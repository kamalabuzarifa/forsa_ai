import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
    Building2,
    CalendarDays,
    CheckCircle2,
    ChevronLeft,
    ChevronRight,
    Eye,
    FilePlus2,
    Pencil,
    Search,
    Trash2,
    XCircle,
} from "lucide-react";

import {
    deleteAdminOpportunity,
    getAdminOpportunities,
} from "../../api/admin";

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

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const getOpportunities = (response) => {
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

const getUniversityName = (opportunity) => {
    return getName(
        opportunity?.university ??
        opportunity?.university_name
    );
};

const getCountryName = (opportunity) => {
    return getName(
        opportunity?.country ??
        opportunity?.country_name
    );
};

const getFundingName = (opportunity) => {
    return getName(
        opportunity?.funding_type ??
        opportunity?.funding
    );
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

const getActionLinkClass = () => {
    return "inline-flex size-9 items-center justify-center rounded-md border border-input bg-background text-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";
};

function AdminOpportunities() {
    const [opportunities, setOpportunities] = useState([]);

    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [total, setTotal] = useState(0);

    const [search, setSearch] = useState("");

    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState(null);
    const [error, setError] = useState("");

    // Opportunity selected for deletion
    const [deleteOpportunity, setDeleteOpportunity] =
        useState(null);

    const fetchOpportunities = async (page = 1) => {
        try {
            setLoading(true);
            setError("");

            const response =
                await getAdminOpportunities(page);

            const items =
                getOpportunities(response);

            const meta = getMeta(response);

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

            setOpportunities(items);
            setCurrentPage(resolvedCurrentPage);
            setLastPage(resolvedLastPage);
            setTotal(resolvedTotal);
        } catch (err) {
            console.error(
                "Failed to load admin opportunities:",
                err
            );

            setOpportunities([]);
            setCurrentPage(1);
            setLastPage(1);
            setTotal(0);

            setError(
                err?.response?.data?.message ??
                "Failed to load opportunities."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOpportunities(1);
    }, []);

    const filteredOpportunities = useMemo(() => {
        const value = search.trim().toLowerCase();

        if (!value) {
            return opportunities;
        }

        return opportunities.filter((opportunity) => {
            const title = String(
                opportunity?.title ?? ""
            ).toLowerCase();

            const university =
                getUniversityName(
                    opportunity
                ).toLowerCase();

            const country =
                getCountryName(
                    opportunity
                ).toLowerCase();

            const funding =
                getFundingName(
                    opportunity
                ).toLowerCase();

            return (
                title.includes(value) ||
                university.includes(value) ||
                country.includes(value) ||
                funding.includes(value)
            );
        });
    }, [opportunities, search]);

    /*
    |--------------------------------------------------------------------------
    | Open Delete Dialog
    |--------------------------------------------------------------------------
    */

    const handleDeleteClick = (opportunity) => {
        setDeleteOpportunity(opportunity);
        setError("");
    };

    /*
    |--------------------------------------------------------------------------
    | Confirm Delete
    |--------------------------------------------------------------------------
    */

    const handleConfirmDelete = async () => {
        if (!deleteOpportunity?.id) {
            return;
        }

        const opportunityId =
            deleteOpportunity.id;

        try {
            setDeletingId(opportunityId);
            setError("");

            await deleteAdminOpportunity(
                opportunityId
            );

            setDeleteOpportunity(null);

            await fetchOpportunities(
                currentPage
            );
        } catch (err) {
            console.error(
                "Failed to delete opportunity:",
                err
            );

            setError(
                err?.response?.data?.message ??
                "Failed to delete opportunity."
            );
        } finally {
            setDeletingId(null);
        }
    };

    const handlePageChange = (page) => {
        if (
            page < 1 ||
            page > lastPage ||
            page === currentPage
        ) {
            return;
        }

        fetchOpportunities(page);

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    const handleSearchClear = () => {
        setSearch("");
    };

    return (
        <div className="w-full">
            <div className="admin-content-width">
                <div className="space-y-6">

                    <section className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                        <div>
                            <Badge
                                variant="secondary"
                                className="mb-2"
                            >
                                Admin
                            </Badge>

                            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                                Manage Opportunities
                            </h1>

                            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
                                Create, review, edit, and remove
                                opportunities from the platform.
                            </p>
                        </div>

                        <Link
                            to="/admin/opportunities/create"
                            className="inline-flex h-9 w-fit shrink-0 items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow-xs transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        >
                            <FilePlus2 className="size-4" />
                            Add Opportunity
                        </Link>
                    </section>

                    {error && (
                        <div className="flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
                            <XCircle className="mt-0.5 size-4 shrink-0" />

                            <p>{error}</p>
                        </div>
                    )}

                    <Card>
                        <CardContent className="p-4">
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                                <div className="relative max-w-xl flex-1">
                                    <Search className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                                    <Input
                                        type="search"
                                        value={search}
                                        onChange={(event) =>
                                            setSearch(
                                                event.target.value
                                            )
                                        }
                                        placeholder="Search by title, university, country, or funding..."
                                        className="h-10 ps-9"
                                    />
                                </div>

                                {search && (
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        onClick={handleSearchClear}
                                    >
                                        Clear
                                    </Button>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>
                                Opportunities
                            </CardTitle>

                            <CardDescription>
                                {total}{" "}
                                {total === 1
                                    ? "opportunity"
                                    : "opportunities"}{" "}
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
                            ) : filteredOpportunities.length ===
                                0 ? (
                                <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
                                    <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-muted">
                                        <Search className="size-6 text-muted-foreground" />
                                    </div>

                                    <h2 className="text-lg font-semibold">
                                        {search
                                            ? "No matching opportunities"
                                            : "No opportunities found"}
                                    </h2>

                                    <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
                                        {search
                                            ? "Try another search term."
                                            : "There are no opportunities available yet."}
                                    </p>
                                </div>
                            ) : (
                                <>
                                    <div className="hidden overflow-x-auto md:block">
                                        <table className="w-full border-collapse text-start text-sm">
                                            <thead>
                                                <tr className="border-y bg-muted/40">
                                                    <th className="px-5 py-3 text-start font-medium">
                                                        Opportunity
                                                    </th>

                                                    <th className="px-5 py-3 text-start font-medium">
                                                        University
                                                    </th>

                                                    <th className="px-5 py-3 text-start font-medium">
                                                        Funding
                                                    </th>

                                                    <th className="px-5 py-3 text-start font-medium">
                                                        Deadline
                                                    </th>

                                                    <th className="px-5 py-3 text-start font-medium">
                                                        Status
                                                    </th>

                                                    <th className="px-5 py-3 text-start font-medium">
                                                        Actions
                                                    </th>
                                                </tr>
                                            </thead>

                                            <tbody>
                                                {filteredOpportunities.map(
                                                    (opportunity) => (
                                                        <tr
                                                            key={
                                                                opportunity.id
                                                            }
                                                            className="border-b last:border-b-0"
                                                        >
                                                            <td className="px-5 py-4 text-start align-middle">
                                                                <div className="min-w-56">
                                                                    <p className="font-medium">
                                                                        {opportunity.title ??
                                                                            "Untitled Opportunity"}
                                                                    </p>

                                                                    <p className="mt-1 text-xs text-muted-foreground">
                                                                        {getCountryName(
                                                                            opportunity
                                                                        )}
                                                                    </p>
                                                                </div>
                                                            </td>

                                                            <td className="px-5 py-4 text-start align-middle text-muted-foreground">
                                                                <div className="flex items-center gap-2">
                                                                    <Building2 className="size-4 shrink-0" />

                                                                    <span>
                                                                        {getUniversityName(
                                                                            opportunity
                                                                        )}
                                                                    </span>
                                                                </div>
                                                            </td>

                                                            <td className="px-5 py-4 text-start align-middle">
                                                                <Badge variant="outline">
                                                                    {getFundingName(
                                                                        opportunity
                                                                    )}
                                                                </Badge>
                                                            </td>

                                                            <td className="whitespace-nowrap px-5 py-4 text-start align-middle text-muted-foreground">
                                                                <div className="flex items-center gap-2">
                                                                    <CalendarDays className="size-4" />

                                                                    <span>
                                                                        {formatDate(
                                                                            opportunity.deadline
                                                                        )}
                                                                    </span>
                                                                </div>
                                                            </td>

                                                            <td className="px-5 py-4 text-start align-middle">
                                                                {opportunity.is_verified ? (
                                                                    <Badge className="gap-1">
                                                                        <CheckCircle2 className="size-3.5" />
                                                                        Verified
                                                                    </Badge>
                                                                ) : (
                                                                    <Badge variant="secondary">
                                                                        Not Verified
                                                                    </Badge>
                                                                )}
                                                            </td>

                                                            <td className="px-5 py-4 text-start align-middle">
                                                                <div className="flex items-center gap-2">
                                                                    <Link
                                                                        to={`/admin/opportunities/${opportunity.id}`}
                                                                        className={getActionLinkClass()}
                                                                        title="View opportunity"
                                                                        aria-label="View opportunity"
                                                                    >
                                                                        <Eye className="size-4" />
                                                                    </Link>

                                                                    <Link
                                                                        to={`/admin/opportunities/${opportunity.id}/edit`}
                                                                        className={getActionLinkClass()}
                                                                        title="Edit opportunity"
                                                                        aria-label="Edit opportunity"
                                                                    >
                                                                        <Pencil className="size-4" />
                                                                    </Link>

                                                                    <Button
                                                                        type="button"
                                                                        variant="outline"
                                                                        size="icon"
                                                                        className="text-destructive hover:text-destructive"
                                                                        disabled={
                                                                            deletingId ===
                                                                            opportunity.id
                                                                        }
                                                                        onClick={() =>
                                                                            handleDeleteClick(
                                                                                opportunity
                                                                            )
                                                                        }
                                                                        title="Delete opportunity"
                                                                        aria-label="Delete opportunity"
                                                                    >
                                                                        <Trash2 className="size-4" />
                                                                    </Button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    )
                                                )}
                                            </tbody>
                                        </table>
                                    </div>

                                    <div className="space-y-3 p-4 md:hidden">
                                        {filteredOpportunities.map(
                                            (opportunity) => (
                                                <div
                                                    key={
                                                        opportunity.id
                                                    }
                                                    className="rounded-xl border p-4"
                                                >
                                                    <div className="flex items-start justify-between gap-3">
                                                        <div className="min-w-0">
                                                            <p className="font-medium">
                                                                {opportunity.title ??
                                                                    "Untitled Opportunity"}
                                                            </p>

                                                            <p className="mt-1 text-sm text-muted-foreground">
                                                                {getUniversityName(
                                                                    opportunity
                                                                )}
                                                            </p>

                                                            <p className="mt-1 text-xs text-muted-foreground">
                                                                {getCountryName(
                                                                    opportunity
                                                                )}
                                                            </p>
                                                        </div>

                                                        {opportunity.is_verified ? (
                                                            <Badge className="shrink-0 gap-1">
                                                                <CheckCircle2 className="size-3" />
                                                                Verified
                                                            </Badge>
                                                        ) : (
                                                            <Badge
                                                                variant="secondary"
                                                                className="shrink-0"
                                                            >
                                                                Not Verified
                                                            </Badge>
                                                        )}
                                                    </div>

                                                    <div className="mt-4 grid grid-cols-2 gap-3">
                                                        <div className="rounded-lg bg-muted/40 p-3">
                                                            <p className="text-xs text-muted-foreground">
                                                                Funding
                                                            </p>

                                                            <p className="mt-1 text-sm font-medium">
                                                                {getFundingName(
                                                                    opportunity
                                                                )}
                                                            </p>
                                                        </div>

                                                        <div className="rounded-lg bg-muted/40 p-3">
                                                            <p className="text-xs text-muted-foreground">
                                                                Deadline
                                                            </p>

                                                            <p className="mt-1 text-sm font-medium">
                                                                {formatDate(
                                                                    opportunity.deadline
                                                                )}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div className="mt-4 flex items-center gap-2">
                                                        <Link
                                                            to={`/admin/opportunities/${opportunity.id}`}
                                                            className="inline-flex h-9 flex-1 items-center justify-center gap-2 rounded-md border border-input bg-background text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
                                                        >
                                                            <Eye className="size-4" />
                                                            View
                                                        </Link>

                                                        <Link
                                                            to={`/admin/opportunities/${opportunity.id}/edit`}
                                                            className="inline-flex h-9 flex-1 items-center justify-center gap-2 rounded-md border border-input bg-background text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
                                                        >
                                                            <Pencil className="size-4" />
                                                            Edit
                                                        </Link>

                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            size="icon"
                                                            className="text-destructive hover:text-destructive"
                                                            disabled={
                                                                deletingId ===
                                                                opportunity.id
                                                            }
                                                            onClick={() =>
                                                                handleDeleteClick(
                                                                    opportunity
                                                                )
                                                            }
                                                            title="Delete opportunity"
                                                            aria-label="Delete opportunity"
                                                        >
                                                            <Trash2 className="size-4" />
                                                        </Button>
                                                    </div>
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
                                        size="sm"
                                        variant={
                                            page === currentPage
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
                </div>
            </div>

            {/* Delete Confirmation Dialog */}

            <AlertDialog
                open={Boolean(deleteOpportunity)}
                onOpenChange={(open) => {
                    if (!open && !deletingId) {
                        setDeleteOpportunity(null);
                    }
                }}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            Delete Opportunity?
                        </AlertDialogTitle>

                        <AlertDialogDescription>
                            Are you sure you want to delete{" "}
                            <span className="font-medium text-foreground">
                                {deleteOpportunity?.title ??
                                    "this opportunity"}
                            </span>
                            ?

                            <br />

                            This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>

                    <AlertDialogFooter>
                        <AlertDialogCancel
                            disabled={Boolean(deletingId)}
                        >
                            Cancel
                        </AlertDialogCancel>

                        <AlertDialogAction
                            onClick={(event) => {
                                event.preventDefault();
                                handleConfirmDelete();
                            }}
                            disabled={Boolean(deletingId)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            {deletingId
                                ? "Deleting..."
                                : "Delete"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}

export default AdminOpportunities;
