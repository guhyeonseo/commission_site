import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMyRooms } from "../api/chatApi";

export default function ChatRoomListPage() {
  const [rooms, setRooms] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadRooms();
  }, []);

  const loadRooms = async () => {
    try {
      const data = await getMyRooms();
      setRooms(data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h2>내 채팅방</h2>

      {rooms.length === 0 ? (
        <p>채팅방이 없습니다.</p>
      ) : (
        rooms.map((room) => (
          <div
            key={room.roomId}
            onClick={() => navigate(`/chat/${room.roomId}`)}
            style={{
              border: "1px solid #ddd",
              padding: "12px",
              marginBottom: "10px",
              cursor: "pointer",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <strong>
                {room.commissionTitle}
              </strong>

              {room.unreadCount > 0 && (
                <span
                  style={{
                    background: "red",
                    color: "white",
                    borderRadius: "50%",
                    minWidth: "24px",
                    height: "24px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "12px",
                    fontWeight: "bold",
                  }}
                >
                  {room.unreadCount}
                </span>
              )}
            </div>

            <div>
              상대방 : {room.otherUserNickname}
            </div>
          </div>
        ))
      )}
    </div>
  );
}