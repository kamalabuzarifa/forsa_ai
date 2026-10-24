import api from "./axios";


/* =========================================================
   GET SCHOLARSHIPS
   ========================================================= */

export const getScholarships = async (
    params = {}
) => {

    const response =
        await api.get(
            "/opportunities",
            {
                params: {
                    opportunity_type: "scholarship",
                    ...params,
                },
            }
        );

    return response.data;
};


/* =========================================================
   GET SCHOLARSHIP DETAILS
   ========================================================= */

export const getScholarship = async (
    id
) => {

    const response =
        await api.get(
            `/opportunities/${id}`
        );

    return response.data;
};


/* =========================================================
   GET SCHOLARSHIP MATCH SCORE
   ========================================================= */

export const checkScholarshipMatch = async (
    id
) => {

    const response =
        await api.get(
            `/opportunities/${id}/match`
        );

    return response.data;
};
