import {
    Search,
    MapPin,
    GraduationCap,
    Building2,
    ArrowRight,
    SlidersHorizontal,
    Globe2,
    X,
    ExternalLink,
} from "lucide-react";

import {
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    Link,
} from "react-router-dom";

import {
    getUniversities,
} from "../../../api/universities";

import "./Universities.css";
import LoadingScreen from "../../../components/LoadingScreen";


/*
|--------------------------------------------------------------------------
| Helpers
|--------------------------------------------------------------------------
*/

const getCountryName = (university) =>
    university?.country?.name || "";


const getUniversityName = (university) =>
    university?.name || "";


const getUniversityInitial = (university) => {
    const name = getUniversityName(university).trim();

    return name ? name.charAt(0).toUpperCase() : "";
};


const getOpportunitiesCount = (university) => {
    const value = university?.opportunities_count;

    if (value === undefined || value === null) {
        return 0;
    }

    const count = Number(value);

    return Number.isNaN(count) ? 0 : count;
};


const normalizeUniversitiesResponse = (response) => {
    if (Array.isArray(response)) {
        return response;
    }

    if (Array.isArray(response?.universities)) {
        return response.universities;
    }

    if (Array.isArray(response?.data?.universities)) {
        return response.data.universities;
    }

    if (Array.isArray(response?.data?.data)) {
        return response.data.data;
    }

    if (Array.isArray(response?.data)) {
        return response.data;
    }

    return [];
};


const isActiveUniversity = (university) => {
    if (
        university?.status === undefined ||
        university?.status === null
    ) {
        return true;
    }

    return university.status === "active";
};


/*
|--------------------------------------------------------------------------
| Universities Page
|--------------------------------------------------------------------------
*/

