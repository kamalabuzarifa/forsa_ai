import api from "./axios";


/*
|--------------------------------------------------------------------------
| Saved Opportunities API
|--------------------------------------------------------------------------
*/


/**
 * Get all saved opportunities
 * for the authenticated student.
 */
export async function getSavedOpportunities() {

    const response =
        await api.get("/saved");

    return response.data;
}


/**
 * Save an opportunity.
 */
export async function saveOpportunity(
    opportunityId
) {

    const response =
        await api.post(
            `/opportunities/${opportunityId}/save`
        );

    return response.data;
}


/**
 * Remove an opportunity
 * from saved items.
 */
export async function removeSavedOpportunity(
    opportunityId
) {

    const response =
        await api.delete(
            `/opportunities/${opportunityId}/save`
        );

    return response.data;
}


/**
 * Check whether an opportunity
 * is saved by the authenticated student.
 */
export async function isOpportunitySaved(
    opportunityId
) {

    const response =
        await api.get(
            `/opportunities/${opportunityId}/saved`
        );

    return response.data;
}
