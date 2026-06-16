import apiClient from "../../../services/apiClient";

export const getBoards = async (type) => {
    const res = await apiClient.get(
        `/boards?type=${type}`
    );

    return res.data;
};

export const getBoard = async (boardId) => {
    const res = await apiClient.get(
        `/boards/${boardId}`
    );

    return res.data;
};

export const createBoard = async (data) => {
    const res = await apiClient.post(
        "/boards",
        data
    );

    return res.data;
};

export const updateBoard = async (
    boardId,
    data
) => {
    const res = await apiClient.put(
        `/boards/${boardId}`,
        data
    );

    return res.data;
};

export const deleteBoard = async (
    boardId
) => {
    await apiClient.delete(
        `/boards/${boardId}`
    );
};