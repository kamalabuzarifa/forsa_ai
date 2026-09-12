import {
    ArrowLeft,
    ArrowRight,
    Bookmark,
    BookmarkCheck,
    Check,
    ChevronRight,
    Globe2,
    GraduationCap,
    MapPin,
    Scale,
    Sparkles,
    ExternalLink,
    CalendarDays,
    ShieldCheck,
    BookOpen,
    Award,
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

import {
    getOpportunity,
} from "../../../api/opportunities";

import {
    checkProgramMatch,
} from "../../../api/programs";

import "./ProgramDetails.css";
import LoadingScreen from "../../../components/LoadingScreen";


function ProgramDetails() {

    const { id } = useParams();

    const [program, setProgram] = useState(null);

    const [matchData, setMatchData] = useState(null);

    const [loading, setLoading] = useState(true);

    const [matchLoading, setMatchLoading] = useState(false);

    const [error, setError] = useState("");

    const [saved, setSaved] = useState(false);


    // =========================================================
    // Load Program
    // =========================================================

    useEffect(() => {

        let mounted = true;

        const loadProgram = async () => {

            try {

                setLoading(true);

                setError("");

                const response = await getOpportunity(id);

                const data =
                    response?.data ??
                    response;

                if (!mounted) {
                    return;
                }

                if (!data) {

                    setError(
                        "The programme could not be found."
                    );

                    return;
                }

                setProgram(data);

            } catch (err) {

                console.error(
                    "Failed to load programme",
                    err
                );

                if (!mounted) {
                    return;
                }

                setError(
                    err?.response?.data?.message ||
                    "Unable to load this programme."
                );

            } finally {

                if (mounted) {
                    setLoading(false);
                }

            }
        };


        if (id) {

            loadProgram();

        } else {

            setError(
                "Programme ID is missing."
            );

            setLoading(false);

        }


        return () => {
            mounted = false;
        };

    }, [id]);


    // =========================================================
    // Load Real EduMatch Score
    // =========================================================

    useEffect(() => {

        let mounted = true;

        const loadMatch = async () => {

            if (!id) {
                return;
            }

            try {

                setMatchLoading(true);

                const response =
                    await checkProgramMatch(id);

                if (!mounted) {
                    return;
                }

                setMatchData(
                    response?.data ??
                    response
                );

            } catch (err) {

                console.error(
                    "Failed to load programme match",
                    err
                );

                if (mounted) {
                    setMatchData(null);
                }

            } finally {

                if (mounted) {
                    setMatchLoading(false);
                }

            }

        };


        loadMatch();


        return () => {
            mounted = false;
        };

    }, [id]);


    // =========================================================
    // Normalize Real Laravel Data
    // =========================================================

    const normalizedProgram = useMemo(() => {

        if (!program) {
            return null;
        }


        const university =
            program.university &&
                typeof program.university === "object"
                ? program.university
                : null;


        const country =
            program.country &&
                typeof program.country === "object"
                ? program.country
                : null;


        const opportunityType =
            program.opportunity_type &&
                typeof program.opportunity_type === "object"
                ? program.opportunity_type
                : null;


        const fundingType =
            program.funding_type &&
                typeof program.funding_type === "object"
                ? program.funding_type
                : null;


        const fields =
            Array.isArray(program.fields)
                ? program.fields
                : [];


        const degrees =
            Array.isArray(program.degrees)
                ? program.degrees
                : [];


        const skills =
            Array.isArray(program.skills)
                ? program.skills
                : [];


        const nationalities =
            Array.isArray(program.nationalities)
                ? program.nationalities
                : [];


        const requirements =
            Array.isArray(program.requirements)
                ? program.requirements
                : [];


        return {

            id: program.id,

            title:
                program.title || "",

            slug:
                program.slug || "",

            description:
                program.description || "",


            university,

            country,

            opportunityType,

            fundingType,


            fields,

            degrees,

            skills,

            nationalities,

            requirements,


            applicationUrl:
                program.application_url || "",

            sourceUrl:
                program.source_url || "",


            deadline:
                program.deadline || null,

            startDate:
                program.start_date || null,

            endDate:
                program.end_date || null,


            status:
                program.status || "",

            isVerified:
                Boolean(program.is_verified),

        };

    }, [program]);


    // =========================================================
    // Real Match Score
    // =========================================================

    const matchScore = useMemo(() => {

        if (!matchData) {
            return null;
        }


        const value =
            matchData.match_score ??
            matchData.score ??
            matchData.match_percentage ??
            null;


        const numeric =
            Number(value);


        if (
            !Number.isFinite(numeric)
        ) {
            return null;
        }


        return Math.min(
            Math.max(numeric, 0),
            100
        );

    }, [matchData]);


    // =========================================================
    // Save
    // =========================================================

    const handleSave = () => {

        setSaved(
            current => !current
        );

    };


    // =========================================================
    // Loading
    // =========================================================

    if (loading) {
        return <LoadingScreen />;

    }


    // =========================================================
    // Error
    // =========================================================

    if (
        error ||
        !normalizedProgram
    ) {

        return (
            <div className="program-details-page">

                <div className="program-details-state program-details-error">

                    <div className="program-state-icon">
                        !
                    </div>

                    <h2>
                        Unable to load programme
                    </h2>

                    <p>
                        {error ||
                            "The programme you are looking for does not exist."}
                    </p>

                    <Link
                        to="/student/programs"
                        className="program-state-button"
                    >
                        <ArrowLeft size={15} />

                        Back to Programs
                    </Link>

                </div>

            </div>
        );

    }


    const currentProgram =
        normalizedProgram;


    return (
        <div className="program-details-page">


            {/* =====================================================
                Breadcrumb
            ===================================================== */}

            <div className="program-breadcrumb">

                <Link to="/student/programs">

                    <ArrowLeft size={14} />

                    <span>
                        Programs
                    </span>

                </Link>

                <ChevronRight size={13} />

                <span>
                    {currentProgram.title}
                </span>

            </div>


            {/* =====================================================
                Hero
            ===================================================== */}

            <section className="program-details-hero">

                <div className="program-details-main">


                    {/* University */}

                    {currentProgram.university?.name && (

                        <div className="program-university">

                            <div className="university-logo">

                                <GraduationCap size={25} />

                            </div>

                            <div>

                                <span>
                                    University
                                </span>

                                <strong>
                                    {currentProgram.university.name}
                                </strong>

                            </div>

                        </div>

                    )}


                    {/* Title */}

                    {currentProgram.title && (

                        <h1>
                            {currentProgram.title}
                        </h1>

                    )}


                    {/* Location / Degree / Field */}

                    <div className="program-location">


                        {currentProgram.country?.name && (

                            <span>

                                <MapPin size={14} />

                                {currentProgram.country.name}

                            </span>

                        )}


                        {currentProgram.degrees.length > 0 && (

                            <span>

                                <GraduationCap size={14} />

                                {currentProgram.degrees
                                    .map(degree => degree.name)
                                    .filter(Boolean)
                                    .join(", ")}

                            </span>

                        )}


                        {currentProgram.fields.length > 0 && (

                            <span>

                                <Sparkles size={14} />

                                {currentProgram.fields
                                    .map(field => field.name)
                                    .filter(Boolean)
                                    .join(", ")}

                            </span>

                        )}

                    </div>


                    {/* Description */}

                    {currentProgram.description && (

                        <p className="program-hero-description">

                            {currentProgram.description}

                        </p>

                    )}


                    {/* Actions */}

                    <div className="program-actions">


                        {currentProgram.applicationUrl && (

                            <a
                                href={currentProgram.applicationUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="program-apply-button"
                            >

                                Apply Now

                                <ExternalLink size={15} />

                            </a>

                        )}


                        <button
                            type="button"
                            className="program-save-button"
                            onClick={handleSave}
                        >

                            {saved ? (
                                <BookmarkCheck size={15} />
                            ) : (
                                <Bookmark size={15} />
                            )}

                            {saved
                                ? "Saved"
                                : "Save"}

                        </button>


                        <Link
                            to={`/student/compare?program=${currentProgram.id}`}
                            className="program-compare-button"
                        >

                            <Scale size={15} />

                            Compare

                        </Link>

                    </div>

                </div>


                {/* =================================================
                    Real EduMatch Match Card
                ================================================= */}

                {(matchLoading || matchScore !== null) && (

                    <aside className="program-match-card">

                        <div className="match-card-top">

                            <div className="match-icon">

                                <Sparkles size={18} />

                            </div>

                            <span>
                                EduMatch Score
                            </span>

                        </div>


                        {matchLoading ? (

                            <div className="match-loading">

                                Calculating your match...

                            </div>

                        ) : (

                            <>
                                <div className="match-score">

                                    <strong>
                                        {matchScore}%
                                    </strong>

                                    <span>
                                        Match
                                    </span>

                                </div>


                                <div className="match-progress">

                                    <span
                                        style={{
                                            width: `${matchScore}%`,
                                        }}
                                    />

                                </div>


                                <p>
                                    This score is calculated from
                                    your available profile data
                                    and this programme's matching
                                    criteria.
                                </p>


                                <Link to="/student/ai-advisor">

                                    Why is this a good match?

                                    <ArrowRight size={13} />

                                </Link>
                            </>

                        )}

                    </aside>

                )}

            </section>


            {/* =====================================================
                Programme Facts
            ===================================================== */}

            <section className="program-facts">


                {currentProgram.opportunityType?.name && (

                    <div className="program-fact">

                        <BookOpen size={18} />

                        <div>

                            <span>
                                Type
                            </span>

                            <strong>
                                {currentProgram.opportunityType.name}
                            </strong>

                        </div>

                    </div>

                )}


                {currentProgram.fundingType?.name && (

                    <div className="program-fact">

                        <Award size={18} />

                        <div>

                            <span>
                                Funding
                            </span>

                            <strong>
                                {currentProgram.fundingType.name}
                            </strong>

                        </div>

                    </div>

                )}


                {currentProgram.startDate && (

                    <div className="program-fact">

                        <CalendarDays size={18} />

                        <div>

                            <span>
                                Start Date
                            </span>

                            <strong>
                                {formatDate(
                                    currentProgram.startDate
                                )}
                            </strong>

                        </div>

                    </div>

                )}


                {currentProgram.deadline && (

                    <div className="program-fact">

                        <CalendarDays size={18} />

                        <div>

                            <span>
                                Application Deadline
                            </span>

                            <strong>
                                {formatDate(
                                    currentProgram.deadline
                                )}
                            </strong>

                        </div>

                    </div>

                )}

            </section>


            {/* =====================================================
                Main Content
            ===================================================== */}

            <div className="program-content-layout">


                {/* =================================================
                    Main Content
                ================================================= */}

                <main className="program-content">


                    {/* =================================================
                        Description
                    ================================================= */}

                    {currentProgram.description && (

                        <section className="program-content-section">

                            <div className="program-section-heading">

                                <span>
                                    PROGRAM OVERVIEW
                                </span>

                                <h2>
                                    About this programme
                                </h2>

                            </div>


                            <p>
                                {currentProgram.description}
                            </p>

                        </section>

                    )}


                    {/* =================================================
                        Degrees
                    ================================================= */}

                    {currentProgram.degrees.length > 0 && (

                        <section className="program-content-section">

                            <div className="program-section-heading">

                                <span>
                                    ACADEMIC LEVEL
                                </span>

                                <h2>
                                    Available degrees
                                </h2>

                            </div>


                            <div className="program-features">

                                {currentProgram.degrees.map(
                                    degree => (

                                        <div
                                            className="program-feature"
                                            key={degree.id}
                                        >

                                            <Check size={15} />

                                            <span>
                                                {degree.name}

                                                {degree.code && (
                                                    ` (${degree.code})`
                                                )}
                                            </span>

                                        </div>

                                    )
                                )}

                            </div>

                        </section>

                    )}


                    {/* =================================================
                        Fields
                    ================================================= */}

                    {currentProgram.fields.length > 0 && (

                        <section className="program-content-section">

                            <div className="program-section-heading">

                                <span>
                                    STUDY FIELDS
                                </span>

                                <h2>
                                    Fields of study
                                </h2>

                            </div>


                            <div className="program-features">

                                {currentProgram.fields.map(
                                    field => (

                                        <div
                                            className="program-feature"
                                            key={field.id}
                                        >

                                            <Check size={15} />

                                            <span>
                                                {field.name}
                                            </span>

                                        </div>

                                    )
                                )}

                            </div>

                        </section>

                    )}


                    {/* =================================================
                        Skills
                    ================================================= */}

                    {currentProgram.skills.length > 0 && (

                        <section className="program-content-section">

                            <div className="program-section-heading">

                                <span>
                                    SKILLS
                                </span>

                                <h2>
                                    Related skills
                                </h2>

                            </div>


                            <div className="program-features">

                                {currentProgram.skills.map(
                                    skill => (

                                        <div
                                            className="program-feature"
                                            key={skill.id}
                                        >

                                            <Check size={15} />

                                            <span>

                                                {skill.name}

                                                {skill.category && (
                                                    ` · ${skill.category}`
                                                )}

                                                {skill.is_mandatory && (
                                                    " · Mandatory"
                                                )}

                                            </span>

                                        </div>

                                    )
                                )}

                            </div>

                        </section>

                    )}


                    {/* =================================================
                        Requirements
                    ================================================= */}

                    {currentProgram.requirements.length > 0 && (

                        <section className="program-content-section">

                            <div className="program-section-heading">

                                <span>
                                    ADMISSION
                                </span>

                                <h2>
                                    Entry requirements
                                </h2>

                            </div>


                            <div className="requirements-list">

                                {currentProgram.requirements.map(
                                    (requirement, index) => (

                                        <div
                                            className="requirement-item"
                                            key={
                                                requirement.id ??
                                                `${requirement.requirement_type}-${index}`
                                            }
                                        >

                                            <div className="requirement-number">
                                                {index + 1}
                                            </div>

                                            <div>

                                                {requirement.description && (
                                                    <strong>
                                                        {requirement.description}
                                                    </strong>
                                                )}

                                                <span>
                                                    {formatRequirement(
                                                        requirement
                                                    )}
                                                </span>

                                            </div>

                                        </div>

                                    )
                                )}

                            </div>

                        </section>

                    )}


                    {/* =================================================
                        Nationalities
                    ================================================= */}

                    {currentProgram.nationalities.length > 0 && (

                        <section className="program-content-section">

                            <div className="program-section-heading">

                                <span>
                                    ELIGIBILITY
                                </span>

                                <h2>
                                    Nationality eligibility
                                </h2>

                            </div>


                            <div className="program-features">

                                {currentProgram.nationalities.map(
                                    (nationality, index) => (

                                        <div
                                            className="program-feature"
                                            key={
                                                nationality.country_id ??
                                                index
                                            }
                                        >

                                            <Check size={15} />

                                            <span>

                                                {nationality.country_name}

                                                {nationality.eligibility_type && (
                                                    ` · ${nationality.eligibility_type}`
                                                )}

                                            </span>

                                        </div>

                                    )
                                )}

                            </div>

                        </section>

                    )}


                    {/* =================================================
                        Verification
                    ================================================= */}

                    {currentProgram.isVerified && (

                        <section className="program-content-section">

                            <div className="program-insight">

                                <div className="insight-icon">

                                    <ShieldCheck size={20} />

                                </div>

                                <div>

                                    <strong>
                                        Verified opportunity
                                    </strong>

                                    <p>
                                        This opportunity has been marked
                                        as verified in EduMatch.
                                    </p>

                                </div>

                            </div>

                        </section>

                    )}


                    {/* =================================================
                        No Description / Additional Data
                    ================================================= */}

                    {!currentProgram.description &&
                        currentProgram.degrees.length === 0 &&
                        currentProgram.fields.length === 0 &&
                        currentProgram.skills.length === 0 &&
                        currentProgram.requirements.length === 0 &&
                        currentProgram.nationalities.length === 0 && (

                            <section className="program-content-section">

                                <div className="program-section-heading">

                                    <span>
                                        PROGRAM INFORMATION
                                    </span>

                                    <h2>
                                        Information
                                    </h2>

                                </div>

                                <p>
                                    No additional information is available
                                    for this programme yet.
                                </p>

                            </section>

                        )}

                </main>


                {/* =================================================
                    Sidebar
                ================================================= */}

                <aside className="program-sidebar">


                    {/* =================================================
                        Programme Details
                    ================================================= */}

                    <div className="sidebar-card">

                        <h3>
                            Programme details
                        </h3>


                        <div className="sidebar-details">


                            {currentProgram.opportunityType?.name && (

                                <div>

                                    <span>
                                        Opportunity Type
                                    </span>

                                    <strong>
                                        {currentProgram.opportunityType.name}
                                    </strong>

                                </div>

                            )}


                            {currentProgram.fundingType?.name && (

                                <div>

                                    <span>
                                        Funding
                                    </span>

                                    <strong>
                                        {currentProgram.fundingType.name}
                                    </strong>

                                </div>

                            )}


                            {currentProgram.degrees.length > 0 && (

                                <div>

                                    <span>
                                        Degree
                                    </span>

                                    <strong>
                                        {currentProgram.degrees
                                            .map(degree => degree.name)
                                            .filter(Boolean)
                                            .join(", ")}
                                    </strong>

                                </div>

                            )}


                            {currentProgram.fields.length > 0 && (

                                <div>

                                    <span>
                                        Field
                                    </span>

                                    <strong>
                                        {currentProgram.fields
                                            .map(field => field.name)
                                            .filter(Boolean)
                                            .join(", ")}
                                    </strong>

                                </div>

                            )}


                            {currentProgram.country?.name && (

                                <div>

                                    <span>
                                        Country
                                    </span>

                                    <strong>
                                        {currentProgram.country.name}
                                    </strong>

                                </div>

                            )}


                            {currentProgram.status && (

                                <div>

                                    <span>
                                        Status
                                    </span>

                                    <strong>
                                        {currentProgram.status}
                                    </strong>

                                </div>

                            )}

                        </div>

                    </div>


                    {/* =================================================
                        University
                    ================================================= */}

                    {currentProgram.university?.name && (

                        <div className="sidebar-card">

                            <div className="sidebar-card-heading">

                                <GraduationCap size={17} />

                                <h3>
                                    University
                                </h3>

                            </div>


                            <div className="university-sidebar">

                                <div className="university-sidebar-logo">

                                    <GraduationCap size={23} />

                                </div>


                                <div>

                                    <strong>
                                        {currentProgram.university.name}
                                    </strong>

                                    {currentProgram.country?.name && (

                                        <span>
                                            {currentProgram.country.name}
                                        </span>

                                    )}

                                </div>

                            </div>

                        </div>

                    )}


                    {/* =================================================
                        Dates
                    ================================================= */}

                    {(currentProgram.deadline ||
                        currentProgram.startDate ||
                        currentProgram.endDate) && (

                            <div className="sidebar-card">

                                <div className="sidebar-card-heading">

                                    <CalendarDays size={17} />

                                    <h3>
                                        Important dates
                                    </h3>

                                </div>


                                <div className="sidebar-details">


                                    {currentProgram.deadline && (

                                        <div>

                                            <span>
                                                Application Deadline
                                            </span>

                                            <strong>
                                                {formatDate(
                                                    currentProgram.deadline
                                                )}
                                            </strong>

                                        </div>

                                    )}


                                    {currentProgram.startDate && (

                                        <div>

                                            <span>
                                                Start Date
                                            </span>

                                            <strong>
                                                {formatDate(
                                                    currentProgram.startDate
                                                )}
                                            </strong>

                                        </div>

                                    )}


                                    {currentProgram.endDate && (

                                        <div>

                                            <span>
                                                End Date
                                            </span>

                                            <strong>
                                                {formatDate(
                                                    currentProgram.endDate
                                                )}
                                            </strong>

                                        </div>

                                    )}

                                </div>

                            </div>

                        )}


                    {/* =================================================
                        Source
                    ================================================= */}

                    {currentProgram.sourceUrl && (

                        <div className="sidebar-ai-card">

                            <div className="sidebar-ai-icon">

                                <Globe2 size={18} />

                            </div>


                            <h3>
                                Official information
                            </h3>


                            <p>
                                View the original source of this
                                opportunity for additional information.
                            </p>


                            <a
                                href={currentProgram.sourceUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                            >

                                Visit Source

                                <ExternalLink size={14} />

                            </a>

                        </div>

                    )}

                </aside>

            </div>

        </div>
    );
}


// =========================================================
// Format Date
// =========================================================

function formatDate(value) {

    if (!value) {
        return "";
    }

    const date =
        new Date(value);

    if (Number.isNaN(date.getTime())) {
        return String(value);
    }

    return date.toLocaleDateString(
        undefined,
        {
            year: "numeric",
            month: "long",
            day: "numeric",
        }
    );
}


// =========================================================
// Format Requirement
// =========================================================

function formatRequirement(requirement) {

    if (!requirement) {
        return "";
    }


    const parts = [];


    if (requirement.language_name) {

        parts.push(
            requirement.language_name
        );

    }


    if (requirement.value !== null &&
        requirement.value !== undefined &&
        requirement.value !== "") {

        let value =
            String(requirement.value);


        if (requirement.operator) {

            value =
                `${requirement.operator} ${value}`;

        }


        if (requirement.unit) {

            value +=
                ` ${requirement.unit}`;

        }


        parts.push(value);

    }


    if (requirement.requirement_type) {

        parts.push(
            requirement.requirement_type
        );

    }


    return parts.join(" · ");
}


export default ProgramDetails;
