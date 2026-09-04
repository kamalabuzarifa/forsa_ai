import api from "./axios";

export const getUniversities = async (params = {}) => {
    const response = await api.get(
        "/universities",
        {
            params,
        }
    );

    return response.data;
};

export const getUniversity = async (id) => {
    const response = await api.get(
        `/universities/${id}`
    );

    return response.data;
};

export const getUniversityPrograms = async (
    id,
    params = {}
) => {
    const response = await api.get(
        `/universities/${id}/programs`,
        {
            params,
        }
    );

    return response.data;
};
