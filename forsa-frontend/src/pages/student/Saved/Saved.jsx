import {
    ArrowRight,
    Bookmark,
    ExternalLink,
    Heart,
    Search,
    X,
    Loader2,
    AlertCircle,
    Sparkles,
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
    getSavedOpportunities,
    removeSavedOpportunity,
} from "../../../api/saved";

import "../Programs/Programs.css";
import "./Saved.css";
import LoadingScreen from "../../../components/LoadingScreen";


const getDisplayValue = (
    value,
    keys = [
        "name",
        "title",
        "label",
        "value",
    ]
) => {

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
            .map(
                item =>
                    getDisplayValue(
                        item,
                        keys
                    )
            )
            .filter(Boolean)
            .join(", ");
    }

    if (typeof value === "object") {

        for (const key of keys) {

            if (
                value[key] !== undefined &&
                value[key] !== null &&
                value[key] !== ""
            ) {
                return String(
                    value[key]
                );
            }
        }

    }

    return "";
};


const getProgramTitle = (
    opportunity
) =>
    getDisplayValue(
        opportunity?.title ||
        opportunity?.name,
        [
            "title",
            "name",
        ]
    );


const getUniversityName = (
    opportunity
) =>
    getDisplayValue(
        opportunity?.university ||
        opportunity?.university_name,
        [
            "name",
            "title",
        ]
    );


const getCountryName = (
    opportunity
) =>
    getDisplayValue(
        opportunity?.country ||
        opportunity?.university?.country,
        [
            "name",
            "title",
        ]
    );


const getOpportunityType = (
    opportunity
) =>
    getDisplayValue(
        opportunity?.opportunity_type ||
        opportunity?.opportunityType ||
        opportunity?.type,
        [
            "name",
            "title",
            "label",
            "value",
        ]
    );


const getFundingType = (
    opportunity
) =>
    getDisplayValue(
        opportunity?.funding_type ||
        opportunity?.fundingType ||
        opportunity?.funding,
        [
            "name",
            "title",
            "label",
            "value",
        ]
    );


const getStudyMode = (
    opportunity
) => {

    const value =
        opportunity?.study_mode ||
        opportunity?.studyMode ||
        "";

    if (!value) {
        return "";
    }

    return getDisplayValue(value)
        .replace(/_/g, " ")
        .replace(/\s+/g, " ")
        .trim()
        .replace(
            /\b\w/g,
            char =>
                char.toUpperCase()
        );
};


const getDegrees = (
    opportunity
) => {

    if (
        !Array.isArray(
            opportunity?.degrees
        )
    ) {
        return [];
    }

    return opportunity.degrees
        .map(
            degree =>
                getDisplayValue(
                    degree,
                    [
                        "name",
                        "title",
                    ]
                )
        )
        .filter(Boolean);
};


const getFields = (
    opportunity
) => {

    if (
        !Array.isArray(
            opportunity?.fields
        )
    ) {
        return [];
    }

    return opportunity.fields
        .map(
            field =>
                getDisplayValue(
                    field,
                    [
                        "name",
                        "title",
                    ]
                )
        )
        .filter(Boolean);
};


const getDeadline = (
    opportunity
) =>
    opportunity?.deadline ||
    opportunity?.application_deadline ||
    opportunity?.deadline_date ||
    null;


const formatDate = (
    value
) => {

    if (!value) {
        return "Not specified";
    }

    const date =
        new Date(value);

    if (
        Number.isNaN(
            date.getTime()
        )
    ) {
        return "Not specified";
    }

    return new Intl.DateTimeFormat(
        "en-GB",
        {
            day: "2-digit",
            month: "short",
            year: "numeric",
        }
    ).format(date);
};


