import api from "./axios";

export const getStudentProfile = async () => {
    const response = await api.get("/profile");

    return response.data;
};

export const updateStudentProfile = async (data) => {
    const response = await api.put(
        "/profile",
        data
    );

    return response.data;
};

export const getStudentProfileLookups = async () => {
    const response = await api.get(
        "/profile/lookups"
    );

    return response.data;
};
