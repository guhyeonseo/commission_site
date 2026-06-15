import { useEffect, useState } from "react";
import SockJS from "sockjs-client/dist/sockjs";
import { useAuth } from "@/context/AuthContext";
import { getMessages } from "../api/chatApi";
import { useParams } from "react-router-dom";
import { markAsRead } from "../api/chatApi";
import { Client } from "@stomp/stompjs";

export default function ChatPage() {

    const [client, setClient] = useState(null);
    const [messages, setMessages] = useState([]);
    const [content, setContent] = useState("");

    const { auth } = useAuth();

    const { roomId } = useParams();
    const senderId = Number(auth.userId);

    console.log("roomId =", roomId);
    console.log("senderId =", senderId);

    useEffect(() => {

        if (!senderId) {
            return;
        }

        const socket = new SockJS(
            "http://localhost:8484/ws"
        );

        const stompClient = new Client({
            webSocketFactory: () => socket,

            reconnectDelay: 5000,

            onConnect: () => {

                console.log("웹소켓 연결 성공");

                stompClient.subscribe(
                    `/topic/chat/${roomId}`,
                    async (message) => {

                        const data =
                            JSON.parse(message.body);

                        setMessages(prev => [
                            ...prev,
                            data
                        ]);

                        if (data.senderId !== senderId) {

                            await markAsRead(roomId);
                        }
                    }
                );
            }
        });

        stompClient.activate();

        setClient(stompClient);

        return () => {
            stompClient.deactivate();
        };

    }, [senderId, roomId]);

    const sendMessage = () => {

        if (!client?.connected) {

            console.log(
                "웹소켓 연결 안됨"
            );

            return;
        }

        if (!content.trim()) {
            return;
        }

        client.publish({

            destination:
                "/app/chat.send",

            body: JSON.stringify({

                roomId,

                senderId,

                content
            })
        });

        setContent("");
    };

    useEffect(() => {

        const loadMessages = async () => {

            try {

                const data =
                    await getMessages(roomId);

                setMessages(data);

                await markAsRead(roomId);

            } catch (err) {

                console.error(
                    "채팅 조회 실패",
                    err
                );
            }
        };

        loadMessages();

    }, [roomId]);

    return (

        <div>

            <h2>채팅 테스트</h2>

            <div
                style={{
                    border: "1px solid #ccc",
                    height: "300px",
                    overflowY: "auto",
                    padding: "10px",
                    marginBottom: "10px"
                }}
            >

                {Array.isArray(messages) &&
                    messages.map((msg, index) => (

                        <div
                            key={index}
                            style={{
                                textAlign:
                                    msg.senderId === senderId
                                        ? "right"
                                        : "left",
                                marginBottom: "10px"
                            }}
                        >

                            <strong>
                                {msg.senderNickname}
                            </strong>

                            {" : "}

                            {msg.content}

                        </div>
                    ))
                }

            </div>

            <input
                value={content}
                onChange={e =>
                    setContent(
                        e.target.value
                    )
                }
                onKeyDown={e => {

                    if (e.key === "Enter") {
                        sendMessage();
                    }
                }}
                placeholder="메시지를 입력하세요"
            />

            <button
                onClick={sendMessage}
            >
                전송
            </button>

        </div>
    );
}