import api from "./axios";

/*
|--------------------------------------------------------------------------
| Admin Lookups
|--------------------------------------------------------------------------
*/

export const getAdminLookups = async () => {
    const response = await api.get("/admin/lookups");

    return response.data;
};

/*
|--------------------------------------------------------------------------
| Admin Universities
|--------------------------------------------------------------------------
*/

export const getAdminUniversities = async () => {
    const response = await api.get("/admin/universities");

    return response.data;
};

export const createAdminUniversity = async (data) => {
    const response = await api.post(
        "/admin/universities",
        data
    );

    return response.data;
};

/*
|--------------------------------------------------------------------------
| Admin Countries
|--------------------------------------------------------------------------
*/

export const getAdminCountries = async () => {
    const response = await api.get("/admin/countries");

    return response.data;
};

export const createAdminCountry = async (data) => {
    const response = await api.post(
        "/admin/countries",
        data
    );

    return response.data;
};

/*
|--------------------------------------------------------------------------
| Admin Opportunities
|--------------------------------------------------------------------------
*/

export const getAdminOpportunities = async (
    page = 1
) => {
    const response = await api.get(
        "/admin/opportunities",
        {
            params: {
                page,
            },
        }
    );

    return response.data;
};

export const getAdminOpportunity = async (
    opportunityId
) => {
    const response = await api.get(
        `/admin/opportunities/${opportunityId}`
    );

    return response.data;
};

export const createAdminOpportunity = async (
    data
) => {
    const response = await api.post(
        "/admin/opportunities",
        data
    );

    return response.data;
};

export const updateAdminOpportunity = async (
    opportunityId,
    data
) => {
    const response = await api.put(
        `/admin/opportunities/${opportunityId}`,
        data
    );

    return response.data;
};

export const deleteAdminOpportunity = async (
    opportunityId
) => {
    const response = await api.delete(
        `/admin/opportunities/${opportunityId}`
    );

    return response.data;
};

/*
|--------------------------------------------------------------------------
| Admin Applications
|--------------------------------------------------------------------------
*/

export const getAdminApplications = async (
    page = 1
) => {
    const response = await api.get(
        "/admin/applications",
        {
            params: {
                page,
            },
        }
    );

    return response.data;
};

export const getAdminApplication = async (
    applicationId
) => {
    const response = await api.get(
        `/admin/applications/${applicationId}`
    );

    return response.data;
};

export const updateAdminApplication = async (
    applicationId,
    data
) => {
    const response = await api.put(
        `/admin/applications/${applicationId}`,
        data
    );

    return response.data;
};
