import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getMessages } from "../api/chatApi";

export default function ChatRoomPage() {
  const { roomId } = useParams();

  const [messages, setMessages] = useState([]);

  useEffect(() => {
    loadMessages();
  }, [roomId]);

  const loadMessages = async () => {
    try {
      const data = await getMessages(roomId);
      setMessages(data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h2>채팅방 #{roomId}</h2>

      {messages.map((msg) => (
        <div key={msg.messageId}>
          <strong>{msg.senderNickname}</strong>
          <p>{msg.content}</p>
        </div>
      ))}
    </div>
  );
}