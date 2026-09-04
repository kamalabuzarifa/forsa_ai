import {
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    Link,
} from "react-router-dom";

import {
    CalendarDays,
    CheckCircle2,
    GraduationCap,
    MapPin,
    Search,
    SlidersHorizontal,
    RefreshCw,
    Sparkles,
    ArrowRight,
    Building2,
    X,
} from "lucide-react";

import {
    getOpportunities,
} from "../../../api/opportunities";

import "./Opportunities.css";


/* =========================================================
   HELPERS
========================================================= */

const getOpportunityList = (response) => {

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


const getOpportunityId = (opportunity) => {

    const id = Number(
        opportunity?.id
    );

    if (
        Number.isInteger(id) &&
        id > 0
    ) {
        return id;
    }

    return null;
};


const getUniversityName = (opportunity) => {

    if (
        opportunity?.university &&
        typeof opportunity.university === "object"
    ) {

        return (
            opportunity.university.name ||
            opportunity.university.title ||
            "N/A"
        );
    }

    return (
        opportunity?.university_name ||
        opportunity?.university ||
        "N/A"
    );
};


const getCountryName = (opportunity) => {

    if (
        opportunity?.country &&
        typeof opportunity.country === "object"
    ) {

        return (
            opportunity.country.name ||
            opportunity.country.title ||
            "N/A"
        );
    }

    return (
        opportunity?.country_name ||
        opportunity?.country ||
        "N/A"
    );
};


const getFundingName = (opportunity) => {

    if (
        opportunity?.funding_type &&
        typeof opportunity.funding_type === "object"
    ) {

        return (
            opportunity.funding_type.name ||
            opportunity.funding_type.title ||
            "N/A"
        );
    }

    if (
        opportunity?.fundingType &&
        typeof opportunity.fundingType === "object"
    ) {

        return (
            opportunity.fundingType.name ||
            opportunity.fundingType.title ||
            "N/A"
        );
    }

    return (
        opportunity?.funding ||
        opportunity?.funding_type ||
        opportunity?.funding_type_name ||
        "N/A"
    );
};


const getTypeName = (opportunity) => {

    if (
        opportunity?.opportunity_type &&
        typeof opportunity.opportunity_type === "object"
    ) {

        return (
            opportunity.opportunity_type.name ||
            opportunity.opportunity_type.title ||
            "N/A"
        );
    }

    if (
        opportunity?.type &&
        typeof opportunity.type === "object"
    ) {

        return (
            opportunity.type.name ||
            opportunity.type.title ||
            "N/A"
        );
    }

    return (
        opportunity?.type ||
        opportunity?.opportunity_type ||
        opportunity?.opportunity_type_name ||
        "N/A"
    );
};


const getDegreeName = (opportunity) => {

    if (
        Array.isArray(opportunity?.degrees) &&
        opportunity.degrees.length > 0
    ) {

        return (
            opportunity.degrees[0]?.name ||
            opportunity.degrees[0]?.title ||
            "N/A"
        );
    }

    if (
        opportunity?.degree &&
        typeof opportunity.degree === "object"
    ) {

        return (
            opportunity.degree.name ||
            opportunity.degree.title ||
            "N/A"
        );
    }

    return (
        opportunity?.degree_name ||
        "N/A"
    );
};


const formatDate = (date) => {

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
        "en-GB",
        {
            day: "2-digit",
            month: "short",
            year: "numeric",
        }
    );
};


const getDeadlineDate = (date) => {

    if (!date) {
        return null;
    }

    const parsedDate =
        new Date(date);

    if (
        Number.isNaN(
            parsedDate.getTime()
        )
    ) {
        return null;
    }

    return parsedDate;
};


/* =========================================================
   COMPONENT
========================================================= */

