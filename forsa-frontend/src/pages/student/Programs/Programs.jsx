import {
    Search,
    SlidersHorizontal,
    GraduationCap,
    ArrowRight,
    Sparkles,
    RotateCcw,
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
   HELPERS
   ========================================================= */

const getProgramTitle = (program) => {
    if (!program) return "";

    return (
        program.title ||
        program.name ||
        program.program_name ||
        ""
    );
};


const getProgramFields = (program) => {
    if (!program) return [];

    if (Array.isArray(program.fields)) {
        return program.fields;
    }

    if (program.field) {
        return [program.field];
    }

    return [];
};


const getFieldName = (field) => {
    if (!field) return "";

    if (typeof field === "string") {
        return field;
    }

    return (
        field.name ||
        field.title ||
        field.field_name ||
        ""
    );
};


const getPrimaryField = (program) => {
    return getProgramFields(program)
        .map(getFieldName)
        .find(Boolean) || "";
};


/* =========================================================
   DEGREES
   ========================================================= */

const getProgramDegrees = (program) => {
    if (!program) return [];

    if (Array.isArray(program.degrees)) {
        return program.degrees;
    }

    if (program.degree) {
        return [program.degree];
    }

    return [];
};


const getDegreeName = (degree) => {
    if (!degree) return "";

    if (typeof degree === "string") {
        return degree;
    }

    return (
        degree.name ||
        degree.title ||
        degree.degree_name ||
        ""
    );
};


const getDegrees = (program) => {
    return getProgramDegrees(program)
        .map(getDegreeName)
        .filter(Boolean);
};


/* =========================================================
   PROGRAM TYPE
   ========================================================= */

const getProgramTypeName = (program) => {
    if (!program) return "";

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


/* =========================================================
   FUNDING
   ========================================================= */

const getProgramFundingName = (program) => {
    if (!program) return "";

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


/* =========================================================
   STUDY MODE
   ========================================================= */

const getProgramStudyMode = (program) => {
    if (!program?.study_mode) return "";

    return String(program.study_mode)
        .replaceAll("_", " ")
        .replace(/\b\w/g, (letter) => letter.toUpperCase());
};


/* =========================================================
   DEADLINE
   ========================================================= */

const getProgramDeadline = (program) => {
    if (!program) return null;

    return (
        program.deadline ||
        program.application_deadline ||
        program.deadline_date ||
        null
    );
};


const formatDate = (date) => {
    if (!date) return "";

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
   COUNTRY
   ========================================================= */

const getCountryName = (program) => {
    if (!program) return "";

    if (typeof program.country === "string") {
        return program.country;
    }

    return (
        program.country?.name ||
        program.country_name ||
        program.university?.country?.name ||
        ""
    );
};


const getCountryId = (program) => {
    if (!program) return "";

    if (
        typeof program.country === "object" &&
        program.country?.id
    ) {
        return program.country.id;
    }

    if (
        typeof program.university?.country === "object" &&
        program.university.country?.id
    ) {
        return program.university.country.id;
    }

    return (
        program.country_id ||
        program.university?.country_id ||
        ""
    );
};


/* =========================================================
   UNIVERSITY
   ========================================================= */

const getUniversityName = (program) => {
    if (!program) return "";

    if (typeof program.university === "string") {
        return program.university;
    }

    return (
        program.university?.name ||
        program.university_name ||
        ""
    );
};


/* =========================================================
   STATUS
   ========================================================= */

const getStatusValue = (value) => {
    if (!value) return "";

    if (typeof value === "string") {
        return value.toLowerCase();
    }

    if (typeof value === "object") {
        return String(
            value.value ||
            value.name ||
            value.status ||
            ""
        ).toLowerCase();
    }

    return "";
};


/* =========================================================
   RESPONSE NORMALIZATION
   ========================================================= */

const normalizeUniversitiesResponse = (response) => {
    if (!response) return [];

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

    return [];
};


const normalizeProgramsResponse = (response) => {
    if (!response) return [];

    if (Array.isArray(response.programs)) {
        return response.programs;
    }

    if (Array.isArray(response.data?.programs)) {
        return response.data.programs;
    }

    if (Array.isArray(response.data?.data)) {
        return response.data.data;
    }

    if (Array.isArray(response.data)) {
        return response.data;
    }

    if (Array.isArray(response.items)) {
        return response.items;
    }

    if (Array.isArray(response)) {
        return response;
    }

    return [];
};


/* =========================================================
   COMPONENT
   ========================================================= */

function Programs() {
    const [programs, setPrograms] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [search, setSearch] = useState("");

    const [filters, setFilters] = useState({
        country: "",
        degree: "",
        field: "",
    });

    const [showFilters, setShowFilters] = useState(false);


    /* =========================================================
       LOAD PROGRAMS
       ========================================================= */

    useEffect(() => {
        let mounted = true;

        const fetchPrograms = async () => {
            try {
                setLoading(true);
                setError("");

                const universitiesResponse =
                    await getUniversities({
                        per_page: 100,
                    });

                const universities =
                    normalizeUniversitiesResponse(
                        universitiesResponse
                    );

                const activeUniversities =
                    universities.filter((university) => {
                        const status =
                            getStatusValue(
                                university?.status
                            );

                        return (
                            !status ||
                            status === "active" ||
                            status === "published"
                        );
                    });

                const responses = await Promise.all(
                    activeUniversities.map(
                        async (university) => {
                            if (!university?.id) {
                                return [];
                            }

                            try {
                                const response =
                                    await getUniversityPrograms(
                                        university.id,
                                        {
                                            per_page: 100,
                                        }
                                    );

                                return normalizeProgramsResponse(
                                    response
                                ).map((program) => {
                                    if (program?.university) {
                                        return program;
                                    }

                                    return {
                                        ...program,
                                        university,
                                    };
                                });
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

                const validPrograms = responses
                    .flat()
                    .filter((program) => {
                        if (
                            !program?.id ||
                            !getProgramTitle(program)
                        ) {
                            return false;
                        }

                        const status =
                            getStatusValue(
                                program.status
                            );

                        return (
                            !status ||
                            status === "active" ||
                            status === "published"
                        );
                    });

                const uniquePrograms = Array.from(
                    new Map(
                        validPrograms.map((program) => [
                            String(program.id),
                            program,
                        ])
                    ).values()
                );

                if (mounted) {
                    setPrograms(uniquePrograms);
                }
            } catch (err) {
                console.error(
                    "Failed to load programs:",
                    err
                );

                if (mounted) {
                    setError(
                        err?.response?.data?.message ||
                        "Unable to load programmes."
                    );
                }
            } finally {
                if (mounted) {
                    setLoading(false);
                }
            }
        };

        fetchPrograms();

        return () => {
            mounted = false;
        };
    }, []);


    /* =========================================================
       COUNTRIES
       ========================================================= */

    const countries = useMemo(() => {
        const countryMap = new Map();

        programs.forEach((program) => {
            const id = getCountryId(program);
            const name = getCountryName(program);

            if (id && name) {
                countryMap.set(String(id), {
                    id,
                    name,
                });
            }
        });

        return Array.from(countryMap.values()).sort(
            (a, b) =>
                String(a.name).localeCompare(
                    String(b.name)
                )
        );
    }, [programs]);


    /* =========================================================
       DEGREES
       ========================================================= */

    const degrees = useMemo(() => {
        const degreeMap = new Map();

        programs.forEach((program) => {
            getProgramDegrees(program).forEach(
                (degree) => {
                    const name =
                        getDegreeName(degree);

                    const id =
                        typeof degree === "object"
                            ? degree?.id
                            : name;

                    if (id && name) {
                        degreeMap.set(
                            String(id),
                            {
                                id,
                                name,
                            }
                        );
                    }
                }
            );
        });

        return Array.from(degreeMap.values()).sort(
            (a, b) =>
                String(a.name).localeCompare(
                    String(b.name)
                )
        );
    }, [programs]);


    /* =========================================================
       FIELDS
       ========================================================= */

    const fields = useMemo(() => {
        const fieldMap = new Map();

        programs.forEach((program) => {
            getProgramFields(program).forEach(
                (field) => {
                    const name =
                        getFieldName(field);

                    const id =
                        typeof field === "object"
                            ? field?.id
                            : name;

                    if (id && name) {
                        fieldMap.set(
                            String(id),
                            {
                                id,
                                name,
                            }
                        );
                    }
                }
            );
        });

        return Array.from(fieldMap.values()).sort(
            (a, b) =>
                String(a.name).localeCompare(
                    String(b.name)
                )
        );
    }, [programs]);


    /* =========================================================
       FILTERED PROGRAMS
       ========================================================= */

    const filteredPrograms = useMemo(() => {
        const searchValue =
            search.trim().toLowerCase();

        return programs.filter((program) => {
            const title =
                getProgramTitle(program).toLowerCase();

            const university =
                getUniversityName(program).toLowerCase();

            const country =
                getCountryName(program).toLowerCase();

            const description =
                String(
                    program.description || ""
                ).toLowerCase();

            const fieldsText =
                getProgramFields(program)
                    .map(getFieldName)
                    .join(" ")
                    .toLowerCase();

            const degreesText =
                getProgramDegrees(program)
                    .map(getDegreeName)
                    .join(" ")
                    .toLowerCase();

            const type =
                getProgramTypeName(
                    program
                ).toLowerCase();

            const funding =
                getProgramFundingName(
                    program
                ).toLowerCase();

            const studyMode =
                getProgramStudyMode(
                    program
                ).toLowerCase();

            const matchesSearch =
                !searchValue ||
                title.includes(searchValue) ||
                university.includes(searchValue) ||
                country.includes(searchValue) ||
                description.includes(searchValue) ||
                fieldsText.includes(searchValue) ||
                degreesText.includes(searchValue) ||
                type.includes(searchValue) ||
                funding.includes(searchValue) ||
                studyMode.includes(searchValue);

            const matchesCountry =
                !filters.country ||
                String(
                    getCountryId(program)
                ) === String(
                    filters.country
                );

            const matchesDegree =
                !filters.degree ||
                getProgramDegrees(program).some(
                    (degree) => {
                        const degreeId =
                            typeof degree === "object"
                                ? degree?.id
                                : degree;

                        return (
                            String(degreeId) ===
                            String(filters.degree)
                        );
                    }
                );

            const matchesField =
                !filters.field ||
                getProgramFields(program).some(
                    (field) => {
                        const fieldId =
                            typeof field === "object"
                                ? field?.id
                                : field;

                        return (
                            String(fieldId) ===
                            String(filters.field)
                        );
                    }
                );

            return (
                matchesSearch &&
                matchesCountry &&
                matchesDegree &&
                matchesField
            );
        });
    }, [
        programs,
        search,
        filters,
    ]);


    /* =========================================================
       RESET
       ========================================================= */

    const resetFilters = () => {
        setSearch("");

        setFilters({
            country: "",
            degree: "",
            field: "",
        });
    };


    /* =========================================================
       RENDER
       ========================================================= */

    return (
        <div className="programs-page">

            {/* =====================================================
                HEADER
            ====================================================== */}

            <section className="programs-header">

                <div>

                    <div className="programs-eyebrow">
                        <Sparkles size={14} />
                        EXPLORE PROGRAMMES
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


                {/* SEARCH */}

                <section className="programs-search-section">

                    <div className="programs-search">

                        <Search size={18} />

                        <input
                            type="text"
                            placeholder="Search programmes, universities or countries..."
                            value={search}
                            onChange={(event) =>
                                setSearch(
                                    event.target.value
                                )
                            }
                        />

                    </div>


                    <button
                        type="button"
                        className="programs-filter-button"
                        onClick={() =>
                            setShowFilters(
                                (current) => !current
                            )
                        }
                    >
                        <SlidersHorizontal size={16} />
                        Filters
                    </button>

                </section>

            </section>


            {/* =====================================================
                FILTERS
            ====================================================== */}

            <section
                className={`programs-filters ${showFilters
                        ? "visible"
                        : ""
                    }`}
            >

                <select
                    value={filters.country}
                    onChange={(event) =>
                        setFilters((current) => ({
                            ...current,
                            country:
                                event.target.value,
                        }))
                    }
                >
                    <option value="">
                        All countries
                    </option>

                    {countries.map((country) => (
                        <option
                            key={country.id}
                            value={country.id}
                        >
                            {country.name}
                        </option>
                    ))}

                </select>


                <select
                    value={filters.degree}
                    onChange={(event) =>
                        setFilters((current) => ({
                            ...current,
                            degree:
                                event.target.value,
                        }))
                    }
                >
                    <option value="">
                        All degrees
                    </option>

                    {degrees.map((degree) => (
                        <option
                            key={degree.id}
                            value={degree.id}
                        >
                            {degree.name}
                        </option>
                    ))}

                </select>


                <select
                    value={filters.field}
                    onChange={(event) =>
                        setFilters((current) => ({
                            ...current,
                            field:
                                event.target.value,
                        }))
                    }
                >
                    <option value="">
                        All fields
                    </option>

                    {fields.map((field) => (
                        <option
                            key={field.id}
                            value={field.id}
                        >
                            {field.name}
                        </option>
                    ))}

                </select>


                {(
                    search ||
                    filters.country ||
                    filters.degree ||
                    filters.field
                ) && (
                        <button
                            type="button"
                            className="programs-reset-button"
                            onClick={resetFilters}
                        >
                            <RotateCcw size={14} />
                            Reset
                        </button>
                    )}

            </section>


            {/* =====================================================
                RESULTS TOOLBAR
            ====================================================== */}

            <div className="programs-toolbar">

                <div>

                    <span className="programs-result-label">
                        Programmes
                    </span>

                    <h2>
                        Explore study programmes
                    </h2>

                </div>


                {!loading && !error && (
                    <div className="programs-results-top">

                        <p>
                            <strong>
                                {filteredPrograms.length}
                            </strong>{" "}

                            {filteredPrograms.length === 1
                                ? "programme"
                                : "programmes"}{" "}

                            found
                        </p>

                    </div>
                )}

            </div>


            {/* =====================================================
                RESULTS
            ====================================================== */}

            <div className="programs-results">

                {/* =================================================
                    LOADING SKELETON
                ================================================== */}

                {loading && (
                    <div className="programs-grid">

                        {Array.from({ length: 6 }).map(
                            (_, index) => (
                                <article
                                    className="program-card program-card-skeleton"
                                    key={index}
                                >

                                    {/* Card Top */}

                                    <div className="program-card-top">

                                        <div className="program-card-top-main">

                                            <div className="skeleton-logo" />

                                            <div className="skeleton-top-content">

                                                <div className="skeleton-line small" />

                                                <div className="skeleton-line title" />

                                            </div>

                                        </div>

                                    </div>


                                    {/* Card Body */}

                                    <div className="program-card-body">

                                        <div className="skeleton-line field" />

                                        <div className="skeleton-line body-title" />

                                        <div className="skeleton-line description" />

                                        <div className="skeleton-line description short" />

                                    </div>


                                    {/* Meta */}

                                    <div className="program-card-meta">

                                        <div className="skeleton-meta" />

                                        <div className="skeleton-meta second" />

                                    </div>


                                    {/* Footer */}

                                    <div className="program-card-footer">

                                        <div className="skeleton-footer-line" />

                                        <div className="skeleton-arrow" />

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
                    <div className="programs-state programs-error">

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
                ================================================== */}

                {!loading &&
                    !error &&
                    filteredPrograms.length === 0 && (
                        <div className="programs-state">

                            <GraduationCap size={40} />

                            <h3>
                                No programmes found
                            </h3>

                            <p>
                                No published programmes
                                match your search or filters.
                            </p>

                        </div>
                    )}


                {/* =================================================
                    PROGRAMS
                ================================================== */}

                {!loading &&
                    !error &&
                    filteredPrograms.length > 0 && (

                        <div className="programs-grid">

                            {filteredPrograms.map((program) => {

                                if (
                                    !program?.id ||
                                    !getProgramTitle(program)
                                ) {
                                    return null;
                                }

                                const programTitle =
                                    getProgramTitle(
                                        program
                                    );

                                const fieldName =
                                    getPrimaryField(
                                        program
                                    );

                                const degreeNames =
                                    getDegrees(
                                        program
                                    );

                                const primaryDegree =
                                    degreeNames[0] || "";

                                const universityName =
                                    getUniversityName(
                                        program
                                    );

                                const programType =
                                    getProgramTypeName(
                                        program
                                    );

                                const fundingName =
                                    getProgramFundingName(
                                        program
                                    );

                                const studyMode =
                                    getProgramStudyMode(
                                        program
                                    );

                                const deadline =
                                    getProgramDeadline(
                                        program
                                    );

                                return (
                                    <article
                                        className="program-card"
                                        key={program.id}
                                    >

                                        {/* Card Header */}

                                        <div className="program-card-top">

                                            <div className="program-card-top-main">

                                                <div className="program-card-logo">
                                                    <GraduationCap
                                                        size={21}
                                                    />
                                                </div>

                                                <div className="program-card-degree-header">

                                                    {primaryDegree && (
                                                        <strong>
                                                            {primaryDegree}
                                                        </strong>
                                                    )}

                                                    {universityName && (
                                                        <span>
                                                            {universityName}
                                                        </span>
                                                    )}

                                                </div>

                                            </div>

                                        </div>


                                        {/* Card Body */}

                                        <div className="program-card-body">

                                            {fieldName && (
                                                <span className="program-card-field">
                                                    {fieldName}
                                                </span>
                                            )}

                                            <h2>
                                                {programTitle}
                                            </h2>

                                            {program.description && (
                                                <p className="program-card-description">
                                                    {program.description}
                                                </p>
                                            )}

                                        </div>


                                        {/* Card Meta */}

                                        {(programType ||
                                            fundingName ||
                                            studyMode) && (
                                                <div className="program-card-meta">

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
                                            )}


                                        {/* Card Footer */}

                                        <div className="program-card-footer">

                                            <div className="program-card-deadline">

                                                {deadline ? (
                                                    <>
                                                        <span>
                                                            Application deadline
                                                        </span>

                                                        <strong>
                                                            {formatDate(
                                                                deadline
                                                            )}
                                                        </strong>
                                                    </>
                                                ) : (
                                                    <span>
                                                        No deadline specified
                                                    </span>
                                                )}

                                            </div>


                                            <Link
                                                to={`/student/programs/${program.id}`}
                                                className="program-card-arrow"
                                                aria-label={`View ${programTitle}`}
                                            >
                                                <ArrowRight
                                                    size={18}
                                                />
                                            </Link>

                                        </div>

                                    </article>
                                );
                            })}

                        </div>
                    )}

            </div>

        </div>
    );
}


export default Programs;
