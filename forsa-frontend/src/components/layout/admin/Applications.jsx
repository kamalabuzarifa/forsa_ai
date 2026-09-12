import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
    CalendarDays,
    ChevronLeft,
    ChevronRight,
    Eye,
    Search,
    UserRound,
    XCircle,
} from "lucide-react";

import {
    getAdminApplications,
} from "../../../api/admin";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const getApplications = (response) => {
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

const getMeta = (response) => {
    return (
        response?.meta ??
        response?.data?.meta ??
        {}
    );
};

const getName = (value, fallback = "N/A") => {
    if (!value) {
        return fallback;
    }

    if (typeof value === "object") {
        return (
            value.name ??
            value.title ??
            value.label ??
            fallback
        );
    }

    return String(value);
};

const getStudentName = (application) => {
    return getName(
        application?.student ??
        application?.user ??
        application?.student_name ??
        application?.user_name
    );
};

const getOpportunityTitle = (application) => {
    return getName(
        application?.opportunity ??
        application?.opportunity_title
    );
};

const getStatus = (application) => {
    const status = application?.status;

    if (status && typeof status === "object") {
        return status.code ?? status.value ?? status.name ?? "pending";
    }

    return status || "pending";
};

const formatStatus = (status) => {
    if (!status) {
        return "Pending";
    }

    return String(status)
        .replace(/[_-]/g, " ")
        .replace(/\b\w/g, (letter) =>
            letter.toUpperCase()
        );
};

const getStatusVariant = (status) => {
    switch (
    String(status).toLowerCase()
    ) {
        case "accepted":
            return "default";

        case "rejected":
            return "destructive";

        case "under_review":
        case "under review":
            return "secondary";

        case "withdrawn":
            return "outline";

        case "pending":
        default:
            return "secondary";
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

    return parsedDate.toLocaleDateString(
        "en-GB",
        {
            day: "2-digit",
            month: "short",
            year: "numeric",
        }
    );
};

function AdminApplications() {
    const [applications, setApplications] =
        useState([]);

    const [currentPage, setCurrentPage] =
        useState(1);

    const [lastPage, setLastPage] =
        useState(1);

    const [total, setTotal] =
        useState(0);

    const [search, setSearch] =
        useState("");

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const fetchApplications = async (
        page = 1
    ) => {
        try {
            setLoading(true);
            setError("");

            const response =
                await getAdminApplications(
                    page
                );

            const items =
                getApplications(response);

            const meta =
                getMeta(response);

            const resolvedCurrentPage =
                Number(
                    meta.current_page ??
                    response?.current_page ??
                    response?.data?.current_page ??
                    page
                );

            const resolvedLastPage =
                Number(
                    meta.last_page ??
                    response?.last_page ??
                    response?.data?.last_page ??
                    1
                );

            const resolvedTotal =
                Number(
                    meta.total ??
                    response?.total ??
                    response?.data?.total ??
                    items.length
                );

            setApplications(items);
            setCurrentPage(
                resolvedCurrentPage
            );
            setLastPage(
                resolvedLastPage
            );
            setTotal(
                resolvedTotal
            );
        } catch (err) {
            console.error(
                "Failed to load admin applications:",
                err
            );

            setApplications([]);
            setCurrentPage(1);
            setLastPage(1);
            setTotal(0);

            setError(
                err?.response?.data?.message ??
                "Failed to load applications."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchApplications(1);
    }, []);

    const filteredApplications =
        useMemo(() => {
            const value =
                search
                    .trim()
                    .toLowerCase();

            if (!value) {
                return applications;
            }

            return applications.filter(
                (application) => {
                    const student =
                        getStudentName(
                            application
                        ).toLowerCase();

                    const opportunity =
                        getOpportunityTitle(
                            application
                        ).toLowerCase();

                    const status =
                        formatStatus(
                            getStatus(
                                application
                            )
                        ).toLowerCase();

                    return (
                        student.includes(value) ||
                        opportunity.includes(value) ||
                        status.includes(value)
                    );
                }
            );
        }, [
            applications,
            search,
        ]);

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

    return (
        <div className="w-full">
            <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                <div className="space-y-6">

                    <section>
                        <Badge
                            variant="secondary"
                            className="mb-2"
                        >
                            Admin
                        </Badge>

                        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                            Manage Applications
                        </h1>

                        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
                            Review and manage student applications submitted to opportunities.
                        </p>
                    </section>

                    {error && (
                        <div className="flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
                            <XCircle className="mt-0.5 size-4 shrink-0" />

                            <p>{error}</p>
                        </div>
                    )}

                    <Card>
                        <CardContent className="p-4">
                            <div className="relative max-w-xl">
                                <Search className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                                <Input
                                    type="search"
                                    value={search}
                                    onChange={(event) =>
                                        setSearch(
                                            event.target.value
                                        )
                                    }
                                    placeholder="Search by student, opportunity, or status..."
                                    className="h-10 ps-9"
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>
                                Applications
                            </CardTitle>

                            <CardDescription>
                                {total}{" "}
                                {total === 1
                                    ? "application"
                                    : "applications"}{" "}
                                in the platform
                            </CardDescription>
                        </CardHeader>

                        <CardContent className="p-0">
                            {loading ? (
                                <div className="space-y-3 p-5">
                                    {[1, 2, 3, 4].map(
                                        (item) => (
                                            <div
                                                key={item}
                                                className="h-20 animate-pulse rounded-xl bg-muted"
                                            />
                                        )
                                    )}
                                </div>
                            ) : filteredApplications.length ===
                                0 ? (
                                <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
                                    <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-muted">
                                        <Search className="size-6 text-muted-foreground" />
                                    </div>

                                    <h2 className="text-lg font-semibold">
                                        {search
                                            ? "No matching applications"
                                            : "No applications found"}
                                    </h2>

                                    <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
                                        {search
                                            ? "Try another search term."
                                            : "There are no applications available yet."}
                                    </p>
                                </div>
                            ) : (
                                <>
                                    <div className="hidden overflow-x-auto md:block">
                                        <table className="w-full border-collapse text-start text-sm">
                                            <thead>
                                                <tr className="border-y bg-muted/40">
                                                    <th className="px-5 py-3 text-start font-medium">
                                                        Student
                                                    </th>

                                                    <th className="px-5 py-3 text-start font-medium">
                                                        Opportunity
                                                    </th>

                                                    <th className="px-5 py-3 text-start font-medium">
                                                        Status
                                                    </th>

                                                    <th className="px-5 py-3 text-start font-medium">
                                                        Applied At
                                                    </th>

                                                    <th className="px-5 py-3 text-start font-medium">
                                                        Actions
                                                    </th>
                                                </tr>
                                            </thead>

                                            <tbody>
                                                {filteredApplications.map(
                                                    (application) => (
                                                        <tr
                                                            key={
                                                                application.id
                                                            }
                                                            className="border-b last:border-b-0"
                                                        >
                                                            <td className="px-5 py-4 align-middle">
                                                                <div className="flex items-center gap-2">
                                                                    <UserRound className="size-4 text-muted-foreground" />

                                                                    <span className="font-medium">
                                                                        {getStudentName(
                                                                            application
                                                                        )}
                                                                    </span>
                                                                </div>
                                                            </td>

                                                            <td className="px-5 py-4 align-middle">
                                                                <div className="min-w-64">
                                                                    <p className="font-medium">
                                                                        {getOpportunityTitle(
                                                                            application
                                                                        )}
                                                                    </p>
                                                                </div>
                                                            </td>

                                                            <td className="px-5 py-4 align-middle">
                                                                <Badge
                                                                    variant={getStatusVariant(
                                                                        getStatus(
                                                                            application
                                                                        )
                                                                    )}
                                                                >
                                                                    {formatStatus(
                                                                        getStatus(
                                                                            application
                                                                        )
                                                                    )}
                                                                </Badge>
                                                            </td>

                                                            <td className="px-5 py-4 align-middle text-muted-foreground">
                                                                <div className="flex items-center gap-2">
                                                                    <CalendarDays className="size-4" />

                                                                    <span>
                                                                        {formatDate(
                                                                            application.created_at ??
                                                                            application.applied_at ??
                                                                            application.application_date
                                                                        )}
                                                                    </span>
                                                                </div>
                                                            </td>

                                                            <td className="px-5 py-4 align-middle">
                                                                <Link
                                                                    to={`/admin/applications/${application.id}`}
                                                                    className="inline-flex size-9 items-center justify-center rounded-md border border-input bg-background text-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                                                    title="View application"
                                                                    aria-label="View application"
                                                                >
                                                                    <Eye className="size-4" />
                                                                </Link>
                                                            </td>
                                                        </tr>
                                                    )
                                                )}
                                            </tbody>
                                        </table>
                                    </div>

                                    <div className="space-y-3 p-4 md:hidden">
                                        {filteredApplications.map(
                                            (application) => (
                                                <div
                                                    key={
                                                        application.id
                                                    }
                                                    className="rounded-xl border p-4"
                                                >
                                                    <div className="flex items-start justify-between gap-3">
                                                        <div className="min-w-0">
                                                            <p className="font-medium">
                                                                {getStudentName(
                                                                    application
                                                                )}
                                                            </p>

                                                            <p className="mt-1 text-sm text-muted-foreground">
                                                                {getOpportunityTitle(
                                                                    application
                                                                )}
                                                            </p>
                                                        </div>

                                                        <Badge
                                                            variant={getStatusVariant(
                                                                getStatus(
                                                                    application
                                                                )
                                                            )}
                                                            className="shrink-0"
                                                        >
                                                            {formatStatus(
                                                                getStatus(
                                                                    application
                                                                )
                                                            )}
                                                        </Badge>
                                                    </div>

                                                    <div className="mt-4 rounded-lg bg-muted/40 p-3">
                                                        <p className="text-xs text-muted-foreground">
                                                            Applied At
                                                        </p>

                                                        <p className="mt-1 text-sm font-medium">
                                                            {formatDate(
                                                                application.created_at ??
                                                                application.applied_at ??
                                                                application.application_date
                                                            )}
                                                        </p>
                                                    </div>

                                                    <Link
                                                        to={`/admin/applications/${application.id}`}
                                                        className="mt-4 inline-flex h-9 w-full items-center justify-center gap-2 rounded-md border border-input bg-background text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
                                                    >
                                                        <Eye className="size-4" />
                                                        View Application
                                                    </Link>
                                                </div>
                                            )
                                        )}
                                    </div>
                                </>
                            )}
                        </CardContent>
                    </Card>

                    {lastPage > 1 && (
                        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
                            <Button
                                type="button"
                                variant="outline"
                                disabled={
                                    currentPage === 1
                                }
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
                                ).map(
                                    (page) => (
                                        <Button
                                            key={page}
                                            type="button"
                                            size="sm"
                                            variant={
                                                page ===
                                                    currentPage
                                                    ? "default"
                                                    : "ghost"
                                            }
                                            onClick={() =>
                                                handlePageChange(
                                                    page
                                                )
                                            }
                                        >
                                            {page}
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
                                        currentPage + 1
                                    )
                                }
                            >
                                Next
                                <ChevronRight className="size-4" />
                            </Button>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}

export default AdminApplications;
