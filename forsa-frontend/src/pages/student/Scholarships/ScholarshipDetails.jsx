import {
    ArrowRight,
    BookOpen,
    CheckCircle2,
    Clock3,
    DollarSign,
    ExternalLink,
    Globe2,
    GraduationCap,
    MapPin,
    ShieldCheck,
    University,
} from "lucide-react";

import {
    Link,
    useParams,
} from "react-router-dom";

import {
    useEffect,
    useMemo,
    useState,
} from "react";

import "./ScholarshipDetails.css";


/* =========================================================
   HELPERS
   ========================================================= */

const formatDate = (date) => {
    if (!date) {
        return "Not specified";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
        return "Not specified";
    }

    return new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
    }).format(parsedDate);
};


const formatRequirement = (requirement) => {
    if (!requirement) {
        return "";
    }

    if (requirement.description) {
        return requirement.description;
    }

    if (requirement.requirement_type === "degree") {
        return `Required degree: ${requirement.value || "Not specified"}`;
    }

    if (requirement.requirement_type === "gpa") {
        return `Minimum GPA: ${requirement.value || "Not specified"} ${requirement.unit || ""}`;
    }

    if (requirement.requirement_type === "language") {
        const language = requirement.language_name
            ? `${requirement.language_name} `
            : "";

        return `${language}language level: ${requirement.value || "Not specified"} ${requirement.unit || ""}`;
    }

    return requirement.value || "Requirement not specified";
};


const getDegreeNames = (degrees) => {
    if (!Array.isArray(degrees) || degrees.length === 0) {
        return "";
    }

    return degrees
        .map((degree) => degree?.name)
        .filter(Boolean)
        .join(", ");
};


/* =========================================================
   COMPONENT
   ========================================================= */

