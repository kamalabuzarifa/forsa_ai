import {
    ArrowRight,
    CalendarDays,
    CheckCircle2,
    DollarSign,
    Globe2,
    GraduationCap,
    Heart,
    RotateCcw,
    Search,
    SlidersHorizontal,
    X,
} from "lucide-react";

import {
    Link,
} from "react-router-dom";

import {
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    getScholarships,
    checkScholarshipMatch,
} from "../../../api/scholarships";

import {
    getAIAdvisorOptions,
} from "../../../api/aiAdvisor";

import "./Scholarships.css";
import "../../../components/student/StudentCard.css";
import LoadingScreen from "../../../components/LoadingScreen";


/* =========================================================
   INITIAL FILTERS
   ========================================================= */

const INITIAL_FILTERS = {
    country: "",
    degree: "",
    funding: "",
};


/* =========================================================
   HELPERS
   ========================================================= */

const getDisplayValue = (
    value
) => {

    if (
        value === null ||
        value === undefined
    ) {
        return "";
    }

    if (
        typeof value === "string" ||
        typeof value === "number"
    ) {
        return String(value);
    }

    if (
        typeof value === "object"
    ) {

        return (
            value.name ??
            value.title ??
            value.label ??
            value.code ??
            value.value ??
            ""
        ).toString();

    }

    return "";
};


const getObjectId = (
    value
) => {

    if (
        value === null ||
        value === undefined
    ) {
        return "";
    }

    if (
        typeof value === "string" ||
        typeof value === "number"
    ) {
        return String(value);
    }

    if (
        typeof value === "object"
    ) {

        return (
            value.id !== undefined &&
            value.id !== null
        )
            ? String(value.id)
            : "";

    }

    return "";
};


const uniqueById = (
    items
) => {

    const seen = new Set();

    return items.filter(
        (item) => {

            const id =
                item.id !== undefined &&
                    item.id !== null
                    ? String(item.id)
                    : getDisplayValue(item);

            if (
                seen.has(id)
            ) {
                return false;
            }

            seen.add(id);

            return true;
        }
    );
};


const sortByName = (
    items
) => {

    return [
        ...items,
    ].sort(
        (a, b) =>
            getDisplayValue(a).localeCompare(
                getDisplayValue(b),
                undefined,
                {
                    sensitivity: "base",
                }
            )
    );
};


/* =========================================================
   NORMALIZE API RESPONSE
   ========================================================= */

const normalizeResponse = (
    response
) => {

    if (
        Array.isArray(response)
    ) {
        return response;
    }

    if (
        response &&
        Array.isArray(response.data)
    ) {
        return response.data;
    }

    if (
        response &&
        response.data &&
        Array.isArray(response.data.data)
    ) {
        return response.data.data;
    }

    return [];
};


/* =========================================================
   SCHOLARSHIP HELPERS
   ========================================================= */

const getScholarshipCountry = (
    scholarship
) => {

    return (
        scholarship?.country ??
        scholarship?.destination ??
        scholarship?.countries ??
        ""
    );
};


const getScholarshipCountryId = (
    scholarship
) => {

    const country =
        getScholarshipCountry(
            scholarship
        );

    return getObjectId(
        country
    );
};


const getScholarshipFunding = (
    scholarship
) => {

    return (
        scholarship?.funding_type ??
        scholarship?.funding ??
        scholarship?.fundingType ??
        ""
    );
};


const getScholarshipFundingId = (
    scholarship
) => {

    const funding =
        getScholarshipFunding(
            scholarship
        );

    return getObjectId(
        funding
    );
};


const getScholarshipDegrees = (
    scholarship
) => {

    if (
        Array.isArray(
            scholarship?.degrees
        )
    ) {
        return scholarship.degrees;
    }

    if (
        scholarship?.degree
    ) {
        return [
            scholarship.degree,
        ];
    }

    if (
        scholarship?.study_level
    ) {
        return [
            scholarship.study_level,
        ];
    }

    if (
        scholarship?.studyLevel
    ) {
        return [
            scholarship.studyLevel,
        ];
    }

    return [];
};


const getDegreeName = (
    degree
) => {

    return getDisplayValue(
        degree
    );
};


