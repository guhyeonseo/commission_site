import apiClient from "../../../services/apiClient";

export const getBoards = async (type, params = {}) => {

    const res = await apiClient.get("/boards", {
        params: {
            type,
            ...params,
        },
    });

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

export const uploadBoardImage = async (file) => {

    const formData = new FormData();

    formData.append("file", file);

    const res = await apiClient.post(
        "/boards/upload",
        formData
    );

    return res.data;
};