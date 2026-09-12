import {
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    Link,
} from "react-router-dom";

import {
    CheckCircle2,
    ChevronLeft,
    ChevronRight,
    Clock3,
    FileText,
    Search,
    XCircle,
} from "lucide-react";

import {
    getMyApplications,
} from "../../../api/applications";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import {
    Badge,
} from "@/components/ui/badge";

import {
    Button,
} from "@/components/ui/button";

import {
    Separator,
} from "@/components/ui/separator";

import LoadingScreen from "../../../components/LoadingScreen";

import "./Applications.css";


/*
|--------------------------------------------------------------------------
| Helpers
|--------------------------------------------------------------------------
*/

const getTextValue = (
    value,
    fallback = ""
) => {
    if (
        value === null ||
        value === undefined
    ) {
        return fallback;
    }

    if (
        typeof value === "string" ||
        typeof value === "number"
    ) {
        return String(value);
    }

    if (typeof value === "object") {
        return (
            value.name ??
            value.title ??
            value.label ??
            value.value ??
            value.text ??
            value.description ??
            fallback
        );
    }

    return fallback;
};


const getStatusValue = (status) => {
    if (
        status === null ||
        status === undefined
    ) {
        return "";
    }

    if (
        typeof status === "string" ||
        typeof status === "number"
    ) {
        return String(status).toLowerCase();
    }

    if (typeof status === "object") {
        return String(
            status.value ??
            status.name ??
            status.label ??
            status.status ??
            ""
        ).toLowerCase();
    }

    return "";
};


const getStatusLabel = (status) => {
    const value = getStatusValue(status);

    switch (value) {
        case "approved":
            return "Approved";

        case "accepted":
            return "Accepted";

        case "rejected":
            return "Rejected";

        case "pending":
            return "Pending";

        case "withdrawn":
            return "Withdrawn";

        case "submitted":
            return "Submitted";

        case "under_review":
            return "Under Review";

        default:
            return value
                ? value
                    .replace(/_/g, " ")
                    .replace(/\b\w/g, (letter) =>
                        letter.toUpperCase()
                    )
                : "Pending";
    }
};


const getStatusClass = (status) => {
    const value = getStatusValue(status);

    if (
        value === "accepted" ||
        value === "approved"
    ) {
        return "accepted";
    }

    if (value === "rejected") {
        return "rejected";
    }

    if (value === "withdrawn") {
        return "withdrawn";
    }

    return "pending";
};


const getStatusIcon = (status) => {
    const value = getStatusValue(status);

    if (
        value === "accepted" ||
        value === "approved"
    ) {
        return CheckCircle2;
    }

    if (value === "rejected") {
        return XCircle;
    }

    return Clock3;
};


