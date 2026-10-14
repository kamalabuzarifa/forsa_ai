import api from "./axios";

export const getPublishedContentPage = async (slug) => {
    const response = await api.get(`/content/pages/${slug}`);

    return response.data;
};
