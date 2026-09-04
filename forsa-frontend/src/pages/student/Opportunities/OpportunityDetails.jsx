import {
    useEffect,
    useState,
} from "react";

import {
    Link,
    useParams,
} from "react-router-dom";

import {
    ArrowLeft,
    Award,
    Check,
    CheckCircle2,
    Clock3,
    ExternalLink,
    GraduationCap,
    MapPin,
    X,
    Building2,
    CalendarDays,
    FileCheck2,
    Sparkles,
} from "lucide-react";

import {
    getOpportunity,
    checkOpportunityEligibility,
    checkOpportunityMatch,
} from "../../../api/opportunities";

import {
    createApplication,
    getMyApplications,
} from "../../../api/applications";

import "./OpportunityDetails.css";


/* =========================================================
   CONSTANTS
========================================================= */

const OPPORTUNITIES_ROUTE =
    "/student/opportunities";


/* =========================================================
   HELPERS
========================================================= */

const getApiData = (response) => {
    return response?.data ?? response;
};


const getApplicationsFromResponse = (response) => {

    if (Array.isArray(response)) {
        return response;
    }

    if (Array.isArray(response?.data)) {
        return response.data;
    }

    if (Array.isArray(response?.data?.data)) {
        return response.data.data;
    }

    return [];
};


const getStatusValue = (status) => {

    if (
        status === null ||
        status === undefined
    ) {
        return "pending";
    }

    if (typeof status === "object") {

        return String(
            status.value ??
            status.name ??
            status.label ??
            status.status ??
            "pending"
        ).toLowerCase();
    }

    return String(status).toLowerCase();
};


const getStatusLabel = (status) => {

    switch (getStatusValue(status)) {

        case "accepted":
            return "Accepted";

        case "approved":
            return "Approved";

        case "rejected":
            return "Rejected";

        case "pending":
            return "Pending";

        default:
            return String(
                status ?? "Pending"
            );
    }
};


const getStatusClass = (status) => {

    switch (getStatusValue(status)) {

        case "accepted":
        case "approved":
            return "status-success";

        case "rejected":
            return "status-danger";

        default:
            return "status-pending";
    }
};


const formatDate = (date) => {

    if (!date) {
        return "N/A";
    }

    const parsedDate =
        new Date(date);

    if (
        Number.isNaN(
            parsedDate.getTime()
        )
    ) {
        return "N/A";
    }

    return parsedDate.toLocaleDateString(
        "en-GB",
        {
            day: "2-digit",
            month: "short",
            year: "numeric",
        }
    );
};


const formatDateTime = (date) => {

    if (!date) {
        return "N/A";
    }

    const parsedDate =
        new Date(date);

    if (
        Number.isNaN(
            parsedDate.getTime()
        )
    ) {
        return "N/A";
    }

    return parsedDate.toLocaleString(
        "en-GB"
    );
};


const getUniversityName = (opportunity) => {

    if (!opportunity) {
        return "N/A";
    }

    if (
        opportunity.university &&
        typeof opportunity.university === "object"
    ) {

        return (
            opportunity.university.name ||
            opportunity.university.title ||
            "N/A"
        );
    }

    return (
        opportunity.university_name ||
        opportunity.university ||
        "N/A"
    );
};


const getCountryName = (opportunity) => {

    if (!opportunity) {
        return "N/A";
    }

    if (
        opportunity.country &&
        typeof opportunity.country === "object"
    ) {

        return (
            opportunity.country.name ||
            opportunity.country.title ||
            "N/A"
        );
    }

    return (
        opportunity.country_name ||
        opportunity.country ||
        "N/A"
    );
};


const getOpportunityType = (opportunity) => {

    if (!opportunity) {
        return "N/A";
    }

    if (
        opportunity.opportunity_type &&
        typeof opportunity.opportunity_type === "object"
    ) {

        return (
            opportunity.opportunity_type.name ||
            opportunity.opportunity_type.title ||
            "N/A"
        );
    }

    if (
        opportunity.type &&
        typeof opportunity.type === "object"
    ) {

        return (
            opportunity.type.name ||
            opportunity.type.title ||
            "N/A"
        );
    }

    return (
        opportunity.opportunity_type ||
        opportunity.type ||
        opportunity.opportunity_type_name ||
        "N/A"
    );
};


