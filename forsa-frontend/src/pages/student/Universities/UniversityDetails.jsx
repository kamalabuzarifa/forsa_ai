import {
    ArrowRight,
    BookOpen,
    Building2,
    ExternalLink,
    Globe2,
    GraduationCap,
    MapPin,
    Search,
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
    getUniversity,
    getUniversityPrograms,
} from "../../../api/universities";

import "./UniversityDetails.css";
import LoadingScreen from "../../../components/LoadingScreen";


/* =========================================================
   Helpers
   ========================================================= */

const normalizeUniversityResponse = (response) => {
    if (!response) {
        return null;
    }

    if (response.university) {
        return response.university;
    }

    if (response.data?.university) {
        return response.data.university;
    }

    if (response.data?.data) {
        return response.data.data;
    }

    if (response.data) {
        return response.data;
    }

    return response;
};


const normalizeProgramsResponse = (response) => {
    if (!response) {
        return [];
    }

    /*
     * Actual API response:
     *
     * {
     *     university: {...},
     *     programs: [...]
     * }
     */
    if (Array.isArray(response.programs)) {
        return response.programs;
    }

    /*
     * Support wrapped response:
     *
     * {
     *     data: {
     *         programs: [...]
     *     }
     * }
     */
    if (Array.isArray(response.data?.programs)) {
        return response.data.programs;
    }

    if (Array.isArray(response)) {
        return response;
    }

    if (Array.isArray(response.data)) {
        return response.data;
    }

    if (Array.isArray(response.data?.data)) {
        return response.data.data;
    }

    if (Array.isArray(response.data?.items)) {
        return response.data.items;
    }

    if (Array.isArray(response.items)) {
        return response.items;
    }

    return [];
};


const getCountryName = (university) => {
    if (!university) {
        return "";
    }

    if (typeof university.country === "string") {
        return university.country;
    }

    if (university.country?.name) {
        return university.country.name;
    }

    if (university.country_name) {
        return university.country_name;
    }

    return "";
};


const getUniversityName = (university) => {
    if (!university) {
        return "";
    }

    return (
        university.name ||
        university.university_name ||
        ""
    );
};


const getUniversityInitial = (university) => {
    const name = getUniversityName(university);

    if (!name) {
        return "";
    }

    return name.charAt(0).toUpperCase();
};


/* =========================================================
   Program helpers
   ========================================================= */

const getProgramDegrees = (program) => {
    if (!program) {
        return [];
    }

    if (Array.isArray(program.degrees)) {
        return program.degrees;
    }

    if (program.degree) {
        return [program.degree];
    }

    return [];
};


const getProgramDegreeName = (program) => {
    const degrees = getProgramDegrees(program);

    return degrees
        .map((degree) => {
            if (typeof degree === "string") {
                return degree;
            }

            return (
                degree?.name ||
                degree?.title ||
                degree?.degree_name ||
                ""
            );
        })
        .filter(Boolean)
        .join(", ");
};


const getProgramFields = (program) => {
    if (!program) {
        return [];
    }

    if (Array.isArray(program.fields)) {
        return program.fields;
    }

    if (program.field) {
        return [program.field];
    }

    return [];
};


const getProgramFieldName = (program) => {
    const fields = getProgramFields(program);

    return fields
        .map((field) => {
            if (typeof field === "string") {
                return field;
            }

            return (
                field?.name ||
                field?.title ||
                field?.field_name ||
                ""
            );
        })
        .filter(Boolean)
        .join(", ");
};


const getProgramTitle = (program) => {
    if (!program) {
        return "";
    }

    return (
        program.title ||
        program.name ||
        program.program_name ||
        ""
    );
};


const getProgramTypeName = (program) => {
    if (!program) {
        return "";
    }

    if (typeof program.type === "string") {
        return program.type;
    }

    return (
        program.type?.name ||
        program.type?.title ||
        program.type_name ||
        ""
    );
};


const getProgramFundingName = (program) => {
    if (!program) {
        return "";
    }

    if (typeof program.funding_type === "string") {
        return program.funding_type;
    }

    return (
        program.funding_type?.name ||
        program.funding_type?.title ||
        program.funding_type_name ||
        ""
    );
};


const getProgramStudyMode = (program) => {
    if (!program?.study_mode) {
        return "";
    }

    return String(program.study_mode)
        .replaceAll("_", " ")
        .replace(/\b\w/g, (letter) =>
            letter.toUpperCase()
        );
};


const getProgramDeadline = (program) => {
    if (!program) {
        return null;
    }

    return (
        program.deadline ||
        program.application_deadline ||
        program.deadline_date ||
        null
    );
};


