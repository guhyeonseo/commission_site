import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMyRooms } from "../api/chatApi";

import styles from "./ChatRoomListPage.module.css";

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
    <div className={styles.container}>
      <h2 className={styles.title}>내 채팅방</h2>

      {rooms.length === 0 ? (
        <div className={styles.empty}>
          채팅방이 없습니다.
        </div>
      ) : (
        rooms.map((room) => (
          <div
            key={room.roomId}
            className={styles.card}
            onClick={() =>
              navigate(`/chat/${room.roomId}`)
            }
          >
            <div className={styles.header}>
              <strong className={styles.roomTitle}>
                {room.commissionTitle}
              </strong>

              {room.unreadCount > 0 && (
                <span className={styles.badge}>
                  {room.unreadCount}
                </span>
              )}
            </div>

            <div className={styles.user}>
              상대방 : {room.otherUserNickname}
            </div>
          </div>
        ))
      )}
    </div>
  );
}