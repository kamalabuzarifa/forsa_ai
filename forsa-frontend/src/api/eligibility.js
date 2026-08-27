import api from "./axios";

export const checkEligibility = async (opportunityId) => {
    const response = await api.get(
        `/opportunities/${opportunityId}/eligibility`
    );

    return response.data;
};

export const matchOpportunity = async (opportunityId) => {
    const response = await api.get(
        `/opportunities/${opportunityId}/match`
    );

    return response.data;
};
