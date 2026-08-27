import api from "./axios";

export const getOpportunities = async (params = {}) => {
    const response = await api.get("/opportunities", {
        params,
    });

    return response.data;
};

export const getOpportunity = async (id) => {
    const response = await api.get(
        `/opportunities/${id}`
    );

    return response.data;
};

export const getRecommendedOpportunities = async (
    limit = 10
) => {
    const response = await api.get(
        "/opportunities/recommended",
        {
            params: { limit },
        }
    );

    return response.data;
};