function ScholarshipDetails() {

    const { id } = useParams();

    const [scholarship, setScholarship] = useState(null);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");


    /* =====================================================
       FETCH SCHOLARSHIP
       ===================================================== */

    useEffect(() => {

        let cancelled = false;


        const fetchScholarship = async () => {

            try {

                setLoading(true);

                setError("");

                setScholarship(null);


                const token = localStorage.getItem("token");


                if (!token) {

                    throw new Error(
                        "Your session has expired. Please log in again."
                    );

                }


                const response = await fetch(
                    `http://127.0.0.1:8000/api/opportunities/${id}`,
                    {
                        method: "GET",

                        headers: {
                            Accept: "application/json",

                            Authorization: `Bearer ${token}`,
                        },
                    }
                );


                const result = await response.json();


                if (!response.ok) {

                    throw new Error(
                        result?.message ||
                        "Unable to load scholarship details."
                    );

                }


                if (!result?.data) {

                    throw new Error(
                        "Scholarship data was not returned by the server."
                    );

                }


                if (!cancelled) {

                    setScholarship(result.data);

                }

            } catch (err) {

                if (!cancelled) {

                    console.error(
                        "Scholarship details error:",
                        err
                    );

                    setError(
                        err?.message ||
                        "Something went wrong while loading the scholarship."
                    );

                }

            } finally {

                if (!cancelled) {

                    setLoading(false);

                }

            }

        };


        if (id) {

            fetchScholarship();

        }


        return () => {

            cancelled = true;

        };

    }, [id]);


    /* =====================================================
       DERIVED DATA
       ===================================================== */

    const university = scholarship?.university;

    const country = scholarship?.country;

    const fundingType = scholarship?.funding_type;

    const opportunityType = scholarship?.opportunity_type;


    const fields = useMemo(() => {

        return Array.isArray(scholarship?.fields)
            ? scholarship.fields
            : [];

    }, [scholarship]);


    const degrees = useMemo(() => {

        return Array.isArray(scholarship?.degrees)
            ? scholarship.degrees
            : [];

    }, [scholarship]);


    const skills = useMemo(() => {

        return Array.isArray(scholarship?.skills)
            ? scholarship.skills
            : [];

    }, [scholarship]);


    const nationalities = useMemo(() => {

        return Array.isArray(scholarship?.nationalities)
            ? scholarship.nationalities
            : [];

    }, [scholarship]);


    const requirements = useMemo(() => {

        return Array.isArray(scholarship?.requirements)
            ? scholarship.requirements
            : [];

    }, [scholarship]);


    const mandatoryRequirements = useMemo(() => {

        return requirements.filter(
            (requirement) => requirement.is_mandatory
        );

    }, [requirements]);


    const optionalRequirements = useMemo(() => {

        return requirements.filter(
            (requirement) => !requirement.is_mandatory
        );

    }, [requirements]);


    const isDeadlinePassed = useMemo(() => {

        if (!scholarship?.deadline) {

            return false;

        }

        return new Date(scholarship.deadline) < new Date();

    }, [scholarship]);


    /* =====================================================
       LOADING
       ===================================================== */

    if (loading) {

        return (

            <div className="scholarship-details-page">

                <div className="scholarship-details-loading">

                    <div className="scholarship-loading-spinner" />

                    <p>
                        Loading scholarship...
                    </p>

                </div>

            </div>

        );

    }


    /* =====================================================
       ERROR
       ===================================================== */

    if (error || !scholarship) {

        return (

            <div className="scholarship-details-page">

                <div className="scholarship-details-error">

                    <div className="scholarship-error-icon">

                        <ShieldCheck size={28} />

                    </div>


                    <h2>
                        Unable to load scholarship
                    </h2>


                    <p>
                        {error ||
                            "The requested scholarship could not be found."}
                    </p>


                    <Link
                        to="/student/scholarships"
                        className="scholarship-error-button"
                    >
                        Explore scholarships

                        <ArrowRight size={16} />

                    </Link>

                </div>

            </div>

        );

    }


    return (

        <div className="scholarship-details-page">


            {/* =================================================
                HERO
            ================================================= */}

            <section className="scholarship-details-hero">

                <div className="scholarship-details-hero-overlay" />


                <div className="scholarship-details-hero-inner">


                    {/* =================================================
                        SCHOLARSHIP ICON
                    ================================================= */}

                    <div className="scholarship-details-icon">

                        <University size={38} />

                    </div>


                    {/* =================================================
                        HERO CONTENT
                    ================================================= */}

                    <div className="scholarship-details-hero-content">


                        <span className="scholarship-details-eyebrow">

                            <GraduationCap size={17} />

                            Scholarship opportunity

                        </span>


                        <h1>
                            {scholarship.title}
                        </h1>


                        {university?.name && (

                            <Link
                                to={`/student/universities/${university.id}`}
                                className="scholarship-details-university"
                            >
                                <University size={17} />

                                {university.name}

                            </Link>

                        )}


                        {country?.name && (

                            <div className="scholarship-details-location">

                                <MapPin size={18} />

                                <span>
                                    {country.name}
                                </span>

                            </div>

                        )}

                    </div>

                </div>

            </section>


            {/* =================================================
                STATS
            ================================================= */}

            <section className="scholarship-details-stats">

                <div className="scholarship-details-stats-inner">


                    {/* Funding */}

                    <div className="scholarship-stat">

                        <div className="scholarship-stat-icon">

                            <DollarSign size={20} />

                        </div>

                        <div>

                            <strong>
                                {fundingType?.name ||
                                    "Not specified"}
                            </strong>

                            <span>
                                Funding
                            </span>

                        </div>

                    </div>


                    {/* Deadline */}

                    <div className="scholarship-stat">

                        <div className="scholarship-stat-icon">

                            <Clock3 size={20} />

                        </div>

                        <div>

                            <strong>
                                {formatDate(
                                    scholarship.deadline
                                )}
                            </strong>

                            <span>
                                Application deadline
                            </span>

                        </div>

                    </div>


                    {/* Degree */}

                    <div className="scholarship-stat">

                        <div className="scholarship-stat-icon">

                            <GraduationCap size={20} />

                        </div>

                        <div>

                            <strong>
                                {getDegreeNames(degrees) ||
                                    "Not specified"}
                            </strong>

                            <span>
                                Study level
                            </span>

                        </div>

                    </div>


                </div>

            </section>


            {/* =================================================
                MAIN CONTAINER
            ================================================= */}

            <main className="scholarship-details-container">

                <div className="scholarship-details-layout">


                    {/* =================================================
                        MAIN COLUMN
                    ================================================= */}

                    <div className="scholarship-details-main">


                        {/* =================================================
                            ABOUT
                        ================================================= */}

                        <section className="scholarship-content-section">

                            <div className="scholarship-section-heading">

                                <span className="scholarship-section-kicker">
                                    About opportunity
                                </span>

                                <h2>
                                    Scholarship overview
                                </h2>

                            </div>


                            <div className="scholarship-about-content">

                                <p>
                                    {scholarship.description ||
                                        "No description is available for this opportunity."}
                                </p>


                                {scholarship.start_date && (

                                    <p>

                                        The study period starts on{" "}

                                        <strong>
                                            {formatDate(
                                                scholarship.start_date
                                            )}
                                        </strong>

                                        .

                                    </p>

                                )}


                                {scholarship.end_date && (

                                    <p>

                                        The study period ends on{" "}

                                        <strong>
                                            {formatDate(
                                                scholarship.end_date
                                            )}
                                        </strong>

                                        .

                                    </p>

                                )}

                            </div>

                        </section>


                        {/* =================================================
                            AT A GLANCE
                        ================================================= */}

                        <section className="scholarship-content-section">

                            <div className="scholarship-section-heading">

                                <span className="scholarship-section-kicker">
                                    Scholarship information
                                </span>

                                <h2>
                                    At a glance
                                </h2>

                            </div>


                            <div className="scholarship-information-grid">


                                {university?.name && (

                                    <div className="scholarship-information-item">

                                        <div className="scholarship-information-icon">

                                            <University size={20} />

                                        </div>

                                        <div>

                                            <span>
                                                University
                                            </span>

                                            <strong>
                                                {university.name}
                                            </strong>

                                        </div>

                                    </div>

                                )}


                                {country?.name && (

                                    <div className="scholarship-information-item">

                                        <div className="scholarship-information-icon">

                                            <MapPin size={20} />

                                        </div>

                                        <div>

                                            <span>
                                                Destination
                                            </span>

                                            <strong>
                                                {country.name}
                                            </strong>

                                        </div>

                                    </div>

                                )}


                                {fundingType?.name && (

                                    <div className="scholarship-information-item">

                                        <div className="scholarship-information-icon">

                                            <DollarSign size={20} />

                                        </div>

                                        <div>

                                            <span>
                                                Funding type
                                            </span>

                                            <strong>
                                                {fundingType.name}
                                            </strong>

                                        </div>

                                    </div>

                                )}


                                {opportunityType?.name && (

                                    <div className="scholarship-information-item">

                                        <div className="scholarship-information-icon">

                                            <BookOpen size={20} />

                                        </div>

                                        <div>

                                            <span>
                                                Opportunity type
                                            </span>

                                            <strong>
                                                {opportunityType.name}
                                            </strong>

                                        </div>

                                    </div>

                                )}


                                {degrees.length > 0 && (

                                    <div className="scholarship-information-item">

                                        <div className="scholarship-information-icon">

                                            <GraduationCap size={20} />

                                        </div>

                                        <div>

                                            <span>
                                                Academic level
                                            </span>

                                            <strong>
                                                {getDegreeNames(degrees)}
                                            </strong>

                                        </div>

                                    </div>

                                )}


                                {scholarship.deadline && (

                                    <div className="scholarship-information-item">

                                        <div className="scholarship-information-icon">

                                            <Clock3 size={20} />

                                        </div>

                                        <div>

                                            <span>
                                                Deadline
                                            </span>

                                            <strong>
                                                {formatDate(
                                                    scholarship.deadline
                                                )}
                                            </strong>

                                        </div>

                                    </div>

                                )}

                            </div>

                        </section>


                        {/* =================================================
                            FIELDS
                        ================================================= */}

                        {fields.length > 0 && (

                            <section className="scholarship-content-section">

                                <div className="scholarship-section-heading">

                                    <span className="scholarship-section-kicker">
                                        Areas of study
                                    </span>

                                    <h2>
                                        Eligible fields
                                    </h2>

                                </div>


                                <div className="scholarship-items-grid">

                                    {fields.map((field) => (

                                        <div
                                            className="scholarship-item-card"
                                            key={field.id}
                                        >

                                            <div className="scholarship-item-icon">

                                                <CheckCircle2 size={18} />

                                            </div>

                                            <span>
                                                {field.name}
                                            </span>

                                        </div>

                                    ))}

                                </div>

                            </section>

                        )}


                        {/* =================================================
                            DEGREES
                        ================================================= */}

                        {degrees.length > 0 && (

                            <section className="scholarship-content-section">

                                <div className="scholarship-section-heading">

                                    <span className="scholarship-section-kicker">
                                        Academic level
                                    </span>

                                    <h2>
                                        Eligible degrees
                                    </h2>

                                </div>


                                <div className="scholarship-items-grid">

                                    {degrees.map((degree) => (

                                        <div
                                            className="scholarship-item-card"
                                            key={degree.id}
                                        >

                                            <div className="scholarship-item-icon">

                                                <GraduationCap size={18} />

                                            </div>

                                            <span>

                                                {degree.name}

                                                {degree.code
                                                    ? ` (${degree.code})`
                                                    : ""}

                                            </span>

                                        </div>

                                    ))}

                                </div>

                            </section>

                        )}


                        {/* =================================================
                            ELIGIBILITY
                        ================================================= */}

                        <section className="scholarship-content-section">

                            <div className="scholarship-section-heading">

                                <span className="scholarship-section-kicker">
                                    Eligibility
                                </span>

                                <h2>
                                    Who can apply?
                                </h2>

                            </div>


                            {nationalities.length > 0 ? (

                                <div className="scholarship-eligibility-list">

                                    {nationalities.map(
                                        (nationality, index) => (

                                            <div
                                                className="scholarship-eligibility-item"
                                                key={`${nationality.country_id}-${index}`}
                                            >

                                                <div className="scholarship-eligibility-number">
                                                    {index + 1}
                                                </div>

                                                <div>

                                                    <strong>
                                                        {nationality.country_name}
                                                    </strong>

                                                    <span>

                                                        {nationality.eligibility_type ===
                                                            "eligible"
                                                            ? "Eligible"
                                                            : nationality.eligibility_type}

                                                    </span>

                                                </div>

                                            </div>

                                        )
                                    )}

                                </div>

                            ) : (

                                <div className="scholarship-empty-state">

                                    <ShieldCheck size={24} />

                                    <p>
                                        No nationality eligibility
                                        information is available.
                                    </p>

                                </div>

                            )}

                        </section>


                        {/* =================================================
                            REQUIREMENTS
                        ================================================= */}

                        {requirements.length > 0 && (

                            <section className="scholarship-content-section">

                                <div className="scholarship-section-heading">

                                    <span className="scholarship-section-kicker">
                                        Requirements
                                    </span>

                                    <h2>
                                        Admission requirements
                                    </h2>

                                </div>


                                {mandatoryRequirements.length > 0 && (

                                    <div className="scholarship-requirements-group">

                                        <h3>
                                            Mandatory requirements
                                        </h3>


                                        <div className="scholarship-requirements-list">

                                            {mandatoryRequirements.map(
                                                (requirement) => (

                                                    <div
                                                        className="scholarship-requirement-item"
                                                        key={requirement.id}
                                                    >

                                                        <CheckCircle2 size={17} />

                                                        <span>
                                                            {formatRequirement(
                                                                requirement
                                                            )}
                                                        </span>

                                                    </div>

                                                )
                                            )}

                                        </div>

                                    </div>

                                )}


                                {optionalRequirements.length > 0 && (

                                    <div className="scholarship-requirements-group">

                                        <h3>
                                            Other requirements
                                        </h3>


                                        <div className="scholarship-requirements-list">

                                            {optionalRequirements.map(
                                                (requirement) => (

                                                    <div
                                                        className="scholarship-requirement-item"
                                                        key={requirement.id}
                                                    >

                                                        <CheckCircle2 size={17} />

                                                        <span>
                                                            {formatRequirement(
                                                                requirement
                                                            )}
                                                        </span>

                                                    </div>

                                                )
                                            )}

                                        </div>

                                    </div>

                                )}

                            </section>

                        )}


                        {/* =================================================
                            SKILLS
                        ================================================= */}

                        {skills.length > 0 && (

                            <section className="scholarship-content-section">

                                <div className="scholarship-section-heading">

                                    <span className="scholarship-section-kicker">
                                        Skills
                                    </span>

                                    <h2>
                                        Required skills
                                    </h2>

                                </div>


                                <div className="scholarship-items-grid">

                                    {skills.map((skill) => (

                                        <div
                                            className="scholarship-item-card"
                                            key={skill.id}
                                        >

                                            <div className="scholarship-item-icon">

                                                <CheckCircle2 size={18} />

                                            </div>

                                            <span>

                                                {skill.name}

                                                {skill.is_mandatory
                                                    ? " — Mandatory"
                                                    : " — Preferred"}

                                            </span>

                                        </div>

                                    ))}

                                </div>

                            </section>

                        )}


                        {/* =================================================
                            APPLICATION
                        ================================================= */}

                        <section className="scholarship-content-section">

                            <div className="scholarship-section-heading">

                                <span className="scholarship-section-kicker">
                                    Application
                                </span>

                                <h2>
                                    How to apply
                                </h2>

                            </div>


                            <div className="scholarship-about-content">

                                <p>
                                    Submit your application through the
                                    official application page provided for
                                    this opportunity.
                                </p>

                            </div>


                            {scholarship.application_url && (

                                <div className="scholarship-official-application">

                                    <div>

                                        <strong>
                                            Ready to apply?
                                        </strong>

                                        <p>
                                            Continue to the official
                                            application page.
                                        </p>

                                    </div>


                                    <a
                                        href={
                                            scholarship.application_url
                                        }
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="scholarship-official-button"
                                    >
                                        Official application

                                        <ExternalLink size={14} />

                                    </a>

                                </div>

                            )}

                        </section>

                    </div>


                    {/* =================================================
                        SIDEBAR
                    ================================================= */}

                    <aside className="scholarship-details-sidebar">


                        {/* =================================================
                            APPLY
                        ================================================= */}

                        {scholarship.application_url && (

                            <div className="scholarship-action-card">

                                <div className="scholarship-action-icon">

                                    <ExternalLink size={21} />

                                </div>


                                <h3>
                                    Apply for this scholarship
                                </h3>


                                <p>
                                    Continue to the official application
                                    page to submit your application.
                                </p>


                                <a
                                    href={scholarship.application_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="scholarship-action-button"
                                >
                                    Apply now

                                    <ExternalLink size={16} />

                                </a>

                            </div>

                        )}


                        {/* =================================================
                            DEADLINE
                        ================================================= */}

                        <div className="scholarship-sidebar-card">

                            <div className="scholarship-sidebar-card-icon">

                                <Clock3 size={20} />

                            </div>


                            <span className="scholarship-sidebar-label">
                                Application deadline
                            </span>


                            <strong className="scholarship-sidebar-deadline">
                                {formatDate(
                                    scholarship.deadline
                                )}
                            </strong>


                            <p>

                                {isDeadlinePassed
                                    ? "This application deadline has passed."
                                    : "Make sure your application is submitted before the deadline."}

                            </p>

                        </div>


                        {/* =================================================
                            UNIVERSITY
                        ================================================= */}

                        {university && (

                            <div className="scholarship-sidebar-card">

                                <div className="scholarship-sidebar-card-header">

                                    <span>
                                        Offered by
                                    </span>

                                    <University size={17} />

                                </div>


                                <div className="scholarship-sidebar-university">

                                    <div className="scholarship-sidebar-university-icon">

                                        <GraduationCap size={20} />

                                    </div>


                                    <div>

                                        <strong>
                                            {university.name ||
                                                "University not specified"}
                                        </strong>

                                        <span>
                                            {country?.name ||
                                                "Country not specified"}
                                        </span>

                                    </div>

                                </div>


                                {university.id && (

                                    <Link
                                        to={`/student/universities/${university.id}`}
                                        className="scholarship-sidebar-link"
                                    >
                                        View university

                                        <ArrowRight size={15} />

                                    </Link>

                                )}

                            </div>

                        )}


                        {/* =================================================
                            QUICK FACTS
                        ================================================= */}

                        <div className="scholarship-sidebar-card">

                            <div className="scholarship-sidebar-card-header">

                                <span>
                                    Quick facts
                                </span>

                            </div>


                            <div className="scholarship-quick-facts">


                                <div>

                                    <span>
                                        Study level
                                    </span>

                                    <strong>
                                        {getDegreeNames(degrees) ||
                                            "Not specified"}
                                    </strong>

                                </div>


                                <div>

                                    <span>
                                        Funding
                                    </span>

                                    <strong>
                                        {fundingType?.name ||
                                            "Not specified"}
                                    </strong>

                                </div>


                                <div>

                                    <span>
                                        Opportunity type
                                    </span>

                                    <strong>
                                        {opportunityType?.name ||
                                            "Not specified"}
                                    </strong>

                                </div>


                                <div>

                                    <span>
                                        Status
                                    </span>

                                    <strong>
                                        {scholarship.status ||
                                            "Not specified"}
                                    </strong>

                                </div>

                            </div>

                        </div>


                        {/* =================================================
                            VERIFICATION / SOURCE
                        ================================================= */}

                        <div className="scholarship-ai-card">

                            <div className="scholarship-ai-card-icon">

                                <ShieldCheck size={21} />

                            </div>


                            <span className="scholarship-ai-card-label">
                                Opportunity status
                            </span>


                            <h3>
                                {scholarship.is_verified
                                    ? "Verified opportunity"
                                    : "Unverified opportunity"}
                            </h3>


                            <p>

                                {scholarship.is_verified
                                    ? "This opportunity has been verified."
                                    : "This opportunity has not been verified."}

                            </p>


                            {scholarship.source_url && (

                                <a
                                    href={scholarship.source_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="scholarship-ai-card-link"
                                >
                                    View source

                                    <ExternalLink size={15} />

                                </a>

                            )}

                        </div>

                    </aside>

                </div>

            </main>

        </div>

    );

}


export default ScholarshipDetails;
