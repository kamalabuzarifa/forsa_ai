import api from "./axios";

export const getRecommendedOpportunities = async () => {
    const response = await api.get(
        "/opportunities/recommended"
    );

    return response.data;
};