const getScholarshipDegreeNames = (
    scholarship
) => {

    return getScholarshipDegrees(
        scholarship
    )
        .map(
            getDegreeName
        )
        .filter(Boolean);
};


const getScholarshipTitle = (
    scholarship
) => {

    return (
        scholarship?.title ??
        scholarship?.name ??
        "Untitled Scholarship"
    );
};


const getScholarshipUniversity = (
    scholarship
) => {

    const university =
        scholarship?.university;

    if (
        typeof university === "object" &&
        university !== null
    ) {

        return (
            university.name ??
            university.title ??
            "University"
        );

    }

    return (
        university ??
        scholarship?.university_name ??
        "University"
    );
};


const getScholarshipDescription = (
    scholarship
) => {

    return (
        scholarship?.description ??
        scholarship?.summary ??
        "No description available."
    );
};


const getScholarshipDeadline = (
    scholarship
) => {

    return (
        scholarship?.deadline ??
        scholarship?.application_deadline ??
        scholarship?.applicationDeadline ??
        null
    );
};


/* =========================================================
   DATE FORMATTER
   ========================================================= */

const formatDate = (
    date
) => {

    if (!date) {
        return "No deadline";
    }

    const parsedDate =
        new Date(date);

    if (
        Number.isNaN(
            parsedDate.getTime()
        )
    ) {
        return "No deadline";
    }

    return parsedDate.toLocaleDateString(
        "en-US",
        {
            month: "short",
            day: "numeric",
            year: "numeric",
        }
    );
};


/* =========================================================
   NORMALIZE SCHOLARSHIP
   ========================================================= */

const normalizeScholarship = (
    scholarship
) => {

    const country =
        getScholarshipCountry(
            scholarship
        );

    const funding =
        getScholarshipFunding(
            scholarship
        );

    const degrees =
        getScholarshipDegreeNames(
            scholarship
        );

    const deadline =
        getScholarshipDeadline(
            scholarship
        );

    return {
        ...scholarship,

        id:
            scholarship?.id ??
            scholarship?.slug ??
            "",

        title:
            getScholarshipTitle(
                scholarship
            ),

        university:
            getScholarshipUniversity(
                scholarship
            ),

        country:
            getDisplayValue(
                country
            ),

        countryId:
            getScholarshipCountryId(
                scholarship
            ),

        funding:
            getDisplayValue(
                funding
            ),

        fundingId:
            getScholarshipFundingId(
                scholarship
            ),

        degrees,

        degree:
            degrees.length > 0
                ? degrees.join(", ")
                : "Not specified",

        description:
            getScholarshipDescription(
                scholarship
            ),

        deadline,

        deadlineFormatted:
            formatDate(
                deadline
            ),

        isVerified:
            Boolean(
                scholarship?.is_verified ??
                scholarship?.isVerified ??
                false
            ),

        opportunityType:
            getDisplayValue(
                scholarship?.opportunity_type
            ),

        matchScore: null,
    };
};


/* =========================================================
   MATCH SCORE HELPER
   ========================================================= */

const getMatchScoreFromResponse = (
    response
) => {

    const rawMatchScore =
        response?.data?.match_score ??
        response?.match_score ??
        response?.data?.data?.match_score ??
        null;

    if (
        rawMatchScore === null ||
        rawMatchScore === undefined ||
        rawMatchScore === ""
    ) {
        return null;
    }

    const matchScore =
        Number(
            rawMatchScore
        );

    if (
        !Number.isFinite(
            matchScore
        )
    ) {
        return null;
    }

    return matchScore;
};


/* =========================================================
   BUILD COUNTRY OPTIONS
   ========================================================= */

const buildCountryOptions = (
    scholarships
) => {

    const options =
        scholarships
            .map(
                (scholarship) => {

                    const country =
                        getScholarshipCountry(
                            scholarship
                        );

                    const name =
                        getDisplayValue(
                            country
                        );

                    const id =
                        getObjectId(
                            country
                        ) || name;

                    if (!name) {
                        return null;
                    }

                    return {
                        id,
                        name,
                    };
                }
            )
            .filter(Boolean);

    return sortByName(
        uniqueById(
            options
        )
    );
};


