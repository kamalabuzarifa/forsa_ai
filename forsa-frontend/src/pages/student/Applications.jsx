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
            return String(status ?? "Pending");
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

const formatDate = (date) => {
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

const getOpportunityTitle = (opportunity) => {
    if (!opportunity) {
        return "Untitled Opportunity";
    }

    return (
        opportunity.title ??
        opportunity.name ??
        opportunity.opportunity_title ??
        "Untitled Opportunity"
    );
};

const getOpportunityType = (opportunity) => {
    if (!opportunity) {
        return "";
    }

    if (
        opportunity.opportunity_type &&
        typeof opportunity.opportunity_type === "object"
    ) {
        return (
            opportunity.opportunity_type.name ??
            opportunity.opportunity_type.title ??
            ""
        );
    }

    return opportunity.type ?? "";
};

const getUniversityName = (opportunity) => {
    if (!opportunity) {
        return "Unknown University";
    }

    if (
        opportunity.university &&
        typeof opportunity.university === "object"
    ) {
        return (
            opportunity.university.name ??
            opportunity.university.title ??
            "Unknown University"
        );
    }

    return (
        opportunity.university_name ??
        opportunity.university ??
        "Unknown University"
    );
};

const normalizeApplicationsResponse = (response) => {
    if (Array.isArray(response)) {
        return {
            items: response,
            meta: {},
        };
    }

    if (Array.isArray(response?.data)) {
        return {
            items: response.data,
            meta: response.meta ?? {},
        };
    }

    if (Array.isArray(response?.data?.data)) {
        return {
            items: response.data.data,
            meta: response.data.meta ?? response.meta ?? {},
        };
    }

    return {
        items: [],
        meta: {},
    };
};

const getLinkClass = () =>
    "inline-flex h-9 items-center justify-center whitespace-nowrap rounded-md border border-input bg-background px-3 text-sm font-medium text-foreground shadow-xs transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

function Applications() {
    const [applications, setApplications] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [total, setTotal] = useState(0);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchApplications = async (page = 1) => {
        try {
            setLoading(true);
            setError("");

            const response = await getMyApplications(page);

            const { items, meta } =
                normalizeApplicationsResponse(response);

            const resolvedCurrentPage = Number(
                meta.current_page ??
                response?.current_page ??
                response?.data?.current_page ??
                page
            );

            const resolvedLastPage = Number(
                meta.last_page ??
                response?.last_page ??
                response?.data?.last_page ??
                1
            );

            const resolvedTotal = Number(
                meta.total ??
                response?.total ??
                response?.data?.total ??
                items.length
            );

            setApplications(items);
            setCurrentPage(resolvedCurrentPage);
            setLastPage(resolvedLastPage);
            setTotal(resolvedTotal);
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

    useEffect(() => {
        fetchApplications(1);
    }, []);

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

    return (
        <div className="w-full">
            <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                <div className="space-y-6">

                    <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <div className="mb-2 flex items-center gap-2">
                                <Badge variant="secondary">
                                    Student Portal
                                </Badge>

                                {!loading && !error && (
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
                                Track your submitted applications and
                                review their current status.
                            </p>
                        </div>

                        <Link
                            to="/student/opportunities"
                            className="inline-flex h-9 w-fit items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow-xs transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        >
                            Browse Opportunities
                        </Link>
                    </section>

                    {loading && (
                        <section className="space-y-3">
                            {[1, 2, 3].map((item) => (
                                <Card key={item}>
                                    <CardContent className="p-5">
                                        <div className="space-y-3">
                                            <div className="h-5 w-1/3 animate-pulse rounded bg-muted" />
                                            <div className="h-4 w-1/2 animate-pulse rounded bg-muted" />
                                            <div className="h-4 w-1/4 animate-pulse rounded bg-muted" />
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </section>
                    )}

                    {!loading && error && (
                        <Card>
                            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                                <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-destructive/10">
                                    <XCircle className="size-6 text-destructive" />
                                </div>

                                <h2 className="text-xl font-semibold">
                                    Unable to load applications
                                </h2>

                                <p className="mt-2 max-w-md text-sm text-muted-foreground">
                                    {error}
                                </p>

                                <Button
                                    type="button"
                                    className="mt-5"
                                    onClick={() =>
                                        fetchApplications(currentPage)
                                    }
                                >
                                    Try Again
                                </Button>
                            </CardContent>
                        </Card>
                    )}

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
                                        You have not submitted any
                                        applications yet. Explore
                                        opportunities and submit your
                                        first application.
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
                                            Review your applications
                                            and open their details.
                                        </CardDescription>
                                    </CardHeader>

                                    <CardContent className="p-0">
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
                                                        (application) => {
                                                            const opportunity =
                                                                application?.opportunity;

                                                            const StatusIcon =
                                                                getStatusIcon(
                                                                    application?.status
                                                                );

                                                            return (
                                                                <tr
                                                                    key={
                                                                        application?.id
                                                                    }
                                                                    className="border-b last:border-b-0"
                                                                >
                                                                    <td className="px-5 py-4 text-start align-middle font-mono text-xs text-muted-foreground">
                                                                        #
                                                                        {
                                                                            application?.id
                                                                        }
                                                                    </td>

                                                                    <td className="px-5 py-4 text-start align-middle">
                                                                        <div className="max-w-sm">
                                                                            <p className="font-medium">
                                                                                {getOpportunityTitle(
                                                                                    opportunity
                                                                                )}
                                                                            </p>

                                                                            {getOpportunityType(
                                                                                opportunity
                                                                            ) && (
                                                                                    <p className="mt-1 text-xs text-muted-foreground">
                                                                                        {getOpportunityType(
                                                                                            opportunity
                                                                                        )}
                                                                                    </p>
                                                                                )}
                                                                        </div>
                                                                    </td>

                                                                    <td className="px-5 py-4 text-start align-middle text-muted-foreground">
                                                                        {getUniversityName(
                                                                            opportunity
                                                                        )}
                                                                    </td>

                                                                    <td className="whitespace-nowrap px-5 py-4 text-start align-middle text-muted-foreground">
                                                                        {formatDate(
                                                                            application?.created_at
                                                                        )}
                                                                    </td>

                                                                    <td className="px-5 py-4 text-start align-middle">
                                                                        <Badge
                                                                            variant={getStatusVariant(
                                                                                application?.status
                                                                            )}
                                                                            className="gap-1.5"
                                                                        >
                                                                            <StatusIcon className="size-3.5" />
                                                                            {getStatusLabel(
                                                                                application?.status
                                                                            )}
                                                                        </Badge>
                                                                    </td>

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

                                        <div className="space-y-3 p-4 md:hidden">
                                            {applications.map(
                                                (application) => {
                                                    const opportunity =
                                                        application?.opportunity;

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
                                                            className="block rounded-xl border p-4 text-start transition-colors hover:bg-muted/40"
                                                        >
                                                            <div className="flex items-start justify-between gap-3">
                                                                <div className="min-w-0">
                                                                    <p className="font-medium">
                                                                        {getOpportunityTitle(
                                                                            opportunity
                                                                        )}
                                                                    </p>

                                                                    <p className="mt-1 text-sm text-muted-foreground">
                                                                        {getUniversityName(
                                                                            opportunity
                                                                        )}
                                                                    </p>
                                                                </div>

                                                                <Badge
                                                                    variant={getStatusVariant(
                                                                        application?.status
                                                                    )}
                                                                    className="shrink-0 gap-1"
                                                                >
                                                                    <StatusIcon className="size-3" />
                                                                    {getStatusLabel(
                                                                        application?.status
                                                                    )}
                                                                </Badge>
                                                            </div>

                                                            <Separator className="my-3" />

                                                            <div className="flex items-center justify-between gap-3 text-xs text-muted-foreground">
                                                                <span>
                                                                    Application #
                                                                    {
                                                                        application?.id
                                                                    }
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

                                {lastPage > 1 && (
                                    <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            disabled={currentPage === 1}
                                            onClick={() =>
                                                handlePageChange(
                                                    currentPage - 1
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
                                                (_, index) =>
                                                    index + 1
                                            ).map((page) => (
                                                <Button
                                                    key={page}
                                                    type="button"
                                                    variant={
                                                        page === currentPage
                                                            ? "default"
                                                            : "ghost"
                                                    }
                                                    size="sm"
                                                    onClick={() =>
                                                        handlePageChange(page)
                                                    }
                                                >
                                                    {page}
                                                </Button>
                                            ))}
                                        </div>

                                        <Button
                                            type="button"
                                            variant="outline"
                                            disabled={
                                                currentPage === lastPage
                                            }
                                            onClick={() =>
                                                handlePageChange(
                                                    currentPage + 1
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
