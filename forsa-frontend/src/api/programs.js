import api from "./axios";


// =========================================================
// Get Published Programs
// =========================================================

export async function getPrograms(params = {}) {

    const response = await api.get(
        "/opportunities",
        {
            params,
        }
    );

    return response.data;
}


// =========================================================
// Get Single Program
// Supports ID or SLUG
// =========================================================

export async function getProgram(identifier) {

    const response = await api.get(
        `/opportunities/${identifier}`
    );

    return response.data;
}


// =========================================================
// Check Program Eligibility
// =========================================================

export async function checkProgramEligibility(id) {

    const response = await api.get(
        `/opportunities/${id}/eligibility`
    );

    return response.data;
}


// =========================================================
// Check Program Match
// =========================================================

export async function checkProgramMatch(id) {

    const response = await api.get(
        `/opportunities/${id}/match`
    );

    return response.data;
}