/* =========================================================
   BUILD DEGREE OPTIONS
   ========================================================= */

const buildDegreeOptions = (
    scholarships
) => {

    const options = [];

    scholarships.forEach(
        (scholarship) => {

            getScholarshipDegrees(
                scholarship
            ).forEach(
                (degree) => {

                    const name =
                        getDegreeName(
                            degree
                        );

                    const id =
                        getObjectId(
                            degree
                        ) || name;

                    if (name) {

                        options.push({
                            id,
                            name,
                        });

                    }
                }
            );

        }
    );

    return sortByName(
        uniqueById(
            options
        )
    );
};


/* =========================================================
   BUILD FUNDING OPTIONS
   ========================================================= */

const buildFundingOptions = (
    scholarships
) => {

    const options =
        scholarships
            .map(
                (scholarship) => {

                    const funding =
                        getScholarshipFunding(
                            scholarship
                        );

                    const name =
                        getDisplayValue(
                            funding
                        );

                    const id =
                        getObjectId(
                            funding
                        ) || name;

                    if (!name) {
                        return null;
                    }

                    return {
                        id,
                        name,
                    };
                }
            )
            .filter(Boolean);

    return sortByName(
        uniqueById(
            options
        )
    );
};


/* =========================================================
   COMPONENT
   ========================================================= */

const DEFAULT_FUNDING_OPTIONS = [
    { id: "Fully Funded", name: "Fully Funded" },
    { id: "Partially Funded", name: "Partially Funded" },
    { id: "Self-Funded", name: "Self-Funded" },
];

