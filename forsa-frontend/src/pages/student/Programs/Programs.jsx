import {
    ArrowRight,
    GraduationCap,
    RotateCcw,
    Search,
    SlidersHorizontal,
    Sparkles,
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
    getUniversities,
    getUniversityPrograms,
} from "../../../api/universities";

import "./Programs.css";


/* =========================================================
   CONSTANTS
   ========================================================= */

const INITIAL_FILTERS = {
    country: "",
    degree: "",
    field: "",
};

const ACTIVE_STATUSES = [
    "active",
    "published",
];


/* =========================================================
   GENERIC HELPERS
   ========================================================= */

const getObjectName = (value, keys = []) => {
    if (typeof value === "string") {
        return value;
    }

    if (
        typeof value === "number" ||
        typeof value === "boolean"
    ) {
        return String(value);
    }

    if (!value || typeof value !== "object") {
        return "";
    }

    for (const key of keys) {
        const currentValue = value[key];

        if (
            currentValue !== undefined &&
            currentValue !== null &&
            currentValue !== ""
        ) {
            return String(currentValue);
        }
    }

    return "";
};


const getObjectId = (value) => {
    if (
        value &&
        typeof value === "object" &&
        value.id !== undefined &&
        value.id !== null
    ) {
        return String(value.id);
    }

    if (
        typeof value === "string" ||
        typeof value === "number"
    ) {
        return String(value);
    }

    return "";
};


/*
 * Prevent React from receiving an object as a child.
 */
const getDisplayValue = (value, keys = ["name", "title", "label", "value"]) => {
    if (
        value === undefined ||
        value === null
    ) {
        return "";
    }

    if (
        typeof value === "string" ||
        typeof value === "number" ||
        typeof value === "boolean"
    ) {
        return String(value);
    }

    if (Array.isArray(value)) {
        return value
            .map((item) =>
                getDisplayValue(item, keys)
            )
            .filter(Boolean)
            .join(", ");
    }

    if (typeof value === "object") {
        return getObjectName(value, keys);
    }

    return "";
};


const uniqueById = (items) => {
    const unique = new Map();

    items.forEach((item) => {
        const key =
            item.id ||
            item.name?.toLowerCase();

        if (key && !unique.has(key)) {
            unique.set(key, item);
        }
    });

    return [...unique.values()];
};


const sortByName = (items) =>
    [...items].sort((a, b) =>
        String(a.name || "").localeCompare(
            String(b.name || ""),
            undefined,
            {
                sensitivity: "base",
            }
        )
    );


const normalizeResponse = (response, keys = []) => {
    if (Array.isArray(response)) {
        return response;
    }

    for (const key of keys) {
        if (Array.isArray(response?.[key])) {
            return response[key];
        }

        if (Array.isArray(response?.data?.[key])) {
            return response.data[key];
        }
    }

    if (Array.isArray(response?.data?.data)) {
        return response.data.data;
    }

    if (Array.isArray(response?.data)) {
        return response.data;
    }

    return [];
};


/* =========================================================
   PROGRAM HELPERS
   ========================================================= */

const getProgramTitle = (program) =>
    getDisplayValue(
        program?.title ||
        program?.name ||
        program?.program_name,
        ["name", "title"]
    );


const getProgramFields = (program) => {
    if (Array.isArray(program?.fields)) {
        return program.fields;
    }

    return program?.field
        ? [program.field]
        : [];
};


const getFieldName = (field) =>
    getDisplayValue(
        field,
        [
            "name",
            "title",
            "field_name",
        ]
    );


const getProgramDegrees = (program) => {
    if (Array.isArray(program?.degrees)) {
        return program.degrees;
    }

    return program?.degree
        ? [program.degree]
        : [];
};


const getDegreeName = (degree) =>
    getDisplayValue(
        degree,
        [
            "name",
            "title",
            "degree_name",
        ]
    );


const getPrimaryField = (program) =>
    getFieldName(
        getProgramFields(program)[0]
    );


const getDegrees = (program) =>
    getProgramDegrees(program)
        .map(getDegreeName)
        .filter(Boolean);


const getProgramTypeName = (program) => {
    const type =
        program?.opportunity_type ||
        program?.opportunityType;

    if (!type) {
        return "";
    }

    return getDisplayValue(
        type,
        [
            "name",
            "title",
            "label",
            "value",
        ]
    );
};


const getProgramFundingName = (program) => {
    const funding =
        program?.funding_type ||
        program?.fundingType;

    if (!funding) {
        return "";
    }

    return getDisplayValue(
        funding,
        [
            "name",
            "title",
            "label",
            "value",
        ]
    );
};


