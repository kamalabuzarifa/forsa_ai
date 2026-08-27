import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
    Building2,
    CalendarDays,
    CheckCircle2,
    GraduationCap,
    MapPin,
    Search,
    SlidersHorizontal,
} from "lucide-react";

import { getOpportunities } from "../../api/opportunities";

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const getOpportunityList = (response) => {
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

const getUniversityName = (opportunity) => {
    if (
        opportunity?.university &&
        typeof opportunity.university === "object"
    ) {
        return (
            opportunity.university.name ||
            opportunity.university.title ||
            "N/A"
        );
    }

    return (
        opportunity?.university_name ||
        opportunity?.university ||
        "N/A"
    );
};

const getCountryName = (opportunity) => {
    if (
        opportunity?.country &&
        typeof opportunity.country === "object"
    ) {
        return (
            opportunity.country.name ||
            opportunity.country.title ||
            "N/A"
        );
    }

    return (
        opportunity?.country_name ||
        opportunity?.country ||
        "N/A"
    );
};

const getFundingName = (opportunity) => {
    if (
        opportunity?.funding_type &&
        typeof opportunity.funding_type === "object"
    ) {
        return (
            opportunity.funding_type.name ||
            opportunity.funding_type.title ||
            "N/A"
        );
    }

    return (
        opportunity?.funding ||
        opportunity?.funding_type ||
        "N/A"
    );
};

const getTypeName = (opportunity) => {
    if (
        opportunity?.opportunity_type &&
        typeof opportunity.opportunity_type === "object"
    ) {
        return (
            opportunity.opportunity_type.name ||
            opportunity.opportunity_type.title ||
            "N/A"
        );
    }

    return opportunity?.type || "N/A";
};

const formatDate = (date) => {
    if (!date) {
        return "No deadline";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
        return "No deadline";
    }

    return parsedDate.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
};

const getDeadlineDate = (date) => {
    if (!date) {
        return null;
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
        return null;
    }

    return parsedDate;
};

function Opportunities() {
    const [opportunities, setOpportunities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [search, setSearch] = useState("");
    const [fundingFilter, setFundingFilter] =
        useState("all");
    const [verifiedOnly, setVerifiedOnly] =
        useState(false);

    const loadOpportunities = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await getOpportunities();

            setOpportunities(
                getOpportunityList(response)
            );
        } catch (err) {
            console.error(
                "Failed to load opportunities:",
                err
            );

            setError(
                err?.response?.data?.message ||
                "Failed to load opportunities."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadOpportunities();
    }, []);

    const fundingOptions = useMemo(() => {
        const values = opportunities
            .map((opportunity) =>
                getFundingName(opportunity)
            )
            .filter(
                (value) =>
                    value &&
                    value !== "N/A"
            );

        return [...new Set(values)];
    }, [opportunities]);

    const filteredOpportunities = useMemo(() => {
        const normalizedSearch =
            search.trim().toLowerCase();

        return opportunities.filter(
            (opportunity) => {
                const title = String(
                    opportunity?.title || ""
                ).toLowerCase();

                const description = String(
                    opportunity?.description || ""
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

                const matchesSearch =
                    !normalizedSearch ||
                    title.includes(
                        normalizedSearch
                    ) ||
                    description.includes(
                        normalizedSearch
                    ) ||
                    university.includes(
                        normalizedSearch
                    ) ||
                    country.includes(
                        normalizedSearch
                    ) ||
                    funding.includes(
                        normalizedSearch
                    );

                const matchesFunding =
                    fundingFilter === "all" ||
                    getFundingName(
                        opportunity
                    ) === fundingFilter;

                const matchesVerified =
                    !verifiedOnly ||
                    opportunity?.is_verified === true;

                return (
                    matchesSearch &&
                    matchesFunding &&
                    matchesVerified
                );
            }
        );
    }, [
        opportunities,
        search,
        fundingFilter,
        verifiedOnly,
    ]);

    const clearFilters = () => {
        setSearch("");
        setFundingFilter("all");
        setVerifiedOnly(false);
    };

    return (
        <div className="w-full">
            <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                <div className="space-y-6">
                    <section className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                        <div>
                            <div className="mb-2 flex items-center gap-2">
                                <Badge
                                    variant="secondary"
                                    className="w-fit"
                                >
                                    Explore
                                </Badge>

                                <span className="text-sm text-muted-foreground">
                                    {
                                        filteredOpportunities.length
                                    }{" "}
                                    opportunities
                                </span>
                            </div>

                            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                                Opportunities
                            </h1>

                            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
                                Find scholarships and other
                                opportunities that match your
                                academic profile.
                            </p>
                        </div>

                        <Button
                            type="button"
                            variant="outline"
                            onClick={loadOpportunities}
                            disabled={loading}
                        >
                            Refresh
                        </Button>
                    </section>

                    <Card>
                        <CardContent className="p-4">
                            <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
                                <div className="relative flex-1">
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

                                <div className="flex items-center gap-2">
                                    <SlidersHorizontal className="size-4 text-muted-foreground" />

                                    <select
                                        value={fundingFilter}
                                        onChange={(event) =>
                                            setFundingFilter(
                                                event.target.value
                                            )
                                        }
                                        className="h-10 rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                                    >
                                        <option value="all">
                                            All Funding
                                        </option>

                                        {fundingOptions.map(
                                            (funding) => (
                                                <option
                                                    key={
                                                        funding
                                                    }
                                                    value={
                                                        funding
                                                    }
                                                >
                                                    {funding}
                                                </option>
                                            )
                                        )}
                                    </select>
                                </div>

                                <Button
                                    type="button"
                                    variant={
                                        verifiedOnly
                                            ? "default"
                                            : "outline"
                                    }
                                    onClick={() =>
                                        setVerifiedOnly(
                                            (value) =>
                                                !value
                                        )
                                    }
                                >
                                    <CheckCircle2 className="size-4" />
                                    Verified Only
                                </Button>
                            </div>

                            {(search ||
                                fundingFilter !== "all" ||
                                verifiedOnly) && (
                                    <div className="mt-4 flex items-center justify-between border-t pt-4">
                                        <p className="text-sm text-muted-foreground">
                                            Filters are active
                                        </p>

                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={
                                                clearFilters
                                            }
                                        >
                                            Clear Filters
                                        </Button>
                                    </div>
                                )}
                        </CardContent>
                    </Card>

                    {loading && (
                        <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                            {[1, 2, 3, 4, 5, 6].map(
                                (item) => (
                                    <Card
                                        key={item}
                                        className="overflow-hidden"
                                    >
                                        <div className="h-2 bg-muted" />

                                        <CardHeader>
                                            <div className="h-5 w-3/4 animate-pulse rounded bg-muted" />

                                            <div className="mt-2 h-4 w-full animate-pulse rounded bg-muted" />

                                            <div className="h-4 w-2/3 animate-pulse rounded bg-muted" />
                                        </CardHeader>

                                        <CardContent className="space-y-3">
                                            <div className="h-4 w-full animate-pulse rounded bg-muted" />
                                            <div className="h-4 w-5/6 animate-pulse rounded bg-muted" />
                                            <div className="h-4 w-4/6 animate-pulse rounded bg-muted" />
                                        </CardContent>

                                        <CardFooter>
                                            <div className="h-9 w-full animate-pulse rounded bg-muted" />
                                        </CardFooter>
                                    </Card>
                                )
                            )}
                        </section>
                    )}

                    {!loading && error && (
                        <Card>
                            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                                <p className="text-lg font-medium">
                                    Unable to load opportunities
                                </p>

                                <p className="mt-2 max-w-md text-sm text-muted-foreground">
                                    {error}
                                </p>

                                <Button
                                    type="button"
                                    className="mt-5"
                                    onClick={
                                        loadOpportunities
                                    }
                                >
                                    Try Again
                                </Button>
                            </CardContent>
                        </Card>
                    )}

                    {!loading &&
                        !error &&
                        filteredOpportunities.length ===
                        0 && (
                            <Card>
                                <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                                    <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-muted">
                                        <Search className="size-5 text-muted-foreground" />
                                    </div>

                                    <p className="text-lg font-medium">
                                        No opportunities found
                                    </p>

                                    <p className="mt-2 max-w-md text-sm text-muted-foreground">
                                        Try changing your search
                                        or removing some filters.
                                    </p>

                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="mt-5"
                                        onClick={
                                            clearFilters
                                        }
                                    >
                                        Clear Filters
                                    </Button>
                                </CardContent>
                            </Card>
                        )}

                    {!loading &&
                        !error &&
                        filteredOpportunities.length >
                        0 && (
                            <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                                {filteredOpportunities.map(
                                    (opportunity) => {
                                        const deadline =
                                            getDeadlineDate(
                                                opportunity.deadline
                                            );

                                        const isDeadlinePassed =
                                            deadline &&
                                            deadline <
                                            new Date();

                                        return (
                                            <Card
                                                key={
                                                    opportunity.id
                                                }
                                                className="group flex h-full flex-col overflow-hidden transition-shadow hover:shadow-md"
                                            >
                                                <div className="h-1 bg-primary" />

                                                <CardHeader>
                                                    <div className="flex items-start justify-between gap-3">
                                                        <div className="min-w-0">
                                                            <CardTitle className="line-clamp-2 text-xl transition-colors group-hover:text-primary">
                                                                {
                                                                    opportunity.title
                                                                }
                                                            </CardTitle>

                                                            <CardDescription className="mt-2 line-clamp-2">
                                                                {opportunity.description ||
                                                                    "No description available."}
                                                            </CardDescription>
                                                        </div>

                                                        {opportunity.is_verified && (
                                                            <Badge
                                                                variant="secondary"
                                                                className="shrink-0"
                                                            >
                                                                <CheckCircle2 className="size-3.5" />

                                                                Verified
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </CardHeader>

                                                <CardContent className="flex-1 space-y-3">
                                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                        <Building2 className="size-4 shrink-0" />

                                                        <span className="truncate">
                                                            {
                                                                getUniversityName(
                                                                    opportunity
                                                                )
                                                            }
                                                        </span>
                                                    </div>

                                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                        <MapPin className="size-4 shrink-0" />

                                                        <span className="truncate">
                                                            {
                                                                getCountryName(
                                                                    opportunity
                                                                )
                                                            }
                                                        </span>
                                                    </div>

                                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                        <GraduationCap className="size-4 shrink-0" />

                                                        <span>
                                                            {
                                                                getTypeName(
                                                                    opportunity
                                                                )
                                                            }
                                                        </span>
                                                    </div>

                                                    <div className="flex items-center justify-between gap-3 rounded-lg bg-muted/50 px-3 py-2">
                                                        <div>
                                                            <p className="text-xs text-muted-foreground">
                                                                Funding
                                                            </p>

                                                            <p className="text-sm font-medium">
                                                                {
                                                                    getFundingName(
                                                                        opportunity
                                                                    )
                                                                }
                                                            </p>
                                                        </div>

                                                        <div className="text-end">
                                                            <p className="text-xs text-muted-foreground">
                                                                Deadline
                                                            </p>

                                                            <div className="flex items-center gap-1 text-sm font-medium">
                                                                <CalendarDays className="size-3.5" />

                                                                <span
                                                                    className={
                                                                        isDeadlinePassed
                                                                            ? "text-destructive"
                                                                            : ""
                                                                    }
                                                                >
                                                                    {formatDate(
                                                                        opportunity.deadline
                                                                    )}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </CardContent>

                                                <CardFooter>
                                                    <Button
                                                        asChild
                                                        className="w-full"
                                                    >
                                                        <Link
                                                            to={`/student/opportunities/${opportunity.id}`}
                                                        >
                                                            View Details
                                                        </Link>
                                                    </Button>
                                                </CardFooter>
                                            </Card>
                                        );
                                    }
                                )}
                            </section>
                        )}
                </div>
            </div>
        </div>
    );
}

export default Opportunities;