export default function Scholarships() {

    const [
        scholarships,
        setScholarships,
    ] = useState([]);

    const [
        loading,
        setLoading,
    ] = useState(false);

    const [
        initialLoading,
        setInitialLoading,
    ] = useState(true);

    const [
        error,
        setError,
    ] = useState("");

    const [
        search,
        setSearch,
    ] = useState("");

    const [
        debouncedSearch,
        setDebouncedSearch,
    ] = useState("");

    const [
        filters,
        setFilters,
    ] = useState(
        INITIAL_FILTERS
    );

    const [
        showFilters,
        setShowFilters,
    ] = useState(false);

    const [
        sortBy,
        setSortBy,
    ] = useState(
        "recommended"
    );

    const [
        page,
        setPage,
    ] = useState(1);

    const [
        pagination,
        setPagination,
    ] = useState({
        current_page: 1,
        last_page: 1,
        total: 0,
        per_page: 12,
    });

    const [
        lookupCountries,
        setLookupCountries,
    ] = useState([]);

    const [
        lookupDegrees,
        setLookupDegrees,
    ] = useState([]);

    /* =====================================================
       LOAD TAXONOMY LOOKUPS
    ===================================================== */

    useEffect(() => {
        let isMounted = true;

        getAIAdvisorOptions()
            .then((data) => {
                if (!isMounted || !data) return;

                if (Array.isArray(data.countries)) {
                    setLookupCountries(
                        data.countries.map((c) => ({
                            id: String(c.id),
                            name: c.name,
                        }))
                    );
                }

                if (Array.isArray(data.degrees)) {
                    setLookupDegrees(
                        data.degrees.map((d) => ({
                            id: String(d.id),
                            name: d.name,
                        }))
                    );
                }
            })
            .catch((err) => {
                console.warn(
                    "Could not load advisor lookups for scholarship filters:",
                    err
                );
            });

        return () => {
            isMounted = false;
        };
    }, []);

    /* =====================================================
       DEBOUNCE SEARCH
    ===================================================== */

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(search);
        }, 350);

        return () => clearTimeout(handler);
    }, [search]);

    /* =====================================================
       LOAD SCHOLARSHIPS
    ===================================================== */

    const loadScholarships = async (pageToLoad = page) => {

        try {

            setLoading(true);
            setError("");

            const sortMap = {
                recommended: "latest",
                title_az: "title_asc",
                deadline_soon: "deadline_asc",
            };

            const params = {
                page: pageToLoad,
                per_page: 12,
                sort_by: sortMap[sortBy] || "latest",
            };

            if (debouncedSearch.trim()) {
                params.search = debouncedSearch.trim();
            }

            if (filters.country) {
                params.country = filters.country;
            }

            if (filters.degree) {
                params.degree = filters.degree;
            }

            if (filters.funding) {
                params.funding = filters.funding;
            }

            const response =
                await getScholarships(params);

            const rawScholarships =
                normalizeResponse(
                    response
                );

            const scholarshipOnly =
                rawScholarships.filter(
                    (item) => {

                        const type =
                            getDisplayValue(
                                item?.opportunity_type
                            );

                        if (!type) {
                            return true;
                        }

                        return (
                            type.toLowerCase() ===
                            "scholarship"
                        );
                    }
                );

            const normalized =
                scholarshipOnly.map(
                    normalizeScholarship
                );

            const valid =
                normalized.filter(
                    (item) =>
                        item.id !== ""
                );

            const unique =
                uniqueById(
                    valid
                );

            if (response?.meta) {
                setPagination({
                    current_page: response.meta.current_page ?? pageToLoad,
                    last_page: response.meta.last_page ?? 1,
                    total: response.meta.total ?? unique.length,
                    per_page: response.meta.per_page ?? 12,
                });
            } else {
                setPagination({
                    current_page: pageToLoad,
                    last_page: 1,
                    total: unique.length,
                    per_page: 12,
                });
            }

            const scholarshipsWithMatch =
                await Promise.all(
                    unique.map(
                        async (
                            scholarship
                        ) => {

                            try {

                                const matchResponse =
                                    await checkScholarshipMatch(
                                        scholarship.id
                                    );

                                const matchScore =
                                    getMatchScoreFromResponse(
                                        matchResponse
                                    );

                                return {
                                    ...scholarship,
                                    matchScore,
                                };

                            } catch (
                                matchError
                            ) {

                                console.error(
                                    `Failed to load match for scholarship ${scholarship.id}:`,
                                    matchError
                                );

                                return {
                                    ...scholarship,
                                    matchScore: null,
                                };
                            }

                        }
                    )
                );

            setScholarships(
                scholarshipsWithMatch
            );

        } catch (
            requestError
        ) {

            console.error(
                "Failed to load scholarships:",
                requestError
            );

            setError(
                "Unable to load scholarships. Please try again."
            );

            setScholarships([]);

        } finally {

            setLoading(false);
            setInitialLoading(false);

        }

    };

    useEffect(() => {

        loadScholarships(page);

    }, [page, debouncedSearch, filters, sortBy]);

    /* =====================================================
       FILTER OPTIONS
    ===================================================== */

    const countries =
        useMemo(() => {

            const dynamic =
                buildCountryOptions(
                    scholarships
                );

            return sortByName(
                uniqueById([
                    ...lookupCountries,
                    ...dynamic,
                ])
            );

        }, [
            lookupCountries,
            scholarships,
        ]);

    const degrees =
        useMemo(() => {

            const dynamic =
                buildDegreeOptions(
                    scholarships
                );

            return sortByName(
                uniqueById([
                    ...lookupDegrees,
                    ...dynamic,
                ])
            );

        }, [
            lookupDegrees,
            scholarships,
        ]);

    const fundingOptions =
        useMemo(() => {

            const dynamic =
                buildFundingOptions(
                    scholarships
                );

            return sortByName(
                uniqueById([
                    ...DEFAULT_FUNDING_OPTIONS,
                    ...dynamic,
                ])
            );

        }, [
            scholarships,
        ]);

    /* =====================================================
       FILTER HANDLERS
    ===================================================== */

    const handleFilterChange = (
        event
    ) => {

        const {
            name,
            value,
        } = event.target;

        setFilters(
            (previous) => ({
                ...previous,
                [name]: value,
            })
        );

        setPage(1);

    };

    const resetFilters = () => {

        setFilters(
            INITIAL_FILTERS
        );

        setSearch("");

        setSortBy(
            "recommended"
        );

        setPage(1);

    };

    const hasFilters =
        Boolean(
            filters.country ||
            filters.degree ||
            filters.funding ||
            search.trim()
        );

    if (initialLoading) {
        return <LoadingScreen />;
    }


    /* =====================================================
       RENDER
    ===================================================== */

    return (

        <div className="scholarships-page">


            {/* =================================================
                HERO
            ================================================= */}

            <section className="scholarships-hero">

                <div className="scholarships-hero-content">


                    <span className="scholarships-eyebrow">

                        <GraduationCap
                            size={15}
                        />

                        Find your opportunity

                    </span>


                    <h1>

                        Discover

                        <span>
                            Scholarships
                        </span>

                    </h1>


                    <p>

                        Explore scholarship opportunities
                        from universities around the world
                        and find the right opportunity for
                        your academic journey.

                    </p>


                    {/* SEARCH + FILTER */}

                    <div className="scholarships-toolbar">


                        <div className="scholarships-search">

                            <Search
                                size={18}
                            />


                            <input
                                type="text"
                                value={search}
                                onChange={(event) => {
                                    setSearch(
                                        event.target.value
                                    );
                                    setPage(1);
                                }}
                                placeholder="Search scholarships, universities..."
                                aria-label="Search scholarships"
                            />


                            {search && (

                                <button
                                    type="button"
                                    className="scholarships-search-clear"
                                    onClick={() => {
                                        setSearch("");
                                        setPage(1);
                                    }}
                                    aria-label="Clear search"
                                >

                                    <X
                                        size={16}
                                    />

                                </button>

                            )}

                        </div>


                        <div className="scholarships-filter-wrapper">

                            <button
                                type="button"
                                className={`scholarships-filter-button ${showFilters
                                    ? "is-active"
                                    : ""
                                    }`}
                                onClick={() =>
                                    setShowFilters(
                                        (previous) =>
                                            !previous
                                    )
                                }
                                aria-expanded={
                                    showFilters
                                }
                                aria-controls="scholarships-filters"
                            >

                                <SlidersHorizontal
                                    size={16}
                                />

                                Filters

                            </button>


                            {showFilters && (

                                <div
                                    id="scholarships-filters"
                                    className="scholarships-filter-dropdown"
                                >

                                    <div className="scholarships-filter-dropdown-header">

                                        <div>

                                            <span>
                                                Refine results
                                            </span>

                                            <h3>
                                                Filters
                                            </h3>

                                        </div>


                                        <button
                                            type="button"
                                            className="scholarships-filter-dropdown-close"
                                            onClick={() =>
                                                setShowFilters(
                                                    false
                                                )
                                            }
                                            aria-label="Close filters"
                                        >

                                            <X
                                                size={17}
                                            />

                                        </button>

                                    </div>


                                    <div className="scholarship-filter-group">

                                        <label htmlFor="scholarship-country">
                                            Country
                                        </label>


                                        <select
                                            id="scholarship-country"
                                            name="country"
                                            value={
                                                filters.country
                                            }
                                            onChange={
                                                handleFilterChange
                                            }
                                        >

                                            <option value="">
                                                All countries
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

                                    </div>


                                    <div className="scholarship-filter-group">

                                        <label htmlFor="scholarship-degree">
                                            Degree
                                        </label>


                                        <select
                                            id="scholarship-degree"
                                            name="degree"
                                            value={
                                                filters.degree
                                            }
                                            onChange={
                                                handleFilterChange
                                            }
                                        >

                                            <option value="">
                                                All degrees
                                            </option>


                                            {degrees.map(
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


                                    <div className="scholarship-filter-group">

                                        <label htmlFor="scholarship-funding">
                                            Funding Type
                                        </label>


                                        <select
                                            id="scholarship-funding"
                                            name="funding"
                                            value={
                                                filters.funding
                                            }
                                            onChange={
                                                handleFilterChange
                                            }
                                        >

                                            <option value="">
                                                All funding types
                                            </option>


                                            {fundingOptions.map(
                                                (funding) => (

                                                    <option
                                                        key={
                                                            funding.id
                                                        }
                                                        value={
                                                            funding.id
                                                        }
                                                    >
                                                        {
                                                            funding.name
                                                        }
                                                    </option>

                                                )
                                            )}

                                        </select>

                                    </div>


                                    {hasFilters && (

                                        <button
                                            type="button"
                                            className="scholarships-clear-filters"
                                            onClick={
                                                resetFilters
                                            }
                                        >

                                            <RotateCcw
                                                size={14}
                                            />

                                            Clear all filters

                                        </button>

                                    )}

                                </div>

                            )}

                        </div>

                    </div>

                </div>

            </section>


            {/* =================================================
                MAIN
            ================================================= */}

            <main className="scholarships-main">


                <div className="scholarships-results-toolbar">

                    <div>

                        <span className="scholarships-result-label">
                            Scholarship opportunities
                        </span>


                        <h2>
                            Find your next opportunity
                        </h2>

                    </div>


                    <div className="scholarships-results-right">

                        {!loading && !error && (

                            <p>

                                <strong>
                                    {
                                        pagination.total
                                    }
                                </strong>

                                {" "}

                                {
                                    pagination.total === 1
                                        ? "scholarship"
                                        : "scholarships"
                                }

                            </p>

                        )}

                        <select
                            value={sortBy}
                            onChange={(event) => {
                                setSortBy(
                                    event.target.value
                                );
                                setPage(1);
                            }}
                            aria-label="Sort scholarships"
                        >
                            <option value="recommended">
                                Recommended
                            </option>
                            <option value="title_az">
                                Title (A-Z)
                            </option>
                            <option value="deadline_soon">
                                Deadline (Soonest)
                            </option>
                        </select>

                    </div>

                </div>


                {/* =================================================
                    LOADING SKELETON
                ================================================= */}

                {loading && (

                    <div
                        className="scholarships-grid"
                        aria-label="Loading scholarships"
                    >

                        {Array.from({
                            length: 6,
                        }).map(
                            (_, index) => (

                                <article
                                    className="scholarship-card scholarship-card-skeleton"
                                    key={index}
                                >

                                    {/* CARD TOP */}

                                    <div className="scholarship-card-top">

                                        <div className="scholarship-card-top-main">

                                            <div className="skeleton-scholarship-icon" />

                                            <div className="skeleton-top-content">

                                                <div className="skeleton-line small" />

                                                <div className="skeleton-line title" />

                                                <div className="skeleton-line university" />

                                            </div>

                                        </div>

                                    </div>


                                    {/* CARD BODY */}

                                    <div className="scholarship-card-body">

                                        <div className="skeleton-line description" />

                                        <div className="skeleton-line description short" />

                                    </div>


                                    {/* META */}

                                    <div className="scholarship-card-meta">

                                        <div className="skeleton-meta" />

                                    </div>


                                    {/* FOOTER */}

                                    <div className="scholarship-card-footer">

                                        <div className="skeleton-footer-line" />

                                    </div>

                                </article>

                            )
                        )}

                    </div>

                )}


                {/* =================================================
                    ERROR
                ================================================= */}

                {!loading && error && (

                    <div className="scholarships-empty">

                        <div className="scholarships-empty-icon">

                            <X
                                size={26}
                            />

                        </div>


                        <h3>
                            Unable to load scholarships
                        </h3>


                        <p>
                            {error}
                        </p>


                        <button
                            type="button"
                            onClick={() =>
                                window.location.reload()
                            }
                        >
                            Try again
                        </button>

                    </div>

                )}


                {/* =================================================
                    EMPTY
                ================================================= */}

                {!loading &&
                    !error &&
                    scholarships.length === 0 && (

                        <div className="scholarships-empty">

                            <div className="scholarships-empty-icon">

                                <GraduationCap
                                    size={28}
                                />

                            </div>


                            <h3>
                                No scholarships found
                            </h3>


                            <p>
                                Try changing your search
                                or filters to find more
                                opportunities.
                            </p>


                            {hasFilters && (

                                <button
                                    type="button"
                                    onClick={
                                        resetFilters
                                    }
                                >

                                    <RotateCcw
                                        size={14}
                                    />

                                    Clear filters

                                </button>

                            )}

                        </div>

                    )}


                {/* =================================================
                    SCHOLARSHIPS
                ================================================= */}

                {!loading &&
                    !error &&
                    scholarships.length > 0 && (

                        <div className="scholarships-grid">

                            {scholarships.map(
                                (scholarship) => (

                                    <article
                                        key={
                                            scholarship.id
                                        }
                                        className="scholarship-card student-reference-card"
                                    >

                                        {/* CARD TOP */}

                                        <div className="scholarship-card-top student-card-top">

                                            <div className="scholarship-icon">

                                                <GraduationCap
                                                    size={22}
                                                />

                                            </div>


                                            <div className="scholarship-card-actions">

                                                {Number.isFinite(
                                                    Number(
                                                        scholarship.matchScore
                                                    )
                                                ) && (

                                                        <div
                                                            className="scholarship-match"
                                                            title="Your match score"
                                                            aria-label={`Match score ${Math.round(
                                                                Number(
                                                                    scholarship.matchScore
                                                                )
                                                            )}%`}
                                                        >

                                                            <CheckCircle2
                                                                size={14}
                                                            />

                                                            <span>

                                                                {
                                                                    Math.round(
                                                                        Number(
                                                                            scholarship.matchScore
                                                                        )
                                                                    )
                                                                }%

                                                            </span>

                                                        </div>

                                                    )}


                                                <button
                                                    type="button"
                                                    className="save-scholarship"
                                                    aria-label="Save scholarship"
                                                >

                                                    <Heart
                                                        size={18}
                                                    />

                                                </button>

                                            </div>

                                        </div>


                                        <div className="scholarship-card-body student-card-body">

                                            {/* TITLE */}

                                            <h2>
                                                {
                                                    scholarship.title
                                                }
                                            </h2>


                                            {/* UNIVERSITY */}

                                            <p className="scholarship-university">

                                                <GraduationCap
                                                    size={15}
                                                />

                                                {
                                                    scholarship.university
                                                }

                                            </p>


                                            {/* DESCRIPTION */}

                                            <p className="scholarship-description">

                                                {
                                                    scholarship.description
                                                }

                                            </p>


                                            {/* META */}

                                            <div className="scholarship-meta student-card-meta">

                                                <span className="student-card-meta-item is-primary">

                                                    <Globe2
                                                        size={15}
                                                    />

                                                    {
                                                        scholarship.country ||
                                                        "Not specified"
                                                    }

                                                </span>


                                                <span className="student-card-meta-item">

                                                    <GraduationCap
                                                        size={15}
                                                    />

                                                    {
                                                        scholarship.degree
                                                    }

                                                </span>


                                                <span className="student-card-meta-item">

                                                    <DollarSign
                                                        size={15}
                                                    />

                                                    {
                                                        scholarship.funding ||
                                                        "Not specified"
                                                    }

                                                </span>

                                            </div>

                                        </div>


                                        {/* FOOTER */}

                                        <div className="scholarship-footer student-card-footer">

                                            <span className="scholarship-deadline">

                                                <CalendarDays
                                                    size={15}
                                                />

                                                Deadline:{" "}

                                                {
                                                    scholarship.deadlineFormatted
                                                }

                                            </span>


                                            <Link
                                                to={`/student/scholarships/${scholarship.id}`}
                                                className="scholarship-view"
                                            >

                                                <span>
                                                    View scholarship
                                                </span>


                                                <ArrowRight
                                                    size={14}
                                                />

                                            </Link>

                                        </div>

                                    </article>

                                )
                            )}

                        </div>

                    )}


                {/* =================================================
                    PAGINATION
                ================================================= */}

                {!loading &&
                    !error &&
                    pagination.last_page > 1 && (

                        <nav
                            className="scholarships-pagination"
                            aria-label="Scholarships pagination"
                        >

                            <button
                                type="button"
                                className="scholarships-page-button"
                                onClick={() =>
                                    setPage((p) =>
                                        Math.max(1, p - 1)
                                    )
                                }
                                disabled={
                                    pagination.current_page <= 1 ||
                                    loading
                                }
                            >
                                Previous
                            </button>

                            <span className="scholarships-page-info">
                                Page {pagination.current_page} of {pagination.last_page}
                            </span>

                            <button
                                type="button"
                                className="scholarships-page-button"
                                onClick={() =>
                                    setPage((p) =>
                                        Math.min(
                                            pagination.last_page,
                                            p + 1
                                        )
                                    )
                                }
                                disabled={
                                    pagination.current_page >=
                                    pagination.last_page ||
                                    loading
                                }
                            >
                                Next
                            </button>

                        </nav>

                    )}

            </main>

        </div>

    );
}
