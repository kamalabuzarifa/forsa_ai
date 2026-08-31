import api from "./axios";


/*
|--------------------------------------------------------------------------
| Get Profile
|--------------------------------------------------------------------------
*/

export const getStudentProfile = async () => {
    const response = await api.get("/profile");

    return response.data;
};


/*
|--------------------------------------------------------------------------
| Update Personal Profile
|--------------------------------------------------------------------------
*/

export const updateStudentProfile = async (data) => {
    const response = await api.put(
        "/profile",
        data
    );

    return response.data;
};


/*
|--------------------------------------------------------------------------
| Get Profile Lookups
|--------------------------------------------------------------------------
*/

export const getStudentProfileLookups = async () => {
    const response = await api.get(
        "/profile/lookups"
    );

    return response.data;
};


/*
|--------------------------------------------------------------------------
| Academic Records
|--------------------------------------------------------------------------
*/

export const createAcademicRecord = async (data) => {
    const response = await api.post(
        "/profile/academic-records",
        data
    );

    return response.data;
};


export const updateAcademicRecord = async (
    id,
    data
) => {
    const response = await api.put(
        `/profile/academic-records/${id}`,
        data
    );

    return response.data;
};


export const deleteAcademicRecord = async (
    id
) => {
    const response = await api.delete(
        `/profile/academic-records/${id}`
    );

    return response.data;
};


/*
|--------------------------------------------------------------------------
| Languages
|--------------------------------------------------------------------------
*/

export const createLanguage = async (data) => {
    const response = await api.post(
        "/profile/languages",
        data
    );

    return response.data;
};


export const updateLanguage = async (
    id,
    data
) => {
    const response = await api.put(
        `/profile/languages/${id}`,
        data
    );

    return response.data;
};


export const deleteLanguage = async (
    id
) => {
    const response = await api.delete(
        `/profile/languages/${id}`
    );

    return response.data;
};


/*
|--------------------------------------------------------------------------
| Skills
|--------------------------------------------------------------------------
*/

export const createSkill = async (data) => {
    const response = await api.post(
        "/profile/skills",
        data
    );

    return response.data;
};


export const updateSkill = async (
    id,
    data
) => {
    const response = await api.put(
        `/profile/skills/${id}`,
        data
    );

    return response.data;
};


export const deleteSkill = async (
    id
) => {
    const response = await api.delete(
        `/profile/skills/${id}`
    );

    return response.data;
};


/*
|--------------------------------------------------------------------------
| Work Experiences
|--------------------------------------------------------------------------
*/

export const createWorkExperience = async (
    data
) => {
    const response = await api.post(
        "/profile/work-experiences",
        data
    );

    return response.data;
};


export const updateWorkExperience = async (
    id,
    data
) => {
    const response = await api.put(
        `/profile/work-experiences/${id}`,
        data
    );

    return response.data;
};


export const deleteWorkExperience = async (
    id
) => {
    const response = await api.delete(
        `/profile/work-experiences/${id}`
    );

    return response.data;
};