const formatDate = (date) => {
    if (!date) {
        return "";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
        return "";
    }

    return parsedDate.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
};


/* =========================================================
   Component
   ========================================================= */

function UniversityDetails() {
    const { id } = useParams();

    const [university, setUniversity] = useState(null);
    const [programs, setPrograms] = useState([]);

    const [loading, setLoading] = useState(true);
    const [programsLoading, setProgramsLoading] = useState(true);

    const [error, setError] = useState("");
    const [programsError, setProgramsError] = useState("");


    /* =====================================================
       Fetch university
       ===================================================== */

    useEffect(() => {
        let mounted = true;

        const fetchUniversity = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await getUniversity(id);

                if (!mounted) {
                    return;
                }

                setUniversity(
                    normalizeUniversityResponse(response)
                );
            } catch (err) {
                if (!mounted) {
                    return;
                }

                console.error(
                    "Failed to load university:",
                    err
                );

                setError(
                    err?.response?.data?.message ||
                    "Failed to load university information."
                );
            } finally {
                if (mounted) {
                    setLoading(false);
                }
            }
        };

        if (id) {
            fetchUniversity();
        }

        return () => {
            mounted = false;
        };
    }, [id]);


    /* =====================================================
       Fetch university programs
       ===================================================== */

    useEffect(() => {
        let mounted = true;

        const fetchPrograms = async () => {
            try {
                setProgramsLoading(true);
                setProgramsError("");

                const response =
                    await getUniversityPrograms(id);

                if (!mounted) {
                    return;
                }

                const normalizedPrograms =
                    normalizeProgramsResponse(response);

                setPrograms(normalizedPrograms);
            } catch (err) {
                if (!mounted) {
                    return;
                }

                console.error(
                    "Failed to load university programs:",
                    err
                );

                setProgramsError(
                    err?.response?.data?.message ||
                    "Failed to load university programs."
                );
            } finally {
                if (mounted) {
                    setProgramsLoading(false);
                }
            }
        };

        if (id) {
            fetchPrograms();
        }

        return () => {
            mounted = false;
        };
    }, [id]);


    /* =====================================================
       Derived data
       ===================================================== */

    const universityName = useMemo(
        () => getUniversityName(university),
        [university]
    );

    const countryName = useMemo(
        () => getCountryName(university),
        [university]
    );

    const universityInitial = useMemo(
        () => getUniversityInitial(university),
        [university]
    );

    const programsCount = programs.length;


    /* =====================================================
       Loading
       ===================================================== */

    if (loading) {
        return <LoadingScreen />;
    }


    /* =====================================================
       Error
       ===================================================== */

    if (error || !university) {
        return (
            <div className="university-details-page">

                <div className="university-details-error">

                    <div className="university-error-icon">
                        <Building2 size={28} />
                    </div>

                    <h2>
                        Unable to load university
                    </h2>

                    <p>
                        {error ||
                            "The requested university could not be found."}
                    </p>

                    <Link
                        to="/student/universities"
                        className="university-error-button"
                    >
                        Explore universities
                    </Link>

                </div>

            </div>
        );
    }


    return (
        <div className="university-details-page">

            {/* =================================================
                HERO
            ================================================= */}

            <section className="university-details-hero">

                <div className="university-details-hero-overlay" />

                <div className="university-details-hero-inner">

                    {university.logo ? (

                        <div className="university-details-logo">

                            <img
                                src={university.logo}
                                alt={universityName}
                            />

                        </div>

                    ) : universityInitial ? (

                        <div className="university-details-logo">

                            <span>
                                {universityInitial}
                            </span>

                        </div>

                    ) : null}


                    <div className="university-details-hero-content">

                        <span className="university-details-eyebrow">

                            <GraduationCap size={17} />

                            University

                        </span>


                        {universityName && (
                            <h1>
                                {universityName}
                            </h1>
                        )}


                        {countryName && (
                            <div className="university-details-location">

                                <MapPin size={18} />

                                <span>
                                    {countryName}
                                </span>

                            </div>
                        )}


                        <div className="university-details-hero-meta">

                            <div className="university-hero-meta-item">

                                <BookOpen size={17} />

                                <span>
                                    {programsCount}{" "}
                                    {programsCount === 1
                                        ? "program"
                                        : "programs"}
                                </span>

                            </div>


                            {university.website && (
                                <a
                                    href={university.website}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="university-hero-website"
                                >
                                    <ExternalLink size={16} />

                                    Official website
                                </a>
                            )}

                        </div>

                    </div>

                </div>

            </section>


            {/* =================================================
                STATS
            ================================================= */}

            <section className="university-details-stats">

                <div className="university-details-stats-inner">

                    <div className="university-stat">

                        <div className="university-stat-icon">
                            <BookOpen size={20} />
                        </div>

                        <div>

                            <strong>
                                {programsCount}
                            </strong>

                            <span>
                                Published programs
                            </span>

                        </div>

                    </div>


                    {countryName && (
                        <div className="university-stat">

                            <div className="university-stat-icon">
                                <MapPin size={20} />
                            </div>

                            <div>

                                <strong>
                                    {countryName}
                                </strong>

                                <span>
                                    Location
                                </span>

                            </div>

                        </div>
                    )}


                    {university.website && (
                        <div className="university-stat">

                            <div className="university-stat-icon">
                                <Globe2 size={20} />
                            </div>

                            <div>

                                <strong>
                                    Official
                                </strong>

                                <span>
                                    University website
                                </span>

                            </div>

                        </div>
                    )}

                </div>

            </section>


            {/* =================================================
                MAIN CONTENT
            ================================================= */}

            <main className="university-details-container">

                <div className="university-details-layout">

                    {/* =========================================
                        MAIN COLUMN
                    ========================================= */}

                    <div className="university-details-main">

                        {/* =====================================
                            ABOUT
                        ===================================== */}

                        {university.description && (
                            <section className="university-content-section">

                                <div className="university-section-heading">

                                    <span className="university-section-kicker">
                                        About institution
                                    </span>

                                    <h2>
                                        About {universityName}
                                    </h2>

                                </div>


                                <div className="university-about-content">

                                    <p>
                                        {university.description}
                                    </p>

                                </div>

                            </section>
                        )}


                        {/* =====================================
                            AT A GLANCE
                        ===================================== */}

                        <section className="university-content-section">

                            <div className="university-section-heading">

                                <span className="university-section-kicker">
                                    University information
                                </span>

                                <h2>
                                    At a glance
                                </h2>

                            </div>


                            <div className="university-information-grid">

                                {universityName && (
                                    <div className="university-information-item">

                                        <div className="university-information-icon">
                                            <Building2 size={20} />
                                        </div>

                                        <div>

                                            <span>
                                                Institution
                                            </span>

                                            <strong>
                                                {universityName}
                                            </strong>

                                        </div>

                                    </div>
                                )}


                                {countryName && (
                                    <div className="university-information-item">

                                        <div className="university-information-icon">
                                            <MapPin size={20} />
                                        </div>

                                        <div>

                                            <span>
                                                Country
                                            </span>

                                            <strong>
                                                {countryName}
                                            </strong>

                                        </div>

                                    </div>
                                )}


                                <div className="university-information-item">

                                    <div className="university-information-icon">
                                        <BookOpen size={20} />
                                    </div>

                                    <div>

                                        <span>
                                            Academic programs
                                        </span>

                                        <strong>
                                            {programsCount}
                                        </strong>

                                    </div>

                                </div>


                                {university.website && (
                                    <div className="university-information-item">

                                        <div className="university-information-icon">
                                            <Globe2 size={20} />
                                        </div>

                                        <div>

                                            <span>
                                                Website
                                            </span>

                                            <a
                                                href={university.website}
                                                target="_blank"
                                                rel="noreferrer"
                                            >
                                                Visit official website

                                                <ExternalLink
                                                    size={14}
                                                />
                                            </a>

                                        </div>

                                    </div>
                                )}

                            </div>

                        </section>


                        {/* =====================================
                            PROGRAMS
                        ===================================== */}

                        <section className="university-content-section">

                            <div className="university-section-heading university-programs-heading">

                                <div>

                                    <span className="university-section-kicker">
                                        Academic opportunities
                                    </span>

                                    <h2>
                                        Programs at {universityName}
                                    </h2>

                                </div>


                                <Link
                                    to="/student/programs"
                                    className="university-view-all-link"
                                >
                                    View all

                                    <ArrowRight size={17} />

                                </Link>

                            </div>


                            {/* =================================
                                PROGRAMS LOADING
                            ================================= */}

                            {programsLoading ? (

                                <div className="university-programs-loading">

                                    <div className="university-loading-spinner" />

                                    <p>
                                        Loading programs...
                                    </p>

                                </div>

                            ) : programsError ? (

                                /* =================================
                                   PROGRAMS ERROR
                                ================================= */

                                <div className="university-programs-error">

                                    <p>
                                        {programsError}
                                    </p>

                                </div>

                            ) : programs.length === 0 ? (

                                /* =================================
                                   EMPTY PROGRAMS
                                ================================= */

                                <div className="university-empty-programs">

                                    <div className="university-empty-icon">
                                        <BookOpen size={26} />
                                    </div>

                                    <h3>
                                        No programs available
                                    </h3>

                                    <p>
                                        There are currently no
                                        published programs for this
                                        university.
                                    </p>

                                </div>

                            ) : (

                                /* =================================
                                   PROGRAMS GRID
                                ================================= */

                                <div className="university-programs-grid">

                                    {programs.map((program) => {

                                        const fieldName =
                                            getProgramFieldName(program);

                                        const degreeName =
                                            getProgramDegreeName(program);

                                        const deadline =
                                            getProgramDeadline(program);

                                        const programTitle =
                                            getProgramTitle(program);

                                        const programType =
                                            getProgramTypeName(program);

                                        const fundingName =
                                            getProgramFundingName(program);

                                        const studyMode =
                                            getProgramStudyMode(program);


                                        /*
                                         * Do not render a card if
                                         * the API does not provide
                                         * a program title.
                                         */
                                        if (!programTitle) {
                                            return null;
                                        }


                                        return (
                                            <article
                                                key={program.id}
                                                className="university-program-card"
                                            >

                                                {/* =========================
                                                    CARD TOP
                                                ========================= */}

                                                <div className="university-program-card-top">

                                                    <div className="university-program-icon">

                                                        <GraduationCap
                                                            size={21}
                                                        />

                                                    </div>

                                                </div>


                                                {/* =========================
                                                    CARD BODY
                                                ========================= */}

                                                <div className="university-program-card-body">

                                                    {fieldName && (
                                                        <span className="university-program-field">
                                                            {fieldName}
                                                        </span>
                                                    )}


                                                    <h3>
                                                        {programTitle}
                                                    </h3>


                                                    {degreeName && (
                                                        <p className="university-program-degree">
                                                            {degreeName}
                                                        </p>
                                                    )}


                                                    {program.description && (
                                                        <p className="university-program-description">
                                                            {program.description}
                                                        </p>
                                                    )}


                                                    <div className="university-program-meta">

                                                        {programType && (
                                                            <span>
                                                                {programType}
                                                            </span>
                                                        )}


                                                        {fundingName && (
                                                            <span>
                                                                {fundingName}
                                                            </span>
                                                        )}


                                                        {studyMode && (
                                                            <span>
                                                                {studyMode}
                                                            </span>
                                                        )}

                                                    </div>

                                                </div>


                                                {/* =========================
                                                    CARD FOOTER
                                                ========================= */}

                                                <div className="university-program-card-footer">

                                                    {deadline && (
                                                        <div className="university-program-deadline">

                                                            <span>
                                                                Deadline
                                                            </span>

                                                            <strong>
                                                                {formatDate(
                                                                    deadline
                                                                )}
                                                            </strong>

                                                        </div>
                                                    )}


                                                    {program.id && (
                                                        <Link
                                                            to={`/student/programs/${program.id}`}
                                                            className="university-program-arrow"
                                                            aria-label={`View ${programTitle}`}
                                                        >
                                                            <ArrowRight
                                                                size={18}
                                                            />
                                                        </Link>
                                                    )}

                                                </div>

                                            </article>
                                        );
                                    })}

                                </div>

                            )}

                        </section>

                    </div>


                    {/* =========================================
                        SIDEBAR
                    ========================================= */}

                    <aside className="university-details-sidebar">

                        {/* =====================================
                            EXPLORE PROGRAMS
                        ===================================== */}

                        <div className="university-action-card">

                            <div className="university-action-icon">
                                <Search size={22} />
                            </div>

                            <h3>
                                Explore more programs
                            </h3>

                            <p>
                                Discover programs from universities
                                that match your academic interests
                                and goals.
                            </p>

                            <Link
                                to="/student/programs"
                                className="university-action-button"
                            >
                                Explore programs

                                <ArrowRight size={17} />

                            </Link>

                        </div>


                        {/* =====================================
                            AI ADVISOR
                        ===================================== */}

                        <div className="university-ai-card">

                            <div className="university-ai-card-icon">
                                ✦
                            </div>

                            <span className="university-ai-card-label">
                                AI Advisor
                            </span>

                            <h3>
                                Not sure which program fits you?
                            </h3>

                            <p>
                                Get personalized recommendations
                                based on your profile, skills and
                                academic goals.
                            </p>

                            <Link
                                to="/student/ai-advisor"
                                className="university-ai-card-link"
                            >
                                Ask AI Advisor

                                <ArrowRight size={16} />

                            </Link>

                        </div>

                    </aside>

                </div>

            </main>

        </div>
    );
}


export default UniversityDetails;
