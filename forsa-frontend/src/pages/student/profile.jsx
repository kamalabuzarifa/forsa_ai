import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import {
    getStudentProfile,
    updateStudentProfile,
    getStudentProfileLookups,

    createAcademicRecord,
    updateAcademicRecord,
    deleteAcademicRecord,

    createLanguage,
    updateLanguage,
    deleteLanguage,

    createSkill,
    updateSkill,
    deleteSkill,

    createWorkExperience,
    updateWorkExperience,
    deleteWorkExperience,
} from "../../api/profile";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";

import { Textarea } from "@/components/ui/textarea";

import { Label } from "@/components/ui/label";

import { Badge } from "@/components/ui/badge";

import { Separator } from "@/components/ui/separator";

import {
    Pencil,
    Save,
    X,
    User,
    GraduationCap,
    Languages,
    Code2,
    Briefcase,
    Plus,
    Trash2,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";


function Profile() {

    const { setUser } = useAuth();

    const location = useLocation();


    /*
    |--------------------------------------------------------------------------
    | Main State
    |--------------------------------------------------------------------------
    */

    const [profile, setProfile] = useState(null);

    const [lookups, setLookups] = useState({
        countries: [],
        degrees: [],
        universities: [],
        fields: [],
        languages: [],
        skills: [],
    });


    /*
    |--------------------------------------------------------------------------
    | Loading
    |--------------------------------------------------------------------------
    */

    const [loading, setLoading] = useState(true);

    const [saving, setSaving] = useState(false);

    const [actionLoading, setActionLoading] = useState(false);


    /*
    |--------------------------------------------------------------------------
    | Messages
    |--------------------------------------------------------------------------
    */

    const [error, setError] = useState("");

    const [success, setSuccess] = useState("");

    const [profileRequiredMessage, setProfileRequiredMessage] =
        useState(false);


    /*
    |--------------------------------------------------------------------------
    | Editing Personal Profile
    |--------------------------------------------------------------------------
    */

    const [editing, setEditing] = useState(false);


    /*
    |--------------------------------------------------------------------------
    | Personal Form
    |--------------------------------------------------------------------------
    */

    const [form, setForm] = useState({
        name: "",
        date_of_birth: "",
        nationality_id: "",
        country_of_residence_id: "",
        phone: "",
        bio: "",
    });


    /*
    |--------------------------------------------------------------------------
    | Academic Form
    |--------------------------------------------------------------------------
    */

    const [academicForm, setAcademicForm] = useState({
        degree_id: "",
        university_id: "",
        field_id: "",
        gpa: "",
        gpa_scale: "",
        start_date: "",
        end_date: "",
        is_current: false,
    });

    const [editingAcademicId, setEditingAcademicId] =
        useState(null);


    /*
    |--------------------------------------------------------------------------
    | Language Form
    |--------------------------------------------------------------------------
    */

    const [languageForm, setLanguageForm] = useState({
        language_id: "",
        level: "",
        test_type: "",
        score: "",
    });

    const [editingLanguageId, setEditingLanguageId] =
        useState(null);


    /*
    |--------------------------------------------------------------------------
    | Skill Form
    |--------------------------------------------------------------------------
    */

    const [skillForm, setSkillForm] = useState({
        skill_id: "",
        level: "",
        years_of_experience: "",
    });

    const [editingSkillId, setEditingSkillId] =
        useState(null);


    /*
    |--------------------------------------------------------------------------
    | Work Experience Form
    |--------------------------------------------------------------------------
    */

    const [workForm, setWorkForm] = useState({
        job_title: "",
        company: "",
        description: "",
        start_date: "",
        end_date: "",
        is_current: false,
    });

    const [editingWorkId, setEditingWorkId] =
        useState(null);


    /*
    |--------------------------------------------------------------------------
    | Profile Required Message
    |--------------------------------------------------------------------------
    */

    useEffect(() => {

        if (
            location.state?.profileRequired
        ) {

            setProfileRequiredMessage(true);

            const timer = setTimeout(() => {

                setProfileRequiredMessage(false);

            }, 5000);

            return () => clearTimeout(timer);
        }

    }, [location.state]);


    /*
    |--------------------------------------------------------------------------
    | Load Data
    |--------------------------------------------------------------------------
    */

    useEffect(() => {

        loadProfile();

        loadLookups();

    }, []);


    /*
    |--------------------------------------------------------------------------
    | Helpers
    |--------------------------------------------------------------------------
    */

    const getProfileFormData = (
        profileData
    ) => {

        const user = profileData?.user;

        const personalProfile =
            profileData?.profile;

        return {

            name:
                user?.name ||
                "",

            date_of_birth:
                personalProfile?.date_of_birth
                    ? personalProfile.date_of_birth.substring(
                        0,
                        10
                    )
                    : "",

            nationality_id:
                personalProfile?.nationality_id
                    ? String(
                        personalProfile.nationality_id
                    )
                    : "",

            country_of_residence_id:
                personalProfile?.country_of_residence_id
                    ? String(
                        personalProfile.country_of_residence_id
                    )
                    : "",

            phone:
                personalProfile?.phone ||
                "",

            bio:
                personalProfile?.bio ||
                "",
        };
    };


    const extractErrorMessage = (
        error,
        fallback
    ) => {

        const validationErrors =
            error?.response?.data?.errors;

        if (validationErrors) {

            const firstError =
                Object.values(
                    validationErrors
                )?.[0]?.[0];

            return (
                firstError ||
                fallback
            );
        }

        return (
            error?.response?.data?.message ||
            fallback
        );
    };


    /*
    |--------------------------------------------------------------------------
    | Load Profile
    |--------------------------------------------------------------------------
    */

    const loadProfile = async () => {

        try {

            setLoading(true);

            setError("");

            const response =
                await getStudentProfile();

            setProfile(response);

            setForm(
                getProfileFormData(
                    response
                )
            );

        } catch (error) {

            console.error(
                "Failed to load profile:",
                error
            );

            setError(
                extractErrorMessage(
                    error,
                    "Failed to load profile."
                )
            );

        } finally {

            setLoading(false);
        }
    };


    /*
    |--------------------------------------------------------------------------
    | Load Lookups
    |--------------------------------------------------------------------------
    */

    const loadLookups = async () => {

        try {

            const response =
                await getStudentProfileLookups();

            setLookups({

                countries:
                    response?.countries ||
                    response?.data?.countries ||
                    [],

                degrees:
                    response?.degrees ||
                    response?.data?.degrees ||
                    [],

                universities:
                    response?.universities ||
                    response?.data?.universities ||
                    [],

                fields:
                    response?.fields ||
                    response?.data?.fields ||
                    [],

                languages:
                    response?.languages ||
                    response?.data?.languages ||
                    [],

                skills:
                    response?.skills ||
                    response?.data?.skills ||
                    [],
            });

        } catch (error) {

            console.error(
                "Failed to load profile lookups:",
                error
            );
        }
    };


    /*
    |--------------------------------------------------------------------------
    | Personal Information
    |--------------------------------------------------------------------------
    */

    const handleChange = (
        event
    ) => {

        const {
            name,
            value,
        } = event.target;

        setForm(
            (previous) => ({
                ...previous,
                [name]: value,
            })
        );
    };


    const handleEdit = () => {

        setSuccess("");

        setError("");

        setEditing(true);
    };


    const handleCancel = () => {

        setForm(
            getProfileFormData(profile)
        );

        setEditing(false);

        setError("");

        setSuccess("");
    };


    const handleSubmit = async (
        event
    ) => {

        event.preventDefault();

        try {

            setSaving(true);

            setError("");

            setSuccess("");

            const response =
                await updateStudentProfile({

                    name:
                        form.name,

                    date_of_birth:
                        form.date_of_birth ||
                        null,

                    nationality_id:
                        form.nationality_id
                            ? Number(
                                form.nationality_id
                            )
                            : null,

                    country_of_residence_id:
                        form.country_of_residence_id
                            ? Number(
                                form.country_of_residence_id
                            )
                            : null,

                    phone:
                        form.phone ||
                        null,

                    bio:
                        form.bio ||
                        null,
                });


            setProfile(response);

            setForm(
                getProfileFormData(
                    response
                )
            );


            if (
                response?.user
            ) {

                setUser(
                    response.user
                );

                localStorage.setItem(
                    "user",
                    JSON.stringify(
                        response.user
                    )
                );
            }


            setEditing(false);

            setSuccess(
                "Profile updated successfully."
            );

        } catch (error) {

            console.error(
                "Failed to update profile:",
                error
            );

            setError(
                extractErrorMessage(
                    error,
                    "Failed to update profile."
                )
            );

        } finally {

            setSaving(false);
        }
    };


    /*
    |--------------------------------------------------------------------------
    | Academic Form
    |--------------------------------------------------------------------------
    */

    const resetAcademicForm = () => {

        setAcademicForm({

            degree_id: "",
            university_id: "",
            field_id: "",
            gpa: "",
            gpa_scale: "",
            start_date: "",
            end_date: "",
            is_current: false,

        });

        setEditingAcademicId(null);
    };


    const handleAcademicChange = (
        event
    ) => {

        const {
            name,
            value,
            type,
            checked,
        } = event.target;

        setAcademicForm(
            (previous) => ({
                ...previous,
                [name]:
                    type === "checkbox"
                        ? checked
                        : value,
            })
        );
    };


    const handleAcademicEdit = (
        record
    ) => {

        setError("");

        setSuccess("");

        setEditingAcademicId(
            record.id
        );

        setAcademicForm({

            degree_id:
                record.degree_id
                    ? String(
                        record.degree_id
                    )
                    : "",

            university_id:
                record.university_id
                    ? String(
                        record.university_id
                    )
                    : "",

            field_id:
                record.field_id
                    ? String(
                        record.field_id
                    )
                    : "",

            gpa:
                record.gpa ??
                "",

            gpa_scale:
                record.gpa_scale ??
                "",

            start_date:
                record.start_date
                    ? record.start_date.substring(
                        0,
                        10
                    )
                    : "",

            end_date:
                record.end_date
                    ? record.end_date.substring(
                        0,
                        10
                    )
                    : "",

            is_current:
                Boolean(
                    record.is_current
                ),
        });
    };


    const handleAcademicSubmit = async (
        event
    ) => {

        event.preventDefault();

        try {

            setActionLoading(true);

            setError("");

            setSuccess("");

            const payload = {

                degree_id:
                    Number(
                        academicForm.degree_id
                    ),

                university_id:
                    Number(
                        academicForm.university_id
                    ),

                field_id:
                    Number(
                        academicForm.field_id
                    ),

                gpa:
                    academicForm.gpa === ""
                        ? null
                        : Number(
                            academicForm.gpa
                        ),

                gpa_scale:
                    academicForm.gpa_scale === ""
                        ? null
                        : Number(
                            academicForm.gpa_scale
                        ),

                start_date:
                    academicForm.start_date ||
                    null,

                end_date:
                    academicForm.is_current
                        ? null
                        : academicForm.end_date ||
                        null,

                is_current:
                    Boolean(
                        academicForm.is_current
                    ),
            };


            let response;


            if (
                editingAcademicId
            ) {

                response =
                    await updateAcademicRecord(
                        editingAcademicId,
                        payload
                    );

            } else {

                response =
                    await createAcademicRecord(
                        payload
                    );
            }


            setProfile(response);

            resetAcademicForm();

            setSuccess(
                editingAcademicId
                    ? "Academic record updated successfully."
                    : "Academic record added successfully."
            );

        } catch (error) {

            console.error(
                "Academic operation failed:",
                error
            );

            setError(
                extractErrorMessage(
                    error,
                    "Failed to save academic record."
                )
            );

        } finally {

            setActionLoading(false);
        }
    };


    const handleAcademicDelete = async (
        id
    ) => {

        const confirmed =
            window.confirm(
                "Are you sure you want to delete this academic record?"
            );

        if (!confirmed) {
            return;
        }

        try {

            setActionLoading(true);

            setError("");

            setSuccess("");

            const response =
                await deleteAcademicRecord(
                    id
                );

            setProfile(response);

            if (
                editingAcademicId === id
            ) {
                resetAcademicForm();
            }

            setSuccess(
                "Academic record deleted successfully."
            );

        } catch (error) {

            console.error(
                "Failed to delete academic record:",
                error
            );

            setError(
                extractErrorMessage(
                    error,
                    "Failed to delete academic record."
                )
            );

        } finally {

            setActionLoading(false);
        }
    };


    /*
    |--------------------------------------------------------------------------
    | Language
    |--------------------------------------------------------------------------
    */

    const resetLanguageForm = () => {

        setLanguageForm({

            language_id: "",
            level: "",
            test_type: "",
            score: "",

        });

        setEditingLanguageId(null);
    };


    const handleLanguageChange = (
        event
    ) => {

        const {
            name,
            value,
        } = event.target;

        setLanguageForm(
            (previous) => ({
                ...previous,
                [name]: value,
            })
        );
    };


    const handleLanguageEdit = (
        language
    ) => {

        setError("");

        setSuccess("");

        setEditingLanguageId(
            language.id
        );

        setLanguageForm({

            language_id:
                language.id
                    ? String(
                        language.id
                    )
                    : "",

            level:
                language.pivot?.level ||
                "",

            test_type:
                language.pivot?.test_type ||
                "",

            score:
                language.pivot?.score ??
                "",
        });
    };


    const handleLanguageSubmit = async (
        event
    ) => {

        event.preventDefault();

        try {

            setActionLoading(true);

            setError("");

            setSuccess("");


            if (
                editingLanguageId
            ) {

                const response =
                    await updateLanguage(
                        editingLanguageId,
                        {
                            level:
                                languageForm.level,

                            test_type:
                                languageForm.test_type ||
                                null,

                            score:
                                languageForm.score === ""
                                    ? null
                                    : Number(
                                        languageForm.score
                                    ),
                        }
                    );

                setProfile(response);

                setSuccess(
                    "Language updated successfully."
                );

            } else {

                const response =
                    await createLanguage({

                        language_id:
                            Number(
                                languageForm.language_id
                            ),

                        level:
                            languageForm.level,

                        test_type:
                            languageForm.test_type ||
                            null,

                        score:
                            languageForm.score === ""
                                ? null
                                : Number(
                                    languageForm.score
                                ),
                    });

                setProfile(response);

                setSuccess(
                    "Language added successfully."
                );
            }


            resetLanguageForm();

        } catch (error) {

            console.error(
                "Language operation failed:",
                error
            );

            setError(
                extractErrorMessage(
                    error,
                    "Failed to save language."
                )
            );

        } finally {

            setActionLoading(false);
        }
    };


    const handleLanguageDelete = async (
        id
    ) => {

        const confirmed =
            window.confirm(
                "Are you sure you want to delete this language?"
            );

        if (!confirmed) {
            return;
        }

        try {

            setActionLoading(true);

            setError("");

            setSuccess("");

            const response =
                await deleteLanguage(
                    id
                );

            setProfile(response);

            setSuccess(
                "Language deleted successfully."
            );

        } catch (error) {

            console.error(
                "Failed to delete language:",
                error
            );

            setError(
                extractErrorMessage(
                    error,
                    "Failed to delete language."
                )
            );

        } finally {

            setActionLoading(false);
        }
    };


    /*
    |--------------------------------------------------------------------------
    | Skills
    |--------------------------------------------------------------------------
    */

    const resetSkillForm = () => {

        setSkillForm({

            skill_id: "",
            level: "",
            years_of_experience: "",

        });

        setEditingSkillId(null);
    };


    const handleSkillChange = (
        event
    ) => {

        const {
            name,
            value,
        } = event.target;

        setSkillForm(
            (previous) => ({
                ...previous,
                [name]: value,
            })
        );
    };


    const handleSkillEdit = (
        skill
    ) => {

        setError("");

        setSuccess("");

        setEditingSkillId(
            skill.id
        );

        setSkillForm({

            skill_id:
                skill.id
                    ? String(
                        skill.id
                    )
                    : "",

            level:
                skill.pivot?.level ||
                "",

            years_of_experience:
                skill.pivot
                    ?.years_of_experience ??
                "",
        });
    };


    const handleSkillSubmit = async (
        event
    ) => {

        event.preventDefault();

        try {

            setActionLoading(true);

            setError("");

            setSuccess("");


            if (
                editingSkillId
            ) {

                const response =
                    await updateSkill(
                        editingSkillId,
                        {
                            level:
                                skillForm.level,

                            years_of_experience:
                                skillForm.years_of_experience === ""
                                    ? null
                                    : Number(
                                        skillForm.years_of_experience
                                    ),
                        }
                    );

                setProfile(response);

                setSuccess(
                    "Skill updated successfully."
                );

            } else {

                const response =
                    await createSkill({

                        skill_id:
                            Number(
                                skillForm.skill_id
                            ),

                        level:
                            skillForm.level,

                        years_of_experience:
                            skillForm.years_of_experience === ""
                                ? null
                                : Number(
                                    skillForm.years_of_experience
                                ),
                    });

                setProfile(response);

                setSuccess(
                    "Skill added successfully."
                );
            }


            resetSkillForm();

        } catch (error) {

            console.error(
                "Skill operation failed:",
                error
            );

            setError(
                extractErrorMessage(
                    error,
                    "Failed to save skill."
                )
            );

        } finally {

            setActionLoading(false);
        }
    };


    const handleSkillDelete = async (
        id
    ) => {

        const confirmed =
            window.confirm(
                "Are you sure you want to delete this skill?"
            );

        if (!confirmed) {
            return;
        }

        try {

            setActionLoading(true);

            setError("");

            setSuccess("");

            const response =
                await deleteSkill(
                    id
                );

            setProfile(response);

            setSuccess(
                "Skill deleted successfully."
            );

        } catch (error) {

            console.error(
                "Failed to delete skill:",
                error
            );

            setError(
                extractErrorMessage(
                    error,
                    "Failed to delete skill."
                )
            );

        } finally {

            setActionLoading(false);
        }
    };


    /*
    |--------------------------------------------------------------------------
    | Work Experience
    |--------------------------------------------------------------------------
    */

    const resetWorkForm = () => {

        setWorkForm({

            job_title: "",
            company: "",
            description: "",
            start_date: "",
            end_date: "",
            is_current: false,

        });

        setEditingWorkId(null);
    };


    const handleWorkChange = (
        event
    ) => {

        const {
            name,
            value,
            type,
            checked,
        } = event.target;

        setWorkForm(
            (previous) => ({
                ...previous,
                [name]:
                    type === "checkbox"
                        ? checked
                        : value,
            })
        );
    };


    const handleWorkEdit = (
        experience
    ) => {

        setError("");

        setSuccess("");

        setEditingWorkId(
            experience.id
        );

        setWorkForm({

            job_title:
                experience.job_title ||
                "",

            company:
                experience.company ||
                "",

            description:
                experience.description ||
                "",

            start_date:
                experience.start_date
                    ? experience.start_date.substring(
                        0,
                        10
                    )
                    : "",

            end_date:
                experience.end_date
                    ? experience.end_date.substring(
                        0,
                        10
                    )
                    : "",

            is_current:
                Boolean(
                    experience.is_current
                ),
        });
    };


    const handleWorkSubmit = async (
        event
    ) => {

        event.preventDefault();

        try {

            setActionLoading(true);

            setError("");

            setSuccess("");


            const payload = {

                job_title:
                    workForm.job_title,

                company:
                    workForm.company,

                description:
                    workForm.description ||
                    null,

                start_date:
                    workForm.start_date ||
                    null,

                end_date:
                    workForm.is_current
                        ? null
                        : workForm.end_date ||
                        null,

                is_current:
                    Boolean(
                        workForm.is_current
                    ),
            };


            let response;


            if (
                editingWorkId
            ) {

                response =
                    await updateWorkExperience(
                        editingWorkId,
                        payload
                    );

            } else {

                response =
                    await createWorkExperience(
                        payload
                    );
            }


            setProfile(response);

            resetWorkForm();

            setSuccess(
                editingWorkId
                    ? "Work experience updated successfully."
                    : "Work experience added successfully."
            );

        } catch (error) {

            console.error(
                "Work experience operation failed:",
                error
            );

            setError(
                extractErrorMessage(
                    error,
                    "Failed to save work experience."
                )
            );

        } finally {

            setActionLoading(false);
        }
    };


    const handleWorkDelete = async (
        id
    ) => {

        const confirmed =
            window.confirm(
                "Are you sure you want to delete this work experience?"
            );

        if (!confirmed) {
            return;
        }

        try {

            setActionLoading(true);

            setError("");

            setSuccess("");

            const response =
                await deleteWorkExperience(
                    id
                );

            setProfile(response);

            if (
                editingWorkId === id
            ) {
                resetWorkForm();
            }

            setSuccess(
                "Work experience deleted successfully."
            );

        } catch (error) {

            console.error(
                "Failed to delete work experience:",
                error
            );

            setError(
                extractErrorMessage(
                    error,
                    "Failed to delete work experience."
                )
            );

        } finally {

            setActionLoading(false);
        }
    };


    /*
    |--------------------------------------------------------------------------
    | Loading State
    |--------------------------------------------------------------------------
    */

    if (loading) {

        return (

            <div className="w-full">

                <div className="mx-auto max-w-7xl p-6">

                    <div className="space-y-4">

                        <div className="h-8 w-48 animate-pulse rounded bg-muted" />

                        <div className="h-4 w-80 animate-pulse rounded bg-muted" />

                        <div className="h-64 animate-pulse rounded-xl bg-muted" />

                    </div>

                </div>

            </div>
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Error State
    |--------------------------------------------------------------------------
    */

    if (
        error &&
        !profile
    ) {

        return (

            <div className="w-full">

                <div className="mx-auto max-w-7xl p-6">

                    <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6 text-destructive">

                        {error}

                    </div>

                </div>

            </div>
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Data
    |--------------------------------------------------------------------------
    */

    const user = profile?.user;

    const personalProfile =
        profile?.profile;


    const profileCompletion =
        Number(
            personalProfile?.profile_completion ??
            0
        );


    const isProfileComplete =
        profileCompletion >= 100;


    /*
    |--------------------------------------------------------------------------
    | Render
    |--------------------------------------------------------------------------
    */

    return (

        <div className="w-full">

            {/* Profile Required */}

            {profileRequiredMessage &&
                !isProfileComplete && (

                    <div className="fixed right-6 top-6 z-50 w-[calc(100%-3rem)] max-w-md rounded-xl border border-amber-500/30 bg-amber-50 p-4 shadow-lg">

                        <div className="flex items-start gap-3">

                            <div className="flex-1">

                                <p className="font-medium text-amber-900">
                                    Complete your profile
                                </p>

                                <p className="mt-1 text-sm text-amber-800">
                                    Please complete your profile before continuing.
                                </p>

                            </div>

                            <button
                                type="button"
                                onClick={() =>
                                    setProfileRequiredMessage(
                                        false
                                    )
                                }
                                className="text-amber-700 hover:text-amber-900"
                                aria-label="Close"
                            >

                                <X className="size-4" />

                            </button>

                        </div>

                    </div>
                )}


            <div className="mx-auto max-w-7xl p-6">


                {/* Header */}

                <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                    <div>

                        <h1 className="text-3xl font-semibold tracking-tight">
                            My Profile
                        </h1>

                        <p className="mt-2 text-muted-foreground">
                            Manage your personal and academic information.
                        </p>

                    </div>


                    {!editing ? (

                        <Button
                            type="button"
                            onClick={handleEdit}
                        >

                            <Pencil className="mr-2 size-4" />

                            Edit Profile

                        </Button>

                    ) : (

                        <div className="flex gap-2">

                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleCancel}
                                disabled={saving}
                            >

                                <X className="mr-2 size-4" />

                                Cancel

                            </Button>


                            <Button
                                type="submit"
                                form="profile-form"
                                disabled={saving}
                            >

                                <Save className="mr-2 size-4" />

                                {saving
                                    ? "Saving..."
                                    : "Save Changes"}

                            </Button>

                        </div>
                    )}

                </div>


                {/* Messages */}

                {success && (

                    <div className="mb-6 rounded-xl border border-green-500/30 bg-green-500/5 p-4 text-sm text-green-700">

                        {success}

                    </div>

                )}


                {error && (

                    <div className="mb-6 rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">

                        {error}

                    </div>

                )}


                {/* Personal Information */}

                <Card>

                    <CardHeader>

                        <div className="flex items-start gap-3">

                            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">

                                <User className="size-5 text-primary" />

                            </div>

                            <div>

                                <CardTitle>
                                    Personal Information
                                </CardTitle>

                                <CardDescription>
                                    Your basic account information
                                </CardDescription>

                            </div>

                        </div>

                    </CardHeader>


                    <CardContent>

                        {editing ? (

                            <form
                                id="profile-form"
                                onSubmit={handleSubmit}
                                className="space-y-6"
                            >

                                <div className="grid gap-6 sm:grid-cols-2">


                                    <div className="space-y-2">

                                        <Label htmlFor="name">
                                            Full Name
                                        </Label>

                                        <Input
                                            id="name"
                                            name="name"
                                            value={form.name}
                                            onChange={handleChange}
                                            placeholder="Enter your full name"
                                            required
                                        />

                                    </div>


                                    <div className="space-y-2">

                                        <Label htmlFor="email">
                                            Email
                                        </Label>

                                        <Input
                                            id="email"
                                            value={
                                                user?.email ||
                                                ""
                                            }
                                            disabled
                                        />

                                        <p className="text-xs text-muted-foreground">
                                            Email cannot be changed here.
                                        </p>

                                    </div>


                                    <div className="space-y-2">

                                        <Label htmlFor="phone">
                                            Phone
                                        </Label>

                                        <Input
                                            id="phone"
                                            name="phone"
                                            value={form.phone}
                                            onChange={handleChange}
                                            placeholder="+970..."
                                        />

                                    </div>


                                    <div className="space-y-2">

                                        <Label htmlFor="date_of_birth">
                                            Date of Birth
                                        </Label>

                                        <Input
                                            id="date_of_birth"
                                            name="date_of_birth"
                                            type="date"
                                            value={
                                                form.date_of_birth
                                            }
                                            onChange={handleChange}
                                        />

                                    </div>


                                    <div className="space-y-2">

                                        <Label htmlFor="nationality_id">
                                            Nationality
                                        </Label>

                                        <select
                                            id="nationality_id"
                                            name="nationality_id"
                                            value={
                                                form.nationality_id
                                            }
                                            onChange={handleChange}
                                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                                        >

                                            <option value="">
                                                Select nationality
                                            </option>

                                            {lookups.countries.map(
                                                (country) => (

                                                    <option
                                                        key={
                                                            country.id
                                                        }
                                                        value={
                                                            country.id
                                                        }
                                                    >
                                                        {
                                                            country.name
                                                        }
                                                    </option>

                                                )
                                            )}

                                        </select>

                                    </div>


                                    <div className="space-y-2">

                                        <Label htmlFor="country_of_residence_id">
                                            Country of Residence
                                        </Label>

                                        <select
                                            id="country_of_residence_id"
                                            name="country_of_residence_id"
                                            value={
                                                form.country_of_residence_id
                                            }
                                            onChange={handleChange}
                                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                                        >

                                            <option value="">
                                                Select country
                                            </option>

                                            {lookups.countries.map(
                                                (country) => (

                                                    <option
                                                        key={
                                                            country.id
                                                        }
                                                        value={
                                                            country.id
                                                        }
                                                    >
                                                        {
                                                            country.name
                                                        }
                                                    </option>

                                                )
                                            )}

                                        </select>

                                    </div>


                                </div>


                                <div className="space-y-2">

                                    <Label htmlFor="bio">
                                        Bio
                                    </Label>

                                    <Textarea
                                        id="bio"
                                        name="bio"
                                        value={form.bio}
                                        onChange={handleChange}
                                        placeholder="Tell us about yourself..."
                                        rows={5}
                                    />

                                </div>

                            </form>

                        ) : (

                            <>

                                <div className="grid gap-6 sm:grid-cols-2">


                                    <div>

                                        <p className="text-sm text-muted-foreground">
                                            Full Name
                                        </p>

                                        <p className="mt-1 font-medium">
                                            {user?.name ||
                                                "Not available"}
                                        </p>

                                    </div>


                                    <div>

                                        <p className="text-sm text-muted-foreground">
                                            Email
                                        </p>

                                        <p className="mt-1 font-medium">
                                            {user?.email ||
                                                "Not available"}
                                        </p>

                                    </div>


                                    <div>

                                        <p className="text-sm text-muted-foreground">
                                            Phone
                                        </p>

                                        <p className="mt-1 font-medium">
                                            {personalProfile?.phone ||
                                                "Not available"}
                                        </p>

                                    </div>


                                    <div>

                                        <p className="text-sm text-muted-foreground">
                                            Date of Birth
                                        </p>

                                        <p className="mt-1 font-medium">
                                            {
                                                personalProfile?.date_of_birth
                                                    ? personalProfile.date_of_birth.substring(
                                                        0,
                                                        10
                                                    )
                                                    : "Not available"
                                            }
                                        </p>

                                    </div>


                                    <div>

                                        <p className="text-sm text-muted-foreground">
                                            Nationality
                                        </p>

                                        <p className="mt-1 font-medium">
                                            {
                                                personalProfile?.nationality?.name ||
                                                "Not available"
                                            }
                                        </p>

                                    </div>


                                    <div>

                                        <p className="text-sm text-muted-foreground">
                                            Country of Residence
                                        </p>

                                        <p className="mt-1 font-medium">
                                            {
                                                personalProfile?.country_of_residence?.name ||
                                                "Not available"
                                            }
                                        </p>

                                    </div>

                                </div>


                                <Separator className="my-6" />


                                <div>

                                    <p className="text-sm text-muted-foreground">
                                        Bio
                                    </p>

                                    <p className="mt-2 text-sm leading-6">
                                        {
                                            personalProfile?.bio ||
                                            "No bio added yet."
                                        }
                                    </p>

                                </div>

                            </>
                        )}

                    </CardContent>

                </Card>


                {/* Profile Completion */}

                <Card className="mt-6">

                    <CardHeader>

                        <CardTitle>
                            Profile Completion
                        </CardTitle>

                        <CardDescription>
                            Complete your profile to improve recommendations.
                        </CardDescription>

                    </CardHeader>


                    <CardContent>

                        <div className="flex items-center justify-between gap-4">

                            <div>

                                <span className="text-3xl font-semibold">

                                    {profileCompletion}%

                                </span>

                                <p className="mt-1 text-sm text-muted-foreground">

                                    {isProfileComplete
                                        ? "Your profile is complete."
                                        : "Complete the missing information."}

                                </p>

                            </div>


                            <Badge
                                variant={
                                    isProfileComplete
                                        ? "default"
                                        : "secondary"
                                }
                            >

                                {isProfileComplete
                                    ? "Complete"
                                    : "Incomplete"}

                            </Badge>

                        </div>


                        <div className="mt-4 h-2 overflow-hidden rounded-full bg-muted">

                            <div
                                className="h-full rounded-full bg-primary transition-all duration-500"
                                style={{
                                    width: `${profileCompletion}%`,
                                }}
                            />

                        </div>

                    </CardContent>

                </Card>


                {/* Academic Information */}

                <Card className="mt-6">

                    <CardHeader>

                        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

                            <div className="flex items-start gap-3">

                                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">

                                    <GraduationCap className="size-5 text-primary" />

                                </div>

                                <div>

                                    <CardTitle>
                                        Academic Information
                                    </CardTitle>

                                    <CardDescription>
                                        Your education history
                                    </CardDescription>

                                </div>

                            </div>


                            <Button
                                type="button"
                                variant="outline"
                                onClick={() =>
                                    resetAcademicForm()
                                }
                            >

                                <Plus className="mr-2 size-4" />

                                Add Education

                            </Button>

                        </div>

                    </CardHeader>


                    <CardContent>


                        <form
                            onSubmit={handleAcademicSubmit}
                            className="mb-8 rounded-xl border bg-muted/20 p-5"
                        >

                            <div className="mb-4 flex items-center justify-between">

                                <h3 className="font-semibold">

                                    {editingAcademicId
                                        ? "Edit Academic Record"
                                        : "Add Academic Record"}

                                </h3>


                                {editingAcademicId && (

                                    <Button
                                        type="button"
                                        size="sm"
                                        variant="ghost"
                                        onClick={
                                            resetAcademicForm
                                        }
                                    >

                                        <X className="mr-2 size-4" />

                                        Cancel

                                    </Button>

                                )}

                            </div>


                            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">


                                <div className="space-y-2">

                                    <Label>
                                        Degree
                                    </Label>

                                    <select
                                        name="degree_id"
                                        value={
                                            academicForm.degree_id
                                        }
                                        onChange={
                                            handleAcademicChange
                                        }
                                        required
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                                    >

                                        <option value="">
                                            Select degree
                                        </option>

                                        {lookups.degrees.map(
                                            (degree) => (

                                                <option
                                                    key={
                                                        degree.id
                                                    }
                                                    value={
                                                        degree.id
                                                    }
                                                >
                                                    {
                                                        degree.name
                                                    }
                                                </option>

                                            )
                                        )}

                                    </select>

                                </div>


                                <div className="space-y-2">

                                    <Label>
                                        University
                                    </Label>

                                    <select
                                        name="university_id"
                                        value={
                                            academicForm.university_id
                                        }
                                        onChange={
                                            handleAcademicChange
                                        }
                                        required
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                                    >

                                        <option value="">
                                            Select university
                                        </option>

                                        {lookups.universities.map(
                                            (university) => (

                                                <option
                                                    key={
                                                        university.id
                                                    }
                                                    value={
                                                        university.id
                                                    }
                                                >
                                                    {
                                                        university.name
                                                    }
                                                </option>

                                            )
                                        )}

                                    </select>

                                </div>


                                <div className="space-y-2">

                                    <Label>
                                        Field
                                    </Label>

                                    <select
                                        name="field_id"
                                        value={
                                            academicForm.field_id
                                        }
                                        onChange={
                                            handleAcademicChange
                                        }
                                        required
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                                    >

                                        <option value="">
                                            Select field
                                        </option>

                                        {lookups.fields.map(
                                            (field) => (

                                                <option
                                                    key={
                                                        field.id
                                                    }
                                                    value={
                                                        field.id
                                                    }
                                                >
                                                    {
                                                        field.name
                                                    }
                                                </option>

                                            )
                                        )}

                                    </select>

                                </div>


                                <div className="space-y-2">

                                    <Label>
                                        GPA
                                    </Label>

                                    <Input
                                        name="gpa"
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={
                                            academicForm.gpa
                                        }
                                        onChange={
                                            handleAcademicChange
                                        }
                                        placeholder="3.50"
                                    />

                                </div>


                                <div className="space-y-2">

                                    <Label>
                                        GPA Scale
                                    </Label>

                                    <Input
                                        name="gpa_scale"
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={
                                            academicForm.gpa_scale
                                        }
                                        onChange={
                                            handleAcademicChange
                                        }
                                        placeholder="4.00"
                                    />

                                </div>


                                <div className="space-y-2">

                                    <Label>
                                        Start Date
                                    </Label>

                                    <Input
                                        name="start_date"
                                        type="date"
                                        value={
                                            academicForm.start_date
                                        }
                                        onChange={
                                            handleAcademicChange
                                        }
                                    />

                                </div>


                                {!academicForm.is_current && (

                                    <div className="space-y-2">

                                        <Label>
                                            End Date
                                        </Label>

                                        <Input
                                            name="end_date"
                                            type="date"
                                            value={
                                                academicForm.end_date
                                            }
                                            onChange={
                                                handleAcademicChange
                                            }
                                        />

                                    </div>

                                )}


                                <div className="flex items-center gap-2 pt-8">

                                    <input
                                        id="academic-current"
                                        name="is_current"
                                        type="checkbox"
                                        checked={
                                            academicForm.is_current
                                        }
                                        onChange={
                                            handleAcademicChange
                                        }
                                        className="size-4 rounded border-input"
                                    />

                                    <Label htmlFor="academic-current">
                                        Currently studying
                                    </Label>

                                </div>

                            </div>


                            <Button
                                type="submit"
                                className="mt-5"
                                disabled={actionLoading}
                            >

                                <Save className="mr-2 size-4" />

                                {editingAcademicId
                                    ? "Update Education"
                                    : "Add Education"}

                            </Button>

                        </form>


                        {profile?.academic_records?.length > 0 ? (

                            <div className="space-y-4">

                                {profile.academic_records.map(
                                    (record) => (

                                        <div
                                            key={
                                                record.id
                                            }
                                            className="rounded-xl border p-4"
                                        >

                                            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">

                                                <div>

                                                    <p className="font-medium">

                                                        {
                                                            record.degree?.name ||
                                                            "Degree"
                                                        }

                                                    </p>

                                                    <p className="text-sm text-muted-foreground">

                                                        {
                                                            record.university?.name ||
                                                            "University not available"
                                                        }

                                                    </p>

                                                    <p className="text-sm text-muted-foreground">

                                                        {
                                                            record.field?.name ||
                                                            "Field not available"
                                                        }

                                                    </p>


                                                    <div className="mt-3 flex flex-wrap gap-2">

                                                        {record.gpa != null && (

                                                            <Badge variant="secondary">

                                                                GPA {record.gpa}

                                                                {record.gpa_scale
                                                                    ? ` / ${record.gpa_scale}`
                                                                    : ""}

                                                            </Badge>

                                                        )}

                                                        {record.is_current && (

                                                            <Badge>

                                                                Current

                                                            </Badge>

                                                        )}

                                                    </div>

                                                </div>


                                                <div className="flex gap-2">

                                                    <Button
                                                        type="button"
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() =>
                                                            handleAcademicEdit(
                                                                record
                                                            )
                                                        }
                                                    >

                                                        <Pencil className="mr-2 size-4" />

                                                        Edit

                                                    </Button>


                                                    <Button
                                                        type="button"
                                                        size="sm"
                                                        variant="destructive"
                                                        onClick={() =>
                                                            handleAcademicDelete(
                                                                record.id
                                                            )
                                                        }
                                                        disabled={
                                                            actionLoading
                                                        }
                                                    >

                                                        <Trash2 className="mr-2 size-4" />

                                                        Delete

                                                    </Button>

                                                </div>

                                            </div>

                                        </div>

                                    )
                                )}

                            </div>

                        ) : (

                            <p className="text-sm text-muted-foreground">
                                No academic records added yet.
                            </p>

                        )}

                    </CardContent>

                </Card>


                {/* Languages */}

                <Card className="mt-6">

                    <CardHeader>

                        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

                            <div className="flex items-start gap-3">

                                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">

                                    <Languages className="size-5 text-primary" />

                                </div>

                                <div>

                                    <CardTitle>
                                        Languages
                                    </CardTitle>

                                    <CardDescription>
                                        Languages and proficiency levels
                                    </CardDescription>

                                </div>

                            </div>


                            <Button
                                type="button"
                                variant="outline"
                                onClick={() =>
                                    resetLanguageForm()
                                }
                            >

                                <Plus className="mr-2 size-4" />

                                Add Language

                            </Button>

                        </div>

                    </CardHeader>


                    <CardContent>


                        <form
                            onSubmit={handleLanguageSubmit}
                            className="mb-8 rounded-xl border bg-muted/20 p-5"
                        >

                            <div className="mb-4 flex items-center justify-between">

                                <h3 className="font-semibold">

                                    {editingLanguageId
                                        ? "Edit Language"
                                        : "Add Language"}

                                </h3>


                                {editingLanguageId && (

                                    <Button
                                        type="button"
                                        size="sm"
                                        variant="ghost"
                                        onClick={
                                            resetLanguageForm
                                        }
                                    >

                                        <X className="mr-2 size-4" />

                                        Cancel

                                    </Button>

                                )}

                            </div>


                            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">


                                <div className="space-y-2">

                                    <Label>
                                        Language
                                    </Label>

                                    <select
                                        name="language_id"
                                        value={
                                            languageForm.language_id
                                        }
                                        onChange={
                                            handleLanguageChange
                                        }
                                        required
                                        disabled={
                                            Boolean(
                                                editingLanguageId
                                            )
                                        }
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
                                    >

                                        <option value="">
                                            Select language
                                        </option>

                                        {lookups.languages.map(
                                            (language) => (

                                                <option
                                                    key={
                                                        language.id
                                                    }
                                                    value={
                                                        language.id
                                                    }
                                                >
                                                    {
                                                        language.name
                                                    }
                                                </option>

                                            )
                                        )}

                                    </select>

                                </div>


                                <div className="space-y-2">

                                    <Label>
                                        Level
                                    </Label>

                                    <Input
                                        name="level"
                                        value={
                                            languageForm.level
                                        }
                                        onChange={
                                            handleLanguageChange
                                        }
                                        placeholder="B2"
                                        required
                                    />

                                </div>


                                <div className="space-y-2">

                                    <Label>
                                        Test Type
                                    </Label>

                                    <Input
                                        name="test_type"
                                        value={
                                            languageForm.test_type
                                        }
                                        onChange={
                                            handleLanguageChange
                                        }
                                        placeholder="IELTS"
                                    />

                                </div>


                                <div className="space-y-2">

                                    <Label>
                                        Score
                                    </Label>

                                    <Input
                                        name="score"
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={
                                            languageForm.score
                                        }
                                        onChange={
                                            handleLanguageChange
                                        }
                                        placeholder="7.5"
                                    />

                                </div>

                            </div>


                            <Button
                                type="submit"
                                className="mt-5"
                                disabled={actionLoading}
                            >

                                <Save className="mr-2 size-4" />

                                {editingLanguageId
                                    ? "Update Language"
                                    : "Add Language"}

                            </Button>

                        </form>


                        {profile?.languages?.length > 0 ? (

                            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

                                {profile.languages.map(
                                    (language) => (

                                        <div
                                            key={
                                                language.id
                                            }
                                            className="rounded-xl border p-4"
                                        >

                                            <div className="flex items-start justify-between gap-3">

                                                <div>

                                                    <p className="font-medium">
                                                        {
                                                            language.name
                                                        }
                                                    </p>

                                                    <Badge
                                                        variant="secondary"
                                                        className="mt-2"
                                                    >

                                                        {
                                                            language.pivot?.level ||
                                                            "N/A"
                                                        }

                                                    </Badge>

                                                </div>


                                                <div className="flex gap-1">

                                                    <Button
                                                        type="button"
                                                        size="icon"
                                                        variant="ghost"
                                                        onClick={() =>
                                                            handleLanguageEdit(
                                                                language
                                                            )
                                                        }
                                                    >

                                                        <Pencil className="size-4" />

                                                    </Button>


                                                    <Button
                                                        type="button"
                                                        size="icon"
                                                        variant="ghost"
                                                        className="text-destructive hover:text-destructive"
                                                        onClick={() =>
                                                            handleLanguageDelete(
                                                                language.id
                                                            )
                                                        }
                                                        disabled={
                                                            actionLoading
                                                        }
                                                    >

                                                        <Trash2 className="size-4" />

                                                    </Button>

                                                </div>

                                            </div>


                                            {language.pivot?.test_type && (

                                                <p className="mt-3 text-xs text-muted-foreground">

                                                    Test{" "}
                                                    {
                                                        language.pivot.test_type
                                                    }

                                                    {language.pivot?.score != null
                                                        ? ` • Score ${language.pivot.score}`
                                                        : ""}

                                                </p>

                                            )}

                                        </div>

                                    )
                                )}

                            </div>

                        ) : (

                            <p className="text-sm text-muted-foreground">
                                No languages added yet.
                            </p>

                        )}

                    </CardContent>

                </Card>


                {/* Skills */}

                <Card className="mt-6">

                    <CardHeader>

                        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

                            <div className="flex items-start gap-3">

                                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">

                                    <Code2 className="size-5 text-primary" />

                                </div>

                                <div>

                                    <CardTitle>
                                        Skills
                                    </CardTitle>

                                    <CardDescription>
                                        Your technical and professional skills
                                    </CardDescription>

                                </div>

                            </div>


                            <Button
                                type="button"
                                variant="outline"
                                onClick={() =>
                                    resetSkillForm()
                                }
                            >

                                <Plus className="mr-2 size-4" />

                                Add Skill

                            </Button>

                        </div>

                    </CardHeader>


                    <CardContent>


                        <form
                            onSubmit={handleSkillSubmit}
                            className="mb-8 rounded-xl border bg-muted/20 p-5"
                        >

                            <div className="mb-4 flex items-center justify-between">

                                <h3 className="font-semibold">

                                    {editingSkillId
                                        ? "Edit Skill"
                                        : "Add Skill"}

                                </h3>


                                {editingSkillId && (

                                    <Button
                                        type="button"
                                        size="sm"
                                        variant="ghost"
                                        onClick={
                                            resetSkillForm
                                        }
                                    >

                                        <X className="mr-2 size-4" />

                                        Cancel

                                    </Button>

                                )}

                            </div>


                            <div className="grid gap-4 sm:grid-cols-3">


                                <div className="space-y-2">

                                    <Label>
                                        Skill
                                    </Label>

                                    <select
                                        name="skill_id"
                                        value={
                                            skillForm.skill_id
                                        }
                                        onChange={
                                            handleSkillChange
                                        }
                                        required
                                        disabled={
                                            Boolean(
                                                editingSkillId
                                            )
                                        }
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
                                    >

                                        <option value="">
                                            Select skill
                                        </option>

                                        {lookups.skills.map(
                                            (skill) => (

                                                <option
                                                    key={
                                                        skill.id
                                                    }
                                                    value={
                                                        skill.id
                                                    }
                                                >
                                                    {
                                                        skill.name
                                                    }
                                                </option>

                                            )
                                        )}

                                    </select>

                                </div>


                                <div className="space-y-2">

                                    <Label>
                                        Level
                                    </Label>

                                    <Input
                                        name="level"
                                        value={
                                            skillForm.level
                                        }
                                        onChange={
                                            handleSkillChange
                                        }
                                        placeholder="Intermediate"
                                        required
                                    />

                                </div>


                                <div className="space-y-2">

                                    <Label>
                                        Years of Experience
                                    </Label>

                                    <Input
                                        name="years_of_experience"
                                        type="number"
                                        step="0.1"
                                        min="0"
                                        value={
                                            skillForm.years_of_experience
                                        }
                                        onChange={
                                            handleSkillChange
                                        }
                                        placeholder="2.5"
                                    />

                                </div>

                            </div>


                            <Button
                                type="submit"
                                className="mt-5"
                                disabled={
                                    actionLoading
                                }
                            >

                                <Save className="mr-2 size-4" />

                                {editingSkillId
                                    ? "Update Skill"
                                    : "Add Skill"}

                            </Button>

                        </form>


                        {profile?.skills?.length > 0 ? (

                            <div className="flex flex-wrap gap-3">

                                {profile.skills.map(
                                    (skill) => (

                                        <div
                                            key={
                                                skill.id
                                            }
                                            className="flex min-w-[190px] items-center justify-between gap-4 rounded-xl border p-4"
                                        >

                                            <div>

                                                <p className="font-medium">
                                                    {
                                                        skill.name
                                                    }
                                                </p>

                                                <p className="mt-1 text-xs text-muted-foreground">

                                                    {
                                                        skill.pivot?.level ||
                                                        "N/A"
                                                    }

                                                    {skill.pivot?.years_of_experience != null
                                                        ? ` • ${skill.pivot.years_of_experience} years`
                                                        : ""}

                                                </p>

                                            </div>


                                            <div className="flex gap-1">

                                                <Button
                                                    type="button"
                                                    size="icon"
                                                    variant="ghost"
                                                    onClick={() =>
                                                        handleSkillEdit(
                                                            skill
                                                        )
                                                    }
                                                >

                                                    <Pencil className="size-4" />

                                                </Button>


                                                <Button
                                                    type="button"
                                                    size="icon"
                                                    variant="ghost"
                                                    className="text-destructive hover:text-destructive"
                                                    onClick={() =>
                                                        handleSkillDelete(
                                                            skill.id
                                                        )
                                                    }
                                                    disabled={
                                                        actionLoading
                                                    }
                                                >

                                                    <Trash2 className="size-4" />

                                                </Button>

                                            </div>

                                        </div>

                                    )
                                )}

                            </div>

                        ) : (

                            <p className="text-sm text-muted-foreground">
                                No skills added yet.
                            </p>

                        )}

                    </CardContent>

                </Card>


                {/* Work Experience */}

                <Card className="mt-6 mb-8">

                    <CardHeader>

                        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

                            <div className="flex items-start gap-3">

                                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">

                                    <Briefcase className="size-5 text-primary" />

                                </div>

                                <div>

                                    <CardTitle>
                                        Work Experience
                                    </CardTitle>

                                    <CardDescription>
                                        Your professional experience
                                    </CardDescription>

                                </div>

                            </div>


                            <Button
                                type="button"
                                variant="outline"
                                onClick={() =>
                                    resetWorkForm()
                                }
                            >

                                <Plus className="mr-2 size-4" />

                                Add Experience

                            </Button>

                        </div>

                    </CardHeader>


                    <CardContent>


                        <form
                            onSubmit={handleWorkSubmit}
                            className="mb-8 rounded-xl border bg-muted/20 p-5"
                        >

                            <div className="mb-4 flex items-center justify-between">

                                <h3 className="font-semibold">

                                    {editingWorkId
                                        ? "Edit Work Experience"
                                        : "Add Work Experience"}

                                </h3>


                                {editingWorkId && (

                                    <Button
                                        type="button"
                                        size="sm"
                                        variant="ghost"
                                        onClick={
                                            resetWorkForm
                                        }
                                    >

                                        <X className="mr-2 size-4" />

                                        Cancel

                                    </Button>

                                )}

                            </div>


                            <div className="grid gap-4 sm:grid-cols-2">


                                <div className="space-y-2">

                                    <Label>
                                        Job Title
                                    </Label>

                                    <Input
                                        name="job_title"
                                        value={
                                            workForm.job_title
                                        }
                                        onChange={
                                            handleWorkChange
                                        }
                                        placeholder="Software Engineer"
                                        required
                                    />

                                </div>


                                <div className="space-y-2">

                                    <Label>
                                        Company
                                    </Label>

                                    <Input
                                        name="company"
                                        value={
                                            workForm.company
                                        }
                                        onChange={
                                            handleWorkChange
                                        }
                                        placeholder="Company name"
                                        required
                                    />

                                </div>


                                <div className="space-y-2">

                                    <Label>
                                        Start Date
                                    </Label>

                                    <Input
                                        name="start_date"
                                        type="date"
                                        value={
                                            workForm.start_date
                                        }
                                        onChange={
                                            handleWorkChange
                                        }
                                    />

                                </div>


                                {!workForm.is_current && (

                                    <div className="space-y-2">

                                        <Label>
                                            End Date
                                        </Label>

                                        <Input
                                            name="end_date"
                                            type="date"
                                            value={
                                                workForm.end_date
                                            }
                                            onChange={
                                                handleWorkChange
                                            }
                                        />

                                    </div>

                                )}


                                <div className="flex items-center gap-2 pt-8">

                                    <input
                                        id="work-current"
                                        name="is_current"
                                        type="checkbox"
                                        checked={
                                            workForm.is_current
                                        }
                                        onChange={
                                            handleWorkChange
                                        }
                                        className="size-4 rounded border-input"
                                    />

                                    <Label htmlFor="work-current">
                                        I currently work here
                                    </Label>

                                </div>


                                <div className="space-y-2 sm:col-span-2">

                                    <Label>
                                        Description
                                    </Label>

                                    <Textarea
                                        name="description"
                                        value={
                                            workForm.description
                                        }
                                        onChange={
                                            handleWorkChange
                                        }
                                        placeholder="Describe your role and responsibilities..."
                                        rows={4}
                                    />

                                </div>

                            </div>


                            <Button
                                type="submit"
                                className="mt-5"
                                disabled={
                                    actionLoading
                                }
                            >

                                <Save className="mr-2 size-4" />

                                {editingWorkId
                                    ? "Update Experience"
                                    : "Add Experience"}

                            </Button>

                        </form>


                        {profile?.work_experiences?.length > 0 ? (

                            <div className="space-y-4">

                                {profile.work_experiences.map(
                                    (experience) => (

                                        <div
                                            key={
                                                experience.id
                                            }
                                            className="rounded-xl border p-4"
                                        >

                                            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">


                                                <div>

                                                    <p className="font-medium">

                                                        {
                                                            experience.job_title
                                                        }

                                                    </p>

                                                    <p className="text-sm text-muted-foreground">

                                                        {
                                                            experience.company
                                                        }

                                                    </p>


                                                    <div className="mt-3 flex flex-wrap gap-2">

                                                        {experience.is_current && (

                                                            <Badge>

                                                                Current

                                                            </Badge>

                                                        )}

                                                        {experience.start_date && (

                                                            <Badge variant="secondary">

                                                                {
                                                                    experience.start_date.substring(
                                                                        0,
                                                                        10
                                                                    )
                                                                }

                                                                {" - "}

                                                                {experience.is_current
                                                                    ? "Present"
                                                                    : experience.end_date
                                                                        ? experience.end_date.substring(
                                                                            0,
                                                                            10
                                                                        )
                                                                        : "N/A"}

                                                            </Badge>

                                                        )}

                                                    </div>


                                                    {experience.description && (

                                                        <p className="mt-3 text-sm leading-6 text-muted-foreground">

                                                            {
                                                                experience.description
                                                            }

                                                        </p>

                                                    )}

                                                </div>


                                                <div className="flex gap-2">

                                                    <Button
                                                        type="button"
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() =>
                                                            handleWorkEdit(
                                                                experience
                                                            )
                                                        }
                                                    >

                                                        <Pencil className="mr-2 size-4" />

                                                        Edit

                                                    </Button>


                                                    <Button
                                                        type="button"
                                                        size="sm"
                                                        variant="destructive"
                                                        onClick={() =>
                                                            handleWorkDelete(
                                                                experience.id
                                                            )
                                                        }
                                                        disabled={
                                                            actionLoading
                                                        }
                                                    >

                                                        <Trash2 className="mr-2 size-4" />

                                                        Delete

                                                    </Button>

                                                </div>

                                            </div>

                                        </div>

                                    )
                                )}

                            </div>

                        ) : (

                            <p className="text-sm text-muted-foreground">
                                No work experience added yet.
                            </p>

                        )}

                    </CardContent>

                </Card>

            </div>

        </div>
    );
}


export default Profile;
