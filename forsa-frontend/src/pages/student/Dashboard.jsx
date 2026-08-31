import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
    getRecommendedOpportunities,
    getOpportunities,
} from "../../api/opportunities";
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
| Helpers
|--------------------------------------------------------------------------
*/

const getData = (response) => {
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

const getStatusValue = (status) => {
    if (status === null || status === undefined) {
        return "pending";
    }

    if (typeof status === "object") {
        return String(
            status.value ??
            status.code ??
            status.name ??
            status.label ??
            status.status ??
            "pending"
        ).toLowerCase();
    }

    return String(status).toLowerCase();
};

const getStatusLabel = (status) => {
    const value = getStatusValue(status);

    switch (value) {
        case "accepted":
        case "approved":
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
    const value = getStatusValue(status);

    if (
        value === "accepted" ||
        value === "approved"
    ) {
        return "default";
    }

    if (value === "rejected") {
        return "destructive";
    }

    return "secondary";
};

/*
|--------------------------------------------------------------------------
| Opportunity Helpers
|--------------------------------------------------------------------------
*/

const getOpportunityId = (opportunity) => {
    return (
        opportunity?.id ??
        opportunity?.opportunity_id ??
        opportunity?.opportunity?.id ??
        opportunity?.opportunity?.opportunity_id ??
        null
    );
};

const getOpportunityTitle = (opportunity) => {
    return (
        opportunity?.title ??
        opportunity?.name ??
        opportunity?.opportunity_title ??
        opportunity?.opportunity?.title ??
        opportunity?.opportunity?.name ??
        "Untitled Opportunity"
    );
};

const getUniversityName = (opportunity) => {
    const university =
        opportunity?.university ??
        opportunity?.opportunity?.university;

    if (
        university &&
        typeof university === "object"
    ) {
        return (
            university.name ??
            university.title ??
            "Unknown University"
        );
    }

    return (
        opportunity?.university_name ??
        opportunity?.opportunity?.university_name ??
        university ??
        "Unknown University"
    );
};

const getCountryName = (opportunity) => {
    const country =
        opportunity?.country ??
        opportunity?.opportunity?.country;

    if (
        country &&
        typeof country === "object"
    ) {
        return (
            country.name ??
            country.title ??
            "Unknown Country"
        );
    }

    return (
        opportunity?.country_name ??
        opportunity?.opportunity?.country_name ??
        country ??
        "Unknown Country"
    );
};

const getMatchScore = (opportunity) => {
    const score =
        opportunity?.match_score ??
        opportunity?.matching_score ??
        opportunity?.match_percentage ??
        opportunity?.score ??
        opportunity?.match?.score ??
        opportunity?.opportunity?.match_score ??
        opportunity?.opportunity?.matching_score ??
        opportunity?.opportunity?.match_percentage ??
        opportunity?.opportunity?.score;

    if (
        score === null ||
        score === undefined
    ) {
        return null;
    }

    const number = Number(score);

    if (Number.isNaN(number)) {
        return null;
    }

    return Math.round(number);
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

const getDaysRemaining = (date) => {
    if (!date) {
        return null;
    }

    const deadline = new Date(date);

    if (Number.isNaN(deadline.getTime())) {
        return null;
    }

    const now = new Date();

    const difference =
        deadline.getTime() -
        now.getTime();

    return Math.ceil(
        difference /
        (1000 * 60 * 60 * 24)
    );
};

/*
|--------------------------------------------------------------------------
| Component
|--------------------------------------------------------------------------
*/

function Dashboard() {
    const { user } = useAuth();

    const [recommendations, setRecommendations] =
        useState([]);

    const [applications, setApplications] =
        useState([]);

    const [opportunities, setOpportunities] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    /*
    |--------------------------------------------------------------------------
    | Load Dashboard
    |--------------------------------------------------------------------------
    */

    useEffect(() => {
        const loadDashboard = async () => {
            try {
                setLoading(true);
                setError("");

                const [
                    recommendationsResponse,
                    applicationsResponse,
                    opportunitiesResponse,
                ] = await Promise.all([
                    getRecommendedOpportunities(6),
                    getMyApplications(),
                    getOpportunities({
                        per_page: 10,
                    }),
                ]);

                setRecommendations(
                    getData(
                        recommendationsResponse
                    )
                );

                setApplications(
                    getData(
                        applicationsResponse
                    )
                );

                setOpportunities(
                    getData(
                        opportunitiesResponse
                    )
                );
            } catch (err) {
                console.error(
                    "Failed to load student dashboard:",
                    err
                );

                setError(
                    err?.response?.data?.message ||
                    "Failed to load dashboard data."
                );
            } finally {
                setLoading(false);
            }
        };

        loadDashboard();
    }, []);

    /*
    |--------------------------------------------------------------------------
    | Statistics
    |--------------------------------------------------------------------------
    */

    const statistics = useMemo(() => {
        let pending = 0;
        let accepted = 0;
        let rejected = 0;

        applications.forEach(
            (application) => {
                const status =
                    getStatusValue(
                        application?.status
                    );

                if (
                    status === "pending"
                ) {
                    pending += 1;
                }

                if (
                    status === "accepted" ||
                    status === "approved"
                ) {
                    accepted += 1;
                }

                if (
                    status === "rejected"
                ) {
                    rejected += 1;
                }
            }
        );

        return {
            applications:
                applications.length,

            pending,

            accepted,

            rejected,

            opportunities:
                opportunities.length,

            recommendations:
                recommendations.length,
        };
    }, [
        applications,
        opportunities,
        recommendations,
    ]);

    /*
    |--------------------------------------------------------------------------
    | Upcoming Deadlines
    |--------------------------------------------------------------------------
    */

    const upcomingDeadlines = useMemo(() => {
        const now = new Date();

        return opportunities
            .filter(
                (opportunity) =>
                    opportunity?.deadline
            )
            .map(
                (opportunity) => {
                    const deadline =
                        new Date(
                            opportunity.deadline
                        );

                    return {
                        ...opportunity,
                        deadline,
                    };
                }
            )
            .filter(
                (opportunity) =>
                    !Number.isNaN(
                        opportunity.deadline.getTime()
                    ) &&
                    opportunity.deadline >= now
            )
            .sort(
                (first, second) =>
                    first.deadline.getTime() -
                    second.deadline.getTime()
            )
            .slice(0, 4);
    }, [opportunities]);

    /*
    |--------------------------------------------------------------------------
    | Recent Applications
    |--------------------------------------------------------------------------
    */

    const recentApplications = useMemo(() => {
        return [...applications]
            .sort((first, second) => {
                const firstDate =
                    new Date(
                        first?.created_at ?? 0
                    ).getTime();

                const secondDate =
                    new Date(
                        second?.created_at ?? 0
                    ).getTime();

                return (
                    secondDate -
                    firstDate
                );
            })
            .slice(0, 4);
    }, [applications]);

    /*
    |--------------------------------------------------------------------------
    | Render
    |--------------------------------------------------------------------------
    */

    return (
        <div className="w-full">
            <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                <div className="space-y-6">

                    {/* Hero */}

                    <section className="rounded-2xl border bg-card p-6 shadow-sm sm:p-8">
                        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

                            <div className="space-y-3">

                                <Badge
                                    variant="secondary"
                                    className="w-fit"
                                >
                                    Student Portal
                                </Badge>

                                <div>
                                    <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                                        Welcome back,{" "}
                                        {user?.name ||
                                            "Student"}
                                    </h1>

                                    <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
                                        Discover academic
                                        opportunities that
                                        match your profile
                                        and track your
                                        applications.
                                    </p>
                                </div>

                            </div>

                            <div className="flex flex-wrap gap-2">

                                <Button
                                    asChild
                                    className="cursor-pointer"
                                >
                                    <Link to="/student/opportunities">
                                        Explore Opportunities
                                    </Link>
                                </Button>

                                <Button
                                    asChild
                                    variant="outline"
                                    className="cursor-pointer"
                                >
                                    <Link to="/student/applications">
                                        My Applications
                                    </Link>
                                </Button>

                            </div>

                        </div>
                    </section>

                    {/* Error */}

                    {error && (
                        <div className="rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
                            {error}
                        </div>
                    )}

                    {/* Statistics */}

                    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

                        <Card>
                            <CardHeader className="pb-2">
                                <CardDescription>
                                    Recommended
                                </CardDescription>

                                <CardTitle className="text-3xl">
                                    {loading
                                        ? "—"
                                        : statistics.recommendations}
                                </CardTitle>
                            </CardHeader>

                            <CardContent>
                                <p className="text-xs text-muted-foreground">
                                    Opportunities matched
                                    to your profile
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="pb-2">
                                <CardDescription>
                                    Available Opportunities
                                </CardDescription>

                                <CardTitle className="text-3xl">
                                    {loading
                                        ? "—"
                                        : statistics.opportunities}
                                </CardTitle>
                            </CardHeader>

                            <CardContent>
                                <p className="text-xs text-muted-foreground">
                                    Published opportunities
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="pb-2">
                                <CardDescription>
                                    My Applications
                                </CardDescription>

                                <CardTitle className="text-3xl">
                                    {loading
                                        ? "—"
                                        : statistics.applications}
                                </CardTitle>
                            </CardHeader>

                            <CardContent>
                                <p className="text-xs text-muted-foreground">
                                    Applications submitted
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="pb-2">
                                <CardDescription>
                                    Accepted
                                </CardDescription>

                                <CardTitle className="text-3xl">
                                    {loading
                                        ? "—"
                                        : statistics.accepted}
                                </CardTitle>
                            </CardHeader>

                            <CardContent>
                                <p className="text-xs text-muted-foreground">
                                    Accepted applications
                                </p>
                            </CardContent>
                        </Card>

                    </section>

                    {/* Recommended Opportunities */}

                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between gap-4">

                                <div>
                                    <CardTitle>
                                        Recommended for You
                                    </CardTitle>

                                    <CardDescription className="mt-1">
                                        Opportunities selected
                                        based on your profile
                                    </CardDescription>
                                </div>

                                <Button
                                    asChild
                                    variant="ghost"
                                    size="sm"
                                    className="cursor-pointer"
                                >
                                    <Link to="/student/opportunities">
                                        View All
                                    </Link>
                                </Button>

                            </div>
                        </CardHeader>

                        <CardContent>

                            {loading ? (

                                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">

                                    {[1, 2, 3].map(
                                        (item) => (
                                            <div
                                                key={item}
                                                className="h-48 animate-pulse rounded-xl bg-muted"
                                            />
                                        )
                                    )}

                                </div>

                            ) : recommendations.length === 0 ? (

                                <div className="rounded-xl border border-dashed p-8 text-center">

                                    <p className="font-medium">
                                        No recommendations yet
                                    </p>

                                    <p className="mt-1 text-sm text-muted-foreground">
                                        Complete your profile
                                        to receive better
                                        opportunity matches.
                                    </p>

                                    <Button
                                        asChild
                                        className="mt-4 cursor-pointer"
                                    >
                                        <Link to="/student/opportunities">
                                            Explore Opportunities
                                        </Link>
                                    </Button>

                                </div>

                            ) : (

                                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">

                                    {recommendations.map(
                                        (opportunity, index) => {

                                            const matchScore =
                                                getMatchScore(
                                                    opportunity
                                                );

                                            const opportunityId =
                                                getOpportunityId(
                                                    opportunity
                                                );

                                            return (
                                                <Card
                                                    key={
                                                        opportunityId ??
                                                        `recommendation-${index}`
                                                    }
                                                    className="overflow-hidden"
                                                >

                                                    <CardHeader>

                                                        <div className="flex items-start justify-between gap-3">

                                                            <div className="min-w-0">

                                                                <CardTitle className="line-clamp-2 text-base">
                                                                    {getOpportunityTitle(
                                                                        opportunity
                                                                    )}
                                                                </CardTitle>

                                                                <CardDescription className="mt-1">
                                                                    {getUniversityName(
                                                                        opportunity
                                                                    )}
                                                                </CardDescription>

                                                            </div>

                                                            {matchScore !== null && (
                                                                <Badge variant="secondary">
                                                                    {matchScore}% Match
                                                                </Badge>
                                                            )}

                                                        </div>

                                                    </CardHeader>

                                                    <CardContent>

                                                        <div className="space-y-3">

                                                            <div className="flex flex-wrap gap-2">

                                                                <Badge variant="outline">
                                                                    {getCountryName(
                                                                        opportunity
                                                                    )}
                                                                </Badge>

                                                                {opportunity?.type?.name && (
                                                                    <Badge variant="outline">
                                                                        {
                                                                            opportunity
                                                                                .type
                                                                                .name
                                                                        }
                                                                    </Badge>
                                                                )}

                                                            </div>

                                                            <div className="text-sm text-muted-foreground">

                                                                {opportunity?.deadline
                                                                    ? `Deadline ${formatDate(
                                                                        opportunity.deadline
                                                                    )}`
                                                                    : "No deadline specified"}

                                                            </div>

                                                            <Button
                                                                asChild={
                                                                    Boolean(
                                                                        opportunityId
                                                                    )
                                                                }
                                                                className="w-full cursor-pointer"
                                                                variant="outline"
                                                                disabled={
                                                                    !opportunityId
                                                                }
                                                            >
                                                                {opportunityId ? (
                                                                    <Link
                                                                        to={`/student/opportunities/${opportunityId}`}
                                                                    >
                                                                        View Opportunity
                                                                    </Link>
                                                                ) : (
                                                                    <span>
                                                                        View Opportunity
                                                                    </span>
                                                                )}
                                                            </Button>

                                                        </div>

                                                    </CardContent>

                                                </Card>
                                            );
                                        }
                                    )}

                                </div>

                            )}

                        </CardContent>
                    </Card>

                    {/* Deadlines + Applications */}

                    <section className="grid gap-6 lg:grid-cols-2">

                        {/* Deadlines */}

                        <Card>
                            <CardHeader>

                                <CardTitle>
                                    Upcoming Deadlines
                                </CardTitle>

                                <CardDescription>
                                    Published opportunities
                                    with upcoming deadlines
                                </CardDescription>

                            </CardHeader>

                            <CardContent>

                                {loading ? (

                                    <div className="space-y-3">

                                        {[1, 2, 3].map(
                                            (item) => (
                                                <div
                                                    key={item}
                                                    className="h-16 animate-pulse rounded-xl bg-muted"
                                                />
                                            )
                                        )}

                                    </div>

                                ) : upcomingDeadlines.length === 0 ? (

                                    <div className="rounded-xl border border-dashed p-6 text-center">

                                        <p className="font-medium">
                                            No upcoming deadlines
                                        </p>

                                        <p className="mt-1 text-sm text-muted-foreground">
                                            Browse opportunities
                                            to find upcoming
                                            applications.
                                        </p>

                                    </div>

                                ) : (

                                    <div className="space-y-3">

                                        {upcomingDeadlines.map(
                                            (opportunity) => {

                                                const days =
                                                    getDaysRemaining(
                                                        opportunity.deadline
                                                    );

                                                const opportunityId =
                                                    getOpportunityId(
                                                        opportunity
                                                    );

                                                if (!opportunityId) {
                                                    return null;
                                                }

                                                return (
                                                    <Link
                                                        key={
                                                            opportunityId
                                                        }
                                                        to={`/student/opportunities/${opportunityId}`}
                                                        className="block cursor-pointer rounded-xl border p-4 transition-colors hover:bg-muted/50"
                                                    >

                                                        <div className="flex items-center justify-between gap-4">

                                                            <div className="min-w-0">

                                                                <p className="truncate font-medium">
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
                                                                variant={
                                                                    days !== null &&
                                                                        days <= 7
                                                                        ? "destructive"
                                                                        : "secondary"
                                                                }
                                                            >
                                                                {days === 0
                                                                    ? "Today"
                                                                    : days === 1
                                                                        ? "1 day"
                                                                        : `${days} days`}
                                                            </Badge>

                                                        </div>

                                                        <p className="mt-2 text-xs text-muted-foreground">
                                                            Deadline{" "}
                                                            {formatDate(
                                                                opportunity.deadline
                                                            )}
                                                        </p>

                                                    </Link>
                                                );
                                            }
                                        )}

                                    </div>

                                )}

                            </CardContent>
                        </Card>

                        {/* Applications */}

                        <Card>
                            <CardHeader>

                                <div className="flex items-center justify-between gap-4">

                                    <div>

                                        <CardTitle>
                                            My Applications
                                        </CardTitle>

                                        <CardDescription>
                                            Track your recent
                                            applications
                                        </CardDescription>

                                    </div>

                                    {applications.length > 0 && (
                                        <Button
                                            asChild
                                            variant="ghost"
                                            size="sm"
                                            className="cursor-pointer"
                                        >
                                            <Link to="/student/applications">
                                                View All
                                            </Link>
                                        </Button>
                                    )}

                                </div>

                            </CardHeader>

                            <CardContent>

                                {loading ? (

                                    <div className="space-y-3">

                                        {[1, 2, 3].map(
                                            (item) => (
                                                <div
                                                    key={item}
                                                    className="h-16 animate-pulse rounded-xl bg-muted"
                                                />
                                            )
                                        )}

                                    </div>

                                ) : recentApplications.length === 0 ? (

                                    <div className="rounded-xl border border-dashed p-6 text-center">

                                        <p className="font-medium">
                                            No applications yet
                                        </p>

                                        <p className="mt-1 text-sm text-muted-foreground">
                                            Find an opportunity
                                            that matches your
                                            profile.
                                        </p>

                                        <Button
                                            asChild
                                            className="mt-4 cursor-pointer"
                                        >
                                            <Link to="/student/opportunities">
                                                Explore Opportunities
                                            </Link>
                                        </Button>

                                    </div>

                                ) : (

                                    <div className="space-y-3">

                                        {recentApplications.map(
                                            (application) => (
                                                <Link
                                                    key={
                                                        application.id
                                                    }
                                                    to={`/student/applications/${application.id}`}
                                                    className="block cursor-pointer rounded-xl border p-4 transition-colors hover:bg-muted/50"
                                                >

                                                    <div className="flex items-center justify-between gap-4">

                                                        <div className="min-w-0">

                                                            <p className="truncate font-medium">
                                                                {getOpportunityTitle(
                                                                    application?.opportunity
                                                                )}
                                                            </p>

                                                            <p className="mt-1 text-xs text-muted-foreground">
                                                                Submitted{" "}
                                                                {formatDate(
                                                                    application.created_at
                                                                )}
                                                            </p>

                                                        </div>

                                                        <Badge
                                                            variant={getStatusVariant(
                                                                application.status
                                                            )}
                                                        >
                                                            {getStatusLabel(
                                                                application.status
                                                            )}
                                                        </Badge>

                                                    </div>

                                                </Link>
                                            )
                                        )}

                                    </div>

                                )}

                            </CardContent>
                        </Card>

                    </section>

                    {/* Quick Actions */}

                    <Card>
                        <CardHeader>

                            <CardTitle>
                                Quick Actions
                            </CardTitle>

                            <CardDescription>
                                Access the main student features
                            </CardDescription>

                        </CardHeader>

                        <CardContent>

                            <div className="grid gap-3 sm:grid-cols-3">

                                <Button
                                    asChild
                                    variant="outline"
                                    className="h-auto cursor-pointer justify-start p-4"
                                >
                                    <Link to="/student/opportunities">

                                        <div className="text-start">

                                            <p className="font-medium">
                                                Explore Opportunities
                                            </p>

                                            <p className="mt-1 text-xs text-muted-foreground">
                                                Browse available
                                                scholarships and
                                                academic opportunities.
                                            </p>

                                        </div>

                                    </Link>
                                </Button>

                                <Button
                                    asChild
                                    variant="outline"
                                    className="h-auto cursor-pointer justify-start p-4"
                                >
                                    <Link to="/student/applications">

                                        <div className="text-start">

                                            <p className="font-medium">
                                                Track Applications
                                            </p>

                                            <p className="mt-1 text-xs text-muted-foreground">
                                                Review your submitted
                                                applications and
                                                their status.
                                            </p>

                                        </div>

                                    </Link>
                                </Button>

                                <Button
                                    asChild
                                    variant="outline"
                                    className="h-auto cursor-pointer justify-start p-4"
                                >
                                    <Link to="/student/recommended">

                                        <div className="text-start">

                                            <p className="font-medium">
                                                AI Recommendations
                                            </p>

                                            <p className="mt-1 text-xs text-muted-foreground">
                                                Discover opportunities
                                                selected for your profile.
                                            </p>

                                        </div>

                                    </Link>
                                </Button>

                            </div>

                        </CardContent>
                    </Card>

                    <Separator />

                    <footer className="pb-4 text-center text-xs text-muted-foreground">
                         Student Portal
                    </footer>

                </div>
            </div>
        </div>
    );
}

export default Dashboard;
