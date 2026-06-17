import apiClient from "../../../services/apiClient";

export const getUsers = async () => {
    const res = await apiClient.get("/admin/users");
    return res.data;
};

export const suspendUser = async (userId) => {
    await apiClient.patch(
        `/admin/users/${userId}/suspend`
    );
};

export const activateUser = async (userId) => {
    await apiClient.patch(
        `/admin/users/${userId}/activate`
    );
};