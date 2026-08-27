import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
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
    const value = getStatusValue(status);

    switch (value) {
        case "accepted":
            return "Accepted";

        case "approved":
            return "Approved";

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

    switch (value) {
        case "accepted":
        case "approved":
            return "default";

        case "rejected":
            return "destructive";

        default:
            return "secondary";
    }
};

const getOpportunityTitle = (application) => {
    const opportunity = application?.opportunity;

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

const getUniversityName = (application) => {
    const opportunity = application?.opportunity;

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

function Dashboard() {
    const { user } = useAuth();

    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadDashboard = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await getMyApplications();

                setApplications(
                    getApplications(response)
                );
            } catch (err) {
                console.error(
                    "Failed to load dashboard:",
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

    const statistics = useMemo(() => {
        const result = {
            total: applications.length,
            pending: 0,
            accepted: 0,
            rejected: 0,
        };

        applications.forEach((application) => {
            const status = getStatusValue(
                application?.status
            );

            if (status === "pending") {
                result.pending += 1;
            }

            if (
                status === "accepted" ||
                status === "approved"
            ) {
                result.accepted += 1;
            }

            if (status === "rejected") {
                result.rejected += 1;
            }
        });

        return result;
    }, [applications]);

    const recentApplications = useMemo(() => {
        return [...applications]
            .sort((first, second) => {
                const firstDate = new Date(
                    first?.created_at ?? 0
                ).getTime();

                const secondDate = new Date(
                    second?.created_at ?? 0
                ).getTime();

                return secondDate - firstDate;
            })
            .slice(0, 4);
    }, [applications]);

    const upcomingDeadlines = useMemo(() => {
        const now = new Date();

        return applications
            .filter(
                (application) =>
                    application?.opportunity?.deadline
            )
            .map((application) => {
                const deadline = new Date(
                    application.opportunity.deadline
                );

                return {
                    ...application,
                    deadline,
                };
            })
            .filter(
                (application) =>
                    !Number.isNaN(
                        application.deadline.getTime()
                    ) &&
                    application.deadline >= now
            )
            .sort(
                (first, second) =>
                    first.deadline.getTime() -
                    second.deadline.getTime()
            )
            .slice(0, 4);
    }, [applications]);

    return (
        <div className="w-full">
            <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                <div className="space-y-6">
                    <section className="rounded-2xl border bg-card p-6 shadow-sm sm:p-8">
                        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                            <div className="space-y-3">
                                <Badge
                                    variant="secondary"
                                    className="w-fit"
                                >
                                    Student Dashboard
                                </Badge>

                                <div>
                                    <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                                        Welcome back,{" "}
                                        {user?.name ||
                                            "Student"}
                                    </h1>

                                    <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
                                        Manage your applications
                                        and discover opportunities
                                        that match your academic
                                        profile.
                                    </p>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-2">
                                <Button asChild>
                                    <Link to="/student/opportunities">
                                        Browse Opportunities
                                    </Link>
                                </Button>

                                <Button
                                    asChild
                                    variant="outline"
                                >
                                    <Link to="/student/applications">
                                        My Applications
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </section>

                    {error && (
                        <div className="rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
                            {error}
                        </div>
                    )}

                    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                        <Card>
                            <CardHeader className="pb-2">
                                <CardDescription>
                                    Total Applications
                                </CardDescription>

                                <CardTitle className="text-3xl">
                                    {loading
                                        ? "—"
                                        : statistics.total}
                                </CardTitle>
                            </CardHeader>

                            <CardContent>
                                <p className="text-xs text-muted-foreground">
                                    All submitted applications
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="pb-2">
                                <CardDescription>
                                    Pending
                                </CardDescription>

                                <CardTitle className="text-3xl">
                                    {loading
                                        ? "—"
                                        : statistics.pending}
                                </CardTitle>
                            </CardHeader>

                            <CardContent>
                                <p className="text-xs text-muted-foreground">
                                    Waiting for a decision
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
                                    Accepted or approved
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="pb-2">
                                <CardDescription>
                                    Rejected
                                </CardDescription>

                                <CardTitle className="text-3xl">
                                    {loading
                                        ? "—"
                                        : statistics.rejected}
                                </CardTitle>
                            </CardHeader>

                            <CardContent>
                                <p className="text-xs text-muted-foreground">
                                    Not accepted
                                </p>
                            </CardContent>
                        </Card>
                    </section>

                    <section className="grid gap-6 lg:grid-cols-[minmax(0,1.5fr)_minmax(280px,1fr)]">
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between gap-4">
                                    <div>
                                        <CardTitle>
                                            Recent Applications
                                        </CardTitle>

                                        <CardDescription className="mt-1">
                                            Your latest submitted
                                            applications
                                        </CardDescription>
                                    </div>

                                    {applications.length > 0 && (
                                        <Button
                                            asChild
                                            variant="ghost"
                                            size="sm"
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
                                                    className="h-20 animate-pulse rounded-xl bg-muted"
                                                />
                                            )
                                        )}
                                    </div>
                                ) : recentApplications.length === 0 ? (
                                    <div className="rounded-xl border border-dashed p-8 text-center">
                                        <p className="font-medium">
                                            No applications yet
                                        </p>

                                        <p className="mt-1 text-sm text-muted-foreground">
                                            Explore opportunities
                                            and submit your first
                                            application.
                                        </p>

                                        <Button
                                            asChild
                                            className="mt-4"
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
                                                    className="block rounded-xl border p-4 transition-colors hover:bg-muted/50"
                                                >
                                                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                                        <div className="min-w-0">
                                                            <p className="truncate font-medium">
                                                                {getOpportunityTitle(
                                                                    application
                                                                )}
                                                            </p>

                                                            <p className="mt-1 text-sm text-muted-foreground">
                                                                {getUniversityName(
                                                                    application
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
                                                            className="w-fit"
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

                        <Card>
                            <CardHeader>
                                <CardTitle>
                                    Upcoming Deadlines
                                </CardTitle>

                                <CardDescription>
                                    Deadlines from your applications
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
                                            Explore more opportunities
                                            to find your next application.
                                        </p>

                                        <Button
                                            asChild
                                            variant="outline"
                                            className="mt-4"
                                        >
                                            <Link to="/student/opportunities">
                                                Browse Opportunities
                                            </Link>
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {upcomingDeadlines.map(
                                            (application) => (
                                                <Link
                                                    key={
                                                        application.id
                                                    }
                                                    to={`/student/opportunities/${application.opportunity_id}`}
                                                    className="block rounded-xl border p-4 transition-colors hover:bg-muted/50"
                                                >
                                                    <p className="font-medium">
                                                        {getOpportunityTitle(
                                                            application
                                                        )}
                                                    </p>

                                                    <p className="mt-1 text-sm text-muted-foreground">
                                                        Deadline{" "}
                                                        {formatDate(
                                                            application.deadline
                                                        )}
                                                    </p>
                                                </Link>
                                            )
                                        )}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </section>

                    <section>
                        <Card>
                            <CardHeader>
                                <CardTitle>
                                    Quick Actions
                                </CardTitle>

                                <CardDescription>
                                    Common actions
                                </CardDescription>
                            </CardHeader>

                            <CardContent>
                                <div className="grid gap-3 sm:grid-cols-2">
                                    <Button
                                        asChild
                                        variant="outline"
                                        className="h-auto justify-start p-4"
                                    >
                                        <Link to="/student/opportunities">
                                            <div className="text-start">
                                                <p className="font-medium">
                                                    Explore Opportunities
                                                </p>

                                                <p className="mt-1 text-xs text-muted-foreground">
                                                    Find scholarships
                                                    and other
                                                    opportunities.
                                                </p>
                                            </div>
                                        </Link>
                                    </Button>

                                    <Button
                                        asChild
                                        variant="outline"
                                        className="h-auto justify-start p-4"
                                    >
                                        <Link to="/student/applications">
                                            <div className="text-start">
                                                <p className="font-medium">
                                                    Track Applications
                                                </p>

                                                <p className="mt-1 text-xs text-muted-foreground">
                                                    Review your
                                                    application status.
                                                </p>
                                            </div>
                                        </Link>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </section>

                    <Separator />

                    <footer className="pb-4 text-center text-xs text-muted-foreground">
                        Forsa AI Student Portal
                    </footer>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
