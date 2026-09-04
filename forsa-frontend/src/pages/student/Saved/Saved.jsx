import {
    Bookmark,
    Building2,
    GraduationCap,
    MapPin,
    ArrowRight,
    Trash2,
    Search,
    ExternalLink,
    CalendarDays,
    Loader2,
    AlertCircle,
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

import "./Saved.css";


function Saved() {

    const [savedItems, setSavedItems] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [searchTerm, setSearchTerm] = useState("");

    const [removingId, setRemovingId] = useState(null);


    // =========================================================
    // Load Saved Opportunities
    // =========================================================

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
                    Array.isArray(response?.data)
                        ? response.data
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


    // =========================================================
    // Remove Saved Opportunity
    // =========================================================

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


            setSavedItems(current =>
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


    // =========================================================
    // Search
    // =========================================================

    const filteredItems = useMemo(() => {

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


                const title =
                    opportunity.title ||
                    "";


                const university =
                    opportunity.university?.name ||
                    "";


                const country =
                    opportunity.country?.name ||
                    "";


                const type =
                    opportunity.opportunity_type?.name ||
                    "";


                const funding =
                    opportunity.funding_type?.name ||
                    "";


                const degrees =
                    Array.isArray(
                        opportunity.degrees
                    )
                        ? opportunity.degrees
                            .map(
                                degree =>
                                    degree?.name ||
                                    ""
                            )
                            .join(" ")
                        : "";


                const fields =
                    Array.isArray(
                        opportunity.fields
                    )
                        ? opportunity.fields
                            .map(
                                field =>
                                    field?.name ||
                                    ""
                            )
                            .join(" ")
                        : "";


                return [
                    title,
                    university,
                    country,
                    type,
                    funding,
                    degrees,
                    fields,
                ]
                    .join(" ")
                    .toLowerCase()
                    .includes(query);

            }
        );

    }, [
        savedItems,
        searchTerm,
    ]);


    // =========================================================
    // Loading
    // =========================================================

    if (loading) {

        return (
            <div className="saved-page">

                <div className="saved-state">

                    <div className="saved-loading-spinner" />

                    <h2>
                        Loading saved opportunities
                    </h2>

                    <p>
                        Please wait while we load your collection.
                    </p>

                </div>

            </div>
        );

    }


    // =========================================================
    // Initial Error
    // =========================================================

    if (
        error &&
        savedItems.length === 0
    ) {

        return (
            <div className="saved-page">

                <div className="saved-state saved-error">

                    <AlertCircle size={30} />

                    <h2>
                        Unable to load saved opportunities
                    </h2>

                    <p>
                        {error}
                    </p>

                    <Link
                        to="/student/explore"
                        className="saved-explore-button"
                    >

                        <Search size={15} />

                        Explore opportunities

                    </Link>

                </div>

            </div>
        );

    }


    return (
        <div className="saved-page">

            <div className="saved-container">


                {/* =================================================
                    Header
                ================================================= */}

                <section className="saved-header">

                    <div className="saved-header-content">

                        <div className="saved-header-icon">
                            <Bookmark size={22} />
                        </div>


                        <div>

                            <span className="saved-eyebrow">
                                YOUR COLLECTION
                            </span>


                            <h1>
                                Saved opportunities
                            </h1>


                            <p>
                                Keep track of programs and
                                opportunities you want to explore later.
                            </p>

                        </div>

                    </div>


                    <Link
                        to="/student/explore"
                        className="saved-explore-button"
                    >

                        <Search size={15} />

                        Explore opportunities

                    </Link>

                </section>


                {/* =================================================
                    Error Banner
                ================================================= */}

                {error && savedItems.length > 0 && (

                    <div className="saved-error-banner">

                        <AlertCircle size={18} />

                        <span>
                            {error}
                        </span>


                        <button
                            type="button"
                            onClick={() =>
                                setError("")
                            }
                        >
                            ×
                        </button>

                    </div>

                )}


                {/* =================================================
                    Summary
                ================================================= */}

                <section className="saved-summary">

                    <SummaryCard
                        icon={
                            <GraduationCap size={19} />
                        }
                        count={
                            savedItems.length
                        }
                        label={
                            savedItems.length === 1
                                ? "Saved opportunity"
                                : "Saved opportunities"
                        }
                    />

                </section>


                {/* =================================================
                    Search
                ================================================= */}

                {savedItems.length > 0 && (

                    <section className="saved-search-section">

                        <div className="saved-search">

                            <Search size={18} />


                            <input
                                type="text"
                                value={searchTerm}
                                onChange={event =>
                                    setSearchTerm(
                                        event.target.value
                                    )
                                }
                                placeholder="Search your saved opportunities..."
                            />


                            {searchTerm && (

                                <button
                                    type="button"
                                    className="saved-search-clear"
                                    onClick={() =>
                                        setSearchTerm("")
                                    }
                                >
                                    ×
                                </button>

                            )}

                        </div>

                    </section>

                )}


                {/* =================================================
                    Saved Opportunities
                ================================================= */}

                <section className="saved-section saved-last-section">

                    <div className="saved-section-heading">

                        <div>

                            <span>
                                SAVED
                            </span>


                            <h2>
                                Saved opportunities
                            </h2>


                            <p>
                                Programs and opportunities you
                                saved to review later.
                            </p>

                        </div>


                        <Link
                            to="/student/programs"
                        >

                            View all

                            <ArrowRight size={14} />

                        </Link>

                    </div>


                    {/* =================================================
                        Empty
                    ================================================= */}

                    {savedItems.length === 0 && (

                        <EmptyState
                            message="You have not saved any opportunities yet."
                            link="/student/programs"
                            linkText="Explore programs"
                        />

                    )}


                    {/* =================================================
                        Search Empty
                    ================================================= */}

                    {savedItems.length > 0 &&
                        filteredItems.length === 0 && (

                            <div className="saved-empty-state">

                                <Search size={24} />


                                <h3>
                                    No matching opportunities
                                </h3>


                                <p>
                                    Try changing your search term.
                                </p>


                                <button
                                    type="button"
                                    onClick={() =>
                                        setSearchTerm("")
                                    }
                                >
                                    Clear search
                                </button>

                            </div>

                        )}


                    {/* =================================================
                        Opportunities Grid
                    ================================================= */}

                    {filteredItems.length > 0 && (

                        <div className="saved-programs-grid">

                            {filteredItems.map(
                                item => {

                                    const opportunity =
                                        item?.opportunity;


                                    if (!opportunity) {
                                        return null;
                                    }


                                    const university =
                                        opportunity
                                            .university
                                            ?.name;


                                    const country =
                                        opportunity
                                            .country
                                            ?.name;


                                    const opportunityType =
                                        opportunity
                                            .opportunity_type
                                            ?.name;


                                    const fundingType =
                                        opportunity
                                            .funding_type
                                            ?.name;


                                    return (

                                        <article
                                            className="saved-program-card"
                                            key={item.id}
                                        >


                                            {/* =================================================
                                                Card Top
                                            ================================================= */}

                                            <div className="saved-card-top">

                                                <div className="saved-program-icon">

                                                    <GraduationCap
                                                        size={21}
                                                    />

                                                </div>


                                                <button
                                                    className="saved-remove-button"
                                                    type="button"
                                                    title="Remove from saved"
                                                    disabled={
                                                        removingId ===
                                                        item.id
                                                    }
                                                    onClick={() =>
                                                        handleRemove(
                                                            opportunity.id,
                                                            item.id
                                                        )
                                                    }
                                                >

                                                    {removingId ===
                                                        item.id ? (

                                                        <Loader2
                                                            size={15}
                                                            className="saved-spinner"
                                                        />

                                                    ) : (

                                                        <Trash2
                                                            size={15}
                                                        />

                                                    )}

                                                </button>

                                            </div>


                                            {/* =================================================
                                                Opportunity Type
                                            ================================================= */}

                                            {opportunityType && (

                                                <span className="saved-opportunity-type">

                                                    {opportunityType}

                                                </span>

                                            )}


                                            {/* =================================================
                                                Title
                                            ================================================= */}

                                            <h3>
                                                {opportunity.title}
                                            </h3>


                                            {/* =================================================
                                                University
                                            ================================================= */}

                                            {university && (

                                                <p className="saved-university">

                                                    <Building2
                                                        size={14}
                                                    />

                                                    {university}

                                                </p>

                                            )}


                                            {/* =================================================
                                                Country
                                            ================================================= */}

                                            {country && (

                                                <div className="saved-location">

                                                    <MapPin
                                                        size={13}
                                                    />

                                                    {country}

                                                </div>

                                            )}


                                            {/* =================================================
                                                Metadata
                                            ================================================= */}

                                            <div className="saved-program-meta">


                                                {/* Degree */}

                                                {Array.isArray(
                                                    opportunity.degrees
                                                ) &&
                                                    opportunity.degrees.length >
                                                    0 && (

                                                        <div>

                                                            <span>
                                                                Degree
                                                            </span>


                                                            <strong>

                                                                {opportunity.degrees
                                                                    .map(
                                                                        degree =>
                                                                            degree?.name
                                                                    )
                                                                    .join(", ")}

                                                            </strong>

                                                        </div>

                                                    )}


                                                {/* Field */}

                                                {Array.isArray(
                                                    opportunity.fields
                                                ) &&
                                                    opportunity.fields.length >
                                                    0 && (

                                                        <div>

                                                            <span>
                                                                Field
                                                            </span>


                                                            <strong>

                                                                {opportunity.fields
                                                                    .map(
                                                                        field =>
                                                                            field?.name
                                                                    )
                                                                    .join(", ")}

                                                            </strong>

                                                        </div>

                                                    )}


                                                {/* Funding */}

                                                {fundingType && (

                                                    <div>

                                                        <span>
                                                            Funding
                                                        </span>


                                                        <strong>
                                                            {fundingType}
                                                        </strong>

                                                    </div>

                                                )}


                                                {/* Study Mode */}

                                                {opportunity.study_mode && (

                                                    <div>

                                                        <span>
                                                            Study mode
                                                        </span>


                                                        <strong>
                                                            {
                                                                opportunity.study_mode
                                                            }
                                                        </strong>

                                                    </div>

                                                )}

                                            </div>


                                            {/* =================================================
                                                Deadline
                                            ================================================= */}

                                            {opportunity.deadline && (

                                                <div className="saved-deadline">

                                                    <CalendarDays
                                                        size={14}
                                                    />


                                                    <span>
                                                        Deadline
                                                    </span>


                                                    <strong>
                                                        {formatDate(
                                                            opportunity.deadline
                                                        )}
                                                    </strong>

                                                </div>

                                            )}


                                            {/* =================================================
                                                Actions
                                            ================================================= */}

                                            <div className="saved-card-actions">

                                                <Link
                                                    to={`/student/programs/${opportunity.slug ||
                                                        opportunity.id
                                                        }`}
                                                    className="saved-card-button"
                                                >

                                                    View program

                                                    <ArrowRight
                                                        size={14}
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
                                                    >

                                                        Apply

                                                        <ExternalLink
                                                            size={13}
                                                        />

                                                    </a>

                                                )}

                                            </div>

                                        </article>

                                    );

                                }
                            )}

                        </div>

                    )}

                </section>

            </div>

        </div>
    );
}


// =========================================================
// Summary Card
// =========================================================

function SummaryCard({
    icon,
    count,
    label,
}) {

    return (

        <div className="saved-summary-card">

            <div className="saved-summary-icon">
                {icon}
            </div>


            <div>

                <strong>
                    {count}
                </strong>


                <span>
                    {label}
                </span>

            </div>

        </div>
    );
}


// =========================================================
// Empty State
// =========================================================

function EmptyState({
    message,
    link,
    linkText,
}) {

    return (

        <div className="saved-empty-state">

            <div className="saved-empty-icon">

                <Bookmark size={24} />

            </div>


            <h3>
                Nothing saved yet
            </h3>


            <p>
                {message}
            </p>


            <Link to={link}>

                <Search size={14} />

                {linkText}

            </Link>

        </div>
    );
}


// =========================================================
// Format Date
// =========================================================

function formatDate(value) {

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
}


export default Saved;
