import api from "./axios";


/*
|--------------------------------------------------------------------------
| Create application
|--------------------------------------------------------------------------
*/

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


/*
|--------------------------------------------------------------------------
| Get my applications
|--------------------------------------------------------------------------
*/

export const getMyApplications = async (
    page = 1
) => {

    const response = await api.get(
        "/applications",
        {
            params: {
                page,
            },
        }
    );

    return response.data;
};


/*
|--------------------------------------------------------------------------
| Get single application
|--------------------------------------------------------------------------
*/

export const getMyApplication = async (
    applicationId
) => {

    const response = await api.get(
        `/applications/${applicationId}`
    );

    return response.data;
};
