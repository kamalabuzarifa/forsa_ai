import {
    Search,
    SlidersHorizontal,
    Heart,
    ArrowRight,
    GraduationCap,
    Globe2,
    CalendarDays,
    DollarSign,
    CheckCircle2,
    X,
} from "lucide-react";

import {
    Link,
} from "react-router-dom";

import {
    useMemo,
    useState,
} from "react";

import "./Scholarships.css";


/*
|----------------------------------------------------------------------
| Helpers
|----------------------------------------------------------------------
*/

const normalizeValue = (value) =>
    String(value || "").trim().toLowerCase();


/*
|----------------------------------------------------------------------
| Scholarships Page
|----------------------------------------------------------------------
*/

function Scholarships() {

    const scholarships = [
        {
            id: 1,
            title: "Global Excellence Scholarship",
            university: "University of Oxford",
            country: "United Kingdom",
            degree: "Master's",
            funding: "Fully Funded",
            deadline: "15 Jan 2027",
            amount: "£25,000",
            description:
                "Scholarship for international students with strong academic performance and leadership experience.",
            match: 96,
        },
        {
            id: 2,
            title: "International Student Scholarship",
            university: "University of Melbourne",
            country: "Australia",
            degree: "Master's",
            funding: "Partial Funding",
            deadline: "30 Nov 2026",
            amount: "$20,000",
            description:
                "Financial support for international students applying to postgraduate programs.",
            match: 91,
        },
        {
            id: 3,
            title: "International Excellence Award",
            university: "University of Toronto",
            country: "Canada",
            degree: "Master's",
            funding: "Partial Funding",
            deadline: "20 Dec 2026",
            amount: "$15,000",
            description:
                "Merit-based funding for international graduate students with strong academic records.",
            match: 88,
        },
        {
            id: 4,
            title: "Academic Merit Scholarship",
            university: "University of Edinburgh",
            country: "United Kingdom",
            degree: "Master's",
            funding: "Partial Funding",
            deadline: "10 Feb 2027",
            amount: "£12,000",
            description:
                "Funding opportunity for international students with academic excellence.",
            match: 84,
        },
        {
            id: 5,
            title: "Graduate Research Scholarship",
            university: "University of Sydney",
            country: "Australia",
            degree: "Master's / PhD",
            funding: "Fully Funded",
            deadline: "05 Dec 2026",
            amount: "$30,000",
            description:
                "Research-focused scholarship for international postgraduate students.",
            match: 82,
        },
        {
            id: 6,
            title: "International Graduate Award",
            university: "University of British Columbia",
            country: "Canada",
            degree: "Master's",
            funding: "Partial Funding",
            deadline: "18 Jan 2027",
            amount: "$18,000",
            description:
                "Award for international graduate students with strong academic potential.",
            match: 79,
        },
    ];


    /*
    |----------------------------------------------------------------------
    | State
    |----------------------------------------------------------------------
    */

    const [search, setSearch] = useState("");

    const [studyLevel, setStudyLevel] = useState("all");

    const [fundingType, setFundingType] = useState("all");

    const [destination, setDestination] = useState("all");

    const [showFilters, setShowFilters] = useState(false);

    const [sortBy, setSortBy] = useState("recommended");


    /*
    |----------------------------------------------------------------------
    | Filter Options
    |----------------------------------------------------------------------
    */

    const countries = useMemo(() => {
        return [
            ...new Set(
                scholarships
                    .map((scholarship) => scholarship.country)
                    .filter(Boolean)
            ),
        ].sort((a, b) =>
            a.localeCompare(
                b,
                undefined,
                {
                    sensitivity: "base",
                }
            )
        );
    }, [scholarships]);


    /*
    |----------------------------------------------------------------------
    | Filtered Scholarships
    |----------------------------------------------------------------------
    */

    const filteredScholarships = useMemo(() => {

        const query =
            normalizeValue(search);


        const results = scholarships.filter(
            (scholarship) => {

                const title =
                    normalizeValue(
                        scholarship.title
                    );

                const university =
                    normalizeValue(
                        scholarship.university
                    );

                const country =
                    normalizeValue(
                        scholarship.country
                    );

                const degree =
                    normalizeValue(
                        scholarship.degree
                    );

                const funding =
                    normalizeValue(
                        scholarship.funding
                    );


                const matchesSearch =
                    !query ||
                    title.includes(query) ||
                    university.includes(query) ||
                    country.includes(query);


                const matchesStudyLevel =
                    studyLevel === "all" ||
                    degree.includes(
                        normalizeValue(studyLevel)
                    );


                const matchesFunding =
                    fundingType === "all" ||
                    funding ===
                    normalizeValue(fundingType);


                const matchesDestination =
                    destination === "all" ||
                    scholarship.country === destination;


                return (
                    matchesSearch &&
                    matchesStudyLevel &&
                    matchesFunding &&
                    matchesDestination
                );
            }
        );


        return [...results].sort(
            (a, b) => {

                if (sortBy === "deadline") {
                    return (
                        new Date(a.deadline) -
                        new Date(b.deadline)
                    );
                }


                if (sortBy === "highest-funding") {

                    const amountA =
                        Number(
                            String(a.amount)
                                .replace(/[^0-9.]/g, "")
                        );

                    const amountB =
                        Number(
                            String(b.amount)
                                .replace(/[^0-9.]/g, "")
                        );

                    return amountB - amountA;
                }


                return b.match - a.match;
            }
        );

    }, [
        scholarships,
        search,
        studyLevel,
        fundingType,
        destination,
        sortBy,
    ]);


    /*
    |----------------------------------------------------------------------
    | Filters
    |----------------------------------------------------------------------
    */

    const hasFilters =
        Boolean(search.trim()) ||
        studyLevel !== "all" ||
        fundingType !== "all" ||
        destination !== "all";


    const clearFilters = () => {

        setSearch("");

        setStudyLevel("all");

        setFundingType("all");

        setDestination("all");

    };


    /*
    |----------------------------------------------------------------------
    | Render
    |----------------------------------------------------------------------
    */

    return (
        <div className="scholarships-page">

            {/* =====================================================
                HERO
            ====================================================== */}

            <section className="scholarships-hero">

                <div className="scholarships-hero-content">

                    <span className="scholarships-eyebrow">

                        <GraduationCap size={15} />

                        Explore Scholarships

                    </span>


                    <h1>

                        Find scholarships

                        <span>
                            that support your goals.
                        </span>

                    </h1>


                    <p>
                        Explore scholarships and funding
                        opportunities from universities and
                        organizations around the world.
                    </p>


                    {/* Search + Filters */}

                    <div className="scholarships-toolbar">

                        <div className="scholarships-search">

                            <Search size={20} />

                            <input
                                type="search"
                                value={search}
                                onChange={(event) =>
                                    setSearch(
                                        event.target.value
                                    )
                                }
                                placeholder="Search scholarships, universities or countries..."
                                aria-label="Search scholarships"
                            />


                            {search && (
                                <button
                                    type="button"
                                    className="scholarships-search-clear"
                                    onClick={() =>
                                        setSearch("")
                                    }
                                    aria-label="Clear search"
                                >
                                    <X size={16} />
                                </button>
                            )}

                        </div>


                        {/* Filter */}

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
                                            <X size={17} />
                                        </button>

                                    </div>


                                    {/* Study Level */}

                                    <div className="scholarship-filter-group">

                                        <label htmlFor="study-level-filter">
                                            Study level
                                        </label>

                                        <select
                                            id="study-level-filter"
                                            value={studyLevel}
                                            onChange={(event) =>
                                                setStudyLevel(
                                                    event.target.value
                                                )
                                            }
                                        >

                                            <option value="all">
                                                All study levels
                                            </option>

                                            <option value="Bachelor's">
                                                Bachelor's
                                            </option>

                                            <option value="Master's">
                                                Master's
                                            </option>

                                            <option value="PhD">
                                                PhD
                                            </option>

                                        </select>

                                    </div>


                                    {/* Funding */}

                                    <div className="scholarship-filter-group">

                                        <label htmlFor="funding-filter">
                                            Funding type
                                        </label>

                                        <select
                                            id="funding-filter"
                                            value={fundingType}
                                            onChange={(event) =>
                                                setFundingType(
                                                    event.target.value
                                                )
                                            }
                                        >

                                            <option value="all">
                                                All funding types
                                            </option>

                                            <option value="Fully Funded">
                                                Fully funded
                                            </option>

                                            <option value="Partial Funding">
                                                Partial funding
                                            </option>

                                            <option value="Tuition Waiver">
                                                Tuition waiver
                                            </option>

                                        </select>

                                    </div>


                                    {/* Destination */}

                                    <div className="scholarship-filter-group">

                                        <label htmlFor="destination-filter">
                                            Destination
                                        </label>

                                        <select
                                            id="destination-filter"
                                            value={destination}
                                            onChange={(event) =>
                                                setDestination(
                                                    event.target.value
                                                )
                                            }
                                        >

                                            <option value="all">
                                                All destinations
                                            </option>

                                            {countries.map(
                                                (country) => (
                                                    <option
                                                        key={country}
                                                        value={country}
                                                    >
                                                        {country}
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
                                                clearFilters
                                            }
                                        >
                                            Clear all filters
                                        </button>
                                    )}

                                </div>
                            )}

                        </div>

                    </div>

                </div>

            </section>


            {/* =====================================================
                MAIN
            ====================================================== */}

            <main className="scholarships-main">

                {/* Results Toolbar */}

                <div className="scholarships-results-toolbar">

                    <div>

                        <span className="scholarships-result-label">
                            Scholarships
                        </span>

                        <h2>
                            Scholarships for you
                        </h2>

                    </div>


                    <div className="scholarships-results-right">

                        <p>

                            <strong>
                                {filteredScholarships.length}
                            </strong>

                            {" "}

                            {filteredScholarships.length === 1
                                ? "opportunity"
                                : "opportunities"}

                            {" found"}

                        </p>


                        <select
                            value={sortBy}
                            onChange={(event) =>
                                setSortBy(
                                    event.target.value
                                )
                            }
                            aria-label="Sort scholarships"
                        >

                            <option value="recommended">
                                Recommended
                            </option>

                            <option value="deadline">
                                Deadline
                            </option>

                            <option value="highest-funding">
                                Highest funding
                            </option>

                        </select>

                    </div>

                </div>


                {/* Results */}

                {filteredScholarships.length === 0 ? (

                    <div className="scholarships-empty">

                        <div className="scholarships-empty-icon">

                            <Search size={24} />

                        </div>


                        <h3>
                            No scholarships found
                        </h3>


                        <p>
                            Try changing your search or
                            removing some filters.
                        </p>


                        {hasFilters && (
                            <button
                                type="button"
                                onClick={clearFilters}
                            >
                                Clear filters
                            </button>
                        )}

                    </div>

                ) : (

                    <div className="scholarships-grid">

                        {filteredScholarships.map(
                            (scholarship) => (

                                <article
                                    className="scholarship-card"
                                    key={scholarship.id}
                                >

                                    {/* Card Top */}

                                    <div className="scholarship-card-top">

                                        <div className="scholarship-icon">

                                            <GraduationCap
                                                size={21}
                                            />

                                        </div>


                                        <button
                                            type="button"
                                            className="save-scholarship"
                                            aria-label={`Save ${scholarship.title}`}
                                        >

                                            <Heart size={17} />

                                        </button>

                                    </div>


                                    {/* Match */}

                                    <div className="scholarship-match">

                                        <CheckCircle2
                                            size={13}
                                        />

                                        {scholarship.match}% match

                                    </div>


                                    {/* Content */}

                                    <h2>
                                        {scholarship.title}
                                    </h2>


                                    <p className="scholarship-university">
                                        {scholarship.university}
                                    </p>


                                    <p className="scholarship-description">
                                        {scholarship.description}
                                    </p>


                                    {/* Meta */}

                                    <div className="scholarship-meta">

                                        <span>

                                            <Globe2 size={14} />

                                            {scholarship.country}

                                        </span>


                                        <span>

                                            <GraduationCap
                                                size={14}
                                            />

                                            {scholarship.degree}

                                        </span>


                                        <span>

                                            <CalendarDays
                                                size={14}
                                            />

                                            {scholarship.deadline}

                                        </span>

                                    </div>


                                    {/* Footer */}

                                    <div className="scholarship-footer">

                                        <div>

                                            <small>
                                                Funding
                                            </small>

                                            <strong>

                                                <DollarSign
                                                    size={14}
                                                />

                                                {scholarship.amount}

                                            </strong>

                                        </div>


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

            </main>

        </div>
    );
}


export default Scholarships;
