import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    CheckCircle2,
    ChevronLeft,
    ChevronRight,
    Clock3,
    FileText,
    XCircle,
} from "lucide-react";

import { getMyApplications } from "../../api/applications";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

/*
|--------------------------------------------------------------------------
| Safe value helpers
|--------------------------------------------------------------------------
*/

const getTextValue = (value, fallback = "") => {
    if (value === null || value === undefined) {
        return fallback;
    }

    if (
        typeof value === "string" ||
        typeof value === "number" ||
        typeof value === "boolean"
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

/*
|--------------------------------------------------------------------------
| Status
|--------------------------------------------------------------------------
*/

const getStatusValue = (status) => {
    if (status === null || status === undefined) {
        return "pending";
    }

    if (typeof status === "object") {
        return String(
            status.value ??
            status.name ??
            status.label ??
            status.status ??
            "pending"
        ).toLowerCase();
    }

    return String(status).toLowerCase();
};

const getStatusLabel = (status) => {
    switch (getStatusValue(status)) {
        case "approved":
            return "Approved";

        case "accepted":
            return "Accepted";

        case "rejected":
            return "Rejected";

        case "pending":
            return "Pending";

        default:
            return getTextValue(status, "Pending");
    }
};

const getStatusVariant = (status) => {
    switch (getStatusValue(status)) {
        case "accepted":
        case "approved":
            return "default";

        case "rejected":
            return "destructive";

        default:
            return "secondary";
    }
};

const getStatusIcon = (status) => {
    switch (getStatusValue(status)) {
        case "accepted":
        case "approved":
            return CheckCircle2;

        case "rejected":
            return XCircle;

        default:
            return Clock3;
    }
};

/*
|--------------------------------------------------------------------------
| Date
|--------------------------------------------------------------------------
*/

const formatDate = (date) => {
    if (!date) {
        return "N/A";
    }

    if (typeof date === "object") {
        date =
            date.date ??
            date.value ??
            date.created_at ??
            null;
    }

    if (!date) {
        return "N/A";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
        return "N/A";
    }

    return parsedDate.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
};

/*
|--------------------------------------------------------------------------
| Opportunity helpers
|--------------------------------------------------------------------------
*/

const getOpportunity = (application) => {
    if (!application) {
        return null;
    }

    if (
        application.opportunity &&
        typeof application.opportunity === "object"
    ) {
        return application.opportunity;
    }

    return null;
};

const getOpportunityTitle = (opportunity) => {
    if (!opportunity) {
        return "Untitled Opportunity";
    }

    const title =
        opportunity.title ??
        opportunity.name ??
        opportunity.opportunity_title ??
        opportunity.program_name ??
        null;

    return getTextValue(title, "Untitled Opportunity");
};

const getOpportunityType = (opportunity) => {
    if (!opportunity) {
        return "";
    }

    const type =
        opportunity.opportunity_type ??
        opportunity.type ??
        opportunity.opportunityType ??
        null;

    if (!type) {
        return "";
    }

    return getTextValue(type, "");
};

const getUniversityName = (opportunity) => {
    if (!opportunity) {
        return "Unknown University";
    }

    const university =
        opportunity.university ??
        opportunity.university_name ??
        null;

    if (!university) {
        return "Unknown University";
    }

    return getTextValue(
        university,
        "Unknown University"
    );
};

/*
|--------------------------------------------------------------------------
| API response normalization
|--------------------------------------------------------------------------
*/

const normalizeApplicationsResponse = (response) => {
    /*
    |--------------------------------------------------------------
    | Direct array
    |--------------------------------------------------------------
    */

    if (Array.isArray(response)) {
        return {
            items: response,
            meta: {},
        };
    }

    /*
    |--------------------------------------------------------------
    | Laravel paginator
    |
    | {
    |     data: [],
    |     current_page: 1,
    |     last_page: 2,
    |     total: 10
    | }
    |--------------------------------------------------------------
    */

    if (Array.isArray(response?.data)) {
        return {
            items: response.data,
            meta: {
                current_page: response.current_page,
                last_page: response.last_page,
                total: response.total,
                per_page: response.per_page,
            },
        };
    }

    /*
    |--------------------------------------------------------------
    | Wrapped response
    |
    | {
    |     data: {
    |         data: [],
    |         current_page: 1
    |     }
    | }
    |--------------------------------------------------------------
    */

    if (Array.isArray(response?.data?.data)) {
        return {
            items: response.data.data,
            meta: {
                current_page:
                    response.data.current_page ??
                    response.meta?.current_page,

                last_page:
                    response.data.last_page ??
                    response.meta?.last_page,

                total:
                    response.data.total ??
                    response.meta?.total,

                per_page:
                    response.data.per_page ??
                    response.meta?.per_page,
            },
        };
    }

    /*
    |--------------------------------------------------------------
    | Another possible API format
    |--------------------------------------------------------------
    */

    if (Array.isArray(response?.applications)) {
        return {
            items: response.applications,
            meta: response.meta ?? {},
        };
    }

    return {
        items: [],
        meta: {},
    };
};

/*
|--------------------------------------------------------------------------
| Pagination button class
|--------------------------------------------------------------------------
*/

const getLinkClass = () =>
    "inline-flex h-9 items-center justify-center whitespace-nowrap rounded-md border border-input bg-background px-3 text-sm font-medium text-foreground shadow-xs transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

/*
|--------------------------------------------------------------------------
| Component
|--------------------------------------------------------------------------
*/

function Applications() {
    const [applications, setApplications] = useState([]);

    const [currentPage, setCurrentPage] =
        useState(1);

    const [lastPage, setLastPage] =
        useState(1);

    const [total, setTotal] =
        useState(0);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    /*
    |--------------------------------------------------------------------------
    | Fetch applications
    |--------------------------------------------------------------------------
    */

    const fetchApplications = async (page = 1) => {
        try {
            setLoading(true);
            setError("");

            const response =
                await getMyApplications(page);

            const {
                items,
                meta,
            } =
                normalizeApplicationsResponse(
                    response
                );

            const resolvedCurrentPage =
                Number(
                    meta.current_page ?? page
                );

            const resolvedLastPage =
                Number(
                    meta.last_page ?? 1
                );

            const resolvedTotal =
                Number(
                    meta.total ??
                    items.length
                );

            setApplications(
                Array.isArray(items)
                    ? items
                    : []
            );

            setCurrentPage(
                resolvedCurrentPage || 1
            );

            setLastPage(
                resolvedLastPage || 1
            );

            setTotal(
                resolvedTotal || 0
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
    | Initial load
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

    const handlePageChange = (page) => {
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
    | Render
    |--------------------------------------------------------------------------
    */

    return (
        <div className="w-full">
            <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                <div className="space-y-6">

                    {/* Header */}

                    <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <div className="mb-2 flex items-center gap-2">

                                <Badge variant="secondary">
                                    Student Portal
                                </Badge>

                                {!loading &&
                                    !error && (
                                        <span className="text-sm text-muted-foreground">
                                            {total}{" "}
                                            {total === 1
                                                ? "application"
                                                : "applications"}
                                        </span>
                                    )}

                            </div>

                            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                                My Applications
                            </h1>

                            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
                                Track your submitted applications and review their current status.
                            </p>
                        </div>

                        <Link
                            to="/student/opportunities"
                            className="inline-flex h-9 w-fit items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow-xs transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        >
                            Browse Opportunities
                        </Link>
                    </section>

                    {/* Loading */}

                    {loading && (
                        <section className="space-y-3">
                            {[1, 2, 3].map(
                                (item) => (
                                    <Card key={item}>
                                        <CardContent className="p-5">
                                            <div className="space-y-3">
                                                <div className="h-5 w-1/3 animate-pulse rounded bg-muted" />

                                                <div className="h-4 w-1/2 animate-pulse rounded bg-muted" />

                                                <div className="h-4 w-1/4 animate-pulse rounded bg-muted" />
                                            </div>
                                        </CardContent>
                                    </Card>
                                )
                            )}
                        </section>
                    )}

                    {/* Error */}

                    {!loading &&
                        error && (
                            <Card>
                                <CardContent className="flex flex-col items-center justify-center py-16 text-center">

                                    <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-destructive/10">
                                        <XCircle className="size-6 text-destructive" />
                                    </div>

                                    <h2 className="text-xl font-semibold">
                                        Unable to load applications
                                    </h2>

                                    <p className="mt-2 max-w-md text-sm text-muted-foreground">
                                        {getTextValue(
                                            error,
                                            "Failed to load your applications."
                                        )}
                                    </p>

                                    <Button
                                        type="button"
                                        className="mt-5"
                                        onClick={() =>
                                            fetchApplications(
                                                currentPage
                                            )
                                        }
                                    >
                                        Try Again
                                    </Button>

                                </CardContent>
                            </Card>
                        )}

                    {/* Empty */}

                    {!loading &&
                        !error &&
                        applications.length === 0 && (
                            <Card>
                                <CardContent className="flex flex-col items-center justify-center py-16 text-center">

                                    <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-muted">
                                        <FileText className="size-6 text-muted-foreground" />
                                    </div>

                                    <h2 className="text-xl font-semibold">
                                        No applications yet
                                    </h2>

                                    <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
                                        You have not submitted any applications yet. Explore opportunities and submit your first application.
                                    </p>

                                    <Link
                                        to="/student/opportunities"
                                        className="mt-5 inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow-xs transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                    >
                                        Browse Opportunities
                                    </Link>

                                </CardContent>
                            </Card>
                        )}

                    {/* Applications */}

                    {!loading &&
                        !error &&
                        applications.length > 0 && (
                            <>
                                <Card>

                                    <CardHeader>
                                        <CardTitle>
                                            Submitted Applications
                                        </CardTitle>

                                        <CardDescription>
                                            Review your applications and open their details.
                                        </CardDescription>
                                    </CardHeader>

                                    <CardContent className="p-0">

                                        {/* Desktop */}

                                        <div className="hidden overflow-x-auto md:block">

                                            <table className="w-full border-collapse text-start text-sm">

                                                <thead>
                                                    <tr className="border-y bg-muted/40">

                                                        <th className="whitespace-nowrap px-5 py-3 text-start font-medium">
                                                            ID
                                                        </th>

                                                        <th className="px-5 py-3 text-start font-medium">
                                                            Opportunity
                                                        </th>

                                                        <th className="px-5 py-3 text-start font-medium">
                                                            University
                                                        </th>

                                                        <th className="whitespace-nowrap px-5 py-3 text-start font-medium">
                                                            Submitted
                                                        </th>

                                                        <th className="px-5 py-3 text-start font-medium">
                                                            Status
                                                        </th>

                                                        <th className="px-5 py-3 text-start font-medium">
                                                            Action
                                                        </th>

                                                    </tr>
                                                </thead>

                                                <tbody>

                                                    {applications.map(
                                                        (
                                                            application,
                                                            index
                                                        ) => {

                                                            const opportunity =
                                                                getOpportunity(
                                                                    application
                                                                );

                                                            const StatusIcon =
                                                                getStatusIcon(
                                                                    application?.status
                                                                );

                                                            const applicationId =
                                                                application?.id ??
                                                                `application-${index}`;

                                                            const title =
                                                                getOpportunityTitle(
                                                                    opportunity
                                                                );

                                                            const type =
                                                                getOpportunityType(
                                                                    opportunity
                                                                );

                                                            const university =
                                                                getUniversityName(
                                                                    opportunity
                                                                );

                                                            const status =
                                                                getStatusLabel(
                                                                    application?.status
                                                                );

                                                            const submittedDate =
                                                                formatDate(
                                                                    application?.created_at
                                                                );

                                                            return (
                                                                <tr
                                                                    key={
                                                                        applicationId
                                                                    }
                                                                    className="border-b last:border-b-0"
                                                                >

                                                                    {/* ID */}

                                                                    <td className="px-5 py-4 text-start align-middle font-mono text-xs text-muted-foreground">
                                                                        #
                                                                        {getTextValue(
                                                                            application?.id,
                                                                            "N/A"
                                                                        )}
                                                                    </td>

                                                                    {/* Opportunity */}

                                                                    <td className="px-5 py-4 text-start align-middle">

                                                                        <div className="max-w-sm">

                                                                            <p className="font-medium">
                                                                                {title}
                                                                            </p>

                                                                            {type && (
                                                                                <p className="mt-1 text-xs text-muted-foreground">
                                                                                    {type}
                                                                                </p>
                                                                            )}

                                                                        </div>

                                                                    </td>

                                                                    {/* University */}

                                                                    <td className="px-5 py-4 text-start align-middle text-muted-foreground">
                                                                        {university}
                                                                    </td>

                                                                    {/* Date */}

                                                                    <td className="whitespace-nowrap px-5 py-4 text-start align-middle text-muted-foreground">
                                                                        {submittedDate}
                                                                    </td>

                                                                    {/* Status */}

                                                                    <td className="px-5 py-4 text-start align-middle">

                                                                        <Badge
                                                                            variant={getStatusVariant(
                                                                                application?.status
                                                                            )}
                                                                            className="gap-1.5"
                                                                        >

                                                                            <StatusIcon className="size-3.5" />

                                                                            {status}

                                                                        </Badge>

                                                                    </td>

                                                                    {/* Action */}

                                                                    <td className="px-5 py-4 text-start align-middle">

                                                                        <Link
                                                                            to={`/student/applications/${application?.id}`}
                                                                            className={getLinkClass()}
                                                                        >
                                                                            View Details
                                                                        </Link>

                                                                    </td>

                                                                </tr>
                                                            );
                                                        }
                                                    )}

                                                </tbody>

                                            </table>

                                        </div>

                                        {/* Mobile */}

                                        <div className="space-y-3 p-4 md:hidden">

                                            {applications.map(
                                                (
                                                    application,
                                                    index
                                                ) => {

                                                    const opportunity =
                                                        getOpportunity(
                                                            application
                                                        );

                                                    const StatusIcon =
                                                        getStatusIcon(
                                                            application?.status
                                                        );

                                                    const applicationId =
                                                        application?.id ??
                                                        `application-${index}`;

                                                    const title =
                                                        getOpportunityTitle(
                                                            opportunity
                                                        );

                                                    const university =
                                                        getUniversityName(
                                                            opportunity
                                                        );

                                                    const status =
                                                        getStatusLabel(
                                                            application?.status
                                                        );

                                                    return (
                                                        <Link
                                                            key={
                                                                applicationId
                                                            }
                                                            to={`/student/applications/${application?.id}`}
                                                            className="block rounded-xl border p-4 text-start transition-colors hover:bg-muted/40"
                                                        >

                                                            <div className="flex items-start justify-between gap-3">

                                                                <div className="min-w-0">

                                                                    <p className="font-medium">
                                                                        {title}
                                                                    </p>

                                                                    <p className="mt-1 text-sm text-muted-foreground">
                                                                        {university}
                                                                    </p>

                                                                </div>

                                                                <Badge
                                                                    variant={getStatusVariant(
                                                                        application?.status
                                                                    )}
                                                                    className="shrink-0 gap-1"
                                                                >

                                                                    <StatusIcon className="size-3" />

                                                                    {status}

                                                                </Badge>

                                                            </div>

                                                            <Separator className="my-3" />

                                                            <div className="flex items-center justify-between gap-3 text-xs text-muted-foreground">

                                                                <span>
                                                                    Application #
                                                                    {getTextValue(
                                                                        application?.id,
                                                                        "N/A"
                                                                    )}
                                                                </span>

                                                                <span>
                                                                    {formatDate(
                                                                        application?.created_at
                                                                    )}
                                                                </span>

                                                            </div>

                                                        </Link>
                                                    );
                                                }
                                            )}

                                        </div>

                                    </CardContent>

                                </Card>

                                {/* Pagination */}

                                {lastPage > 1 && (
                                    <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">

                                        <Button
                                            type="button"
                                            variant="outline"
                                            disabled={
                                                currentPage ===
                                                1
                                            }
                                            onClick={() =>
                                                handlePageChange(
                                                    currentPage -
                                                    1
                                                )
                                            }
                                        >
                                            <ChevronLeft className="size-4" />
                                            Previous
                                        </Button>

                                        <div className="flex items-center gap-1 rounded-lg border bg-card px-2 py-1">

                                            {Array.from(
                                                {
                                                    length: lastPage,
                                                },
                                                (
                                                    _,
                                                    index
                                                ) =>
                                                    index + 1
                                            ).map(
                                                (
                                                    page
                                                ) => (
                                                    <Button
                                                        key={
                                                            page
                                                        }
                                                        type="button"
                                                        variant={
                                                            page ===
                                                                currentPage
                                                                ? "default"
                                                                : "ghost"
                                                        }
                                                        size="sm"
                                                        onClick={() =>
                                                            handlePageChange(
                                                                page
                                                            )
                                                        }
                                                    >
                                                        {
                                                            page
                                                        }
                                                    </Button>
                                                )
                                            )}

                                        </div>

                                        <Button
                                            type="button"
                                            variant="outline"
                                            disabled={
                                                currentPage ===
                                                lastPage
                                            }
                                            onClick={() =>
                                                handlePageChange(
                                                    currentPage +
                                                    1
                                                )
                                            }
                                        >
                                            Next
                                            <ChevronRight className="size-4" />
                                        </Button>

                                    </div>
                                )}

                            </>
                        )}

                </div>
            </div>
        </div>
    );
}

export default Applications;
