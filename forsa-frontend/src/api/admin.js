import api from "./axios";

export const getAdminDashboard = async () => {
    const response = await api.get("/admin/dashboard");

    return response.data;
};

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
| Admin Users
|--------------------------------------------------------------------------
*/

export const getAdminUsers = async (page = 1, search = "", role = "") => {
    const response = await api.get("/admin/users", {
        params: { page, search, role },
    });

    return response.data;
};

export const updateAdminUser = async (userId, data) => {
    const response = await api.put(`/admin/users/${userId}`, data);

    return response.data;
};

export const deleteAdminUser = async (userId) => {
    const response = await api.delete(`/admin/users/${userId}`);

    return response.data;
};

/*
|--------------------------------------------------------------------------
| Admin Roles and Permissions
|--------------------------------------------------------------------------
*/

export const getAdminRoles = async () => {
    const response = await api.get("/admin/roles");

    return response.data;
};

export const createAdminRole = async (data) => {
    const response = await api.post("/admin/roles", data);

    return response.data;
};

export const updateAdminRole = async (roleId, data) => {
    const response = await api.put(`/admin/roles/${roleId}`, data);

    return response.data;
};

export const deleteAdminRole = async (roleId) => {
    const response = await api.delete(`/admin/roles/${roleId}`);

    return response.data;
};

export const getAdminTaxonomy = async (taxonomy) => {
    const response = await api.get(`/admin/taxonomies/${taxonomy}`);

    return response.data;
};

export const createAdminTaxonomy = async (taxonomy, data) => {
    const response = await api.post(`/admin/taxonomies/${taxonomy}`, data);

    return response.data;
};

export const updateAdminTaxonomy = async (taxonomy, id, data) => {
    const response = await api.put(`/admin/taxonomies/${taxonomy}/${id}`, data);

    return response.data;
};

export const deleteAdminTaxonomy = async (taxonomy, id) => {
    const response = await api.delete(`/admin/taxonomies/${taxonomy}/${id}`);

    return response.data;
};

export const getAdminAuditLogs = async (page = 1, params = {}) => {
    const response = await api.get("/admin/audit-logs", {
        params: { page, ...params },
    });

    return response.data;
};

export const getAdminContentPages = async () => {
    const response = await api.get("/admin/content/pages");

    return response.data;
};

export const createAdminContentPage = async (data) => {
    const response = await api.post("/admin/content/pages", data);

    return response.data;
};

export const updateAdminContentPage = async (pageId, data) => {
    const response = await api.put(`/admin/content/pages/${pageId}`, data);

    return response.data;
};

export const publishAdminContentPage = async (pageId) => {
    const response = await api.post(`/admin/content/pages/${pageId}/publish`);

    return response.data;
};

export const unpublishAdminContentPage = async (pageId) => {
    const response = await api.post(`/admin/content/pages/${pageId}/unpublish`);

    return response.data;
};

export const getAdminContentSections = async (pageId) => {
    const response = await api.get(`/admin/content/pages/${pageId}/sections`);

    return response.data;
};

export const createAdminContentSection = async (pageId, data) => {
    const response = await api.post(`/admin/content/pages/${pageId}/sections`, data);

    return response.data;
};

export const updateAdminContentSection = async (sectionId, data) => {
    const response = await api.put(`/admin/content/sections/${sectionId}`, data);

    return response.data;
};

export const deleteAdminContentSection = async (sectionId) => {
    const response = await api.delete(`/admin/content/sections/${sectionId}`);

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

export const updateAdminUniversity = async (universityId, data) => {
    const response = await api.put(
        `/admin/universities/${universityId}`,
        data
    );

    return response.data;
};

export const deleteAdminUniversity = async (universityId) => {
    const response = await api.delete(
        `/admin/universities/${universityId}`
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

export const updateAdminCountry = async (countryId, data) => {
    const response = await api.put(
        `/admin/countries/${countryId}`,
        data
    );

    return response.data;
};

export const deleteAdminCountry = async (countryId) => {
    const response = await api.delete(
        `/admin/countries/${countryId}`
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