function Saved() {

    const [savedItems, setSavedItems] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [searchTerm, setSearchTerm] =
        useState("");

    const [removingId, setRemovingId] =
        useState(null);


    useEffect(() => {

        let mounted = true;


        const loadSaved = async () => {

            try {

                setLoading(true);
                setError("");


                const response =
                    await getSavedOpportunities();


                if (!mounted) {
                    return;
                }


                const data =
                    Array.isArray(
                        response?.data
                    )
                        ? response.data
                        : Array.isArray(
                            response?.data?.data
                        )
                            ? response.data.data
                            : [];


                setSavedItems(data);

            } catch (err) {

                console.error(
                    "Failed to load saved opportunities:",
                    err
                );


                if (!mounted) {
                    return;
                }


                setError(
                    err?.response?.data?.message ||
                    "Unable to load your saved opportunities."
                );

            } finally {

                if (mounted) {
                    setLoading(false);
                }

            }

        };


        loadSaved();


        return () => {
            mounted = false;
        };

    }, []);


    const handleRemove = async (
        opportunityId,
        savedId
    ) => {

        if (
            !opportunityId ||
            removingId === savedId
        ) {
            return;
        }


        try {

            setRemovingId(savedId);
            setError("");


            await removeSavedOpportunity(
                opportunityId
            );


            setSavedItems(
                current =>
                    current.filter(
                        item =>
                            item.id !== savedId
                    )
            );

        } catch (err) {

            console.error(
                "Failed to remove saved opportunity:",
                err
            );


            setError(
                err?.response?.data?.message ||
                "Unable to remove this opportunity."
            );

        } finally {

            setRemovingId(null);

        }

    };


    const filteredItems =
        useMemo(() => {

            const query =
                searchTerm
                    .trim()
                    .toLowerCase();


            if (!query) {
                return savedItems;
            }


            return savedItems.filter(
                item => {

                    const opportunity =
                        item?.opportunity;


                    if (!opportunity) {
                        return false;
                    }


                    const searchableValues = [

                        getProgramTitle(
                            opportunity
                        ),

                        getUniversityName(
                            opportunity
                        ),

                        getCountryName(
                            opportunity
                        ),

                        getOpportunityType(
                            opportunity
                        ),

                        getFundingType(
                            opportunity
                        ),

                        getStudyMode(
                            opportunity
                        ),

                        ...getDegrees(
                            opportunity
                        ),

                        ...getFields(
                            opportunity
                        ),

                        getDisplayValue(
                            opportunity?.description
                        ),

                    ];


                    return searchableValues
                        .join(" ")
                        .toLowerCase()
                        .includes(query);

                }
            );

        }, [
            savedItems,
            searchTerm,
        ]);


    const clearSearch = () => {
        setSearchTerm("");
    };

    if (loading) {
        return <LoadingScreen />;
    }


    return (

        <div className="saved-page">

            <section className="saved-header">

                <div className="saved-header-content">

                    <div className="saved-eyebrow">

                        <Bookmark
                            size={14}
                        />

                        Saved Opportunities

                    </div>


                    <h1>
                        Your saved opportunities
                    </h1>


                    <p>
                        Keep track of programmes and
                        opportunities you want to explore later.
                    </p>

                </div>


                {savedItems.length > 0 && (

                    <div className="saved-search-section">

                        <div className="saved-search">

                            <Search
                                size={18}
                            />


                            <input
                                type="search"
                                value={searchTerm}
                                onChange={event =>
                                    setSearchTerm(
                                        event.target.value
                                    )
                                }
                                placeholder="Search saved opportunities..."
                                aria-label="Search saved opportunities"
                            />


                            {searchTerm && (

                                <button
                                    type="button"
                                    className="saved-search-clear"
                                    onClick={
                                        clearSearch
                                    }
                                    aria-label="Clear search"
                                >

                                    <X
                                        size={16}
                                    />

                                </button>

                            )}

                        </div>

                    </div>

                )}

            </section>


            <main className="saved-main">

                <div className="saved-toolbar">

                    <div>

                        <span className="saved-result-label">

                            YOUR COLLECTION

                        </span>


                        <h2>
                            Saved opportunities
                        </h2>

                    </div>


                    {!loading &&
                        !error && (

                            <div className="saved-results-top">

                                <p>

                                    <strong>
                                        {
                                            filteredItems.length
                                        }
                                    </strong>

                                    {" "}

                                    {
                                        filteredItems.length === 1
                                            ? "opportunity"
                                            : "opportunities"
                                    }

                                    {" found"}

                                </p>

                            </div>

                        )}

                </div>


                {error &&
                    savedItems.length > 0 && (

                        <div className="saved-error-banner">

                            <AlertCircle
                                size={17}
                            />

                            <span>
                                {error}
                            </span>


                            <button
                                type="button"
                                onClick={() =>
                                    setError("")
                                }
                                aria-label="Close error"
                            >

                                <X
                                    size={15}
                                />

                            </button>

                        </div>

                    )}


                <div
                    className="saved-results"
                    aria-live="polite"
                >

                    {loading && (
                        <div className="saved-loading-state">

                            <div className="saved-loading-spinner" />

                            <p>
                                Loading saved opportunities...
                            </p>

                        </div>
                    )}


                    {!loading &&
                        error &&
                        savedItems.length === 0 && (

                            <div className="saved-empty">

                                <div className="saved-empty-icon">

                                    <AlertCircle
                                        size={24}
                                    />

                                </div>


                                <h3>
                                    Unable to load saved opportunities
                                </h3>


                                <p>
                                    {error}
                                </p>


                                <Link
                                    to="/student/programs"
                                    className="saved-empty-button"
                                >

                                    <Search
                                        size={14}
                                    />

                                    Explore programmes

                                </Link>

                            </div>

                        )}


                    {!loading &&
                        !error &&
                        savedItems.length === 0 && (

                            <div className="saved-empty">

                                <div className="saved-empty-icon">

                                    <Bookmark
                                        size={24}
                                    />

                                </div>


                                <h3>
                                    Nothing saved yet
                                </h3>


                                <p>
                                    Save programmes and opportunities
                                    to easily find them later.
                                </p>


                                <Link
                                    to="/student/programs"
                                    className="saved-empty-button"
                                >

                                    <Search
                                        size={14}
                                    />

                                    Explore programmes

                                </Link>

                            </div>

                        )}


                    {!loading &&
                        !error &&
                        savedItems.length > 0 &&
                        filteredItems.length === 0 && (

                            <div className="saved-empty">

                                <div className="saved-empty-icon">

                                    <Search
                                        size={24}
                                    />

                                </div>


                                <h3>
                                    No matching opportunities
                                </h3>


                                <p>
                                    Try changing your search term.
                                </p>


                                <button
                                    type="button"
                                    className="saved-empty-button"
                                    onClick={
                                        clearSearch
                                    }
                                >

                                    <RotateCcwIcon />

                                    Clear search

                                </button>

                            </div>

                        )}


                    {!loading &&
                        !error &&
                        filteredItems.length > 0 && (

                            <div className="saved-grid">

                                {filteredItems.map(
                                    item => (

                                        <SavedCard
                                            key={item.id}
                                            item={item}
                                            removingId={
                                                removingId
                                            }
                                            onRemove={
                                                handleRemove
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


function SavedCard({
    item,
    removingId,
    onRemove,
}) {

    const opportunity =
        item?.opportunity;


    if (!opportunity) {
        return null;
    }


    const title =
        getProgramTitle(
            opportunity
        );


    const university =
        getUniversityName(
            opportunity
        );


    const country =
        getCountryName(
            opportunity
        );


    const opportunityType =
        getOpportunityType(
            opportunity
        );


    const fundingType =
        getFundingType(
            opportunity
        );


    const studyMode =
        getStudyMode(
            opportunity
        );


    const degrees =
        getDegrees(
            opportunity
        );


    const fields =
        getFields(
            opportunity
        );


    const deadline =
        getDeadline(
            opportunity
        );


    return (

        <article className="program-card saved-opportunity-card">

            <div className="program-card-top">

                <div className="program-card-top-main">

                    <div className="program-card-degree-header">

                        {degrees[0] && (

                            <strong>
                                {degrees[0]}
                            </strong>

                        )}

                        {university && (

                            <span>
                                {university}
                            </span>

                        )}

                    </div>

                </div>


                <button
                    type="button"
                    className="program-card-save"
                    title="Remove from saved"
                    aria-label={`Remove ${title} from saved`}
                    aria-pressed="true"
                    disabled={
                        removingId === item.id
                    }
                    onClick={() =>
                        onRemove(
                            opportunity.id,
                            item.id
                        )
                    }
                >

                    {removingId === item.id ? (

                        <Loader2
                            size={15}
                            className="saved-spinner"
                        />

                    ) : (

                        <Heart
                            size={17}
                            fill="currentColor"
                        />

                    )}

                </button>

            </div>


            <div className="program-card-body">

                {fields[0] && (

                    <span className="program-card-field">
                        {fields[0]}
                    </span>

                )}


                <h2>
                    {title}
                </h2>


                {opportunity.description && (

                    <p className="program-card-description">

                        {getDisplayValue(
                            opportunity.description
                        )}

                    </p>

                )}


            </div>


            {(country || opportunityType || fundingType || studyMode) && (

                <div className="program-card-meta">

                    {country && (

                        <span>
                            {country}
                        </span>

                    )}

                    {opportunityType && (

                        <span>
                            {opportunityType}
                        </span>

                    )}

                    {fundingType && (

                        <span>
                            {fundingType}
                        </span>

                    )}

                    {studyMode && (

                        <span>
                            {studyMode}
                        </span>

                    )}

                </div>

            )}


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


                <div className="saved-card-actions">

                    <Link
                        to={`/student/programs/${opportunity.slug ||
                            opportunity.id
                            }`}
                        className="program-card-arrow"
                        aria-label={`View ${title}`}
                    >

                        <ArrowRight
                            size={18}
                        />

                    </Link>


                    {opportunity.application_url && (

                        <a
                            href={
                                opportunity.application_url
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            className="saved-apply-button"
                            aria-label={`Apply for ${title}`}
                        >

                            <ExternalLink
                                size={16}
                            />

                        </a>

                    )}

                </div>

            </div>

        </article>
    );
}


function RotateCcwIcon() {

    return (
        <Sparkles
            size={14}
        />
    );
}


export default Saved;
