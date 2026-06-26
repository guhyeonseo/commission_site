import { useEffect, useState } from "react";

import {
  getUsers,
  suspendUser,
  activateUser,
} from "../api/adminApi";

import styles from "./AdminPage.module.css";

export default function AdminPage() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSuspend = async (userId) => {
    try {
      if (!window.confirm("정지하시겠습니까?")) return;

      await suspendUser(userId);
      loadUsers();
    } catch (err) {
      console.error(err);
    }
  };

  const handleActivate = async (userId) => {
    try {
      if (!window.confirm("정지를 해제하시겠습니까?")) return;

      await activateUser(userId);
      loadUsers();
    } catch (err) {
      console.error(err);
    }
  };

  const getRoleText = (role) => {
    switch (role) {
      case "ADMIN":
        return "관리자";
      case "USER":
        return "일반회원";
      default:
        return role;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "ACTIVE":
        return "활동중";
      case "SUSPENDED":
        return "정지";
      default:
        return status;
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>
        관리자 페이지
      </h1>

      <div className={styles.card}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>아이디</th>
              <th>닉네임</th>
              <th>이메일</th>
              <th>권한</th>
              <th>상태</th>
              <th>관리</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => (
              <tr key={user.userId}>
                <td>{user.username}</td>

                <td>{user.nickname}</td>

                <td>{user.email}</td>

                <td>
                  <span
                    className={
                      user.role === "ADMIN"
                        ? styles.adminRole
                        : styles.userRole
                    }
                  >
                    {getRoleText(user.role)}
                  </span>
                </td>

                <td>
                  <span
                    className={
                      user.status === "ACTIVE"
                        ? styles.active
                        : styles.suspended
                    }
                  >
                    {getStatusText(user.status)}
                  </span>
                </td>

                <td>
                  {user.role !== "ADMIN" &&
                    (user.status === "ACTIVE" ? (
                      <button
                        className={`${styles.button} ${styles.suspendButton}`}
                        onClick={() =>
                          handleSuspend(user.userId)
                        }
                      >
                        정지
                      </button>
                    ) : (
                      <button
                        className={`${styles.button} ${styles.activateButton}`}
                        onClick={() =>
                          handleActivate(user.userId)
                        }
                      >
                        해제
                      </button>
                    ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}