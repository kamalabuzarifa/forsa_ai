import {
    ArrowRight,
    Search,
    Sparkles,
    GraduationCap,
    MapPin,
    Clock3,
    ChevronRight,
    Building2,
    Award,
    Globe2,
} from "lucide-react";

import {
    Link,
    useNavigate,
} from "react-router-dom";

import {
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    getUniversities,
    getUniversityPrograms,
} from "../../../api/universities";

import "./Explore.css";


/* =========================================================
   STUDENT ROUTES
========================================================= */

const STUDENT_ROUTES = {
    explore: "/student/explore",
    programs: "/student/programs",
    universities: "/student/universities",
    scholarships: "/student/scholarships",
    aiAdvisor: "/student/ai-advisor",
    saved: "/student/saved",
};


/* =========================================================
   NORMALIZE UNIVERSITIES RESPONSE
========================================================= */

const normalizeUniversitiesResponse = (response) => {

    if (!response) {
        return [];
    }

    if (Array.isArray(response.universities)) {
        return response.universities;
    }

    if (Array.isArray(response.data?.universities)) {
        return response.data.universities;
    }

    if (Array.isArray(response.data?.data)) {
        return response.data.data;
    }

    if (Array.isArray(response.data)) {
        return response.data;
    }

    if (Array.isArray(response)) {
        return response;
    }

    if (Array.isArray(response.items)) {
        return response.items;
    }

    return [];
};


/* =========================================================
   NORMALIZE PROGRAMS RESPONSE
========================================================= */

const normalizeProgramsResponse = (response) => {

    if (!response) {
        return [];
    }

    if (Array.isArray(response.programs)) {
        return response.programs;
    }

    if (Array.isArray(response.data?.programs)) {
        return response.data.programs;
    }

    if (Array.isArray(response.data?.data)) {
        return response.data.data;
    }

    if (Array.isArray(response.data?.items)) {
        return response.data.items;
    }

    if (Array.isArray(response.data)) {
        return response.data;
    }

    if (Array.isArray(response)) {
        return response;
    }

    if (Array.isArray(response.items)) {
        return response.items;
    }

    return [];
};


/* =========================================================
   TEXT VALUE
========================================================= */

const getTextValue = (value) => {

    if (
        typeof value === "string" ||
        typeof value === "number"
    ) {
        return String(value);
    }

    if (!value) {
        return "";
    }

    return (
        value.name ||
        value.title ||
        value.label ||
        value.value ||
        ""
    );
};


/* =========================================================
   PROGRAM ID
========================================================= */

const getId = (program) => {

    return (
        program?.id ??
        program?.opportunity_id ??
        ""
    );
};


/* =========================================================
   PROGRAM TITLE
========================================================= */

const getTitle = (program) => {

    return (
        program?.title ??
        program?.name ??
        program?.program_name ??
        "Untitled program"
    );
};


/* =========================================================
   UNIVERSITY
========================================================= */

const getUniversity = (program) => {

    if (
        typeof program?.university === "string"
    ) {
        return program.university;
    }

    return (
        program?.university?.name ??
        program?.university_name ??
        ""
    );
};


const getUniversityId = (program) => {

    return (
        program?.university?.id ??
        program?.university_id ??
        ""
    );
};


/* =========================================================
   COUNTRY
========================================================= */

const getCountry = (program) => {

    if (
        typeof program?.country === "string"
    ) {
        return program.country;
    }

    return (
        program?.country?.name ??
        program?.country_name ??
        ""
    );
};


const getCountryId = (program) => {

    if (
        typeof program?.country === "object" &&
        program?.country?.id
    ) {
        return program.country.id;
    }

    return (
        program?.country_id ??
        ""
    );
};


/* =========================================================
   FIELDS
========================================================= */

const getFields = (program) => {

    if (
        Array.isArray(program?.fields)
    ) {
        return program.fields;
    }

    if (program?.field) {
        return [program.field];
    }

    return [];
};


const getFieldName = (field) => {

    return getTextValue(field);
};


