import { useEffect, useState } from "react";
import SockJS from "sockjs-client/dist/sockjs";
import { Client } from "@stomp/stompjs";
import { useParams } from "react-router-dom";

import { useAuth } from "@/context/AuthContext";
import { getMessages, markAsRead } from "../api/chatApi";

import styles from "./ChatPage.module.css";

export default function ChatPage() {
  const [client, setClient] = useState(null);
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState("");

  const { auth } = useAuth();

  const { roomId } = useParams();
  const senderId = Number(auth.userId);

  useEffect(() => {
    if (!senderId) {
      return;
    }

    const socket = new SockJS(
      `${import.meta.env.VITE_API_URL.replace("/api", "")}/ws`
    );

    const stompClient = new Client({
      webSocketFactory: () => socket,

      reconnectDelay: 5000,

      onConnect: () => {
        console.log("웹소켓 연결 성공");

        stompClient.subscribe(
          `/topic/chat/${roomId}`,
          async (message) => {
            const data = JSON.parse(
              message.body
            );

            setMessages((prev) => [
              ...prev,
              data,
            ]);

            if (
              data.senderId !== senderId
            ) {
              await markAsRead(roomId);
            }
          }
        );
      },

      onStompError: (frame) => {
        console.error(
          "STOMP 에러",
          frame
        );
      },
    });

    stompClient.activate();

    setClient(stompClient);

    return () => {
      stompClient.deactivate();
    };
  }, [senderId, roomId]);

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
        content,
      }),
    });

    setContent("");
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>
        채팅방
      </h2>

      <div className={styles.chatBox}>
        {messages.length === 0 ? (
          <p>
            아직 메시지가 없습니다.
          </p>
        ) : (
          messages.map(
            (msg, index) => {
              const isMine =
                msg.senderId ===
                senderId;

              return (
                <div
                  key={index}
                  className={`${styles.messageRow} ${isMine
                      ? styles.myMessage
                      : styles.otherMessage
                    }`}
                >
                  <div
                    className={`${styles.bubble} ${isMine
                        ? styles.myBubble
                        : styles.otherBubble
                      }`}
                  >
                    {!isMine && (
                      <div
                        className={
                          styles.nickname
                        }
                      >
                        {
                          msg.senderNickname
                        }
                      </div>
                    )}

                    {msg.content}
                  </div>
                </div>
              );
            }
          )
        )}
      </div>

      <div className={styles.inputArea}>
        <input
          className={styles.input}
          value={content}
          onChange={(e) =>
            setContent(
              e.target.value
            )
          }
          onKeyDown={(e) => {
            if (
              e.key === "Enter"
            ) {
              sendMessage();
            }
          }}
          placeholder="메시지를 입력하세요"
        />

        <button
          className={
            styles.sendButton
          }
          onClick={sendMessage}
        >
          전송
        </button>
      </div>
    </div>
  );
}