const getProgramStudyMode = (program) => {
    const value =
        program?.study_mode ||
        program?.studyMode ||
        "";

    if (!value) {
        return "";
    }

    const displayValue =
        getDisplayValue(value);

    if (!displayValue) {
        return "";
    }

    return displayValue
        .replace(/_/g, " ")
        .replace(/\s+/g, " ")
        .trim()
        .replace(/\b\w/g, (char) =>
            char.toUpperCase()
        );
};


const getProgramDeadline = (program) =>
    program?.deadline ||
    program?.application_deadline ||
    program?.deadline_date ||
    null;


/* =========================================================
   LOCATION HELPERS
   ========================================================= */

const getCountryName = (program) => {
    if (typeof program?.country === "string") {
        return program.country;
    }

    return getDisplayValue(
        program?.country ||
        program?.university?.country,
        [
            "name",
            "title",
        ]
    );
};


const getCountryId = (program) => {
    const countryId =
        program?.country_id ??
        program?.country?.id ??
        program?.university?.country_id ??
        program?.university?.country?.id;

    return countryId !== undefined &&
        countryId !== null
        ? String(countryId)
        : "";
};


const getUniversityName = (program) => {
    return getDisplayValue(
        program?.university ||
        program?.university_name,
        [
            "name",
            "title",
        ]
    );
};


/* =========================================================
   STATUS HELPERS
   ========================================================= */

const getStatusValue = (item) => {
    const status = item?.status;

    if (
        status === undefined ||
        status === null
    ) {
        return "";
    }

    if (typeof status === "object") {
        return String(
            status?.value ||
            status?.name ||
            status?.title ||
            ""
        ).toLowerCase();
    }

    return String(status).toLowerCase();
};


const isActive = (item) => {
    const status = getStatusValue(item);

    return (
        !status ||
        ACTIVE_STATUSES.includes(status)
    );
};


/* =========================================================
   DATE
   ========================================================= */

const formatDate = (date) => {
    if (!date) {
        return "";
    }

    if (typeof date === "object") {
        return "";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
        return String(date);
    }

    return parsedDate.toLocaleDateString(
        undefined,
        {
            year: "numeric",
            month: "short",
            day: "numeric",
        }
    );
};


/* =========================================================
   FILTER OPTION HELPERS
   ========================================================= */

const buildOptions = (
    programs,
    getItems
) => {
    const values = [];

    programs.forEach((program) => {
        getItems(program).forEach((item) => {
            const name =
                getDisplayValue(
                    item,
                    [
                        "name",
                        "title",
                        "label",
                    ]
                );

            if (!name) {
                return;
            }

            values.push({
                id:
                    getObjectId(item) ||
                    name,
                name,
            });
        });
    });

    return sortByName(
        uniqueById(values)
    );
};


const getDegreeOptions = (program) =>
    getProgramDegrees(program)
        .map((degree) => ({
            id:
                getObjectId(degree) ||
                getDegreeName(degree),
            name: getDegreeName(degree),
        }))
        .filter((item) => item.name);


const getFieldOptions = (program) =>
    getProgramFields(program)
        .map((field) => ({
            id:
                getObjectId(field) ||
                getFieldName(field),
            name: getFieldName(field),
        }))
        .filter((item) => item.name);


/* =========================================================
   FILTER MATCHERS
   ========================================================= */

const matchesSelectedItem = (
    items,
    selectedValue,
    getName
) => {
    if (!selectedValue) {
        return true;
    }

    return items.some((item) => {
        const itemId =
            getObjectId(item);

        const itemName =
            getName(item);

        return (
            itemId === String(selectedValue) ||
            itemName === selectedValue
        );
    });
};


const matchesSearch = (
    program,
    query
) => {
    if (!query) {
        return true;
    }

    const searchableValues = [
        getProgramTitle(program),
        getUniversityName(program),
        getCountryName(program),
        getDisplayValue(program?.description),
        getProgramTypeName(program),
        getProgramFundingName(program),
        getProgramStudyMode(program),
        ...getProgramFields(program).map(
            getFieldName
        ),
        ...getDegrees(program),
    ];

    return searchableValues.some((value) =>
        String(value || "")
            .toLowerCase()
            .includes(query)
    );
};


/* =========================================================
   PROGRAMS PAGE
   ========================================================= */