const formatDate = (date) => {
    if (!date) {
        return "—";
    }

    const value =
        typeof date === "object"
            ? date.date ?? date.value
            : date;

    const parsedDate = new Date(value);

    if (Number.isNaN(parsedDate.getTime())) {
        return "—";
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


const getOpportunity = (application) => {
    return (
        application?.opportunity ??
        application?.opportunity_data ??
        {}
    );
};


const getOpportunityTitle = (opportunity) => {
    return getTextValue(
        opportunity?.title ??
        opportunity?.name,
        "Untitled Opportunity"
    );
};


const getOpportunityType = (opportunity) => {
    return getTextValue(
        opportunity?.opportunity_type ??
        opportunity?.type,
        "Opportunity"
    );
};


const getUniversityName = (opportunity) => {
    return getTextValue(
        opportunity?.university ??
        opportunity?.university_name,
        "University not specified"
    );
};


const normalizeApplicationsResponse = (
    response
) => {
    if (Array.isArray(response)) {
        return {
            items: response,
            meta: {},
        };
    }

    if (
        response &&
        Array.isArray(response.data)
    ) {
        return {
            items: response.data,
            meta: response,
        };
    }

    if (
        response?.data &&
        Array.isArray(response.data.data)
    ) {
        return {
            items: response.data.data,
            meta: response.data,
        };
    }

    if (
        response &&
        Array.isArray(response.applications)
    ) {
        return {
            items: response.applications,
            meta: response,
        };
    }

    return {
        items: [],
        meta: {},
    };
};


/*
|--------------------------------------------------------------------------
| Component
|--------------------------------------------------------------------------
*/

function Applications() {

    const [
        applications,
        setApplications,
    ] = useState([]);

    const [
        currentPage,
        setCurrentPage,
    ] = useState(1);

    const [
        lastPage,
        setLastPage,
    ] = useState(1);

    const [
        total,
        setTotal,
    ] = useState(0);

    const [
        loading,
        setLoading,
    ] = useState(true);

    const [
        error,
        setError,
    ] = useState("");

    const [
        searchTerm,
        setSearchTerm,
    ] = useState("");

    const [
        statusFilter,
        setStatusFilter,
    ] = useState("all");


    /*
    |--------------------------------------------------------------------------
    | Fetch Applications
    |--------------------------------------------------------------------------
    */

    const fetchApplications = async (
        page = 1
    ) => {
        try {
            setLoading(true);
            setError("");

            const response =
                await getMyApplications(page);

            console.log(
                "Applications API response:",
                response
            );

            const {
                items,
                meta,
            } =
                normalizeApplicationsResponse(
                    response
                );

            setApplications(
                Array.isArray(items)
                    ? items
                    : []
            );

            setCurrentPage(
                Number(
                    meta.current_page ?? page
                ) || 1
            );

            setLastPage(
                Number(
                    meta.last_page ?? 1
                ) || 1
            );

            setTotal(
                Number(
                    meta.total ??
                    items.length
                ) || 0
            );

        } catch (err) {

            console.error(
                "Failed to fetch applications:",
                err
            );

            setApplications([]);
            setCurrentPage(1);
            setLastPage(1);
            setTotal(0);

            setError(
                err?.response?.data?.message ??
                "Failed to load your applications."
            );

        } finally {
            setLoading(false);
        }
    };


    /*
    |--------------------------------------------------------------------------
    | Initial Load
    |--------------------------------------------------------------------------
    */

    useEffect(() => {
        fetchApplications(1);
    }, []);


    /*
    |--------------------------------------------------------------------------
    | Pagination
    |--------------------------------------------------------------------------
    */

    const handlePageChange = (
        page
    ) => {

        if (
            page < 1 ||
            page > lastPage ||
            page === currentPage
        ) {
            return;
        }

        fetchApplications(page);

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };


    /*
    |--------------------------------------------------------------------------
    | Filtering
    |--------------------------------------------------------------------------
    */

    const filteredApplications =
        useMemo(() => {

            const search =
                searchTerm
                    .trim()
                    .toLowerCase();

            return applications.filter(
                (application) => {

                    const opportunity =
                        getOpportunity(
                            application
                        );

                    const title =
                        getOpportunityTitle(
                            opportunity
                        ).toLowerCase();

                    const university =
                        getUniversityName(
                            opportunity
                        ).toLowerCase();

                    const type =
                        getOpportunityType(
                            opportunity
                        ).toLowerCase();

                    const applicationId =
                        String(
                            application?.id ??
                            ""
                        ).toLowerCase();

                    const status =
                        getStatusValue(
                            application?.status
                        );


                    const matchesSearch =
                        !search ||
                        title.includes(search) ||
                        university.includes(search) ||
                        type.includes(search) ||
                        applicationId.includes(search);


                    const matchesStatus =
                        statusFilter === "all" ||
                        (
                            statusFilter === "accepted" &&
                            (
                                status === "accepted" ||
                                status === "approved"
                            )
                        ) ||
                        status === statusFilter;


                    return (
                        matchesSearch &&
                        matchesStatus
                    );
                }
            );

        }, [
            applications,
            searchTerm,
            statusFilter,
        ]);


    /*
    |--------------------------------------------------------------------------
    | Statistics
    |--------------------------------------------------------------------------
    */

    const statistics =
        useMemo(() => {

            const pending =
                applications.filter(
                    (application) =>
                        getStatusValue(
                            application?.status
                        ) === "pending"
                ).length;

            const accepted =
                applications.filter(
                    (application) => {

                        const status =
                            getStatusValue(
                                application?.status
                            );

                        return (
                            status === "accepted" ||
                            status === "approved"
                        );
                    }
                ).length;

            const rejected =
                applications.filter(
                    (application) =>
                        getStatusValue(
                            application?.status
                        ) === "rejected"
                ).length;

            return {
                total: applications.length,
                pending,
                accepted,
                rejected,
            };

        }, [applications]);


    /*
    |--------------------------------------------------------------------------
    | Pagination Numbers
    |--------------------------------------------------------------------------
    */

    const pageNumbers =
        useMemo(() => {

            const pages = [];

            const maxVisiblePages = 5;

            let startPage = Math.max(
                1,
                currentPage -
                Math.floor(
                    maxVisiblePages / 2
                )
            );

            let endPage = Math.min(
                lastPage,
                startPage +
                maxVisiblePages -
                1
            );

            if (
                endPage - startPage + 1 <
                maxVisiblePages
            ) {
                startPage = Math.max(
                    1,
                    endPage -
                    maxVisiblePages +
                    1
                );
            }

            for (
                let page = startPage;
                page <= endPage;
                page++
            ) {
                pages.push(page);
            }

            return pages;

        }, [
            currentPage,
            lastPage,
        ]);


    /*
    |--------------------------------------------------------------------------
    | Loading State
    |--------------------------------------------------------------------------
    */

    if (loading) {
        return <LoadingScreen />;
    }


    /*
    |--------------------------------------------------------------------------
    | Error State
    |--------------------------------------------------------------------------
    */

    if (error) {
        return (
            <div className="applications-page">

                <div className="applications-container">

                    <section className="applications-state">

                        <div className="applications-state-icon error">
                            <XCircle size={30} />
                        </div>

                        <h2>
                            Unable to load applications
                        </h2>

                        <p>
                            {error}
                        </p>

                        <Button
                            className="applications-primary-button"
                            onClick={() =>
                                fetchApplications(
                                    currentPage
                                )
                            }
                        >
                            Try Again
                        </Button>

                    </section>

                </div>

            </div>
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Empty State
    |--------------------------------------------------------------------------
    */

    if (
        applications.length === 0
    ) {
        return (
            <div className="applications-page">

                <div className="applications-container">

                    <section className="applications-hero">

                        <div className="applications-hero-content">

                            <div className="applications-badge">
                                Student Portal
                            </div>

                            <h1>
                                My Applications
                            </h1>

                            <p>
                                Track your submitted applications and review their current status.
                            </p>

                        </div>

                        <Link
                            to="/student/opportunities"
                            className="applications-browse-button"
                        >
                            Browse Opportunities
                        </Link>

                    </section>


                    <section className="applications-state">

                        <div className="applications-state-icon">
                            <FileText size={30} />
                        </div>

                        <h2>
                            No applications yet
                        </h2>

                        <p>
                            You haven't submitted any applications yet.
                            Explore available opportunities and start your journey.
                        </p>

                        <Link
                            to="/student/opportunities"
                            className="applications-primary-button"
                        >
                            Browse Opportunities
                        </Link>

                    </section>

                </div>

            </div>
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Main Render
    |--------------------------------------------------------------------------
    */

    return (
        <div className="applications-page">

            <div className="applications-container">

                {/* =====================================================
                    Hero
                ====================================================== */}

                <section className="applications-hero">

                    <div className="applications-hero-content">

                        <div className="applications-hero-meta">

                            <span className="applications-badge">
                                Student Portal
                            </span>

                            <span className="applications-count">
                                {total}{" "}
                                {total === 1
                                    ? "application"
                                    : "applications"}
                            </span>

                        </div>

                        <h1>
                            My Applications
                        </h1>

                        <p>
                            Track your submitted applications and review their current status.
                        </p>

                    </div>


                    <Link
                        to="/student/opportunities"
                        className="applications-browse-button"
                    >
                        Browse Opportunities
                    </Link>

                </section>


                {/* =====================================================
                    Statistics
                ====================================================== */}

                <section className="applications-stat-grid">

                    <Card className="applications-card applications-stat-card">

                        <CardContent>

                            <div className="applications-stat-icon total">
                                <FileText size={21} />
                            </div>

                            <div className="applications-stat-content">

                                <span className="applications-stat-label">
                                    Total Applications
                                </span>

                                <strong className="applications-stat-value">
                                    {statistics.total}
                                </strong>

                            </div>

                        </CardContent>

                    </Card>


                    <Card className="applications-card applications-stat-card">

                        <CardContent>

                            <div className="applications-stat-icon pending">
                                <Clock3 size={21} />
                            </div>

                            <div className="applications-stat-content">

                                <span className="applications-stat-label">
                                    Pending
                                </span>

                                <strong className="applications-stat-value">
                                    {statistics.pending}
                                </strong>

                            </div>

                        </CardContent>

                    </Card>


                    <Card className="applications-card applications-stat-card">

                        <CardContent>

                            <div className="applications-stat-icon accepted">
                                <CheckCircle2 size={21} />
                            </div>

                            <div className="applications-stat-content">

                                <span className="applications-stat-label">
                                    Accepted
                                </span>

                                <strong className="applications-stat-value">
                                    {statistics.accepted}
                                </strong>

                            </div>

                        </CardContent>

                    </Card>


                    <Card className="applications-card applications-stat-card">

                        <CardContent>

                            <div className="applications-stat-icon rejected">
                                <XCircle size={21} />
                            </div>

                            <div className="applications-stat-content">

                                <span className="applications-stat-label">
                                    Rejected
                                </span>

                                <strong className="applications-stat-value">
                                    {statistics.rejected}
                                </strong>

                            </div>

                        </CardContent>

                    </Card>

                </section>


                {/* =====================================================
                    Filters
                ====================================================== */}

                <section className="applications-filters">

                    <div className="applications-search">

                        <Search
                            size={18}
                            className="applications-search-icon"
                        />

                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(event) =>
                                setSearchTerm(
                                    event.target.value
                                )
                            }
                            placeholder="Search applications..."
                            aria-label="Search applications"
                        />

                    </div>


                    <div className="applications-status-filters">

                        {[
                            {
                                value: "all",
                                label: "All",
                            },
                            {
                                value: "pending",
                                label: "Pending",
                            },
                            {
                                value: "accepted",
                                label: "Accepted",
                            },
                            {
                                value: "rejected",
                                label: "Rejected",
                            },
                        ].map(
                            (filter) => (

                                <button
                                    key={filter.value}
                                    type="button"
                                    className={`applications-filter-button ${statusFilter ===
                                        filter.value
                                        ? "active"
                                        : ""
                                        }`}
                                    onClick={() =>
                                        setStatusFilter(
                                            filter.value
                                        )
                                    }
                                >
                                    {filter.label}
                                </button>

                            )
                        )}

                    </div>

                </section>


                {/* =====================================================
                    No Filtered Results
                ====================================================== */}

                {filteredApplications.length === 0 ? (

                    <section className="applications-state applications-filtered-empty">

                        <div className="applications-state-icon">
                            <Search size={30} />
                        </div>

                        <h2>
                            No matching applications
                        </h2>

                        <p>
                            Try changing your search term or status filter.
                        </p>

                        <button
                            type="button"
                            className="applications-primary-button"
                            onClick={() => {
                                setSearchTerm("");
                                setStatusFilter("all");
                            }}
                        >
                            Clear Filters
                        </button>

                    </section>

                ) : (

                    <>
                        {/* =================================================
                            Applications List
                        ================================================== */}

                        <Card className="applications-card applications-list-card">

                            <CardHeader className="applications-list-header">

                                <div>

                                    <CardTitle className="applications-list-title">
                                        Your Applications
                                    </CardTitle>

                                    <CardDescription className="applications-list-description">
                                        Review your submitted applications and their current status.
                                    </CardDescription>

                                </div>

                            </CardHeader>


                            <Separator />


                            {/* =================================================
                                Desktop Table
                            ================================================== */}

                            <CardContent className="applications-table-wrapper">

                                <table className="applications-table">

                                    <thead>

                                        <tr>

                                            <th>
                                                ID
                                            </th>

                                            <th>
                                                Opportunity
                                            </th>

                                            <th>
                                                University
                                            </th>

                                            <th>
                                                Submitted
                                            </th>

                                            <th>
                                                Status
                                            </th>

                                            <th>
                                                Action
                                            </th>

                                        </tr>

                                    </thead>


                                    <tbody>

                                        {filteredApplications.map(
                                            (application) => {

                                                const opportunity =
                                                    getOpportunity(
                                                        application
                                                    );

                                                const statusClass =
                                                    getStatusClass(
                                                        application?.status
                                                    );

                                                const StatusIcon =
                                                    getStatusIcon(
                                                        application?.status
                                                    );

                                                return (
                                                    <tr
                                                        key={
                                                            application?.id
                                                        }
                                                    >

                                                        <td>

                                                            <span className="applications-id">
                                                                #
                                                                {application?.id ??
                                                                    "—"}
                                                            </span>

                                                        </td>


                                                        <td>

                                                            <div className="applications-opportunity">

                                                                <Link
                                                                    to={`/student/opportunities/${opportunity?.id ?? ""}`}
                                                                    className="applications-opportunity-title"
                                                                >
                                                                    {getOpportunityTitle(
                                                                        opportunity
                                                                    )}
                                                                </Link>

                                                                <span className="applications-opportunity-type">
                                                                    {getOpportunityType(
                                                                        opportunity
                                                                    )}
                                                                </span>

                                                            </div>

                                                        </td>


                                                        <td>

                                                            <span className="applications-university">
                                                                {getUniversityName(
                                                                    opportunity
                                                                )}
                                                            </span>

                                                        </td>


                                                        <td>

                                                            <span className="applications-date">
                                                                {formatDate(
                                                                    application?.created_at ??
                                                                    application?.submitted_at
                                                                )}
                                                            </span>

                                                        </td>


                                                        <td>

                                                            <Badge
                                                                className={`applications-status-badge ${statusClass}`}
                                                            >

                                                                <StatusIcon
                                                                    size={14}
                                                                />

                                                                {getStatusLabel(
                                                                    application?.status
                                                                )}

                                                            </Badge>

                                                        </td>


                                                        <td>

                                                            <Link
                                                                to={`/student/applications/${application?.id}`}
                                                                className="applications-action"
                                                            >
                                                                View Details
                                                                <ChevronRight
                                                                    size={16}
                                                                />
                                                            </Link>

                                                        </td>

                                                    </tr>
                                                );
                                            }
                                        )}

                                    </tbody>

                                </table>

                            </CardContent>


                            {/* =================================================
                                Mobile Cards
                            ================================================== */}

                            <div className="applications-mobile-list">

                                {filteredApplications.map(
                                    (application) => {

                                        const opportunity =
                                            getOpportunity(
                                                application
                                            );

                                        const statusClass =
                                            getStatusClass(
                                                application?.status
                                            );

                                        const StatusIcon =
                                            getStatusIcon(
                                                application?.status
                                            );

                                        return (
                                            <Link
                                                key={
                                                    application?.id
                                                }
                                                to={`/student/applications/${application?.id}`}
                                                className="applications-mobile-card"
                                            >

                                                <div className="applications-mobile-top">

                                                    <span className="applications-id">
                                                        #
                                                        {application?.id ??
                                                            "—"}
                                                    </span>

                                                    <Badge
                                                        className={`applications-status-badge ${statusClass}`}
                                                    >

                                                        <StatusIcon
                                                            size={13}
                                                        />

                                                        {getStatusLabel(
                                                            application?.status
                                                        )}

                                                    </Badge>

                                                </div>


                                                <h3 className="applications-mobile-title">

                                                    {getOpportunityTitle(
                                                        opportunity
                                                    )}

                                                </h3>


                                                <span className="applications-mobile-type">

                                                    {getOpportunityType(
                                                        opportunity
                                                    )}

                                                </span>


                                                <span className="applications-mobile-university">

                                                    {getUniversityName(
                                                        opportunity
                                                    )}

                                                </span>


                                                <div className="applications-mobile-meta">

                                                    <span>
                                                        Submitted
                                                    </span>

                                                    <strong>
                                                        {formatDate(
                                                            application?.created_at ??
                                                            application?.submitted_at
                                                        )}
                                                    </strong>

                                                </div>


                                                <div className="applications-mobile-action">

                                                    View Details

                                                    <ChevronRight
                                                        size={17}
                                                    />

                                                </div>

                                            </Link>
                                        );
                                    }
                                )}

                            </div>

                        </Card>


                        {/* =================================================
                            Pagination
                        ================================================== */}

                        {lastPage > 1 && (

                            <div className="applications-pagination">

                                <button
                                    type="button"
                                    className="applications-page-button applications-page-arrow"
                                    disabled={
                                        currentPage === 1
                                    }
                                    onClick={() =>
                                        handlePageChange(
                                            currentPage - 1
                                        )
                                    }
                                    aria-label="Previous page"
                                >

                                    <ChevronLeft
                                        size={17}
                                    />

                                    <span>
                                        Previous
                                    </span>

                                </button>


                                <div className="applications-page-numbers">

                                    {pageNumbers.map(
                                        (page) => (

                                            <button
                                                key={page}
                                                type="button"
                                                className={`applications-page-button ${page ===
                                                    currentPage
                                                    ? "active"
                                                    : ""
                                                    }`}
                                                onClick={() =>
                                                    handlePageChange(
                                                        page
                                                    )
                                                }
                                            >
                                                {page}
                                            </button>

                                        )
                                    )}

                                </div>


                                <button
                                    type="button"
                                    className="applications-page-button applications-page-arrow"
                                    disabled={
                                        currentPage ===
                                        lastPage
                                    }
                                    onClick={() =>
                                        handlePageChange(
                                            currentPage + 1
                                        )
                                    }
                                    aria-label="Next page"
                                >

                                    <span>
                                        Next
                                    </span>

                                    <ChevronRight
                                        size={17}
                                    />

                                </button>

                            </div>

                        )}

                    </>
                )}

            </div>

        </div>
    );
}


export default Applications;