function Opportunities() {

    const [
        opportunities,
        setOpportunities,
    ] = useState([]);


    const [
        loading,
        setLoading,
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
        fundingFilter,
        setFundingFilter,
    ] = useState("all");


    const [
        verifiedOnly,
        setVerifiedOnly,
    ] = useState(false);


    /* =====================================================
       LOAD
    ===================================================== */

    const loadOpportunities = async () => {

        try {

            setLoading(true);
            setError("");

            const response =
                await getOpportunities();

            setOpportunities(
                getOpportunityList(response)
            );

        } catch (err) {

            console.error(
                "Failed to load opportunities:",
                err
            );

            setError(
                err?.response?.data?.message ||
                "Failed to load opportunities."
            );

        } finally {

            setLoading(false);

        }
    };


    useEffect(() => {

        loadOpportunities();

    }, []);


    /* =====================================================
       FUNDING OPTIONS
    ===================================================== */

    const fundingOptions =
        useMemo(() => {

            const values =
                opportunities
                    .map(
                        (opportunity) =>
                            getFundingName(
                                opportunity
                            )
                    )
                    .filter(
                        (value) =>
                            value &&
                            value !== "N/A"
                    );

            return [
                ...new Set(values),
            ];

        }, [
            opportunities,
        ]);


    /* =====================================================
       FILTER
    ===================================================== */

    const filteredOpportunities =
        useMemo(() => {

            const normalizedSearch =
                search
                    .trim()
                    .toLowerCase();


            return opportunities.filter(
                (opportunity) => {

                    const title =
                        String(
                            opportunity?.title ||
                            opportunity?.name ||
                            ""
                        ).toLowerCase();


                    const description =
                        String(
                            opportunity?.description ||
                            ""
                        ).toLowerCase();


                    const university =
                        getUniversityName(
                            opportunity
                        ).toLowerCase();


                    const country =
                        getCountryName(
                            opportunity
                        ).toLowerCase();


                    const funding =
                        getFundingName(
                            opportunity
                        ).toLowerCase();


                    const type =
                        getTypeName(
                            opportunity
                        ).toLowerCase();


                    const degree =
                        getDegreeName(
                            opportunity
                        ).toLowerCase();


                    const matchesSearch =
                        !normalizedSearch ||
                        title.includes(
                            normalizedSearch
                        ) ||
                        description.includes(
                            normalizedSearch
                        ) ||
                        university.includes(
                            normalizedSearch
                        ) ||
                        country.includes(
                            normalizedSearch
                        ) ||
                        funding.includes(
                            normalizedSearch
                        ) ||
                        type.includes(
                            normalizedSearch
                        ) ||
                        degree.includes(
                            normalizedSearch
                        );


                    const matchesFunding =
                        fundingFilter === "all" ||
                        getFundingName(
                            opportunity
                        ) === fundingFilter;


                    const matchesVerified =
                        !verifiedOnly ||
                        opportunity?.is_verified === true;


                    return (
                        matchesSearch &&
                        matchesFunding &&
                        matchesVerified
                    );

                }
            );

        }, [
            opportunities,
            search,
            fundingFilter,
            verifiedOnly,
        ]);


    /* =====================================================
       CLEAR
    ===================================================== */

    const clearFilters = () => {

        setSearch("");
        setFundingFilter("all");
        setVerifiedOnly(false);

    };


    /* =====================================================
       RENDER
    ===================================================== */

    return (

        <div className="opportunities-page">

            <main className="opportunities-container">


                {/* =================================================
                   HERO
                ================================================= */}

                <section className="opportunities-hero">

                    <div className="opportunities-hero-content">

                        <span className="opportunities-badge">

                            <Sparkles size={14} />

                            Explore Opportunities

                        </span>


                        <h1>
                            Find the right opportunity for you
                        </h1>


                        <p>
                            Explore scholarships, study programs,
                            and other opportunities that match your
                            academic goals.
                        </p>

                    </div>


                    <button
                        type="button"
                        className="opportunities-refresh-button"
                        onClick={
                            loadOpportunities
                        }
                        disabled={loading}
                    >

                        <RefreshCw
                            size={16}
                            className={
                                loading
                                    ? "opportunities-refresh-icon"
                                    : ""
                            }
                        />

                        {loading
                            ? "Refreshing..."
                            : "Refresh"
                        }

                    </button>

                </section>


                {/* =================================================
                   TOOLBAR
                ================================================= */}

                <section className="opportunities-toolbar">

                    <div className="opportunities-search">

                        <Search size={17} />

                        <input
                            type="search"
                            value={search}
                            onChange={(event) =>
                                setSearch(
                                    event.target.value
                                )
                            }
                            placeholder="Search by title, university, country, funding..."
                            aria-label="Search opportunities"
                        />

                    </div>


                    <div className="opportunities-select-wrapper">

                        <SlidersHorizontal size={17} />

                        <select
                            value={fundingFilter}
                            onChange={(event) =>
                                setFundingFilter(
                                    event.target.value
                                )
                            }
                            aria-label="Filter by funding"
                        >

                            <option value="all">
                                All Funding
                            </option>

                            {fundingOptions.map(
                                (funding) => (

                                    <option
                                        key={funding}
                                        value={funding}
                                    >
                                        {funding}
                                    </option>

                                )
                            )}

                        </select>

                    </div>


                    <button
                        type="button"
                        className={
                            `opportunities-verified-button ${verifiedOnly
                                ? "active"
                                : ""
                            }`
                        }
                        onClick={() =>
                            setVerifiedOnly(
                                (value) =>
                                    !value
                            )
                        }
                    >

                        <CheckCircle2 size={16} />

                        Verified Only

                    </button>


                    {(search ||
                        fundingFilter !== "all" ||
                        verifiedOnly) && (

                            <button
                                type="button"
                                className="opportunities-clear-button"
                                onClick={
                                    clearFilters
                                }
                            >
                                Clear Filters
                            </button>

                        )}

                </section>


                {/* =================================================
                   RESULTS HEADER
                ================================================= */}

                <section className="opportunities-results-header">

                    <div>

                        <span>
                            Opportunities
                        </span>

                        <h2>
                            Explore available opportunities
                        </h2>

                    </div>


                    <strong>

                        {filteredOpportunities.length}

                        <span>
                            {" "}results
                        </span>

                    </strong>

                </section>


                {/* =================================================
                   LOADING
                ================================================= */}

                {loading && (

                    <section className="opportunities-grid">

                        {[1, 2, 3, 4, 5, 6].map(
                            (item) => (

                                <article
                                    key={item}
                                    className="opportunity-card opportunity-card-skeleton"
                                >

                                    <div className="opportunity-card-top">

                                        <div className="opportunity-skeleton-icon" />

                                        <div className="opportunity-skeleton-badge" />

                                    </div>


                                    <div className="opportunity-card-content">

                                        <div className="opportunity-skeleton-title" />

                                        <div className="opportunity-skeleton-line" />

                                        <div className="opportunity-skeleton-line short" />

                                        <div className="opportunity-card-meta">

                                            <div className="opportunity-skeleton-meta" />

                                            <div className="opportunity-skeleton-meta" />

                                            <div className="opportunity-skeleton-meta" />

                                        </div>

                                    </div>


                                    <div className="opportunity-card-footer">

                                        <div className="opportunity-skeleton-footer" />

                                    </div>

                                </article>

                            )
                        )}

                    </section>

                )}


                {/* =================================================
                   ERROR
                ================================================= */}

                {!loading && error && (

                    <div className="opportunities-state">

                        <div className="opportunities-state-icon error">

                            <XIcon />

                        </div>

                        <h3>
                            Unable to load opportunities
                        </h3>

                        <p>
                            {error}
                        </p>

                        <button
                            type="button"
                            className="opportunities-primary-button"
                            onClick={
                                loadOpportunities
                            }
                        >

                            Try Again

                        </button>

                    </div>

                )}


                {/* =================================================
                   EMPTY
                ================================================= */}

                {!loading &&
                    !error &&
                    filteredOpportunities.length === 0 && (

                        <div className="opportunities-state">

                            <div className="opportunities-state-icon">

                                <Search size={22} />

                            </div>


                            <h3>
                                No opportunities found
                            </h3>


                            <p>
                                Try changing your search or
                                removing some filters.
                            </p>


                            <button
                                type="button"
                                className="opportunities-primary-button"
                                onClick={
                                    clearFilters
                                }
                            >

                                Clear Filters

                            </button>

                        </div>

                    )}


                {/* =================================================
                   RESULTS
                ================================================= */}

                {!loading &&
                    !error &&
                    filteredOpportunities.length > 0 && (

                        <section className="opportunities-grid">

                            {filteredOpportunities.map(
                                (opportunity) => {

                                    const opportunityId =
                                        getOpportunityId(
                                            opportunity
                                        );


                                    const deadline =
                                        getDeadlineDate(
                                            opportunity.deadline
                                        );


                                    const isDeadlinePassed =
                                        deadline &&
                                        deadline < new Date();


                                    const title =
                                        opportunity?.title ||
                                        opportunity?.name ||
                                        "Untitled Opportunity";


                                    const university =
                                        getUniversityName(
                                            opportunity
                                        );


                                    const country =
                                        getCountryName(
                                            opportunity
                                        );


                                    const type =
                                        getTypeName(
                                            opportunity
                                        );


                                    const degree =
                                        getDegreeName(
                                            opportunity
                                        );


                                    const funding =
                                        getFundingName(
                                            opportunity
                                        );


                                    return (

                                        <article
                                            key={
                                                opportunityId ??
                                                `opportunity-${opportunity.id}`
                                            }
                                            className="opportunity-card"
                                        >


                                            {/* CARD TOP */}

                                            <div className="opportunity-card-top">

                                                <div className="opportunity-card-icon">

                                                    <GraduationCap
                                                        size={21}
                                                    />

                                                </div>


                                                <div className="opportunity-card-top-right">

                                                    <span className="opportunity-card-type">

                                                        {type}

                                                    </span>


                                                    {opportunity?.is_verified && (

                                                        <span className="opportunity-card-verified">

                                                            <CheckCircle2
                                                                size={12}
                                                            />

                                                            Verified

                                                        </span>

                                                    )}

                                                </div>

                                            </div>


                                            {/* CARD CONTENT */}

                                            <div className="opportunity-card-content">

                                                <h3>
                                                    {title}
                                                </h3>


                                                <p className="opportunity-card-university">

                                                    {university}

                                                </p>


                                                <div className="opportunity-card-meta">

                                                    <span>

                                                        <MapPin
                                                            size={14}
                                                        />

                                                        <strong>
                                                            Country
                                                        </strong>

                                                        <em>
                                                            {country}
                                                        </em>

                                                    </span>


                                                    <span>

                                                        <GraduationCap
                                                            size={14}
                                                        />

                                                        <strong>
                                                            Degree
                                                        </strong>

                                                        <em>
                                                            {degree}
                                                        </em>

                                                    </span>


                                                    <span>

                                                        <Sparkles
                                                            size={14}
                                                        />

                                                        <strong>
                                                            Funding
                                                        </strong>

                                                        <em>
                                                            {funding}
                                                        </em>

                                                    </span>

                                                </div>


                                                <div className="opportunity-card-deadline">

                                                    <div>

                                                        <CalendarDays
                                                            size={15}
                                                        />

                                                        <span>
                                                            Deadline
                                                        </span>

                                                    </div>


                                                    <strong
                                                        className={
                                                            isDeadlinePassed
                                                                ? "passed"
                                                                : ""
                                                        }
                                                    >
                                                        {formatDate(
                                                            opportunity.deadline
                                                        )}
                                                    </strong>

                                                </div>

                                            </div>


                                            {/* CARD FOOTER */}

                                            <div className="opportunity-card-footer">

                                                <span>
                                                    Explore opportunity
                                                </span>


                                                {opportunityId && (

                                                    <Link
                                                        to={
                                                            `/student/opportunities/${opportunityId}`
                                                        }
                                                        className="opportunity-card-link"
                                                        aria-label={
                                                            `View ${title}`
                                                        }
                                                    >

                                                        <span>
                                                            View Details
                                                        </span>

                                                        <ArrowRight
                                                            size={15}
                                                        />

                                                    </Link>

                                                )}

                                            </div>

                                        </article>

                                    );

                                }
                            )}

                        </section>

                    )}

            </main>

        </div>
    );
}


/* =========================================================
   SIMPLE ERROR ICON
========================================================= */

function XIcon() {

    return (

        <span className="opportunities-x-icon">
            ×
        </span>

    );
}


export default Opportunities;