function Universities() {
    const [universities, setUniversities] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [search, setSearch] = useState("");

    const [country, setCountry] = useState("all");

    const [showFilters, setShowFilters] = useState(false);


    /*
    |--------------------------------------------------------------------------
    | Load Universities
    |--------------------------------------------------------------------------
    */

    useEffect(() => {
        let isMounted = true;

        const loadUniversities = async () => {
            setLoading(true);
            setError("");

            try {
                const response = await getUniversities();

                if (!isMounted) {
                    return;
                }

                const data =
                    normalizeUniversitiesResponse(response);

                const activeUniversities =
                    data.filter(isActiveUniversity);

                setUniversities(activeUniversities);
            } catch (err) {
                console.error(
                    "Failed to load universities:",
                    err
                );

                if (!isMounted) {
                    return;
                }

                setUniversities([]);

                setError(
                    err?.response?.data?.message ||
                    "Unable to load universities right now. Please try again."
                );
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        loadUniversities();

        return () => {
            isMounted = false;
        };
    }, []);


    /*
    |--------------------------------------------------------------------------
    | Countries
    |--------------------------------------------------------------------------
    */

    const countries = useMemo(() => {
        const countryNames = universities
            .map(getCountryName)
            .filter(Boolean);

        return [...new Set(countryNames)].sort(
            (a, b) =>
                a.localeCompare(
                    b,
                    undefined,
                    {
                        sensitivity: "base",
                    }
                )
        );
    }, [universities]);


    /*
    |--------------------------------------------------------------------------
    | Filtered Universities
    |--------------------------------------------------------------------------
    */

    const filteredUniversities = useMemo(() => {
        const query = search.trim().toLowerCase();

        return universities.filter((university) => {
            const name =
                getUniversityName(university).toLowerCase();

            const universityCountry =
                getCountryName(university);

            const countrySearchValue =
                universityCountry.toLowerCase();

            const matchesSearch =
                !query ||
                name.includes(query) ||
                countrySearchValue.includes(query);

            const matchesCountry =
                country === "all" ||
                universityCountry === country;

            return matchesSearch && matchesCountry;
        });
    }, [
        universities,
        search,
        country,
    ]);


    /*
    |--------------------------------------------------------------------------
    | Filters
    |--------------------------------------------------------------------------
    */

    const hasFilters =
        Boolean(search.trim()) ||
        country !== "all";


    const clearFilters = () => {
        setSearch("");
        setCountry("all");
    };

    if (loading) {
        return <LoadingScreen />;
    }


    /*
    |--------------------------------------------------------------------------
    | Render
    |--------------------------------------------------------------------------
    */

    return (
        <div className="universities-page">

            {/* =====================================================
                HERO
            ====================================================== */}

            <section className="universities-hero">

                <div className="universities-hero-content">

                    <span className="universities-eyebrow">
                        <Globe2 size={15} />
                        Explore Universities
                    </span>

                    <h1>
                        Find a university
                        <span>
                            that fits your future.
                        </span>
                    </h1>

                    <p>
                        Explore universities from different
                        countries and discover institutions
                        that match your academic goals.
                    </p>


                    {/* Search */}

                    <div className="universities-toolbar">

                        <div className="universities-search">

                            <Search size={20} />

                            <input
                                type="search"
                                value={search}
                                onChange={(event) =>
                                    setSearch(event.target.value)
                                }
                                placeholder="Search universities..."
                                aria-label="Search universities"
                            />

                            {search && (
                                <button
                                    type="button"
                                    className="universities-search-clear"
                                    onClick={() =>
                                        setSearch("")
                                    }
                                    aria-label="Clear search"
                                >
                                    <X size={16} />
                                </button>
                            )}

                        </div>


                        {/* Filter Button */}

                        <div className="universities-filter-wrapper">

                            <button
                                type="button"
                                className={`universities-filter-button ${showFilters ? "is-active" : ""
                                    }`}
                                onClick={() =>
                                    setShowFilters(
                                        (previous) => !previous
                                    )
                                }
                                aria-expanded={showFilters}
                                aria-controls="universities-filters"
                            >
                                <SlidersHorizontal size={16} />
                                Filters
                            </button>


                            {/* Filter Dropdown */}

                            {showFilters && (
                                <div
                                    id="universities-filters"
                                    className="universities-filter-dropdown"
                                >

                                    <div className="universities-filter-dropdown-header">

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
                                            onClick={() =>
                                                setShowFilters(false)
                                            }
                                            className="universities-filter-dropdown-close"
                                            aria-label="Close filters"
                                        >
                                            <X size={17} />
                                        </button>

                                    </div>


                                    {/* Country Filter */}

                                    <div className="university-filter-group">

                                        <label htmlFor="country-filter">
                                            Country
                                        </label>

                                        <select
                                            id="country-filter"
                                            value={country}
                                            onChange={(event) =>
                                                setCountry(
                                                    event.target.value
                                                )
                                            }
                                        >

                                            <option value="all">
                                                All countries
                                            </option>

                                            {countries.map((item) => (
                                                <option
                                                    key={item}
                                                    value={item}
                                                >
                                                    {item}
                                                </option>
                                            ))}

                                        </select>

                                    </div>


                                    {/* Clear Filters */}

                                    {hasFilters && (
                                        <button
                                            type="button"
                                            className="universities-clear-filters"
                                            onClick={clearFilters}
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

            <main className="universities-main">

                {/* Toolbar */}

                <div className="universities-toolbar">

                    <div>

                        <span className="universities-result-label">
                            Universities
                        </span>

                        <h2>
                            Explore institutions
                        </h2>

                    </div>


                    {!loading && !error && (
                        <div className="universities-results-top">

                            <p>

                                <strong>
                                    {filteredUniversities.length}
                                </strong>

                                {" "}

                                {filteredUniversities.length === 1
                                    ? "university"
                                    : "universities"}

                                {" found"}

                            </p>

                        </div>
                    )}

                </div>


                {/* Results */}

                <div className="universities-layout">

                    <section
                        className="universities-results"
                        aria-live="polite"
                    >

                        {/* =================================================
                            LOADING
                        ================================================== */}

                        {loading && (
                            <div className="universities-grid">

                                {Array.from({ length: 6 }).map(
                                    (_, index) => (
                                        <article
                                            className="university-card university-card-skeleton"
                                            key={index}
                                        >

                                            <div className="university-card-top">

                                                <div className="university-card-top-main">

                                                    <div className="skeleton-logo" />

                                                    <div className="skeleton-top-content">

                                                        <div className="skeleton-line small" />

                                                        <div className="skeleton-line title" />

                                                        <div className="skeleton-line location" />

                                                    </div>

                                                </div>

                                            </div>


                                            <div className="university-card-body">

                                                <div className="skeleton-line description" />

                                                <div className="skeleton-line description short" />

                                            </div>


                                            <div className="university-card-meta">

                                                <div className="skeleton-meta" />

                                            </div>


                                            <div className="university-card-footer">

                                                <div className="skeleton-footer-line" />

                                            </div>

                                        </article>
                                    )
                                )}

                            </div>
                        )}


                        {/* =================================================
                            ERROR
                        ================================================== */}

                        {!loading && error && (
                            <div className="universities-empty">

                                <div className="universities-empty-icon">
                                    <Building2 size={24} />
                                </div>

                                <h3>
                                    Unable to load universities
                                </h3>

                                <p>
                                    {error}
                                </p>

                            </div>
                        )}


                        {/* =================================================
                            EMPTY
                        ================================================== */}

                        {!loading &&
                            !error &&
                            filteredUniversities.length === 0 && (
                                <div className="universities-empty">

                                    <div className="universities-empty-icon">
                                        <Search size={24} />
                                    </div>

                                    <h3>
                                        No universities found
                                    </h3>

                                    <p>
                                        {hasFilters
                                            ? "Try changing your search or removing some filters."
                                            : "There are no universities available right now."
                                        }
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
                            )}


                        {/* =================================================
                            UNIVERSITIES
                        ================================================== */}

                        {!loading &&
                            !error &&
                            filteredUniversities.length > 0 && (

                                <div className="universities-grid">

                                    {filteredUniversities
                                        .filter(
                                            (university) =>
                                                university?.id &&
                                                getUniversityName(university)
                                        )
                                        .map((university) => {

                                            const id =
                                                university.id;

                                            const name =
                                                getUniversityName(
                                                    university
                                                );

                                            const initial =
                                                getUniversityInitial(
                                                    university
                                                );

                                            const universityCountry =
                                                getCountryName(
                                                    university
                                                );

                                            const opportunitiesCount =
                                                getOpportunitiesCount(
                                                    university
                                                );

                                            const description =
                                                university?.description ||
                                                "";

                                            const website =
                                                university?.website ||
                                                null;


                                            return (
                                                <article
                                                    className="university-card"
                                                    key={id}
                                                >

                                                    {/* Card Top */}

                                                    <div className="university-card-top">

                                                        <div className="university-card-top-main">

                                                            {/* Logo */}

                                                            <div className="university-card-logo">

                                                                {university?.logo ? (
                                                                    <img
                                                                        src={university.logo}
                                                                        alt={`${name} logo`}
                                                                        loading="lazy"
                                                                        onError={(event) => {
                                                                            event.currentTarget.style.display =
                                                                                "none";
                                                                        }}
                                                                    />
                                                                ) : (
                                                                    initial && (
                                                                        <span>
                                                                            {initial}
                                                                        </span>
                                                                    )
                                                                )}

                                                            </div>


                                                            {/* Heading */}

                                                            <div className="university-card-heading">

                                                                <h2>
                                                                    {name}
                                                                </h2>

                                                                {universityCountry && (
                                                                    <div className="university-card-country">

                                                                        <MapPin size={13} />

                                                                        <span>
                                                                            {
                                                                                universityCountry
                                                                            }
                                                                        </span>

                                                                    </div>
                                                                )}

                                                            </div>

                                                        </div>

                                                    </div>


                                                    {/* Card Body */}

                                                    <div className="university-card-body">

                                                        {description && (
                                                            <p className="university-card-description">
                                                                {description}
                                                            </p>
                                                        )}

                                                    </div>


                                                    {/* Meta */}

                                                    <div className="university-card-meta">

                                                        <span>

                                                            <GraduationCap size={14} />

                                                            {opportunitiesCount}

                                                            {" "}

                                                            {opportunitiesCount === 1
                                                                ? "Opportunity"
                                                                : "Opportunities"}

                                                        </span>

                                                    </div>


                                                    {/* Footer */}

                                                    <div className="university-card-footer">

                                                        <Link
                                                            to={`/student/universities/${id}`}
                                                            className="university-card-view"
                                                        >

                                                            <span>
                                                                View university
                                                            </span>

                                                            <ArrowRight size={15} />

                                                        </Link>


                                                        {website && (
                                                            <a
                                                                href={website}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="university-website-link"
                                                                aria-label={`Visit ${name} website`}
                                                            >
                                                                <ExternalLink size={15} />
                                                            </a>
                                                        )}

                                                    </div>

                                                </article>
                                            );
                                        })}

                                </div>
                            )}

                    </section>

                </div>

            </main>

        </div>
    );
}


export default Universities;