const getField = (program) => {

    const fields =
        getFields(program);

    return (
        fields
            .map(getFieldName)
            .filter(Boolean)[0] ||
        ""
    );
};


/* =========================================================
   DEGREES
========================================================= */

const getDegrees = (program) => {

    if (
        Array.isArray(program?.degrees)
    ) {
        return program.degrees
            .map(getTextValue)
            .filter(Boolean);
    }

    if (program?.degree) {
        return [
            getTextValue(
                program.degree
            ),
        ].filter(Boolean);
    }

    return [];
};


const getDegree = (program) => {

    return (
        getDegrees(program)[0] ||
        ""
    );
};


/* =========================================================
   OPPORTUNITY TYPE
========================================================= */

const getOpportunityType = (program) => {

    return getTextValue(
        program?.opportunity_type ??
        program?.opportunityType ??
        program?.type ??
        program?.type_name
    );
};


/* =========================================================
   FUNDING
========================================================= */

const getFunding = (program) => {

    return getTextValue(
        program?.funding_type ??
        program?.fundingType ??
        program?.funding ??
        program?.funding_type_name
    );
};


/* =========================================================
   STUDY MODE
========================================================= */

const getStudyMode = (program) => {

    const value =
        getTextValue(
            program?.study_mode ??
            program?.studyMode
        );

    if (!value) {
        return "";
    }

    return value
        .replaceAll("_", " ")
        .replace(
            /\b\w/g,
            (letter) =>
                letter.toUpperCase()
        );
};


/* =========================================================
   DURATION
========================================================= */

const getDuration = (program) => {

    return getTextValue(
        program?.duration ??
        program?.duration_text
    );
};


/* =========================================================
   DEADLINE
========================================================= */

const getDeadline = (program) => {

    return (
        program?.deadline ??
        program?.application_deadline ??
        program?.deadline_date ??
        null
    );
};


/* =========================================================
   DATE
========================================================= */

const formatDate = (value) => {

    if (!value) {
        return "";
    }

    const date =
        new Date(value);

    if (
        Number.isNaN(
            date.getTime()
        )
    ) {
        return "";
    }

    return date.toLocaleDateString(
        "en-US",
        {
            year: "numeric",
            month: "short",
            day: "numeric",
        }
    );
};


/* =========================================================
   MATCH
========================================================= */

const getMatch = (program) => {

    const value =
        program?.match_percentage ??
        program?.match_score ??
        program?.matching_score ??
        program?.match;

    if (
        value === null ||
        value === undefined ||
        value === ""
    ) {
        return null;
    }

    if (
        typeof value === "object"
    ) {
        return null;
    }

    const numericValue =
        Number(value);

    if (
        Number.isNaN(
            numericValue
        )
    ) {
        return null;
    }

    if (
        numericValue <= 1
    ) {
        return `${Math.round(
            numericValue * 100
        )}%`;
    }

    return `${Math.round(
        numericValue
    )}%`;
};


/* =========================================================
   UNIVERSITY INITIALS
========================================================= */

const getUniversityInitials = (name) => {

    if (!name) {
        return "U";
    }

    return name
        .split(" ")
        .filter(Boolean)
        .map(
            (word) =>
                word[0]
        )
        .slice(0, 2)
        .join("")
        .toUpperCase();
};


/* =========================================================
   COMPONENT
========================================================= */

