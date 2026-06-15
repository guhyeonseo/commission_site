import axios from "axios";
import apiClient from "../../../services/apiClient";

export const getMessages = async (roomId) => {
    const res = await apiClient.get(
        `/chat-rooms/${roomId}/messages`
    );

    return res.data;
};

export const getMyRooms = async () => {
    const res = await apiClient.get(
        "/chat-rooms/my"
    );

    return res.data;
};

export const createChatRoom = async (
    commissionId
) => {

    const res =
        await apiClient.post(
            "/chat-rooms",
            {
                commissionId
            }
        );

    return res.data;
};

export const markAsRead = async (
  roomId
) => {

  await apiClient.post(
    `/chat-rooms/${roomId}/read`
  );
};