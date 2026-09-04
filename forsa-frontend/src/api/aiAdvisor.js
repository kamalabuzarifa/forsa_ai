import api from "./axios";


export const getAIAdvisorOptions = async () => {

    const response = await api.get(
        "/profile/lookups"
    );

    return response.data;
};


export const getAIRecommendations = async (
    preferences
) => {

    const response = await api.post(
        "/advisor/recommend",
        preferences
    );

    return response.data;
};
