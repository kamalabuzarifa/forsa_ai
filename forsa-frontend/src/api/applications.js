import api from "./axios";

export const createApplication = async (
    opportunityId,
    notes = ""
) => {
    const response = await api.post(
        `/opportunities/${opportunityId}/applications`,
        {
            notes,
        }
    );

    return response.data;
};

export const getMyApplications = async (page = 1) => {
    const response = await api.get("/applications", {
        params: { page },
    });

    return response.data;
};

export const getMyApplication = async (applicationId) => {
    const response = await api.get(
        `/applications/${applicationId}`
    );

    return response.data;
};