function Explore() {

    const navigate =
        useNavigate();

    const [search, setSearch] =
        useState("");

    const [programs, setPrograms] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    /* =========================================================
       LOAD PROGRAMS
    ========================================================= */

    useEffect(() => {

        let cancelled = false;


        const loadPrograms = async () => {

            try {

                setLoading(true);

                setError("");


                const universitiesResponse =
                    await getUniversities({
                        per_page: 100,
                    });


                if (cancelled) {
                    return;
                }


                const universities =
                    normalizeUniversitiesResponse(
                        universitiesResponse
                    );


                if (
                    universities.length === 0
                ) {

                    setPrograms([]);

                    return;
                }


                const universityRequests =
                    universities
                        .filter(
                            (university) =>
                                university?.id
                        )
                        .map(
                            async (university) => {

                                try {

                                    const response =
                                        await getUniversityPrograms(
                                            university.id,
                                            {
                                                per_page: 100,
                                            }
                                        );


                                    const universityPrograms =
                                        normalizeProgramsResponse(
                                            response
                                        );


                                    return universityPrograms.map(
                                        (program) => ({

                                            ...program,

                                            university:
                                                program?.university ||
                                                university,

                                            university_id:
                                                program?.university_id ??
                                                university.id,

                                            country:
                                                program?.country ||
                                                university?.country ||
                                                null,

                                        })
                                    );

                                } catch (universityError) {

                                    console.error(
                                        `Failed to load programs for university ${university.id}`,
                                        universityError
                                    );

                                    return [];
                                }

                            }
                        );


                const universityResults =
                    await Promise.all(
                        universityRequests
                    );


                if (cancelled) {
                    return;
                }


                const allPrograms =
                    universityResults.flat();


                const uniqueProgramsMap =
                    new Map();


                allPrograms.forEach(
                    (program) => {

                        const id =
                            getId(program);


                        if (!id) {
                            return;
                        }


                        if (
                            !uniqueProgramsMap.has(id)
                        ) {

                            uniqueProgramsMap.set(
                                id,
                                program
                            );

                        }

                    }
                );


                let results =
                    Array.from(
                        uniqueProgramsMap.values()
                    );


                results =
                    results.filter(
                        (program) => {

                            if (
                                program?.is_active === false ||
                                program?.active === false
                            ) {
                                return false;
                            }


                            if (
                                program?.status &&
                                typeof program.status === "string"
                            ) {

                                const status =
                                    program.status
                                        .toLowerCase()
                                        .trim();


                                if (
                                    [
                                        "draft",
                                        "inactive",
                                        "archived",
                                        "closed",
                                        "rejected",
                                    ].includes(status)
                                ) {
                                    return false;
                                }

                            }


                            return true;
                        }
                    );


                results.sort(
                    (a, b) => {

                        const aId =
                            Number(
                                getId(a)
                            );

                        const bId =
                            Number(
                                getId(b)
                            );

                        return bId - aId;
                    }
                );


                setPrograms(
                    results
                );

            } catch (err) {

                console.error(
                    "Failed to load programs",
                    err
                );


                if (cancelled) {
                    return;
                }


                setPrograms([]);

                setError(
                    err?.response?.data?.message ||
                    "Unable to load programs."
                );

            } finally {

                if (!cancelled) {
                    setLoading(false);
                }

            }

        };


        loadPrograms();


        return () => {
            cancelled = true;
        };

    }, []);


    /* =========================================================
       SEARCH
    ========================================================= */

    const handleSearch = (event) => {

        event.preventDefault();

        const value =
            search.trim();


        if (!value) {

            navigate(
                STUDENT_ROUTES.programs
            );

            return;
        }


        navigate(
            `${STUDENT_ROUTES.programs}?search=${encodeURIComponent(value)}`
        );
    };


    /* =========================================================
       POPULAR SEARCH
    ========================================================= */

    const handlePopularSearch = (value) => {

        navigate(
            `${STUDENT_ROUTES.programs}?search=${encodeURIComponent(value)}`
        );
    };


    /* =========================================================
       COUNTRY SEARCH
    ========================================================= */

    const handleCountrySearch = (country) => {

        if (!country) {

            navigate(
                STUDENT_ROUTES.programs
            );

            return;
        }


        navigate(
            `${STUDENT_ROUTES.programs}?country=${encodeURIComponent(country)}`
        );
    };


    /* =========================================================
       FEATURED PROGRAMS
    ========================================================= */

    const featuredPrograms =
        useMemo(
            () =>
                programs.slice(
                    0,
                    3
                ),
            [programs]
        );


    /* =========================================================
       POPULAR DESTINATIONS
    ========================================================= */

    const popularDestinations =
        useMemo(
            () => {

                const countryMap =
                    new Map();


                programs.forEach(
                    (program) => {

                        const country =
                            getCountry(program);


                        if (!country) {
                            return;
                        }


                        const current =
                            countryMap.get(
                                country
                            ) || 0;


                        countryMap.set(
                            country,
                            current + 1
                        );

                    }
                );


                return Array.from(
                    countryMap.entries()
                )
                    .map(
                        ([name, count]) => ({
                            name,
                            programs: count,
                        })
                    )
                    .sort(
                        (a, b) =>
                            b.programs -
                            a.programs
                    )
                    .slice(0, 4);

            },
            [programs]
        );


    /* =========================================================
       RENDER
    ========================================================= */

    return (

        <div className="explore-page">


            {/* =================================================
                HERO
            ================================================= */}

            <section className="explore-hero">

                <div className="explore-hero-content">

                    <span className="explore-eyebrow">

                        <Sparkles size={14} />

                        Find your next opportunity

                    </span>


                    <h1>

                        Find the right

                        <span>
                            study program
                        </span>

                        for your future.

                    </h1>


                    <p>

                        Search programs, universities and
                        scholarships. Compare your options
                        and find opportunities that match
                        your profile.

                    </p>


                    <form
                        className="explore-search"
                        onSubmit={handleSearch}
                    >

                        <Search
                            size={19}
                            className="explore-search-icon"
                        />


                        <input
                            type="text"
                            value={search}
                            onChange={(event) =>
                                setSearch(
                                    event.target.value
                                )
                            }
                            placeholder="What do you want to study?"
                        />


                        <button type="submit">
                            Search
                        </button>

                    </form>


                    <div className="explore-quick-search">

                        <span>
                            Popular searches
                        </span>


                        <button
                            type="button"
                            onClick={() =>
                                handlePopularSearch(
                                    "Artificial Intelligence"
                                )
                            }
                        >
                            Artificial Intelligence
                        </button>


                        <button
                            type="button"
                            onClick={() =>
                                handlePopularSearch(
                                    "Data Science"
                                )
                            }
                        >
                            Data Science
                        </button>


                        <button
                            type="button"
                            onClick={() =>
                                handlePopularSearch(
                                    "Computer Science"
                                )
                            }
                        >
                            Computer Science
                        </button>

                    </div>

                </div>


                {/* =================================================
                    HERO VISUAL
                ================================================= */}

                <div className="explore-hero-visual">

                    <div className="explore-hero-card">

                        <div className="explore-hero-card-header">

                            <div className="explore-card-icon">

                                <GraduationCap size={21} />

                            </div>


                            <div>

                                <strong>
                                    AI Matching
                                </strong>

                                <span>
                                    Based on your profile
                                </span>

                            </div>

                        </div>


                        {featuredPrograms[0] ? (

                            <>

                                <div className="explore-match-score">

                                    <div>

                                        <span>
                                            Featured program
                                        </span>

                                        <strong>
                                            {getMatch(
                                                featuredPrograms[0]
                                            ) || "—"}
                                        </strong>

                                    </div>


                                    <div className="match-progress">
                                        <span />
                                    </div>

                                </div>


                                <div className="explore-match-program">

                                    <div className="explore-program-logo">

                                        {getUniversityInitials(
                                            getUniversity(
                                                featuredPrograms[0]
                                            )
                                        )}

                                    </div>


                                    <div>

                                        <strong>
                                            {getTitle(
                                                featuredPrograms[0]
                                            )}
                                        </strong>


                                        <span>
                                            {getUniversity(
                                                featuredPrograms[0]
                                            )}
                                        </span>

                                    </div>

                                </div>


                                <div className="explore-card-footer">

                                    {getCountry(
                                        featuredPrograms[0]
                                    ) && (

                                            <span>

                                                <MapPin size={12} />

                                                {getCountry(
                                                    featuredPrograms[0]
                                                )}

                                            </span>

                                        )}


                                    {getDuration(
                                        featuredPrograms[0]
                                    ) && (

                                            <span>

                                                <Clock3 size={12} />

                                                {getDuration(
                                                    featuredPrograms[0]
                                                )}

                                            </span>

                                        )}

                                </div>

                            </>

                        ) : (

                            <div className="explore-hero-empty">

                                {loading
                                    ? "Loading programs..."
                                    : "No programs available"
                                }

                            </div>

                        )}

                    </div>


                    <div className="explore-floating-card explore-floating-top">

                        <div className="floating-icon">

                            <Building2 size={15} />

                        </div>


                        <div>

                            <strong>
                                {loading
                                    ? "..."
                                    : programs.length
                                }
                            </strong>

                            <span>
                                Available programs
                            </span>

                        </div>

                    </div>


                    <div className="explore-floating-card explore-floating-bottom">

                        <div className="floating-icon">

                            <Award size={15} />

                        </div>


                        <div>

                            <strong>
                                Scholarships
                            </strong>

                            <span>
                                Find funding opportunities
                            </span>

                        </div>

                    </div>

                </div>

            </section>


            {/* =================================================
                DISCOVERY CATEGORIES
            ================================================= */}

            <section className="explore-categories">

                <div className="explore-section-heading">

                    <div>

                        <span className="section-label">
                            Explore
                        </span>


                        <h2>

                            Everything you need

                            <span>
                                to study abroad
                            </span>

                        </h2>

                    </div>


                    <p>

                        Explore programs, universities
                        and scholarships in one place.

                    </p>

                </div>


                <div className="explore-category-grid">

                    <Link
                        to={STUDENT_ROUTES.programs}
                        className="explore-category-card"
                    >

                        <div className="category-icon">
                            <GraduationCap size={21} />
                        </div>

                        <h3>
                            Study Programs
                        </h3>

                        <p>
                            Find bachelor's, master's
                            and doctoral programs that
                            match your goals.
                        </p>

                        <span>
                            Explore programs
                            <ArrowRight size={14} />
                        </span>

                    </Link>


                    <Link
                        to={STUDENT_ROUTES.universities}
                        className="explore-category-card"
                    >

                        <div className="category-icon">
                            <Building2 size={21} />
                        </div>

                        <h3>
                            Universities
                        </h3>

                        <p>
                            Discover universities and
                            learn about their programs
                            and requirements.
                        </p>

                        <span>
                            Explore universities
                            <ArrowRight size={14} />
                        </span>

                    </Link>


                    <Link
                        to={STUDENT_ROUTES.scholarships}
                        className="explore-category-card"
                    >

                        <div className="category-icon">
                            <Award size={21} />
                        </div>

                        <h3>
                            Scholarships
                        </h3>

                        <p>
                            Find scholarships and funding
                            options for your study plans.
                        </p>

                        <span>
                            Find scholarships
                            <ArrowRight size={14} />
                        </span>

                    </Link>


                    <Link
                        to={STUDENT_ROUTES.aiAdvisor}
                        className="explore-category-card explore-ai-category"
                    >

                        <div className="category-icon">
                            <Sparkles size={21} />
                        </div>

                        <h3>
                            AI Advisor
                        </h3>

                        <p>
                            Get personalized recommendations
                            based on your academic profile.
                        </p>

                        <span>
                            Talk to AI Advisor
                            <ArrowRight size={14} />
                        </span>

                    </Link>

                </div>

            </section>


            {/* =================================================
                RECOMMENDED PROGRAMS
            ================================================= */}

            <section className="explore-programs">

                <div className="explore-section-heading">

                    <div>

                        <span className="section-label">
                            Recommended for you
                        </span>


                        <h2>

                            Programs you may

                            <span>
                                be interested in
                            </span>

                        </h2>

                    </div>


                    <Link
                        to={STUDENT_ROUTES.programs}
                        className="explore-view-all"
                    >

                        View all

                        <ChevronRight size={15} />

                    </Link>

                </div>


                {error ? (

                    <div className="explore-empty-state">

                        <GraduationCap size={24} />

                        <p>
                            {error}
                        </p>

                    </div>

                ) : loading ? (

                    <div className="explore-empty-state">

                        <p>
                            Loading programs...
                        </p>

                    </div>

                ) : featuredPrograms.length === 0 ? (

                    <div className="explore-empty-state">

                        <GraduationCap size={24} />

                        <p>
                            No programs are available yet.
                        </p>


                        <Link
                            to={STUDENT_ROUTES.programs}
                            className="explore-view-all"
                        >

                            Explore programs

                            <ArrowRight size={14} />

                        </Link>

                    </div>

                ) : (

                    <div className="explore-program-grid">

                        {featuredPrograms.map(
                            (program) => {

                                const id =
                                    getId(program);

                                const title =
                                    getTitle(program);

                                const university =
                                    getUniversity(program);

                                const universityId =
                                    getUniversityId(program);

                                const field =
                                    getField(program);

                                const degree =
                                    getDegree(program);

                                const opportunityType =
                                    getOpportunityType(
                                        program
                                    );

                                const funding =
                                    getFunding(
                                        program
                                    );

                                const studyMode =
                                    getStudyMode(
                                        program
                                    );

                                const deadline =
                                    getDeadline(
                                        program
                                    );


                                return (

                                    <article
                                        className="program-card"
                                        key={id}
                                    >

                                        {/* =========================
                                            CARD TOP
                                        ========================= */}

                                        <div className="program-card-top">

                                            <div className="program-card-top-main">

                                                <div
                                                    className={`program-card-logo ${universityId
                                                            ? "is-clickable"
                                                            : ""
                                                        }`}
                                                    role={
                                                        universityId
                                                            ? "button"
                                                            : undefined
                                                    }
                                                    tabIndex={
                                                        universityId
                                                            ? 0
                                                            : undefined
                                                    }
                                                    onClick={(event) => {

                                                        if (!universityId) {
                                                            return;
                                                        }

                                                        event.stopPropagation();

                                                        navigate(
                                                            `${STUDENT_ROUTES.universities}/${universityId}`
                                                        );

                                                    }}
                                                    onKeyDown={(event) => {

                                                        if (
                                                            !universityId
                                                        ) {
                                                            return;
                                                        }

                                                        if (
                                                            event.key === "Enter" ||
                                                            event.key === " "
                                                        ) {

                                                            event.preventDefault();

                                                            navigate(
                                                                `${STUDENT_ROUTES.universities}/${universityId}`
                                                            );

                                                        }

                                                    }}
                                                >

                                                    <GraduationCap
                                                        size={21}
                                                    />

                                                </div>


                                                <div className="program-card-degree-header">

                                                    {degree && (

                                                        <strong>
                                                            {degree}
                                                        </strong>

                                                    )}


                                                    {university && (

                                                        <span>
                                                            {university}
                                                        </span>

                                                    )}

                                                </div>

                                            </div>

                                        </div>


                                        {/* =========================
                                            CARD BODY
                                        ========================= */}

                                        <div className="program-card-body">

                                            {field && (

                                                <span className="program-card-field">

                                                    {field}

                                                </span>

                                            )}


                                            <h2>
                                                {title}
                                            </h2>


                                            {program?.description && (

                                                <p className="program-card-description">

                                                    {program.description}

                                                </p>

                                            )}

                                        </div>


                                        {/* =========================
                                            PROGRAM META
                                        ========================= */}

                                        {(
                                            opportunityType ||
                                            funding ||
                                            studyMode
                                        ) && (

                                                <div className="program-card-meta">

                                                    {opportunityType && (

                                                        <span>
                                                            {opportunityType}
                                                        </span>

                                                    )}


                                                    {funding && (

                                                        <span>
                                                            {funding}
                                                        </span>

                                                    )}


                                                    {studyMode && (

                                                        <span>
                                                            {studyMode}
                                                        </span>

                                                    )}

                                                </div>

                                            )}


                                        {/* =========================
                                            FOOTER
                                        ========================= */}

                                        <div className="program-card-footer">

                                            <div className="program-card-deadline">

                                                {deadline ? (

                                                    <>

                                                        <span>
                                                            Deadline
                                                        </span>


                                                        <strong>

                                                            {formatDate(
                                                                deadline
                                                            )}

                                                        </strong>

                                                    </>

                                                ) : (

                                                    <span>
                                                        Application deadline
                                                    </span>

                                                )}

                                            </div>


                                            <Link
                                                to={
                                                    id
                                                        ? `${STUDENT_ROUTES.programs}/${id}`
                                                        : STUDENT_ROUTES.programs
                                                }
                                                className="program-card-arrow"
                                                aria-label={`View ${title}`}
                                            >

                                                <ArrowRight
                                                    size={18}
                                                />

                                            </Link>

                                        </div>

                                    </article>

                                );

                            }
                        )}

                    </div>

                )}

            </section>


            {/* =================================================
                DESTINATIONS
            ================================================= */}

            <section className="explore-destinations">

                <div className="explore-section-heading">

                    <div>

                        <span className="section-label">
                            Study destinations
                        </span>


                        <h2>

                            Where do you want

                            <span>
                                to study?
                            </span>

                        </h2>

                    </div>


                    <Link
                        to={STUDENT_ROUTES.programs}
                        className="explore-view-all"
                    >

                        Explore all destinations

                        <ChevronRight size={15} />

                    </Link>

                </div>


                {popularDestinations.length === 0 ? (

                    <div className="explore-empty-state">

                        <Globe2 size={24} />

                        <p>
                            Destination information
                            will appear when programs
                            are available.
                        </p>

                    </div>

                ) : (

                    <div className="destination-grid">

                        {popularDestinations.map(
                            (destination) => (

                                <button
                                    type="button"
                                    key={destination.name}
                                    className="destination-card"
                                    onClick={() =>
                                        handleCountrySearch(
                                            destination.name
                                        )
                                    }
                                >

                                    <div className="destination-icon">

                                        <Globe2 size={20} />

                                    </div>


                                    <div>

                                        <strong>
                                            {destination.name}
                                        </strong>


                                        <span>

                                            {destination.programs === 1
                                                ? "1 program"
                                                : `${destination.programs} programs`
                                            }

                                        </span>

                                    </div>


                                    <ChevronRight
                                        size={17}
                                        className="destination-arrow"
                                    />

                                </button>

                            )
                        )}

                    </div>

                )}

            </section>


            {/* =================================================
                AI CTA
            ================================================= */}

            <section className="explore-ai-section">

                <div className="explore-ai-content">

                    <span className="section-label">
                        EduMatch AI
                    </span>


                    <h2>

                        Not sure what to study?

                        <span>
                            Let AI help you.
                        </span>

                    </h2>


                    <p>

                        Tell us about your education,
                        interests and goals. EduMatch AI
                        can help you discover programs that
                        fit your profile.

                    </p>


                    <Link
                        to={STUDENT_ROUTES.aiAdvisor}
                        className="explore-ai-button"
                    >

                        Start with AI Advisor

                        <ArrowRight size={15} />

                    </Link>

                </div>


                <div className="explore-ai-visual">

                    <div className="ai-orb">

                        <Sparkles size={31} />

                    </div>


                    <div className="ai-result-card">

                        <span>
                            AI Recommendation
                        </span>


                        <strong>

                            {featuredPrograms[0]
                                ? getTitle(
                                    featuredPrograms[0]
                                )
                                : "No recommendation yet"
                            }

                        </strong>


                        <small>

                            {featuredPrograms[0]
                                ? (
                                    getMatch(
                                        featuredPrograms[0]
                                    )
                                    ||
                                    "Profile match pending"
                                )
                                : "Use AI Advisor to get recommendations"
                            }

                        </small>

                    </div>

                </div>

            </section>

        </div>

    );
}


export default Explore;