function Programs() {
    const [programs, setPrograms] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [search, setSearch] =
        useState("");

    const [filters, setFilters] =
        useState(INITIAL_FILTERS);

    const [showFilters, setShowFilters] =
        useState(false);


    /* =====================================================
       LOAD PROGRAMS
       ===================================================== */

    useEffect(() => {
        let isMounted = true;

        const loadPrograms = async () => {
            setLoading(true);
            setError("");

            try {
                const universitiesResponse =
                    await getUniversities({
                        per_page: 100,
                    });

                if (!isMounted) {
                    return;
                }

                const universities =
                    normalizeResponse(
                        universitiesResponse,
                        ["universities"]
                    );

                const activeUniversities =
                    universities.filter(isActive);

                const results =
                    await Promise.all(
                        activeUniversities.map(
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
                                        normalizeResponse(
                                            response,
                                            ["programs"]
                                        );

                                    return universityPrograms
                                        .filter(isActive)
                                        .map(
                                            (program) => ({
                                                ...program,

                                                university:
                                                    program?.university ||
                                                    university,
                                            })
                                        );
                                } catch (programError) {
                                    console.error(
                                        `Failed to load programs for university ${university.id}:`,
                                        programError
                                    );

                                    return [];
                                }
                            }
                        )
                    );

                if (!isMounted) {
                    return;
                }

                const seenIds =
                    new Set();

                const uniquePrograms =
                    results
                        .flat()
                        .filter(
                            (program, index) => {
                                const id =
                                    program?.id !==
                                        undefined &&
                                        program?.id !== null
                                        ? String(
                                            program.id
                                        )
                                        : `program-${index}`;

                                if (
                                    seenIds.has(id)
                                ) {
                                    return false;
                                }

                                seenIds.add(id);

                                return true;
                            }
                        );

                setPrograms(
                    uniquePrograms
                );
            } catch (err) {
                console.error(
                    "Failed to load programs:",
                    err
                );

                if (!isMounted) {
                    return;
                }

                setPrograms([]);

                setError(
                    err?.response?.data?.message ||
                    "Unable to load programmes right now. Please try again."
                );
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        loadPrograms();

        return () => {
            isMounted = false;
        };
    }, []);


    /* =====================================================
       FILTER OPTIONS
       ===================================================== */

    const countries = useMemo(() => {
        const values =
            programs
                .map((program) => ({
                    id:
                        getCountryId(
                            program
                        ),
                    name:
                        getCountryName(
                            program
                        ),
                }))
                .filter(
                    (item) =>
                        item.name
                );

        return sortByName(
            uniqueById(values)
        );
    }, [programs]);


    const degrees = useMemo(
        () =>
            buildOptions(
                programs,
                getDegreeOptions
            ),
        [programs]
    );


    const fields = useMemo(
        () =>
            buildOptions(
                programs,
                getFieldOptions
            ),
        [programs]
    );


    /* =====================================================
       FILTERED PROGRAMS
       ===================================================== */

    const filteredPrograms =
        useMemo(() => {
            const query =
                search
                    .trim()
                    .toLowerCase();

            return programs.filter(
                (program) => {
                    if (
                        !matchesSearch(
                            program,
                            query
                        )
                    ) {
                        return false;
                    }

                    const selectedCountry =
                        filters.country;

                    const countryMatches =
                        !selectedCountry ||
                        getCountryId(
                            program
                        ) ===
                        String(
                            selectedCountry
                        ) ||
                        getCountryName(
                            program
                        ) ===
                        selectedCountry;

                    if (
                        !countryMatches
                    ) {
                        return false;
                    }

                    const degreeMatches =
                        matchesSelectedItem(
                            getProgramDegrees(
                                program
                            ),
                            filters.degree,
                            getDegreeName
                        );

                    if (
                        !degreeMatches
                    ) {
                        return false;
                    }

                    return matchesSelectedItem(
                        getProgramFields(
                            program
                        ),
                        filters.field,
                        getFieldName
                    );
                }
            );
        }, [
            programs,
            search,
            filters,
        ]);


    /* =====================================================
       FILTER ACTIONS
       ===================================================== */

    const resetFilters = () => {
        setSearch("");
        setFilters(INITIAL_FILTERS);
    };


    const updateFilter = (
        filterName,
        value
    ) => {
        setFilters(
            (previous) => ({
                ...previous,
                [filterName]: value,
            })
        );
    };


    const hasFilters =
        Boolean(search.trim()) ||
        Object.values(filters)
            .some(Boolean);


    /* =====================================================
       RENDER
       ===================================================== */

    return (
        <div className="programs-page">

            <section className="programs-header">

                <div className="programs-header-content">

                    <div className="programs-eyebrow">
                        <Sparkles size={14} />
                        Explore Programmes
                    </div>

                    <h1>
                        Find your next programme
                    </h1>

                    <p>
                        Explore published study
                        programmes from universities
                        around the world.
                    </p>

                </div>


                <div className="programs-search-section">

                    <div className="programs-search">

                        <Search size={18} />

                        <input
                            type="search"
                            placeholder="Search programmes, universities or countries..."
                            value={search}
                            onChange={(event) =>
                                setSearch(
                                    event.target.value
                                )
                            }
                            aria-label="Search programmes"
                        />

                    </div>


                    <div className="programs-filter-wrapper">

                        <button
                            type="button"
                            className={`programs-filter-button ${showFilters
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
                            aria-controls="programs-filters"
                        >
                            <SlidersHorizontal
                                size={16}
                            />

                            Filters
                        </button>


                        {showFilters && (
                            <div
                                id="programs-filters"
                                className="programs-filter-dropdown"
                            >

                                <div className="programs-filter-dropdown-header">

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
                                        className="programs-filter-dropdown-close"
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


                                <div className="program-filter-group">

                                    <label htmlFor="program-country-filter">
                                        Country
                                    </label>

                                    <select
                                        id="program-country-filter"
                                        value={
                                            filters.country
                                        }
                                        onChange={(event) =>
                                            updateFilter(
                                                "country",
                                                event.target.value
                                            )
                                        }
                                    >
                                        <option value="">
                                            All countries
                                        </option>

                                        {countries.map(
                                            (country) => (
                                                <option
                                                    key={
                                                        country.id ||
                                                        country.name
                                                    }
                                                    value={
                                                        country.id ||
                                                        country.name
                                                    }
                                                >
                                                    {country.name}
                                                </option>
                                            )
                                        )}
                                    </select>

                                </div>


                                <div className="program-filter-group">

                                    <label htmlFor="program-degree-filter">
                                        Degree
                                    </label>

                                    <select
                                        id="program-degree-filter"
                                        value={
                                            filters.degree
                                        }
                                        onChange={(event) =>
                                            updateFilter(
                                                "degree",
                                                event.target.value
                                            )
                                        }
                                    >
                                        <option value="">
                                            All degrees
                                        </option>

                                        {degrees.map(
                                            (degree) => (
                                                <option
                                                    key={
                                                        degree.id ||
                                                        degree.name
                                                    }
                                                    value={
                                                        degree.id ||
                                                        degree.name
                                                    }
                                                >
                                                    {degree.name}
                                                </option>
                                            )
                                        )}
                                    </select>

                                </div>


                                <div className="program-filter-group">

                                    <label htmlFor="program-field-filter">
                                        Field
                                    </label>

                                    <select
                                        id="program-field-filter"
                                        value={
                                            filters.field
                                        }
                                        onChange={(event) =>
                                            updateFilter(
                                                "field",
                                                event.target.value
                                            )
                                        }
                                    >
                                        <option value="">
                                            All fields
                                        </option>

                                        {fields.map(
                                            (field) => (
                                                <option
                                                    key={
                                                        field.id ||
                                                        field.name
                                                    }
                                                    value={
                                                        field.id ||
                                                        field.name
                                                    }
                                                >
                                                    {field.name}
                                                </option>
                                            )
                                        )}
                                    </select>

                                </div>


                                {hasFilters && (
                                    <button
                                        type="button"
                                        className="programs-clear-filters"
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

            </section>


            <main className="programs-main">

                <div className="programs-toolbar">

                    <div>

                        <span className="programs-result-label">
                            Programmes
                        </span>

                        <h2>
                            Explore study programmes
                        </h2>

                    </div>


                    {!loading &&
                        !error && (
                            <div className="programs-results-top">

                                <p>
                                    <strong>
                                        {
                                            filteredPrograms.length
                                        }
                                    </strong>

                                    {" "}

                                    {
                                        filteredPrograms.length ===
                                            1
                                            ? "programme"
                                            : "programmes"
                                    }

                                    {" found"}
                                </p>

                            </div>
                        )}

                </div>


                <div
                    className="programs-results"
                    aria-live="polite"
                >

                    {loading && (
                        <ProgramSkeleton />
                    )}


                    {!loading &&
                        error && (
                            <div className="programs-empty">

                                <div className="programs-empty-icon">
                                    <GraduationCap
                                        size={24}
                                    />
                                </div>

                                <h3>
                                    Unable to load programmes
                                </h3>

                                <p>
                                    {error}
                                </p>

                            </div>
                        )}


                    {!loading &&
                        !error &&
                        filteredPrograms.length ===
                        0 && (
                            <div className="programs-empty">

                                <div className="programs-empty-icon">
                                    <Search
                                        size={24}
                                    />
                                </div>

                                <h3>
                                    No programmes found
                                </h3>

                                <p>
                                    {hasFilters
                                        ? "Try changing your search or removing some filters."
                                        : "There are no programmes available right now."}
                                </p>

                                {hasFilters && (
                                    <button
                                        type="button"
                                        onClick={
                                            resetFilters
                                        }
                                    >
                                        Clear filters
                                    </button>
                                )}

                            </div>
                        )}


                    {!loading &&
                        !error &&
                        filteredPrograms.length >
                        0 && (
                            <div className="programs-grid">

                                {filteredPrograms
                                    .filter(
                                        (program) =>
                                            program?.id &&
                                            getProgramTitle(
                                                program
                                            )
                                    )
                                    .map(
                                        (
                                            program
                                        ) => (
                                            <ProgramCard
                                                key={
                                                    program.id
                                                }
                                                program={
                                                    program
                                                }
                                            />
                                        )
                                    )}

                            </div>
                        )}

                </div>

            </main>

        </div>
    );
}


/* =========================================================
   PROGRAM CARD
   ========================================================= */

function ProgramCard({
    program,
}) {
    const title =
        getProgramTitle(program);

    const university =
        getUniversityName(program);

    const country =
        getCountryName(program);

    const primaryField =
        getPrimaryField(program);

    const degrees =
        getDegrees(program);

    const programType =
        getProgramTypeName(program);

    const funding =
        getProgramFundingName(program);

    const studyMode =
        getProgramStudyMode(program);

    const deadline =
        getProgramDeadline(program);

    const description =
        getDisplayValue(
            program?.description
        );


    return (
        <article className="program-card">

            <div className="program-card-top">

                <div className="program-card-top-main">

                    <div className="program-card-icon">
                        <GraduationCap
                            size={22}
                        />
                    </div>

                    <div className="program-card-heading">

                        {university && (
                            <span className="program-card-university">
                                {university}
                            </span>
                        )}

                        <h3>
                            {title}
                        </h3>

                    </div>

                </div>

            </div>


            <div className="program-card-body">

                {description && (
                    <p className="program-card-description">
                        {description}
                    </p>
                )}

            </div>


            <div className="program-card-meta">

                {primaryField && (
                    <span>
                        {getDisplayValue(
                            primaryField
                        )}
                    </span>
                )}

                {degrees.length > 0 && (
                    <span>
                        {getDisplayValue(
                            degrees[0]
                        )}
                    </span>
                )}

                {country && (
                    <span>
                        {getDisplayValue(
                            country
                        )}
                    </span>
                )}

                {studyMode && (
                    <span>
                        {getDisplayValue(
                            studyMode
                        )}
                    </span>
                )}

            </div>


            <div className="program-card-footer">

                <div className="program-card-footer-info">

                    {programType && (
                        <span>
                            {getDisplayValue(
                                programType
                            )}
                        </span>
                    )}

                    {funding && (
                        <span>
                            {getDisplayValue(
                                funding
                            )}
                        </span>
                    )}

                    {deadline && (
                        <span className="program-card-deadline">
                            Deadline:{" "}
                            {formatDate(
                                deadline
                            )}
                        </span>
                    )}

                </div>


                <Link
                    to={`/student/programs/${program.id}`}
                    className="program-card-view"
                >
                    <span>
                        View programme
                    </span>

                    <ArrowRight
                        size={15}
                    />
                </Link>

            </div>

        </article>
    );
}


/* =========================================================
   PROGRAM SKELETON
   ========================================================= */

function ProgramSkeleton() {
    return (
        <div className="programs-grid">

            {Array.from({
                length: 6,
            }).map(
                (_, index) => (
                    <article
                        className="program-card program-card-skeleton"
                        key={index}
                    >

                        <div className="program-card-top">

                            <div className="program-card-top-main">

                                <div className="skeleton-program-icon" />

                                <div className="skeleton-program-heading">

                                    <div className="skeleton-line small" />

                                    <div className="skeleton-line title" />

                                    <div className="skeleton-line location" />

                                </div>

                            </div>

                        </div>


                        <div className="program-card-body">

                            <div className="skeleton-line description" />

                            <div className="skeleton-line description short" />

                        </div>


                        <div className="program-card-meta">

                            <div className="skeleton-meta" />

                            <div className="skeleton-meta small-meta" />

                        </div>


                        <div className="program-card-footer">

                            <div className="skeleton-footer-line" />

                        </div>

                    </article>
                )
            )}

        </div>
    );
}


export default Programs;
