import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    Sparkles,
    CalendarDays,
    Building2,
    MapPin,
    ArrowRight,
} from "lucide-react";

import { getRecommendedOpportunities } from "../../api/recommendations";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";

function Recommended() {
    const [opportunities, setOpportunities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadRecommendations = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await getRecommendedOpportunities();

                const data =
                    response?.data ??
                    response?.opportunities ??
                    response ??
                    [];

                setOpportunities(
                    Array.isArray(data) ? data : []
                );
            } catch (error) {
                console.error(
                    "Failed to load recommendations:",
                    error
                );

                setError(
                    error?.response?.data?.message ||
                    "Failed to load recommendations."
                );
            } finally {
                setLoading(false);
            }
        };

        loadRecommendations();
    }, []);

    /*
    |--------------------------------------------------------------------------
    | Helpers
    |--------------------------------------------------------------------------
    */

    const getDisplayValue = (value, fallback = "") => {
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
            if (value.name !== undefined) {
                return String(value.name);
            }

            if (value.title !== undefined) {
                return String(value.title);
            }

            if (value.label !== undefined) {
                return String(value.label);
            }

            if (value.code !== undefined) {
                return String(value.code);
            }

            return fallback;
        }

        return fallback;
    };

    const getOpportunityData = (item) => {
        if (
            item?.opportunity &&
            typeof item.opportunity === "object"
        ) {
            return item.opportunity;
        }

        return item ?? {};
    };

    const getOpportunityId = (item) => {
        const opportunity = getOpportunityData(item);

        return (
            opportunity?.id ??
            item?.opportunity_id ??
            item?.id ??
            null
        );
    };

    const getMatchScore = (item) => {
        return (
            item?.match_score ??
            item?.match_percentage ??
            item?.score ??
            item?.matching_score ??
            item?.match?.score ??
            null
        );
    };

    const getDeadline = (item) => {
        const opportunity = getOpportunityData(item);

        return (
            opportunity?.deadline ??
            opportunity?.application_deadline ??
            item?.deadline ??
            item?.application_deadline ??
            null
        );
    };

    const formatDate = (date) => {
        if (!date) {
            return "No deadline";
        }

        const parsedDate = new Date(date);

        if (
            Number.isNaN(
                parsedDate.getTime()
            )
        ) {
            return getDisplayValue(
                date,
                "No deadline"
            );
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

    const getUniversity = (opportunity) => {
        if (
            opportunity?.university &&
            typeof opportunity.university === "object"
        ) {
            return opportunity.university;
        }

        return null;
    };

    const getCountry = (
        opportunity,
        university
    ) => {
        if (
            university?.country &&
            typeof university.country === "object"
        ) {
            return university.country;
        }

        if (
            opportunity?.country &&
            typeof opportunity.country === "object"
        ) {
            return opportunity.country;
        }

        return null;
    };

    /*
    |--------------------------------------------------------------------------
    | Loading
    |--------------------------------------------------------------------------
    */

    if (loading) {
        return (
            <div className="w-full">
                <div className="mx-auto max-w-7xl p-6">
                    <div className="space-y-4">
                        <div className="h-8 w-56 animate-pulse rounded bg-muted" />

                        <div className="h-4 w-96 animate-pulse rounded bg-muted" />

                        <div className="grid gap-6 md:grid-cols-2">
                            <div className="h-56 animate-pulse rounded-xl bg-muted" />

                            <div className="h-56 animate-pulse rounded-xl bg-muted" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Error
    |--------------------------------------------------------------------------
    */

    if (error) {
        return (
            <div className="w-full">
                <div className="mx-auto max-w-7xl p-6">
                    <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6 text-destructive">
                        {error}
                    </div>
                </div>
            </div>
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Page
    |--------------------------------------------------------------------------
    */

    return (
        <div className="w-full">
            <div className="mx-auto max-w-7xl p-6">

                <div className="mb-8">
                    <div className="flex items-center gap-3">

                        <div className="flex size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                            <Sparkles className="size-5" />
                        </div>

                        <div>
                            <h1 className="text-3xl font-semibold tracking-tight">
                                Recommended for You
                            </h1>

                            <p className="mt-1 text-muted-foreground">
                                Opportunities selected based on your profile.
                            </p>
                        </div>

                    </div>
                </div>

                {opportunities.length === 0 ? (
                    <Card>
                        <CardContent className="flex min-h-64 flex-col items-center justify-center text-center">

                            <div className="flex size-12 items-center justify-center rounded-full bg-muted">
                                <Sparkles className="size-6 text-muted-foreground" />
                            </div>

                            <h2 className="mt-4 text-lg font-semibold">
                                No recommendations yet
                            </h2>

                            <p className="mt-2 max-w-md text-sm text-muted-foreground">
                                Complete your profile to receive personalized opportunity recommendations.
                            </p>

                            <Link
                                to="/student/profile"
                                className="mt-5 inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
                            >
                                Complete Profile

                                <ArrowRight className="size-4" />
                            </Link>

                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2">

                        {opportunities.map(
                            (item, index) => {

                                const opportunity =
                                    getOpportunityData(item);

                                const opportunityId =
                                    getOpportunityId(item);

                                const matchScore =
                                    getMatchScore(item);

                                const deadline =
                                    getDeadline(item);

                                const university =
                                    getUniversity(
                                        opportunity
                                    );

                                const country =
                                    getCountry(
                                        opportunity,
                                        university
                                    );

                                const title =
                                    getDisplayValue(
                                        opportunity?.title ??
                                        opportunity?.name,
                                        "Untitled Opportunity"
                                    );

                                const description =
                                    getDisplayValue(
                                        opportunity?.description,
                                        "Academic opportunity"
                                    );

                                const universityName =
                                    getDisplayValue(
                                        university?.name
                                    );

                                const countryName =
                                    getDisplayValue(
                                        country?.name
                                    );

                                return (
                                    <Card
                                        key={
                                            opportunityId ??
                                            `recommendation-${index}`
                                        }
                                        className="flex h-full flex-col transition-shadow hover:shadow-md"
                                    >

                                        <CardHeader>

                                            <div className="flex items-start justify-between gap-4">

                                                <div className="min-w-0">

                                                    <CardTitle className="text-xl">
                                                        {title}
                                                    </CardTitle>

                                                    <CardDescription className="mt-2">
                                                        {description}
                                                    </CardDescription>

                                                </div>

                                                {matchScore !== null &&
                                                    matchScore !== undefined &&
                                                    !Number.isNaN(
                                                        Number(matchScore)
                                                    ) && (
                                                        <Badge className="shrink-0">
                                                            {Math.round(
                                                                Number(
                                                                    matchScore
                                                                )
                                                            )}
                                                            % Match
                                                        </Badge>
                                                    )}

                                            </div>

                                        </CardHeader>

                                        <CardContent className="flex flex-1 flex-col">

                                            <div className="space-y-3">

                                                {universityName && (
                                                    <div className="flex items-center gap-2 text-sm">

                                                        <Building2 className="size-4 text-muted-foreground" />

                                                        <span>
                                                            {universityName}
                                                        </span>

                                                    </div>
                                                )}

                                                {countryName && (
                                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">

                                                        <MapPin className="size-4" />

                                                        <span>
                                                            {countryName}
                                                        </span>

                                                    </div>
                                                )}

                                                {deadline && (
                                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">

                                                        <CalendarDays className="size-4" />

                                                        <span>
                                                            Deadline{" "}
                                                            {formatDate(
                                                                deadline
                                                            )}
                                                        </span>

                                                    </div>
                                                )}

                                            </div>

                                            <div className="mt-auto pt-6">

                                                {opportunityId ? (
                                                    <Link
                                                        to={`/student/opportunities/${opportunityId}`}
                                                        className="inline-flex w-full items-center justify-center gap-2 rounded-md border px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
                                                    >
                                                        View Opportunity

                                                        <ArrowRight className="size-4" />
                                                    </Link>
                                                ) : (
                                                    <span className="inline-flex w-full cursor-not-allowed items-center justify-center rounded-md border px-4 py-2 text-sm text-muted-foreground">
                                                        Opportunity unavailable
                                                    </span>
                                                )}

                                            </div>

                                        </CardContent>

                                    </Card>
                                );
                            }
                        )}

                    </div>
                )}

            </div>
        </div>
    );
}

export default Recommended;
