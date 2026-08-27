import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
    ArrowLeft,
    Building2,
    CalendarDays,
    CheckCircle2,
    Clock3,
    FileText,
    GraduationCap,
    MapPin,
    RefreshCw,
    XCircle,
} from "lucide-react";

import { getMyApplication } from "../../api/applications";
import { getOpportunity } from "../../api/opportunities";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const getApiData = (response) => {
    return response?.data ?? response;
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
    switch (getStatusValue(status)) {
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

const getRelationValue = (value) => {
    if (!value) {
        return "N/A";
    }

    if (typeof value === "object") {
        return (
            value.name ??
            value.title ??
            value.label ??
            "N/A"
        );
    }

    return String(value);
};

const getOpportunityTitle = (opportunity) => {
    return (
        opportunity?.title ??
        opportunity?.name ??
        opportunity?.opportunity_title ??
        "Untitled Opportunity"
    );
};

const getUniversityName = (opportunity) => {
    return getRelationValue(
        opportunity?.university ??
        opportunity?.university_name
    );
};

const getCountryName = (opportunity) => {
    return getRelationValue(
        opportunity?.country ??
        opportunity?.country_name
    );
};

const getTypeName = (opportunity) => {
    return getRelationValue(
        opportunity?.opportunity_type ??
        opportunity?.type
    );
};

const getFundingName = (opportunity) => {
    return getRelationValue(
        opportunity?.funding_type ??
        opportunity?.funding
    );
};

function ApplicationDetails() {
    const { id } = useParams();

    const [application, setApplication] =
        useState(null);

    const [opportunity, setOpportunity] =
        useState(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchApplicationDetails = async () => {
        try {
            setLoading(true);
            setError("");

            const applicationResponse =
                await getMyApplication(id);

            const applicationData =
                getApiData(applicationResponse);

            setApplication(applicationData);

            const opportunityId =
                applicationData?.opportunity_id ??
                applicationData?.opportunity?.id;

            if (opportunityId) {
                try {
                    const opportunityResponse =
                        await getOpportunity(
                            opportunityId
                        );

                    setOpportunity(
                        getApiData(
                            opportunityResponse
                        )
                    );
                } catch (opportunityError) {
                    console.error(
                        "Failed to fetch opportunity details:",
                        opportunityError
                    );

                    setOpportunity(
                        applicationData?.opportunity ??
                        null
                    );
                }
            } else {
                setOpportunity(
                    applicationData?.opportunity ??
                    null
                );
            }
        } catch (err) {
            console.error(
                "Failed to fetch application:",
                err
            );

            setError(
                err?.response?.data?.message ??
                "Failed to load application details."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchApplicationDetails();
    }, [id]);

    if (loading) {
        return (
            <div className="w-full">
                <div className="mx-auto flex min-h-[70vh] max-w-7xl items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
                    <div className="flex flex-col items-center gap-4 text-center">
                        <div className="size-8 animate-spin rounded-full border-2 border-muted border-t-primary" />

                        <p className="text-sm text-muted-foreground">
                            Loading application...
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-full">
                <div className="mx-auto flex min-h-[70vh] max-w-7xl items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
                    <Card className="w-full max-w-lg">
                        <CardContent className="flex flex-col items-center py-12 text-center">
                            <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-destructive/10">
                                <XCircle className="size-6 text-destructive" />
                            </div>

                            <h2 className="text-xl font-semibold">
                                Unable to load application
                            </h2>

                            <p className="mt-2 text-sm text-muted-foreground">
                                {error}
                            </p>

                            <div className="mt-6 flex flex-wrap justify-center gap-2">
                                <Button
                                    type="button"
                                    onClick={
                                        fetchApplicationDetails
                                    }
                                >
                                    <RefreshCw className="size-4" />
                                    Try Again
                                </Button>

                                <Link
                                    to="/student/applications"
                                    className="inline-flex h-9 items-center justify-center rounded-md border border-input bg-background px-4 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
                                >
                                    Back to Applications
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    if (!application) {
        return (
            <div className="w-full">
                <div className="mx-auto flex min-h-[70vh] max-w-7xl items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
                    <Card className="w-full max-w-lg">
                        <CardContent className="flex flex-col items-center py-12 text-center">
                            <FileText className="size-8 text-muted-foreground" />

                            <h2 className="mt-4 text-xl font-semibold">
                                Application not found
                            </h2>

                            <Link
                                to="/student/applications"
                                className="mt-6 inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                            >
                                Back to Applications
                            </Link>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    const currentOpportunity =
        opportunity ??
        application?.opportunity ??
        {};

    const StatusIcon = getStatusIcon(
        application.status
    );

    const opportunityId =
        currentOpportunity?.id ??
        application?.opportunity_id;

    return (
        <div className="w-full">
            <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                <div className="space-y-6">
                    <Link
                        to="/student/applications"
                        className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                        <ArrowLeft className="size-4" />
                        Back to Applications
                    </Link>

                    <section className="rounded-2xl border bg-card p-6 shadow-sm sm:p-8">
                        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                            <div>
                                <Badge
                                    variant="secondary"
                                    className="mb-3"
                                >
                                    Application #{application.id}
                                </Badge>

                                <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                                    Application Details
                                </h1>

                                <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
                                    Review your submitted application
                                    and the opportunity information.
                                </p>
                            </div>

                            <Badge
                                variant={getStatusVariant(
                                    application.status
                                )}
                                className="w-fit gap-1.5 px-3 py-1.5"
                            >
                                <StatusIcon className="size-4" />

                                {getStatusLabel(
                                    application.status
                                )}
                            </Badge>
                        </div>
                    </section>

                    <section className="grid gap-6 lg:grid-cols-[minmax(0,1.5fr)_minmax(280px,0.8fr)]">
                        <Card>
                            <CardHeader>
                                <CardTitle>
                                    Opportunity Information
                                </CardTitle>

                                <CardDescription>
                                    Information related to the
                                    opportunity you applied for.
                                </CardDescription>
                            </CardHeader>

                            <CardContent className="space-y-5">
                                <div className="rounded-xl border bg-muted/20 p-5">
                                    <p className="text-xs text-muted-foreground">
                                        Opportunity
                                    </p>

                                    <p className="mt-1 text-xl font-semibold">
                                        {getOpportunityTitle(
                                            currentOpportunity
                                        )}
                                    </p>
                                </div>

                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="rounded-xl border p-4">
                                        <div className="mb-3 flex size-9 items-center justify-center rounded-lg bg-muted">
                                            <Building2 className="size-4 text-muted-foreground" />
                                        </div>

                                        <p className="text-xs text-muted-foreground">
                                            University
                                        </p>

                                        <p className="mt-1 font-medium">
                                            {getUniversityName(
                                                currentOpportunity
                                            )}
                                        </p>
                                    </div>

                                    <div className="rounded-xl border p-4">
                                        <div className="mb-3 flex size-9 items-center justify-center rounded-lg bg-muted">
                                            <MapPin className="size-4 text-muted-foreground" />
                                        </div>

                                        <p className="text-xs text-muted-foreground">
                                            Country
                                        </p>

                                        <p className="mt-1 font-medium">
                                            {getCountryName(
                                                currentOpportunity
                                            )}
                                        </p>
                                    </div>

                                    <div className="rounded-xl border p-4">
                                        <div className="mb-3 flex size-9 items-center justify-center rounded-lg bg-muted">
                                            <GraduationCap className="size-4 text-muted-foreground" />
                                        </div>

                                        <p className="text-xs text-muted-foreground">
                                            Type
                                        </p>

                                        <p className="mt-1 font-medium">
                                            {getTypeName(
                                                currentOpportunity
                                            )}
                                        </p>
                                    </div>

                                    <div className="rounded-xl border p-4">
                                        <div className="mb-3 flex size-9 items-center justify-center rounded-lg bg-muted">
                                            <CheckCircle2 className="size-4 text-muted-foreground" />
                                        </div>

                                        <p className="text-xs text-muted-foreground">
                                            Funding
                                        </p>

                                        <p className="mt-1 font-medium">
                                            {getFundingName(
                                                currentOpportunity
                                            )}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>
                                    Application Information
                                </CardTitle>

                                <CardDescription>
                                    Submission details
                                </CardDescription>
                            </CardHeader>

                            <CardContent className="space-y-3">
                                <div className="rounded-xl border p-4">
                                    <p className="text-xs text-muted-foreground">
                                        Application ID
                                    </p>

                                    <p className="mt-1 font-mono font-medium">
                                        #{application.id}
                                    </p>
                                </div>

                                <div className="rounded-xl border p-4">
                                    <div className="flex items-center gap-3">
                                        <StatusIcon className="size-4 text-muted-foreground" />

                                        <div>
                                            <p className="text-xs text-muted-foreground">
                                                Status
                                            </p>

                                            <p className="mt-1 font-medium">
                                                {getStatusLabel(
                                                    application.status
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="rounded-xl border p-4">
                                    <div className="flex items-center gap-3">
                                        <CalendarDays className="size-4 text-muted-foreground" />

                                        <div>
                                            <p className="text-xs text-muted-foreground">
                                                Submitted On
                                            </p>

                                            <p className="mt-1 font-medium">
                                                {formatDate(
                                                    application.created_at
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="rounded-xl border p-4">
                                    <div className="flex items-center gap-3">
                                        <Clock3 className="size-4 text-muted-foreground" />

                                        <div>
                                            <p className="text-xs text-muted-foreground">
                                                Last Updated
                                            </p>

                                            <p className="mt-1 font-medium">
                                                {formatDate(
                                                    application.updated_at
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </section>

                    <Card>
                        <CardHeader>
                            <CardTitle>Your Notes</CardTitle>

                            <CardDescription>
                                Notes included with your application.
                            </CardDescription>
                        </CardHeader>

                        <CardContent>
                            {application.notes ? (
                                <div className="rounded-xl border bg-muted/20 p-5">
                                    <p className="whitespace-pre-wrap text-sm leading-7">
                                        {application.notes}
                                    </p>
                                </div>
                            ) : (
                                <div className="rounded-xl border border-dashed p-6 text-center">
                                    <FileText className="mx-auto size-6 text-muted-foreground" />

                                    <p className="mt-2 font-medium">
                                        No notes
                                    </p>

                                    <p className="mt-1 text-sm text-muted-foreground">
                                        No notes were added to this
                                        application.
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <div className="flex flex-col gap-3 pb-6 sm:flex-row">
                        <Link
                            to="/student/applications"
                            className="inline-flex h-9 items-center justify-center gap-2 rounded-md border border-input bg-background px-4 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
                        >
                            <ArrowLeft className="size-4" />
                            Back to Applications
                        </Link>

                        {opportunityId && (
                            <Link
                                to={`/student/opportunities/${opportunityId}`}
                                className="inline-flex h-9 items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                            >
                                View Opportunity
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ApplicationDetails;
