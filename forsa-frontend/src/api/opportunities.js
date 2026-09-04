import api from "./axios";


// =========================================================
// Get Opportunities
// =========================================================

export const getOpportunities = async (params = {}) => {
    const response = await api.get("/opportunities", {
        params,
    });

    return response.data;
};


// =========================================================
// Get Single Opportunity
// =========================================================

export const getOpportunity = async (id) => {
    const response = await api.get(
        `/opportunities/${id}`
    );

    return response.data;
};


// =========================================================
// Get Recommended Opportunities
// =========================================================

export const getRecommendedOpportunities = async (
    limit = 10
) => {
    const response = await api.get(
        "/opportunities/recommended",
        {
            params: {
                limit,
            },
        }
    );

    return response.data;
};


// =========================================================
// Check Opportunity Eligibility
// =========================================================

export const checkOpportunityEligibility = async (id) => {
    const response = await api.get(
        `/opportunities/${id}/eligibility`
    );

    return response.data;
};


// =========================================================
// Check Opportunity Match
// =========================================================

export const checkOpportunityMatch = async (id) => {
    const response = await api.get(
        `/opportunities/${id}/match`
    );

    return response.data;
};
