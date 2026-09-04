import {
    User,
    Mail,
    Phone,
    CalendarDays,
    MapPin,
    FileText,
    GraduationCap,
    Languages as LanguagesIcon,
    Wrench,
    BriefcaseBusiness,
    Plus,
    Edit3,
    Trash2,
    X,
    CheckCircle2,
    AlertCircle,
    Save,
    ChevronDown,
} from "lucide-react";

import {
    useEffect,
    useMemo,
    useState,
} from "react";

import api from "../../../api/axios";

import "./Profile.css";


function Profile() {

    // =========================================================
    // STATE
    // =========================================================

    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);

    const [academicRecords, setAcademicRecords] = useState([]);
    const [languages, setLanguages] = useState([]);
    const [skills, setSkills] = useState([]);
    const [workExperiences, setWorkExperiences] = useState([]);

    const [countries, setCountries] = useState([]);
    const [degrees, setDegrees] = useState([]);
    const [universities, setUniversities] = useState([]);
    const [fields, setFields] = useState([]);
    const [languageOptions, setLanguageOptions] = useState([]);
    const [skillOptions, setSkillOptions] = useState([]);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [modal, setModal] = useState(null);
    const [editingId, setEditingId] = useState(null);


    // =========================================================
    // PERSONAL FORM
    // =========================================================

    const [personalForm, setPersonalForm] = useState({
        name: "",
        date_of_birth: "",
        nationality_id: "",
        country_of_residence_id: "",
        phone: "",
        bio: "",
    });


    // =========================================================
    // ACADEMIC FORM
    // =========================================================

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


    // =========================================================
    // LANGUAGE FORM
    // =========================================================

    const [languageForm, setLanguageForm] = useState({
        language_id: "",
        level: "",
        test_type: "",
        score: "",
    });


    // =========================================================
    // SKILL FORM
    // =========================================================

    const [skillForm, setSkillForm] = useState({
        skill_id: "",
        level: "",
        years_of_experience: "",
    });


    // =========================================================
    // EXPERIENCE FORM
    // =========================================================

    const [experienceForm, setExperienceForm] = useState({
        job_title: "",
        company: "",
        description: "",
        start_date: "",
        end_date: "",
        is_current: false,
    });


    // =========================================================
    // HELPERS
    // =========================================================

    const getArray = (value) => {
        return Array.isArray(value) ? value : [];
    };


    const formatDate = (value) => {

        if (!value) {
            return "Not specified";
        }

        const date = new Date(value);

        if (Number.isNaN(date.getTime())) {
            return value;
        }

        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };


    const formatDateInput = (value) => {

        if (!value) {
            return "";
        }

        if (typeof value === "string") {
            return value.substring(0, 10);
        }

        const date = new Date(value);

        if (Number.isNaN(date.getTime())) {
            return "";
        }

        return date.toISOString().substring(0, 10);
    };


    const getErrorMessage = (err, fallback = "Something went wrong.") => {

        if (err?.response?.status === 422) {

            const validationErrors = err.response.data?.errors;

            if (validationErrors) {

                const messages = Object.values(validationErrors)
                    .flat()
                    .filter(Boolean);

                if (messages.length > 0) {
                    return messages.join(" ");
                }
            }
        }

        return (
            err?.response?.data?.message ||
            err?.message ||
            fallback
        );
    };


    const showSuccess = (message) => {

        setSuccess(message);

        window.setTimeout(() => {
            setSuccess("");
        }, 4000);
    };


    const getProfileCompletion = () => {

        if (!profile) {
            return 0;
        }

        return Number(profile.profile_completion ?? 0);
    };


    const getInitials = (name) => {

        if (!name) {
            return "U";
        }

        return name
            .trim()
            .split(/\s+/)
            .slice(0, 2)
            .map((part) => part.charAt(0).toUpperCase())
            .join("");
    };


    // =========================================================
    // LOOKUP HELPERS
    // =========================================================

    const getLookupIdByName = (list, value) => {

        if (!value) {
            return "";
        }

        const normalizedValue = String(value)
            .trim()
            .toLowerCase();

        const exactMatch = list.find((item) => {

            return String(item.name ?? "")
                .trim()
                .toLowerCase() === normalizedValue;

        });

        if (exactMatch) {
            return exactMatch.id;
        }

        return "";
    };


    const getLookupNameById = (list, id) => {

        if (!id) {
            return "";
        }

        const item = list.find(
            (entry) => Number(entry.id) === Number(id)
        );

        return item?.name ?? "";
    };


    // =========================================================
    // LOAD PROFILE
    // =========================================================

    const loadProfile = async ({ initial = false } = {}) => {

        try {

            if (initial) {
                setLoading(true);
            }

            const response = await api.get("/profile");

            const data = response.data ?? {};

            setUser(data.user ?? null);
            setProfile(data.profile ?? null);

            setAcademicRecords(
                getArray(data.academic_records)
            );

            setLanguages(
                getArray(data.languages)
            );

            setSkills(
                getArray(data.skills)
            );

            setWorkExperiences(
                getArray(data.work_experiences)
            );

            setPersonalForm({
                name: data.user?.name ?? "",
                date_of_birth: formatDateInput(
                    data.profile?.date_of_birth
                ),
                nationality_id:
                    data.profile?.nationality_id ?? "",
                country_of_residence_id:
                    data.profile?.country_of_residence_id ?? "",
                phone:
                    data.profile?.phone ?? "",
                bio:
                    data.profile?.bio ?? "",
            });

        } catch (err) {

            console.error("Profile Load Error:", err);

            setError(
                getErrorMessage(
                    err,
                    "Failed to load your profile."
                )
            );

        } finally {

            if (initial) {
                setLoading(false);
            }
        }
    };


    // =========================================================
    // LOAD LOOKUPS
    // =========================================================

    const loadLookups = async () => {

        try {

            const response = await api.get(
                "/profile/lookups"
            );

            const data = response.data ?? {};

            setCountries(
                getArray(data.countries)
            );

            setDegrees(
                getArray(data.degrees)
            );

            setUniversities(
                getArray(data.universities)
            );

            setFields(
                getArray(data.fields)
            );

            setLanguageOptions(
                getArray(data.languages)
            );

            setSkillOptions(
                getArray(data.skills)
            );

        } catch (err) {

            console.error("Lookup Load Error:", err);

            setError(
                getErrorMessage(
                    err,
                    "Failed to load profile options."
                )
            );
        }
    };


    // =========================================================
    // INITIAL LOAD
    // =========================================================

    useEffect(() => {

        const load = async () => {

            await Promise.all([
                loadProfile({ initial: true }),
                loadLookups(),
            ]);

        };

        load();

    }, []);


    // =========================================================
    // PERSONAL FORM
    // =========================================================

    const handlePersonalChange = (event) => {

        const {
            name,
            value,
        } = event.target;

        setPersonalForm((previous) => ({
            ...previous,
            [name]: value,
        }));
    };


    const handlePersonalSubmit = async (event) => {

        event.preventDefault();

        setError("");
        setSuccess("");

        try {

            setSaving(true);

            await api.put(
                "/profile",
                {
                    name: personalForm.name,
                    date_of_birth:
                        personalForm.date_of_birth || null,
                    nationality_id:
                        personalForm.nationality_id || null,
                    country_of_residence_id:
                        personalForm.country_of_residence_id || null,
                    phone:
                        personalForm.phone || null,
                    bio:
                        personalForm.bio || null,
                }
            );

            await loadProfile();

            showSuccess(
                "Personal information updated successfully."
            );

        } catch (err) {

            console.error(
                "Personal Information Error:",
                err
            );

            setError(
                getErrorMessage(
                    err,
                    "Failed to update personal information."
                )
            );

        } finally {

            setSaving(false);
        }
    };


    // =========================================================
    // MODAL
    // =========================================================

    const closeModal = () => {

        setModal(null);
        setEditingId(null);

    };


    // =========================================================
    // ACADEMIC RESET
    // =========================================================

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

        setEditingId(null);
    };


    // =========================================================
    // ACADEMIC CHANGE
    // =========================================================

    const handleAcademicChange = (event) => {

        const {
            name,
            value,
            type,
            checked,
        } = event.target;

        setAcademicForm((previous) => ({
            ...previous,
            [name]:
                type === "checkbox"
                    ? checked
                    : value,
        }));
    };


    // =========================================================
    // OPEN ADD ACADEMIC
    // =========================================================

    const openAddAcademic = () => {

        resetAcademicForm();

        setError("");
        setSuccess("");

        setModal("academic");
    };


    // =========================================================
    // OPEN EDIT ACADEMIC
    // =========================================================

    const openEditAcademic = (record) => {

        setEditingId(record.id);

        setAcademicForm({
            degree_id: getLookupNameById(
                degrees,
                record.degree_id
            ),

            university_id: getLookupNameById(
                universities,
                record.university_id
            ),

            field_id: getLookupNameById(
                fields,
                record.field_id
            ),

            gpa: record.gpa ?? "",

            gpa_scale:
                record.gpa_scale ?? "",

            start_date:
                formatDateInput(
                    record.start_date
                ),

            end_date:
                formatDateInput(
                    record.end_date
                ),

            is_current:
                Boolean(record.is_current),
        });

        setError("");
        setSuccess("");

        setModal("academic");
    };


    // =========================================================
    // SAVE ACADEMIC
    // =========================================================

    const handleAcademicSubmit = async (event) => {

        event.preventDefault();

        setError("");
        setSuccess("");

        // -----------------------------------------
        // Convert input names -> database IDs
        // -----------------------------------------

        const degreeId = getLookupIdByName(
            degrees,
            academicForm.degree_id
        );

        const universityId = getLookupIdByName(
            universities,
            academicForm.university_id
        );

        const fieldId = getLookupIdByName(
            fields,
            academicForm.field_id
        );


        // -----------------------------------------
        // Validate lookup inputs
        // -----------------------------------------

        if (!degreeId) {

            setError(
                "Please select a valid degree from the suggestions."
            );

            return;
        }


        if (!universityId) {

            setError(
                "Please select a valid university from the suggestions."
            );

            return;
        }


        if (!fieldId) {

            setError(
                "Please select a valid field of study from the suggestions."
            );

            return;
        }


        // -----------------------------------------
        // Build API payload
        // -----------------------------------------

        const payload = {

            degree_id:
                Number(degreeId),

            university_id:
                Number(universityId),

            field_id:
                Number(fieldId),

            gpa:
                academicForm.gpa !== ""
                    ? Number(academicForm.gpa)
                    : null,

            gpa_scale:
                academicForm.gpa_scale !== ""
                    ? Number(academicForm.gpa_scale)
                    : null,

            start_date:
                academicForm.start_date || null,

            end_date:
                academicForm.is_current
                    ? null
                    : academicForm.end_date || null,

            is_current:
                Boolean(
                    academicForm.is_current
                ),
        };


        console.log(
            "Submitting Academic Record:",
            payload
        );


        try {

            setSaving(true);


            let response;


            // -----------------------------------------
            // EDIT
            // -----------------------------------------

            if (editingId) {

                response = await api.put(
                    `/profile/academic-records/${editingId}`,
                    payload
                );

            }

            // -----------------------------------------
            // CREATE
            // -----------------------------------------

            else {

                response = await api.post(
                    "/profile/academic-records",
                    payload
                );
            }


            console.log(
                "Academic API Response:",
                response.data
            );


            // -----------------------------------------
            // Refresh data
            // -----------------------------------------

            await loadProfile();


            // -----------------------------------------
            // Reset + close
            // -----------------------------------------

            resetAcademicForm();

            closeModal();


            showSuccess(
                editingId
                    ? "Academic record updated successfully."
                    : "Academic record added successfully."
            );


        } catch (err) {

            console.error(
                "Academic Record Error:",
                err
            );


            if (
                err?.response?.status === 422
            ) {

                const validationErrors =
                    err.response.data?.errors;


                if (validationErrors) {

                    const messages =
                        Object.values(validationErrors)
                            .flat()
                            .filter(Boolean);

                    setError(
                        messages.join(" ")
                    );

                } else {

                    setError(
                        err.response.data?.message ||
                        "Please check the entered data."
                    );
                }

                return;
            }


            if (
                err?.response?.status === 401
            ) {

                setError(
                    "Your session has expired. Please log in again."
                );

                return;
            }


            setError(
                err?.response?.data?.message ||
                err?.message ||
                "Failed to save academic record."
            );


        } finally {

            setSaving(false);
        }
    };


    // =========================================================
    // DELETE ACADEMIC
    // =========================================================

    const handleDeleteAcademic = async (id) => {

        const confirmed = window.confirm(
            "Are you sure you want to delete this academic record?"
        );

        if (!confirmed) {
            return;
        }

        try {

            setError("");
            setSuccess("");
            setSaving(true);

            await api.delete(
                `/profile/academic-records/${id}`
            );

            await loadProfile();

            showSuccess(
                "Academic record deleted successfully."
            );

        } catch (err) {

            console.error(
                "Delete Academic Error:",
                err
            );

            setError(
                getErrorMessage(
                    err,
                    "Failed to delete academic record."
                )
            );

        } finally {

            setSaving(false);
        }
    };


    // =========================================================
    // LANGUAGE
    // =========================================================

    const resetLanguageForm = () => {

        setLanguageForm({
            language_id: "",
            level: "",
            test_type: "",
            score: "",
        });

        setEditingId(null);
    };


    const handleLanguageChange = (event) => {

        const {
            name,
            value,
        } = event.target;

        setLanguageForm((previous) => ({
            ...previous,
            [name]: value,
        }));
    };


    const openAddLanguage = () => {

        resetLanguageForm();

        setError("");
        setSuccess("");

        setModal("language");
    };


    const openEditLanguage = (language) => {

        setEditingId(language.id);

        setLanguageForm({
            language_id:
                language.id ?? "",

            level:
                language.pivot?.level ??
                language.level ??
                "",

            test_type:
                language.pivot?.test_type ??
                language.test_type ??
                "",

            score:
                language.pivot?.score ??
                language.score ??
                "",
        });

        setError("");
        setSuccess("");

        setModal("language");
    };


    const handleLanguageSubmit = async (event) => {

        event.preventDefault();

        setError("");
        setSuccess("");

        const languageId =
            getLookupIdByName(
                languageOptions,
                languageForm.language_id
            ) ||
            languageForm.language_id;


        if (!languageId) {

            setError(
                "Please select a valid language."
            );

            return;
        }


        const payload = {

            language_id:
                Number(languageId),

            level:
                languageForm.level,

            test_type:
                languageForm.test_type || null,

            score:
                languageForm.score !== ""
                    ? Number(languageForm.score)
                    : null,
        };


        try {

            setSaving(true);

            if (editingId) {

                await api.put(
                    `/profile/languages/${editingId}`,
                    {
                        level: payload.level,
                        test_type:
                            payload.test_type,
                        score:
                            payload.score,
                    }
                );

            } else {

                await api.post(
                    "/profile/languages",
                    payload
                );
            }


            await loadProfile();

            resetLanguageForm();

            closeModal();

            showSuccess(
                editingId
                    ? "Language updated successfully."
                    : "Language added successfully."
            );

        } catch (err) {

            console.error(
                "Language Error:",
                err
            );

            setError(
                getErrorMessage(
                    err,
                    "Failed to save language."
                )
            );

        } finally {

            setSaving(false);
        }
    };


    const handleDeleteLanguage = async (id) => {

        const confirmed = window.confirm(
            "Are you sure you want to delete this language?"
        );

        if (!confirmed) {
            return;
        }

        try {

            setSaving(true);
            setError("");
            setSuccess("");

            await api.delete(
                `/profile/languages/${id}`
            );

            await loadProfile();

            showSuccess(
                "Language deleted successfully."
            );

        } catch (err) {

            setError(
                getErrorMessage(
                    err,
                    "Failed to delete language."
                )
            );

        } finally {

            setSaving(false);
        }
    };


    // =========================================================
    // SKILLS
    // =========================================================

    const resetSkillForm = () => {

        setSkillForm({
            skill_id: "",
            level: "",
            years_of_experience: "",
        });

        setEditingId(null);
    };


    const handleSkillChange = (event) => {

        const {
            name,
            value,
        } = event.target;

        setSkillForm((previous) => ({
            ...previous,
            [name]: value,
        }));
    };


    const openAddSkill = () => {

        resetSkillForm();

        setError("");
        setSuccess("");

        setModal("skill");
    };


    const openEditSkill = (skill) => {

        setEditingId(skill.id);

        setSkillForm({
            skill_id:
                skill.name ?? "",

            level:
                skill.pivot?.level ??
                skill.level ??
                "",

            years_of_experience:
                skill.pivot?.years_of_experience ??
                skill.years_of_experience ??
                "",
        });

        setError("");
        setSuccess("");

        setModal("skill");
    };


    const handleSkillSubmit = async (event) => {

        event.preventDefault();

        setError("");
        setSuccess("");

        const skillId =
            getLookupIdByName(
                skillOptions,
                skillForm.skill_id
            ) ||
            skillForm.skill_id;


        if (!skillId) {

            setError(
                "Please select a valid skill."
            );

            return;
        }


        const payload = {

            skill_id:
                Number(skillId),

            level:
                skillForm.level,

            years_of_experience:
                skillForm.years_of_experience !== ""
                    ? Number(
                        skillForm.years_of_experience
                    )
                    : null,
        };


        try {

            setSaving(true);

            if (editingId) {

                await api.put(
                    `/profile/skills/${editingId}`,
                    {
                        level:
                            payload.level,

                        years_of_experience:
                            payload.years_of_experience,
                    }
                );

            } else {

                await api.post(
                    "/profile/skills",
                    payload
                );
            }


            await loadProfile();

            resetSkillForm();

            closeModal();

            showSuccess(
                editingId
                    ? "Skill updated successfully."
                    : "Skill added successfully."
            );

        } catch (err) {

            console.error(
                "Skill Error:",
                err
            );

            setError(
                getErrorMessage(
                    err,
                    "Failed to save skill."
                )
            );

        } finally {

            setSaving(false);
        }
    };


    const handleDeleteSkill = async (id) => {

        const confirmed = window.confirm(
            "Are you sure you want to delete this skill?"
        );

        if (!confirmed) {
            return;
        }

        try {

            setSaving(true);
            setError("");
            setSuccess("");

            await api.delete(
                `/profile/skills/${id}`
            );

            await loadProfile();

            showSuccess(
                "Skill deleted successfully."
            );

        } catch (err) {

            setError(
                getErrorMessage(
                    err,
                    "Failed to delete skill."
                )
            );

        } finally {

            setSaving(false);
        }
    };


    // =========================================================
    // EXPERIENCE
    // =========================================================

    const resetExperienceForm = () => {

        setExperienceForm({
            job_title: "",
            company: "",
            description: "",
            start_date: "",
            end_date: "",
            is_current: false,
        });

        setEditingId(null);
    };


    const handleExperienceChange = (event) => {

        const {
            name,
            value,
            type,
            checked,
        } = event.target;

        setExperienceForm((previous) => ({
            ...previous,
            [name]:
                type === "checkbox"
                    ? checked
                    : value,
        }));
    };


    const openAddExperience = () => {

        resetExperienceForm();

        setError("");
        setSuccess("");

        setModal("experience");
    };


    const openEditExperience = (experience) => {

        setEditingId(experience.id);

        setExperienceForm({
            job_title:
                experience.job_title ?? "",

            company:
                experience.company ?? "",

            description:
                experience.description ?? "",

            start_date:
                formatDateInput(
                    experience.start_date
                ),

            end_date:
                formatDateInput(
                    experience.end_date
                ),

            is_current:
                Boolean(
                    experience.is_current
                ),
        });

        setError("");
        setSuccess("");

        setModal("experience");
    };


    const handleExperienceSubmit = async (event) => {

        event.preventDefault();

        setError("");
        setSuccess("");

        const payload = {

            job_title:
                experienceForm.job_title,

            company:
                experienceForm.company,

            description:
                experienceForm.description ||
                null,

            start_date:
                experienceForm.start_date ||
                null,

            end_date:
                experienceForm.is_current
                    ? null
                    : experienceForm.end_date ||
                    null,

            is_current:
                Boolean(
                    experienceForm.is_current
                ),
        };


        try {

            setSaving(true);

            if (editingId) {

                await api.put(
                    `/profile/work-experiences/${editingId}`,
                    payload
                );

            } else {

                await api.post(
                    "/profile/work-experiences",
                    payload
                );
            }


            await loadProfile();

            resetExperienceForm();

            closeModal();

            showSuccess(
                editingId
                    ? "Work experience updated successfully."
                    : "Work experience added successfully."
            );

        } catch (err) {

            console.error(
                "Experience Error:",
                err
            );

            setError(
                getErrorMessage(
                    err,
                    "Failed to save work experience."
                )
            );

        } finally {

            setSaving(false);
        }
    };


    const handleDeleteExperience = async (id) => {

        const confirmed = window.confirm(
            "Are you sure you want to delete this work experience?"
        );

        if (!confirmed) {
            return;
        }

        try {

            setSaving(true);
            setError("");
            setSuccess("");

            await api.delete(
                `/profile/work-experiences/${id}`
            );

            await loadProfile();

            showSuccess(
                "Work experience deleted successfully."
            );

        } catch (err) {

            setError(
                getErrorMessage(
                    err,
                    "Failed to delete work experience."
                )
            );

        } finally {

            setSaving(false);
        }
    };


    // =========================================================
    // DISPLAY HELPERS
    // =========================================================

    const getAcademicDegreeName = (record) => {

        return (
            record.degree?.name ||
            getLookupNameById(
                degrees,
                record.degree_id
            ) ||
            "Degree"
        );
    };


    const getAcademicUniversityName = (record) => {

        return (
            record.university?.name ||
            getLookupNameById(
                universities,
                record.university_id
            ) ||
            "University"
        );
    };


    const getAcademicFieldName = (record) => {

        return (
            record.field?.name ||
            getLookupNameById(
                fields,
                record.field_id
            ) ||
            "Field of Study"
        );
    };


    const getLanguageName = (language) => {

        return (
            language.name ||
            getLookupNameById(
                languageOptions,
                language.language_id
            ) ||
            "Language"
        );
    };


    const getSkillName = (skill) => {

        return (
            skill.name ||
            getLookupNameById(
                skillOptions,
                skill.skill_id
            ) ||
            "Skill"
        );
    };


    const completion = getProfileCompletion();


    // =========================================================
    // LOADING
    // =========================================================

    if (loading) {

        return (
            <div className="profile-page">

                <div className="profile-loading">

                    <div className="profile-loading-spinner" />

                    <p>
                        Loading your profile...
                    </p>

                </div>

            </div>
        );
    }


    // =========================================================
    // RENDER
    // =========================================================

    return (

        <div className="profile-page">


            {/* =================================================
                HEADER
            ================================================= */}

            <div className="profile-header">

                <div>

                    <span className="profile-header-eyebrow">
                        My Profile
                    </span>

                    <h1>
                        Profile &amp; Academic Information
                    </h1>

                    <p>
                        Keep your information updated to
                        improve your opportunity matches.
                    </p>

                </div>

            </div>


            {/* =================================================
                GLOBAL ERROR
            ================================================= */}

            {error && !modal && (

                <div className="profile-inline-error">

                    <AlertCircle size={18} />

                    <span>
                        {error}
                    </span>

                    <button
                        type="button"
                        onClick={() => setError("")}
                    >
                        <X size={16} />
                    </button>

                </div>
            )}


            {/* =================================================
                SUCCESS
            ================================================= */}

            {success && (

                <div className="profile-success">

                    <CheckCircle2 size={18} />

                    <span>
                        {success}
                    </span>

                </div>
            )}


            {/* =================================================
                PROFILE OVERVIEW
            ================================================= */}

            <section className="profile-overview-card">

                <div className="profile-overview-main">

                    <div className="profile-avatar">

                        {getInitials(
                            user?.name
                        )}

                    </div>


                    <div className="profile-overview-info">

                        <h2>
                            {user?.name ||
                                "Student"}
                        </h2>

                        <div className="profile-overview-email">

                            <Mail size={16} />

                            <span>
                                {user?.email ||
                                    "No email"}
                            </span>

                        </div>

                    </div>

                </div>


                <div className="profile-completion">

                    <div className="profile-completion-header">

                        <span>
                            Profile completion
                        </span>

                        <strong>
                            {completion}%
                        </strong>

                    </div>


                    <div className="profile-progress">

                        <div
                            className="profile-progress-bar"
                            style={{
                                width:
                                    `${completion}%`,
                            }}
                        />

                    </div>

                </div>

            </section>


            {/* =================================================
                PERSONAL INFORMATION
            ================================================= */}

            <section className="profile-card">

                <div className="profile-section-heading">

                    <div>

                        <div className="profile-section-title">

                            <User size={20} />

                            <h2>
                                Personal Information
                            </h2>

                        </div>

                        <p>
                            Your basic personal information.
                        </p>

                    </div>

                </div>


                <form
                    className="profile-form"
                    onSubmit={
                        handlePersonalSubmit
                    }
                >

                    <div className="profile-form-grid">


                        {/* NAME */}

                        <div className="profile-field">

                            <label htmlFor="profile-name">
                                Full Name
                            </label>

                            <div className="profile-input-wrapper">

                                <User size={17} />

                                <input
                                    id="profile-name"
                                    name="name"
                                    type="text"
                                    value={
                                        personalForm.name
                                    }
                                    onChange={
                                        handlePersonalChange
                                    }
                                    placeholder="Your full name"
                                    required
                                />

                            </div>

                        </div>


                        {/* EMAIL */}

                        <div className="profile-field">

                            <label>
                                Email
                            </label>

                            <div className="profile-input-wrapper">

                                <Mail size={17} />

                                <input
                                    type="email"
                                    value={
                                        user?.email ||
                                        ""
                                    }
                                    disabled
                                />

                            </div>

                        </div>


                        {/* PHONE */}

                        <div className="profile-field">

                            <label htmlFor="profile-phone">
                                Phone
                            </label>

                            <div className="profile-input-wrapper">

                                <Phone size={17} />

                                <input
                                    id="profile-phone"
                                    name="phone"
                                    type="text"
                                    value={
                                        personalForm.phone
                                    }
                                    onChange={
                                        handlePersonalChange
                                    }
                                    placeholder="+970..."
                                />

                            </div>

                        </div>


                        {/* DOB */}

                        <div className="profile-field">

                            <label htmlFor="profile-dob">
                                Date of Birth
                            </label>

                            <div className="profile-input-wrapper">

                                <CalendarDays size={17} />

                                <input
                                    id="profile-dob"
                                    name="date_of_birth"
                                    type="date"
                                    value={
                                        personalForm.date_of_birth
                                    }
                                    onChange={
                                        handlePersonalChange
                                    }
                                />

                            </div>

                        </div>


                        {/* NATIONALITY */}

                        <div className="profile-field">

                            <label htmlFor="profile-nationality">
                                Nationality
                            </label>

                            <div className="profile-select-wrapper">

                                <MapPin size={17} />

                                <select
                                    id="profile-nationality"
                                    name="nationality_id"
                                    value={
                                        personalForm.nationality_id
                                    }
                                    onChange={
                                        handlePersonalChange
                                    }
                                >

                                    <option value="">
                                        Select nationality
                                    </option>

                                    {countries.map(
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

                                <ChevronDown
                                    size={17}
                                />

                            </div>

                        </div>


                        {/* RESIDENCE */}

                        <div className="profile-field">

                            <label htmlFor="profile-residence">
                                Country of Residence
                            </label>

                            <div className="profile-select-wrapper">

                                <MapPin size={17} />

                                <select
                                    id="profile-residence"
                                    name="country_of_residence_id"
                                    value={
                                        personalForm.country_of_residence_id
                                    }
                                    onChange={
                                        handlePersonalChange
                                    }
                                >

                                    <option value="">
                                        Select country
                                    </option>

                                    {countries.map(
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

                                <ChevronDown
                                    size={17}
                                />

                            </div>

                        </div>


                        {/* BIO */}

                        <div className="profile-field profile-field-full">

                            <label htmlFor="profile-bio">
                                About You
                            </label>

                            <div className="profile-input-wrapper profile-textarea-wrapper">

                                <FileText size={17} />

                                <textarea
                                    id="profile-bio"
                                    name="bio"
                                    value={
                                        personalForm.bio
                                    }
                                    onChange={
                                        handlePersonalChange
                                    }
                                    placeholder="Tell us about yourself..."
                                    rows={5}
                                />

                            </div>

                        </div>

                    </div>


                    <div className="profile-form-actions">

                        <button
                            type="submit"
                            className="profile-save-button"
                            disabled={saving}
                        >

                            <Save size={17} />

                            {saving
                                ? "Saving..."
                                : "Save Changes"}

                        </button>

                    </div>

                </form>

            </section>


            {/* =================================================
                ACADEMIC RECORDS
            ================================================= */}

            <section className="profile-card">

                <div className="profile-section-heading">

                    <div>

                        <div className="profile-section-title">

                            <GraduationCap size={20} />

                            <h2>
                                Academic Records
                            </h2>

                        </div>

                        <p>
                            Add your educational background
                            and academic history.
                        </p>

                    </div>


                    <button
                        type="button"
                        className="profile-add-button"
                        onClick={
                            openAddAcademic
                        }
                    >

                        <Plus size={17} />

                        Add Record

                    </button>

                </div>


                {academicRecords.length === 0 ? (

                    <div className="profile-empty-state">

                        <GraduationCap size={28} />

                        <h3>
                            No academic records yet
                        </h3>

                        <p>
                            Add your degree, university,
                            and field of study.
                        </p>

                        <button
                            type="button"
                            className="profile-add-button"
                            onClick={
                                openAddAcademic
                            }
                        >

                            <Plus size={17} />

                            Add Academic Record

                        </button>

                    </div>

                ) : (

                    <div className="profile-record-list">

                        {academicRecords.map(
                            (record) => (

                                <div
                                    className="profile-record"
                                    key={record.id}
                                >

                                    <div className="profile-record-icon">

                                        <GraduationCap
                                            size={22}
                                        />

                                    </div>


                                    <div className="profile-record-content">

                                        <div className="profile-record-top">

                                            <div>

                                                <h3>
                                                    {
                                                        getAcademicDegreeName(
                                                            record
                                                        )
                                                    }
                                                </h3>

                                                <p>
                                                    {
                                                        getAcademicFieldName(
                                                            record
                                                        )
                                                    }
                                                </p>

                                            </div>


                                            <div className="profile-record-actions">

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        openEditAcademic(
                                                            record
                                                        )
                                                    }
                                                    title="Edit"
                                                >

                                                    <Edit3
                                                        size={16}
                                                    />

                                                </button>


                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleDeleteAcademic(
                                                            record.id
                                                        )
                                                    }
                                                    title="Delete"
                                                >

                                                    <Trash2
                                                        size={16}
                                                    />

                                                </button>

                                            </div>

                                        </div>


                                        <div className="profile-record-meta">

                                            <span>
                                                {
                                                    getAcademicUniversityName(
                                                        record
                                                    )
                                                }
                                            </span>


                                            {record.start_date && (

                                                <span>
                                                    {
                                                        formatDate(
                                                            record.start_date
                                                        )
                                                    }

                                                    {" — "}

                                                    {record.is_current
                                                        ? "Present"
                                                        : formatDate(
                                                            record.end_date
                                                        )}

                                                </span>

                                            )}


                                            {record.gpa !== null &&
                                                record.gpa !== undefined &&
                                                record.gpa !== "" && (

                                                    <span>
                                                        GPA:{" "}
                                                        {
                                                            record.gpa
                                                        }

                                                        {record.gpa_scale
                                                            ? ` / ${record.gpa_scale}`
                                                            : ""}
                                                    </span>

                                                )}

                                        </div>

                                    </div>

                                </div>

                            )
                        )}

                    </div>

                )}

            </section>


            {/* =================================================
                LANGUAGES
            ================================================= */}

            <section className="profile-card">

                <div className="profile-section-heading">

                    <div>

                        <div className="profile-section-title">

                            <LanguagesIcon size={20} />

                            <h2>
                                Languages
                            </h2>

                        </div>

                        <p>
                            Add the languages you know
                            and your proficiency level.
                        </p>

                    </div>


                    <button
                        type="button"
                        className="profile-add-button"
                        onClick={
                            openAddLanguage
                        }
                    >

                        <Plus size={17} />

                        Add Language

                    </button>

                </div>


                {languages.length === 0 ? (

                    <div className="profile-empty-state">

                        <LanguagesIcon size={28} />

                        <h3>
                            No languages added
                        </h3>

                        <p>
                            Add your language skills.
                        </p>

                    </div>

                ) : (

                    <div className="profile-simple-list">

                        {languages.map(
                            (language) => (

                                <div
                                    className="profile-simple-item"
                                    key={
                                        language.id
                                    }
                                >

                                    <div>

                                        <strong>
                                            {
                                                getLanguageName(
                                                    language
                                                )
                                            }
                                        </strong>

                                        <span>
                                            {
                                                language.pivot?.level ||
                                                language.level ||
                                                "Not specified"
                                            }
                                        </span>

                                    </div>


                                    <div className="profile-record-actions">

                                        <button
                                            type="button"
                                            onClick={() =>
                                                openEditLanguage(
                                                    language
                                                )
                                            }
                                        >

                                            <Edit3
                                                size={16}
                                            />

                                        </button>


                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleDeleteLanguage(
                                                    language.id
                                                )
                                            }
                                        >

                                            <Trash2
                                                size={16}
                                            />

                                        </button>

                                    </div>

                                </div>

                            )
                        )}

                    </div>

                )}

            </section>


            {/* =================================================
                SKILLS
            ================================================= */}

            <section className="profile-card">

                <div className="profile-section-heading">

                    <div>

                        <div className="profile-section-title">

                            <Wrench size={20} />

                            <h2>
                                Skills
                            </h2>

                        </div>

                        <p>
                            Highlight your technical and
                            professional skills.
                        </p>

                    </div>


                    <button
                        type="button"
                        className="profile-add-button"
                        onClick={
                            openAddSkill
                        }
                    >

                        <Plus size={17} />

                        Add Skill

                    </button>

                </div>


                {skills.length === 0 ? (

                    <div className="profile-empty-state">

                        <Wrench size={28} />

                        <h3>
                            No skills added
                        </h3>

                        <p>
                            Add your skills to improve
                            opportunity matching.
                        </p>

                    </div>

                ) : (

                    <div className="profile-skills-list">

                        {skills.map(
                            (skill) => (

                                <div
                                    className="profile-skill"
                                    key={skill.id}
                                >

                                    <div>

                                        <strong>
                                            {
                                                getSkillName(
                                                    skill
                                                )
                                            }
                                        </strong>

                                        <span>
                                            {
                                                skill.pivot?.level ||
                                                skill.level ||
                                                "Not specified"
                                            }
                                        </span>

                                    </div>


                                    <div className="profile-skill-right">

                                        {skill.pivot?.years_of_experience !== null &&
                                            skill.pivot?.years_of_experience !== undefined && (

                                                <span>
                                                    {
                                                        skill.pivot.years_of_experience
                                                    }{" "}
                                                    years
                                                </span>

                                            )}


                                        <div className="profile-record-actions">

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    openEditSkill(
                                                        skill
                                                    )
                                                }
                                            >

                                                <Edit3
                                                    size={16}
                                                />

                                            </button>


                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleDeleteSkill(
                                                        skill.id
                                                    )
                                                }
                                            >

                                                <Trash2
                                                    size={16}
                                                />

                                            </button>

                                        </div>

                                    </div>

                                </div>

                            )
                        )}

                    </div>

                )}

            </section>


            {/* =================================================
                WORK EXPERIENCE
            ================================================= */}

            <section className="profile-card">

                <div className="profile-section-heading">

                    <div>

                        <div className="profile-section-title">

                            <BriefcaseBusiness
                                size={20}
                            />

                            <h2>
                                Work Experience
                            </h2>

                        </div>

                        <p>
                            Add your previous and current
                            work experience.
                        </p>

                    </div>


                    <button
                        type="button"
                        className="profile-add-button"
                        onClick={
                            openAddExperience
                        }
                    >

                        <Plus size={17} />

                        Add Experience

                    </button>

                </div>


                {workExperiences.length === 0 ? (

                    <div className="profile-empty-state">

                        <BriefcaseBusiness
                            size={28}
                        />

                        <h3>
                            No work experience
                        </h3>

                        <p>
                            Add your professional experience.
                        </p>

                    </div>

                ) : (

                    <div className="profile-record-list">

                        {workExperiences.map(
                            (experience) => (

                                <div
                                    className="profile-record"
                                    key={
                                        experience.id
                                    }
                                >

                                    <div className="profile-record-icon">

                                        <BriefcaseBusiness
                                            size={22}
                                        />

                                    </div>


                                    <div className="profile-record-content">

                                        <div className="profile-record-top">

                                            <div>

                                                <h3>
                                                    {
                                                        experience.job_title
                                                    }
                                                </h3>

                                                <p>
                                                    {
                                                        experience.company
                                                    }
                                                </p>

                                            </div>


                                            <div className="profile-record-actions">

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        openEditExperience(
                                                            experience
                                                        )
                                                    }
                                                >

                                                    <Edit3
                                                        size={16}
                                                    />

                                                </button>


                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleDeleteExperience(
                                                            experience.id
                                                        )
                                                    }
                                                >

                                                    <Trash2
                                                        size={16}
                                                    />

                                                </button>

                                            </div>

                                        </div>


                                        {experience.description && (

                                            <p className="profile-record-description">
                                                {
                                                    experience.description
                                                }
                                            </p>

                                        )}


                                        <div className="profile-record-meta">

                                            {experience.start_date && (

                                                <span>
                                                    {
                                                        formatDate(
                                                            experience.start_date
                                                        )
                                                    }

                                                    {" — "}

                                                    {experience.is_current
                                                        ? "Present"
                                                        : formatDate(
                                                            experience.end_date
                                                        )}

                                                </span>

                                            )}

                                        </div>

                                    </div>

                                </div>

                            )
                        )}

                    </div>

                )}

            </section>


            {/* =================================================
                ACADEMIC MODAL
            ================================================= */}

            {modal === "academic" && (

                <div
                    className="profile-modal-overlay"
                    onMouseDown={(event) => {

                        if (
                            event.target ===
                            event.currentTarget
                        ) {
                            closeModal();
                        }

                    }}
                >

                    <div
                        className="profile-modal"
                        role="dialog"
                        aria-modal="true"
                    >

                        <div className="profile-modal-header">

                            <div>

                                <h2>
                                    {editingId
                                        ? "Edit Academic Record"
                                        : "Add Academic Record"}
                                </h2>

                                <p>
                                    Enter your academic
                                    information below.
                                </p>

                            </div>


                            <button
                                type="button"
                                onClick={
                                    closeModal
                                }
                                disabled={saving}
                                aria-label="Close"
                            >

                                <X size={20} />

                            </button>

                        </div>


                        {error && (

                            <div className="profile-inline-error">

                                <AlertCircle
                                    size={18}
                                />

                                <span>
                                    {error}
                                </span>

                            </div>

                        )}


                        <form
                            className="profile-modal-form"
                            onSubmit={
                                handleAcademicSubmit
                            }
                        >

                            {/* =================================
                                DEGREE INPUT
                            ================================= */}

                            <div className="profile-field">

                                <label htmlFor="academic-degree">
                                    Degree
                                </label>

                                <input
                                    id="academic-degree"
                                    name="degree_id"
                                    type="text"
                                    list="degrees-list"
                                    value={
                                        academicForm.degree_id
                                    }
                                    onChange={
                                        handleAcademicChange
                                    }
                                    placeholder="e.g. MSc Artificial Intelligence"
                                    autoComplete="off"
                                    required
                                />

                                <datalist id="degrees-list">

                                    {degrees.map(
                                        (degree) => (

                                            <option
                                                key={
                                                    degree.id
                                                }
                                                value={
                                                    degree.name
                                                }
                                            />

                                        )
                                    )}

                                </datalist>

                            </div>


                            {/* =================================
                                UNIVERSITY INPUT
                            ================================= */}

                            <div className="profile-field">

                                <label htmlFor="academic-university">
                                    University
                                </label>

                                <input
                                    id="academic-university"
                                    name="university_id"
                                    type="text"
                                    list="universities-list"
                                    value={
                                        academicForm.university_id
                                    }
                                    onChange={
                                        handleAcademicChange
                                    }
                                    placeholder="e.g. University of York"
                                    autoComplete="off"
                                    required
                                />

                                <datalist id="universities-list">

                                    {universities.map(
                                        (university) => (

                                            <option
                                                key={
                                                    university.id
                                                }
                                                value={
                                                    university.name
                                                }
                                            />

                                        )
                                    )}

                                </datalist>

                            </div>


                            {/* =================================
                                FIELD INPUT
                            ================================= */}

                            <div className="profile-field">

                                <label htmlFor="academic-field">
                                    Field of Study
                                </label>

                                <input
                                    id="academic-field"
                                    name="field_id"
                                    type="text"
                                    list="fields-list"
                                    value={
                                        academicForm.field_id
                                    }
                                    onChange={
                                        handleAcademicChange
                                    }
                                    placeholder="e.g. Artificial Intelligence"
                                    autoComplete="off"
                                    required
                                />

                                <datalist id="fields-list">

                                    {fields.map(
                                        (field) => (

                                            <option
                                                key={
                                                    field.id
                                                }
                                                value={
                                                    field.name
                                                }
                                            />

                                        )
                                    )}

                                </datalist>

                            </div>


                            {/* =================================
                                GPA
                            ================================= */}

                            <div className="profile-form-grid">

                                <div className="profile-field">

                                    <label htmlFor="academic-gpa">
                                        GPA
                                    </label>

                                    <input
                                        id="academic-gpa"
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
                                        placeholder="e.g. 88.19"
                                    />

                                </div>


                                {/* GPA SCALE */}

                                <div className="profile-field">

                                    <label htmlFor="academic-gpa-scale">
                                        GPA Scale
                                    </label>

                                    <input
                                        id="academic-gpa-scale"
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
                                        placeholder="e.g. 100"
                                    />

                                </div>


                                {/* START DATE */}

                                <div className="profile-field">

                                    <label htmlFor="academic-start">
                                        Start Date
                                    </label>

                                    <input
                                        id="academic-start"
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


                                {/* END DATE */}

                                <div className="profile-field">

                                    <label htmlFor="academic-end">
                                        End Date
                                    </label>

                                    <input
                                        id="academic-end"
                                        name="end_date"
                                        type="date"
                                        value={
                                            academicForm.end_date
                                        }
                                        onChange={
                                            handleAcademicChange
                                        }
                                        disabled={
                                            academicForm.is_current
                                        }
                                    />

                                </div>


                                {/* CURRENT */}

                                <label className="profile-checkbox-field profile-field-full">

                                    <input
                                        type="checkbox"
                                        name="is_current"
                                        checked={
                                            academicForm.is_current
                                        }
                                        onChange={
                                            handleAcademicChange
                                        }
                                    />

                                    <span>
                                        I am currently studying
                                        this program
                                    </span>

                                </label>

                            </div>


                            {/* =================================
                                ACTIONS
                            ================================= */}

                            <div className="profile-modal-actions">

                                <button
                                    type="button"
                                    className="profile-cancel-button"
                                    onClick={
                                        closeModal
                                    }
                                    disabled={saving}
                                >
                                    Cancel
                                </button>


                                <button
                                    type="submit"
                                    className="profile-save-button"
                                    disabled={saving}
                                >

                                    <Save size={17} />

                                    {saving
                                        ? "Saving..."
                                        : editingId
                                            ? "Update Record"
                                            : "Add Record"}

                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}


            {/* =================================================
                LANGUAGE MODAL
            ================================================= */}

            {modal === "language" && (

                <div className="profile-modal-overlay">

                    <div className="profile-modal">

                        <div className="profile-modal-header">

                            <div>

                                <h2>
                                    {editingId
                                        ? "Edit Language"
                                        : "Add Language"}
                                </h2>

                                <p>
                                    Add your language proficiency.
                                </p>

                            </div>

                            <button
                                type="button"
                                onClick={
                                    closeModal
                                }
                                disabled={saving}
                            >
                                <X size={20} />
                            </button>

                        </div>


                        {error && (

                            <div className="profile-inline-error">

                                <AlertCircle
                                    size={18}
                                />

                                <span>
                                    {error}
                                </span>

                            </div>

                        )}


                        <form
                            className="profile-modal-form"
                            onSubmit={
                                handleLanguageSubmit
                            }
                        >

                            <div className="profile-field">

                                <label>
                                    Language
                                </label>

                                <input
                                    name="language_id"
                                    type="text"
                                    list="languages-list"
                                    value={
                                        getLookupNameById(
                                            languageOptions,
                                            languageForm.language_id
                                        ) ||
                                        languageForm.language_id
                                    }
                                    onChange={
                                        handleLanguageChange
                                    }
                                    placeholder="e.g. English"
                                    required
                                />

                                <datalist id="languages-list">

                                    {languageOptions.map(
                                        (language) => (

                                            <option
                                                key={
                                                    language.id
                                                }
                                                value={
                                                    language.name
                                                }
                                            />

                                        )
                                    )}

                                </datalist>

                            </div>


                            <div className="profile-field">

                                <label>
                                    Level
                                </label>

                                <input
                                    name="level"
                                    type="text"
                                    value={
                                        languageForm.level
                                    }
                                    onChange={
                                        handleLanguageChange
                                    }
                                    placeholder="e.g. B2 / Upper-Intermediate"
                                    required
                                />

                            </div>


                            <div className="profile-field">

                                <label>
                                    Test Type
                                </label>

                                <input
                                    name="test_type"
                                    type="text"
                                    value={
                                        languageForm.test_type
                                    }
                                    onChange={
                                        handleLanguageChange
                                    }
                                    placeholder="e.g. IELTS"
                                />

                            </div>


                            <div className="profile-field">

                                <label>
                                    Score
                                </label>

                                <input
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
                                    placeholder="e.g. 7.0"
                                />

                            </div>


                            <div className="profile-modal-actions">

                                <button
                                    type="button"
                                    className="profile-cancel-button"
                                    onClick={
                                        closeModal
                                    }
                                    disabled={saving}
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="profile-save-button"
                                    disabled={saving}
                                >

                                    <Save size={17} />

                                    {saving
                                        ? "Saving..."
                                        : editingId
                                            ? "Update"
                                            : "Add Language"}

                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}


            {/* =================================================
                SKILL MODAL
            ================================================= */}

            {modal === "skill" && (

                <div className="profile-modal-overlay">

                    <div className="profile-modal">

                        <div className="profile-modal-header">

                            <div>

                                <h2>
                                    {editingId
                                        ? "Edit Skill"
                                        : "Add Skill"}
                                </h2>

                                <p>
                                    Add your professional skill.
                                </p>

                            </div>

                            <button
                                type="button"
                                onClick={
                                    closeModal
                                }
                                disabled={saving}
                            >
                                <X size={20} />
                            </button>

                        </div>


                        {error && (

                            <div className="profile-inline-error">

                                <AlertCircle
                                    size={18}
                                />

                                <span>
                                    {error}
                                </span>

                            </div>

                        )}


                        <form
                            className="profile-modal-form"
                            onSubmit={
                                handleSkillSubmit
                            }
                        >

                            <div className="profile-field">

                                <label>
                                    Skill
                                </label>

                                <input
                                    name="skill_id"
                                    type="text"
                                    list="skills-list"
                                    value={
                                        skillForm.skill_id
                                    }
                                    onChange={
                                        handleSkillChange
                                    }
                                    placeholder="e.g. Python"
                                    autoComplete="off"
                                    required
                                />

                                <datalist id="skills-list">

                                    {skillOptions.map(
                                        (skill) => (

                                            <option
                                                key={
                                                    skill.id
                                                }
                                                value={
                                                    skill.name
                                                }
                                            />

                                        )
                                    )}

                                </datalist>

                            </div>


                            <div className="profile-field">

                                <label>
                                    Level
                                </label>

                                <input
                                    name="level"
                                    type="text"
                                    value={
                                        skillForm.level
                                    }
                                    onChange={
                                        handleSkillChange
                                    }
                                    placeholder="e.g. Advanced"
                                    required
                                />

                            </div>


                            <div className="profile-field">

                                <label>
                                    Years of Experience
                                </label>

                                <input
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
                                    placeholder="e.g. 2"
                                />

                            </div>


                            <div className="profile-modal-actions">

                                <button
                                    type="button"
                                    className="profile-cancel-button"
                                    onClick={
                                        closeModal
                                    }
                                    disabled={saving}
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="profile-save-button"
                                    disabled={saving}
                                >

                                    <Save size={17} />

                                    {saving
                                        ? "Saving..."
                                        : editingId
                                            ? "Update"
                                            : "Add Skill"}

                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}


            {/* =================================================
                EXPERIENCE MODAL
            ================================================= */}

            {modal === "experience" && (

                <div className="profile-modal-overlay">

                    <div className="profile-modal">

                        <div className="profile-modal-header">

                            <div>

                                <h2>
                                    {editingId
                                        ? "Edit Work Experience"
                                        : "Add Work Experience"}
                                </h2>

                                <p>
                                    Add your professional experience.
                                </p>

                            </div>

                            <button
                                type="button"
                                onClick={
                                    closeModal
                                }
                                disabled={saving}
                            >
                                <X size={20} />
                            </button>

                        </div>


                        {error && (

                            <div className="profile-inline-error">

                                <AlertCircle
                                    size={18}
                                />

                                <span>
                                    {error}
                                </span>

                            </div>

                        )}


                        <form
                            className="profile-modal-form"
                            onSubmit={
                                handleExperienceSubmit
                            }
                        >

                            <div className="profile-form-grid">

                                <div className="profile-field">

                                    <label>
                                        Job Title
                                    </label>

                                    <input
                                        name="job_title"
                                        type="text"
                                        value={
                                            experienceForm.job_title
                                        }
                                        onChange={
                                            handleExperienceChange
                                        }
                                        placeholder="e.g. Software Engineer"
                                        required
                                    />

                                </div>


                                <div className="profile-field">

                                    <label>
                                        Company
                                    </label>

                                    <input
                                        name="company"
                                        type="text"
                                        value={
                                            experienceForm.company
                                        }
                                        onChange={
                                            handleExperienceChange
                                        }
                                        placeholder="e.g. Company Name"
                                        required
                                    />

                                </div>


                                <div className="profile-field">

                                    <label>
                                        Start Date
                                    </label>

                                    <input
                                        name="start_date"
                                        type="date"
                                        value={
                                            experienceForm.start_date
                                        }
                                        onChange={
                                            handleExperienceChange
                                        }
                                    />

                                </div>


                                <div className="profile-field">

                                    <label>
                                        End Date
                                    </label>

                                    <input
                                        name="end_date"
                                        type="date"
                                        value={
                                            experienceForm.end_date
                                        }
                                        onChange={
                                            handleExperienceChange
                                        }
                                        disabled={
                                            experienceForm.is_current
                                        }
                                    />

                                </div>


                                <div className="profile-field profile-field-full">

                                    <label>
                                        Description
                                    </label>

                                    <textarea
                                        name="description"
                                        value={
                                            experienceForm.description
                                        }
                                        onChange={
                                            handleExperienceChange
                                        }
                                        placeholder="Describe your responsibilities..."
                                        rows={5}
                                    />

                                </div>


                                <label className="profile-checkbox-field profile-field-full">

                                    <input
                                        type="checkbox"
                                        name="is_current"
                                        checked={
                                            experienceForm.is_current
                                        }
                                        onChange={
                                            handleExperienceChange
                                        }
                                    />

                                    <span>
                                        I currently work here
                                    </span>

                                </label>

                            </div>


                            <div className="profile-modal-actions">

                                <button
                                    type="button"
                                    className="profile-cancel-button"
                                    onClick={
                                        closeModal
                                    }
                                    disabled={saving}
                                >
                                    Cancel
                                </button>


                                <button
                                    type="submit"
                                    className="profile-save-button"
                                    disabled={saving}
                                >

                                    <Save size={17} />

                                    {saving
                                        ? "Saving..."
                                        : editingId
                                            ? "Update"
                                            : "Add Experience"}

                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}

        </div>
    );
}


export default Profile;