const getFundingType = (opportunity) => {

    if (!opportunity) {
        return "N/A";
    }

    if (
        opportunity.funding_type &&
        typeof opportunity.funding_type === "object"
    ) {

        return (
            opportunity.funding_type.name ||
            opportunity.funding_type.title ||
            "N/A"
        );
    }

    if (
        opportunity.fundingType &&
        typeof opportunity.fundingType === "object"
    ) {

        return (
            opportunity.fundingType.name ||
            opportunity.fundingType.title ||
            "N/A"
        );
    }

    return (
        opportunity.funding ||
        opportunity.funding_type ||
        opportunity.funding_type_name ||
        "N/A"
    );
};


const getMatchLevelLabel = (level) => {

    if (!level) {
        return "N/A";
    }

    return String(level)
        .replace(/_/g, " ")
        .replace(/\b\w/g, (char) =>
            char.toUpperCase()
        );
};


const getScore = (section) => {
    return section?.score ?? 0;
};


const getMaxScore = (section) => {
    return section?.max_score ?? 0;
};


/* =========================================================
   COMPONENT
========================================================= */

function OpportunityDetails() {

    const { id } = useParams();

    const opportunityId =
        Number(id);


    const [opportunity, setOpportunity] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    const [eligibility, setEligibility] =
        useState(null);

    const [eligibilityLoading, setEligibilityLoading] =
        useState(false);


    const [match, setMatch] =
        useState(null);

    const [matchLoading, setMatchLoading] =
        useState(false);


    const [actionError, setActionError] =
        useState("");


    const [notes, setNotes] =
        useState("");

    const [existingApplication, setExistingApplication] =
        useState(null);

    const [applicationLoading, setApplicationLoading] =
        useState(false);

    const [applicationError, setApplicationError] =
        useState("");


    /* =========================================================
       LOAD OPPORTUNITY
    ========================================================= */

    useEffect(() => {

        const loadOpportunity = async () => {

            try {

                setLoading(true);
                setError("");

                if (
                    !Number.isInteger(opportunityId) ||
                    opportunityId <= 0
                ) {

                    setOpportunity(null);

                    setError(
                        "Invalid opportunity ID."
                    );

                    return;
                }


                const response =
                    await getOpportunity(
                        opportunityId
                    );


                const data =
                    getApiData(response);


                setOpportunity(data);

            } catch (err) {

                console.error(
                    "Failed to load opportunity:",
                    err
                );

                setError(
                    err?.response?.data?.message ||
                    "Failed to load opportunity."
                );

            } finally {

                setLoading(false);

            }
        };


        loadOpportunity();

    }, [opportunityId]);


    /* =========================================================
       APPLICATION STATUS
    ========================================================= */

    useEffect(() => {

        const loadApplicationStatus =
            async () => {

                try {

                    if (
                        !Number.isInteger(opportunityId) ||
                        opportunityId <= 0
                    ) {
                        setExistingApplication(null);
                        return;
                    }


                    const response =
                        await getMyApplications();


                    const applications =
                        getApplicationsFromResponse(
                            response
                        );


                    const existing =
                        applications.find(
                            (item) =>
                                Number(
                                    item?.opportunity_id
                                ) === opportunityId
                        );


                    setExistingApplication(
                        existing || null
                    );

                } catch (err) {

                    console.error(
                        "Failed to check application status:",
                        err
                    );

                }
            };


        loadApplicationStatus();

    }, [opportunityId]);


    /* =========================================================
       CHECK ELIGIBILITY
    ========================================================= */

    const handleCheckEligibility =
        async () => {

            try {

                setEligibilityLoading(true);
                setActionError("");

                const response =
                    await checkOpportunityEligibility(
                        opportunityId
                    );


                const result =
                    getApiData(response);


                setEligibility(result);

                return result;

            } catch (err) {

                console.error(
                    "Failed to check eligibility:",
                    err
                );

                setActionError(
                    err?.response?.data?.message ||
                    "Failed to check eligibility."
                );

                return null;

            } finally {

                setEligibilityLoading(false);

            }
        };


    /* =========================================================
       MATCH
    ========================================================= */

    const handleMatch =
        async () => {

            try {

                setMatchLoading(true);
                setActionError("");

                const response =
                    await checkOpportunityMatch(
                        opportunityId
                    );


                const result =
                    getApiData(response);


                setMatch(result);

                return result;

            } catch (err) {

                console.error(
                    "Failed to calculate match score:",
                    err
                );

                setActionError(
                    err?.response?.data?.message ||
                    "Failed to calculate match score."
                );

                return null;

            } finally {

                setMatchLoading(false);

            }
        };


    /* =========================================================
       APPLY
    ========================================================= */

    const handleApply =
        async () => {

            if (existingApplication) {
                return;
            }


            try {

                setApplicationLoading(true);
                setApplicationError("");
                setActionError("");


                let eligibilityResult =
                    eligibility;


                if (!eligibilityResult) {

                    eligibilityResult =
                        await handleCheckEligibility();

                }


                if (!eligibilityResult) {
                    return;
                }


                if (
                    eligibilityResult.eligible !== true
                ) {

                    setApplicationError(
                        "You are not eligible for this opportunity."
                    );

                    return;
                }


                let matchResult =
                    match;


                if (!matchResult) {

                    matchResult =
                        await handleMatch();

                }


                if (!matchResult) {
                    return;
                }


                const response =
                    await createApplication(
                        opportunityId,
                        notes
                    );


                const createdApplication =
                    getApiData(response);


                setExistingApplication(
                    createdApplication
                );


                setNotes("");

            } catch (err) {

                console.error(
                    "Failed to submit application:",
                    err
                );

                setApplicationError(
                    err?.response?.data?.message ||
                    "Failed to submit application."
                );

            } finally {

                setApplicationLoading(false);

            }
        };


    /* =========================================================
       LOADING
    ========================================================= */

    if (loading) {

        return (

            <div className="opportunity-details-page">

                <div className="opportunity-details-state">

                    <div className="opportunity-loading-spinner" />

                    <p>
                        Loading opportunity...
                    </p>

                </div>

            </div>

        );
    }


    /* =========================================================
       ERROR
    ========================================================= */

    if (error) {

        return (

            <div className="opportunity-details-page">

                <div className="opportunity-details-state">

                    <div className="opportunity-error-icon">

                        <X size={24} />

                    </div>


                    <h2>
                        Unable to load opportunity
                    </h2>


                    <p>
                        {error}
                    </p>


                    <Link
                        to={OPPORTUNITIES_ROUTE}
                        className="opportunity-primary-button"
                    >

                        <ArrowLeft size={16} />

                        Back to Opportunities

                    </Link>

                </div>

            </div>

        );
    }


    /* =========================================================
       NOT FOUND
    ========================================================= */

    if (!opportunity) {

        return (

            <div className="opportunity-details-page">

                <div className="opportunity-details-state">

                    <h2>
                        Opportunity not found
                    </h2>


                    <Link
                        to={OPPORTUNITIES_ROUTE}
                        className="opportunity-primary-button"
                    >

                        <ArrowLeft size={16} />

                        Back to Opportunities

                    </Link>

                </div>

            </div>

        );
    }


    /* =========================================================
       DATA
    ========================================================= */

    const title =
        opportunity.title ||
        "Untitled Opportunity";


    const universityName =
        getUniversityName(
            opportunity
        );


    const countryName =
        getCountryName(
            opportunity
        );


    const opportunityType =
        getOpportunityType(
            opportunity
        );


    const fundingType =
        getFundingType(
            opportunity
        );


    /* =========================================================
       RENDER
    ========================================================= */

    return (

        <div className="opportunity-details-page">

            <div className="opportunity-details-container">


                {/* BACK */}

                <Link
                    to={OPPORTUNITIES_ROUTE}
                    className="opportunity-back-link"
                >

                    <ArrowLeft size={16} />

                    Back to Opportunities

                </Link>


                {/* HERO */}

                <section className="opportunity-details-hero">

                    <div className="opportunity-details-hero-content">

                        <div className="opportunity-details-badges">

                            <span className="opportunity-details-badge">

                                Opportunity Details

                            </span>


                            {opportunity.is_verified && (

                                <span className="opportunity-details-badge opportunity-details-badge-verified">

                                    <CheckCircle2 size={14} />

                                    Verified

                                </span>

                            )}

                        </div>


                        <h1>
                            {title}
                        </h1>


                        <p>
                            {opportunity.description ||
                                "No description available."}
                        </p>

                    </div>


                    <div className="opportunity-ai-card">

                        <Sparkles size={20} />

                        <div>

                            <span>
                                Powered by EduMatch AI
                            </span>

                            <strong>
                                AI-powered matching
                            </strong>

                        </div>

                    </div>

                </section>


                {/* BASIC INFORMATION */}

                <section className="opportunity-details-section">

                    <div className="opportunity-details-card">

                        <div className="opportunity-details-card-header">

                            <h2>
                                Basic Information
                            </h2>

                            <p>
                                Key information about this opportunity
                            </p>

                        </div>


                        <div className="opportunity-basic-grid">

                            <div className="opportunity-basic-item">

                                <div className="opportunity-basic-icon">

                                    <Building2 size={17} />

                                </div>

                                <span>
                                    University
                                </span>

                                <strong>
                                    {universityName}
                                </strong>

                            </div>


                            <div className="opportunity-basic-item">

                                <div className="opportunity-basic-icon">

                                    <MapPin size={17} />

                                </div>

                                <span>
                                    Country
                                </span>

                                <strong>
                                    {countryName}
                                </strong>

                            </div>


                            <div className="opportunity-basic-item">

                                <div className="opportunity-basic-icon">

                                    <GraduationCap size={17} />

                                </div>

                                <span>
                                    Type
                                </span>

                                <strong>
                                    {opportunityType}
                                </strong>

                            </div>


                            <div className="opportunity-basic-item">

                                <div className="opportunity-basic-icon">

                                    <Award size={17} />

                                </div>

                                <span>
                                    Funding
                                </span>

                                <strong>
                                    {fundingType}
                                </strong>

                            </div>


                            <div className="opportunity-basic-item">

                                <div className="opportunity-basic-icon">

                                    <CalendarDays size={17} />

                                </div>

                                <span>
                                    Deadline
                                </span>

                                <strong>
                                    {formatDate(
                                        opportunity.deadline
                                    )}
                                </strong>

                            </div>


                            <div className="opportunity-basic-item">

                                <div className="opportunity-basic-icon">

                                    <Clock3 size={17} />

                                </div>

                                <span>
                                    Start Date
                                </span>

                                <strong>
                                    {formatDate(
                                        opportunity.start_date
                                    )}
                                </strong>

                            </div>

                        </div>

                    </div>

                </section>


                {/* FIELDS + DEGREES */}

                <section className="opportunity-details-two-column">

                    <div className="opportunity-details-card">

                        <div className="opportunity-details-card-header">

                            <h2>
                                Academic Fields
                            </h2>

                        </div>


                        <div className="opportunity-details-card-body">

                            {opportunity.fields?.length > 0 ? (

                                <div className="opportunity-tags">

                                    {opportunity.fields.map(
                                        (field) => (

                                            <span
                                                key={field.id}
                                                className="opportunity-tag"
                                            >
                                                {field.name}
                                            </span>

                                        )
                                    )}

                                </div>

                            ) : (

                                <p className="opportunity-empty-text">
                                    No fields specified.
                                </p>

                            )}

                        </div>

                    </div>


                    <div className="opportunity-details-card">

                        <div className="opportunity-details-card-header">

                            <h2>
                                Degrees
                            </h2>

                        </div>


                        <div className="opportunity-details-card-body">

                            {opportunity.degrees?.length > 0 ? (

                                <div className="opportunity-tags">

                                    {opportunity.degrees.map(
                                        (degree) => (

                                            <span
                                                key={degree.id}
                                                className="opportunity-tag"
                                            >

                                                {degree.name}

                                                {degree.code
                                                    ? ` (${degree.code})`
                                                    : ""}

                                            </span>

                                        )
                                    )}

                                </div>

                            ) : (

                                <p className="opportunity-empty-text">
                                    No degree requirement.
                                </p>

                            )}

                        </div>

                    </div>

                </section>


                {/* SKILLS + NATIONALITIES */}

                <section className="opportunity-details-two-column">

                    <div className="opportunity-details-card">

                        <div className="opportunity-details-card-header">

                            <h2>
                                Skills
                            </h2>

                            <p>
                                Skills required or preferred for this
                                opportunity
                            </p>

                        </div>


                        <div className="opportunity-details-card-body">

                            {opportunity.skills?.length > 0 ? (

                                <div className="opportunity-list">

                                    {opportunity.skills.map(
                                        (skill) => (

                                            <div
                                                key={skill.id}
                                                className="opportunity-list-item"
                                            >

                                                <span>
                                                    {skill.name}
                                                </span>


                                                <span
                                                    className={
                                                        skill.is_mandatory
                                                            ? "opportunity-status-required"
                                                            : "opportunity-status-optional"
                                                    }
                                                >

                                                    {skill.is_mandatory
                                                        ? "Required"
                                                        : "Optional"}

                                                </span>

                                            </div>

                                        )
                                    )}

                                </div>

                            ) : (

                                <p className="opportunity-empty-text">
                                    No skills specified.
                                </p>

                            )}

                        </div>

                    </div>


                    <div className="opportunity-details-card">

                        <div className="opportunity-details-card-header">

                            <h2>
                                Nationalities
                            </h2>

                            <p>
                                Eligibility by nationality
                            </p>

                        </div>


                        <div className="opportunity-details-card-body">

                            {opportunity.nationalities?.length > 0 ? (

                                <div className="opportunity-list">

                                    {opportunity.nationalities.map(
                                        (
                                            nationality,
                                            index
                                        ) => (

                                            <div
                                                key={
                                                    nationality.id ??
                                                    index
                                                }
                                                className="opportunity-list-item"
                                            >

                                                <span>
                                                    {
                                                        nationality.country_name
                                                    }
                                                </span>


                                                <span className="opportunity-status-optional">

                                                    {
                                                        nationality.eligibility_type
                                                    }

                                                </span>

                                            </div>

                                        )
                                    )}

                                </div>

                            ) : (

                                <p className="opportunity-empty-text">
                                    No nationality restriction.
                                </p>

                            )}

                        </div>

                    </div>

                </section>


                {/* REQUIREMENTS */}

                <section className="opportunity-details-section">

                    <div className="opportunity-details-card">

                        <div className="opportunity-details-card-header">

                            <h2>
                                Requirements
                            </h2>

                            <p>
                                Requirements listed by the opportunity
                            </p>

                        </div>


                        <div className="opportunity-details-card-body">

                            {opportunity.requirements?.length > 0 ? (

                                <div className="opportunity-requirements">

                                    {opportunity.requirements.map(
                                        (requirement) => (

                                            <div
                                                key={
                                                    requirement.id
                                                }
                                                className="opportunity-requirement"
                                            >

                                                <FileCheck2 size={20} />

                                                <p>
                                                    {
                                                        requirement.description
                                                    }
                                                </p>

                                            </div>

                                        )
                                    )}

                                </div>

                            ) : (

                                <p className="opportunity-empty-text">
                                    No requirements specified.
                                </p>

                            )}

                        </div>

                    </div>

                </section>


                {/* ELIGIBILITY + MATCH */}

                <section className="opportunity-details-section">

                    <div className="opportunity-details-card">

                        <div className="opportunity-details-card-header">

                            <h2>
                                Eligibility & Match
                            </h2>

                            <p>
                                Check your eligibility and calculate
                                your profile match.
                            </p>

                        </div>


                        <div className="opportunity-details-card-body">

                            {actionError && (

                                <div className="opportunity-error-message">
                                    {actionError}
                                </div>

                            )}


                            {!existingApplication && (

                                <div className="opportunity-action-buttons">

                                    <button
                                        type="button"
                                        className="opportunity-primary-button"
                                        onClick={
                                            handleCheckEligibility
                                        }
                                        disabled={
                                            eligibilityLoading ||
                                            applicationLoading
                                        }
                                    >

                                        <CheckCircle2 size={16} />

                                        {eligibilityLoading
                                            ? "Checking..."
                                            : "Check Eligibility"}

                                    </button>


                                    <button
                                        type="button"
                                        className="opportunity-secondary-action"
                                        onClick={
                                            handleMatch
                                        }
                                        disabled={
                                            matchLoading ||
                                            applicationLoading
                                        }
                                    >

                                        <Sparkles size={16} />

                                        {matchLoading
                                            ? "Calculating..."
                                            : "Calculate Match"}

                                    </button>

                                </div>

                            )}


                            {eligibility && (

                                <div className="opportunity-result-card">

                                    <div className="opportunity-result-header">

                                        <div>

                                            <span>
                                                Eligibility Result
                                            </span>


                                            <h3>
                                                {eligibility.eligible
                                                    ? "Eligible"
                                                    : "Not Eligible"}
                                            </h3>

                                        </div>


                                        <span
                                            className={
                                                eligibility.eligible
                                                    ? "opportunity-result-badge opportunity-result-success"
                                                    : "opportunity-result-badge opportunity-result-danger"
                                            }
                                        >

                                            {eligibility.status ||
                                                (
                                                    eligibility.eligible
                                                        ? "eligible"
                                                        : "not eligible"
                                                )}

                                        </span>

                                    </div>


                                    {eligibility.checks?.length > 0 && (

                                        <div className="opportunity-check-section">

                                            <h4>
                                                Checks
                                            </h4>


                                            <div className="opportunity-check-list">

                                                {eligibility.checks.map(
                                                    (
                                                        check,
                                                        index
                                                    ) => (

                                                        <div
                                                            key={index}
                                                            className="opportunity-check-item"
                                                        >

                                                            <Check size={16} />

                                                            <div>

                                                                <strong>
                                                                    {
                                                                        check.type
                                                                    }
                                                                </strong>

                                                                <p>
                                                                    {
                                                                        check.message
                                                                    }
                                                                </p>

                                                            </div>

                                                        </div>

                                                    )
                                                )}

                                            </div>

                                        </div>

                                    )}


                                    {eligibility.failed_checks?.length > 0 && (

                                        <div className="opportunity-check-section">

                                            <h4 className="opportunity-failed-title">
                                                Failed Checks
                                            </h4>


                                            <div className="opportunity-check-list">

                                                {eligibility.failed_checks.map(
                                                    (
                                                        check,
                                                        index
                                                    ) => (

                                                        <div
                                                            key={index}
                                                            className="opportunity-failed-item"
                                                        >

                                                            <X size={16} />

                                                            <p>
                                                                {
                                                                    check.message
                                                                }
                                                            </p>

                                                        </div>

                                                    )
                                                )}

                                            </div>

                                        </div>

                                    )}

                                </div>

                            )}


                            {match && (

                                <div className="opportunity-match-card">

                                    <div className="opportunity-match-score">

                                        <span>
                                            Match Score
                                        </span>

                                        <strong>
                                            {match.match_score}
                                        </strong>

                                        <small>
                                            {getMatchLevelLabel(
                                                match.level
                                            )}
                                        </small>

                                    </div>


                                    <div className="opportunity-match-content">

                                        <div className="opportunity-match-header">

                                            <div>

                                                <h3>
                                                    Match Result
                                                </h3>

                                                <p>
                                                    Based on your profile
                                                    and opportunity
                                                    requirements.
                                                </p>

                                            </div>


                                            <span
                                                className={
                                                    match.eligible_for_opportunity
                                                        ? "opportunity-result-badge opportunity-result-success"
                                                        : "opportunity-result-badge opportunity-result-danger"
                                                }
                                            >

                                                {match.eligible_for_opportunity
                                                    ? "Eligible"
                                                    : "Not Eligible"}

                                            </span>

                                        </div>


                                        <div className="opportunity-score-grid">

                                            {[
                                                [
                                                    "Academic Field",
                                                    match.breakdown?.academic_field,
                                                ],
                                                [
                                                    "Skills",
                                                    match.breakdown?.skills,
                                                ],
                                                [
                                                    "GPA",
                                                    match.breakdown?.gpa,
                                                ],
                                                [
                                                    "Language",
                                                    match.breakdown?.language,
                                                ],
                                                [
                                                    "Experience",
                                                    match.breakdown?.experience,
                                                ],
                                            ].map(
                                                ([
                                                    label,
                                                    section,
                                                ]) => (

                                                    <div
                                                        key={label}
                                                        className="opportunity-score-item"
                                                    >

                                                        <span>
                                                            {label}
                                                        </span>

                                                        <strong>

                                                            {getScore(
                                                                section
                                                            )}

                                                            /

                                                            {getMaxScore(
                                                                section
                                                            )}

                                                        </strong>

                                                    </div>

                                                )
                                            )}

                                        </div>

                                    </div>

                                </div>

                            )}

                        </div>

                    </div>

                </section>


                {/* APPLICATION */}

                <section className="opportunity-details-section">

                    <div className="opportunity-details-card">

                        <div className="opportunity-details-card-header">

                            <h2>
                                Application
                            </h2>

                            <p>
                                Submit and track your application for
                                this opportunity.
                            </p>

                        </div>


                        <div className="opportunity-details-card-body">

                            {applicationError && (

                                <div className="opportunity-error-message">
                                    {applicationError}
                                </div>

                            )}


                            {existingApplication ? (

                                <div className="opportunity-application-existing">

                                    <div className="opportunity-application-status">

                                        <div>

                                            <span>
                                                Application Status
                                            </span>

                                            <h3>
                                                Already Applied
                                            </h3>

                                        </div>


                                        <span
                                            className={
                                                `opportunity-status-badge ${getStatusClass(
                                                    existingApplication.status
                                                )
                                                }`
                                            }
                                        >

                                            {getStatusLabel(
                                                existingApplication.status
                                            )}

                                        </span>

                                    </div>


                                    <div className="opportunity-application-grid">

                                        <div className="opportunity-application-item">

                                            <span>
                                                Application ID
                                            </span>

                                            <strong>
                                                #
                                                {
                                                    existingApplication.id
                                                }
                                            </strong>

                                        </div>


                                        <div className="opportunity-application-item">

                                            <span>
                                                Applied At
                                            </span>

                                            <strong>

                                                {formatDateTime(
                                                    existingApplication.applied_at ||
                                                    existingApplication.created_at
                                                )}

                                            </strong>

                                        </div>

                                    </div>


                                    {existingApplication.notes && (

                                        <div className="opportunity-application-notes">

                                            <span>
                                                Notes
                                            </span>

                                            <p>
                                                {
                                                    existingApplication.notes
                                                }
                                            </p>

                                        </div>

                                    )}


                                    <Link
                                        to={
                                            `/student/applications/${existingApplication.id}`
                                        }
                                        className="opportunity-primary-button"
                                    >
                                        View Application Details
                                    </Link>

                                </div>

                            ) : (

                                <div className="opportunity-application-form">

                                    <div>

                                        <label
                                            htmlFor="application-notes"
                                        >
                                            Notes
                                        </label>

                                        <p>
                                            Add any information you want
                                            to include with your
                                            application.
                                        </p>


                                        <textarea
                                            id="application-notes"
                                            value={notes}
                                            onChange={(event) =>
                                                setNotes(
                                                    event.target.value
                                                )
                                            }
                                            rows={6}
                                            maxLength={5000}
                                            disabled={
                                                applicationLoading
                                            }
                                            placeholder="Add notes for your application..."
                                        />

                                    </div>


                                    <div className="opportunity-application-form-footer">

                                        <span>
                                            {notes.length}/5000
                                        </span>


                                        <button
                                            type="button"
                                            className="opportunity-primary-button"
                                            onClick={
                                                handleApply
                                            }
                                            disabled={
                                                applicationLoading
                                            }
                                        >

                                            {applicationLoading
                                                ? "Processing..."
                                                : "Submit Application"}

                                        </button>

                                    </div>


                                    {!eligibility &&
                                        !applicationLoading && (

                                            <div className="opportunity-application-info">

                                                Clicking Submit Application
                                                will automatically check
                                                your eligibility and
                                                calculate your match score.

                                            </div>

                                        )}

                                </div>

                            )}

                        </div>

                    </div>

                </section>


                {/* EXTERNAL LINKS */}

                {(opportunity.application_url ||
                    opportunity.source_url) && (

                        <section className="opportunity-external-links">

                            {opportunity.application_url && (

                                <a
                                    href={
                                        opportunity.application_url
                                    }
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="opportunity-primary-button"
                                >

                                    <ExternalLink size={16} />

                                    Apply on Official Website

                                </a>

                            )}


                            {opportunity.source_url && (

                                <a
                                    href={
                                        opportunity.source_url
                                    }
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="opportunity-secondary-action"
                                >

                                    <ExternalLink size={16} />

                                    View Source

                                </a>

                            )}

                        </section>

                    )}

            </div>

        </div>
    );
}


export default OpportunityDetails;
