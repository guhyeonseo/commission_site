import { useEffect, useState } from "react";
import {
    getUsers,
    suspendUser,
    activateUser
} from "../api/adminApi";

export default function AdminPage() {

    const [users, setUsers] = useState([]);

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        try {
            const data = await getUsers();

            console.log("users:", data);

            setUsers(data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleSuspend = async (userId) => {
        try {
            await suspendUser(userId);
            loadUsers();
        } catch (err) {
            console.error(err);
        }
    };

    const handleActivate = async (userId) => {
        try {
            await activateUser(userId);
            loadUsers();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div>
            <h2>관리자 페이지</h2>

            <table>
                <thead>
                    <tr>
                        <th>아이디</th>
                        <th>닉네임</th>
                        <th>이메일</th>
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

                            <td>{user.status}</td>

                            <td>
                                {user.role !== "ADMIN" && (
                                    user.status === "ACTIVE" ? (
                                        <button
                                            onClick={() => handleSuspend(user.userId)}
                                        >
                                            정지
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => handleActivate(user.userId)}
                                        >
                                            해제
                                        </button>
                                    )
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

        </div>
    );
}