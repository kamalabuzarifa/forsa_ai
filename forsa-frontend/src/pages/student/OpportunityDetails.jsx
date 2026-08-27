import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
    ArrowLeft,
    Award,
    Check,
    CheckCircle2,
    Clock3,
    ExternalLink,
    GraduationCap,
    MapPin,
    X,
    Building2,
    CalendarDays,
    FileCheck2,
    Sparkles,
} from "lucide-react";

import { getOpportunity } from "../../api/opportunities";
import {
    checkEligibility,
    matchOpportunity,
} from "../../api/eligibility";
import {
    createApplication,
    getMyApplications,
} from "../../api/applications";

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

const getApiData = (response) => {
    return response?.data ?? response;
};

const getApplicationsFromResponse = (response) => {
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

const formatDateTime = (date) => {
    if (!date) {
        return "N/A";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
        return "N/A";
    }

    return parsedDate.toLocaleString("en-GB");
};

const getUniversityName = (opportunity) => {
    if (!opportunity) {
        return "N/A";
    }

    if (
        opportunity.university &&
        typeof opportunity.university === "object"
    ) {
        return (
            opportunity.university.name ||
            opportunity.university.title ||
            "N/A"
        );
    }

    return (
        opportunity.university_name ||
        opportunity.university ||
        "N/A"
    );
};

const getCountryName = (opportunity) => {
    if (!opportunity) {
        return "N/A";
    }

    if (
        opportunity.country &&
        typeof opportunity.country === "object"
    ) {
        return (
            opportunity.country.name ||
            opportunity.country.title ||
            "N/A"
        );
    }

    return (
        opportunity.country_name ||
        opportunity.country ||
        "N/A"
    );
};

const getOpportunityType = (opportunity) => {
    if (!opportunity) {
        return "N/A";
    }

    if (
        opportunity.opportunity_type &&
        typeof opportunity.opportunity_type === "object"
    ) {
        return (
            opportunity.opportunity_type.name ||
            opportunity.opportunity_type.title ||
            "N/A"
        );
    }

    return opportunity.type || "N/A";
};

const getFundingType = (opportunity) => {
    if (!opportunity) {
        return "N/A";
    }

    if (
        opportunity.funding_type &&
        typeof opportunity.funding_type === "object"
    ) {
        return (
            opportunity.funding_type.name ||
            opportunity.funding_type.title ||
            "N/A"
        );
    }

    return (
        opportunity.funding ||
        opportunity.funding_type ||
        "N/A"
    );
};

const getMatchLevelLabel = (level) => {
    if (!level) {
        return "N/A";
    }

    return String(level)
        .replace(/_/g, " ")
        .replace(/\b\w/g, (char) => char.toUpperCase());
};

const getScore = (section) => {
    return section?.score ?? 0;
};

const getMaxScore = (section) => {
    return section?.max_score ?? 0;
};

function OpportunityDetails() {
    const { id } = useParams();

    const [opportunity, setOpportunity] = useState(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [eligibility, setEligibility] = useState(null);
    const [eligibilityLoading, setEligibilityLoading] =
        useState(false);

    const [match, setMatch] = useState(null);
    const [matchLoading, setMatchLoading] =
        useState(false);

    const [actionError, setActionError] = useState("");

    const [notes, setNotes] = useState("");

    const [existingApplication, setExistingApplication] =
        useState(null);

    const [applicationLoading, setApplicationLoading] =
        useState(false);

    const [applicationError, setApplicationError] =
        useState("");

    useEffect(() => {
        const loadOpportunity = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await getOpportunity(id);

                setOpportunity(getApiData(response));
            } catch (err) {
                console.error(
                    "Failed to load opportunity:",
                    err
                );

                setError(
                    err?.response?.data?.message ||
                    "Failed to load opportunity."
                );
            } finally {
                setLoading(false);
            }
        };

        loadOpportunity();
    }, [id]);

    useEffect(() => {
        const loadApplicationStatus = async () => {
            try {
                const response =
                    await getMyApplications();

                const applications =
                    getApplicationsFromResponse(
                        response
                    );

                const existing = applications.find(
                    (item) =>
                        Number(item?.opportunity_id) ===
                        Number(id)
                );

                setExistingApplication(
                    existing || null
                );
            } catch (err) {
                console.error(
                    "Failed to check application status:",
                    err
                );
            }
        };

        loadApplicationStatus();
    }, [id]);

    const handleCheckEligibility = async () => {
        try {
            setEligibilityLoading(true);
            setActionError("");

            const response =
                await checkEligibility(id);

            setEligibility(getApiData(response));
        } catch (err) {
            console.error(
                "Failed to check eligibility:",
                err
            );

            setActionError(
                err?.response?.data?.message ||
                "Failed to check eligibility."
            );
        } finally {
            setEligibilityLoading(false);
        }
    };

    const handleMatch = async () => {
        try {
            setMatchLoading(true);
            setActionError("");

            const response =
                await matchOpportunity(id);

            setMatch(getApiData(response));
        } catch (err) {
            console.error(
                "Failed to calculate match score:",
                err
            );

            setActionError(
                err?.response?.data?.message ||
                "Failed to calculate match score."
            );
        } finally {
            setMatchLoading(false);
        }
    };

    const handleApply = async () => {
        if (eligibility?.eligible !== true) {
            setApplicationError(
                "You must be eligible before submitting an application."
            );

            return;
        }

        try {
            setApplicationLoading(true);
            setApplicationError("");

            const response = await createApplication(
                id,
                notes
            );

            const createdApplication =
                getApiData(response);

            setExistingApplication(
                createdApplication
            );

            setNotes("");
        } catch (err) {
            console.error(
                "Failed to submit application:",
                err
            );

            setApplicationError(
                err?.response?.data?.message ||
                "Failed to submit application."
            );
        } finally {
            setApplicationLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="w-full">
                <div className="mx-auto flex min-h-[70vh] w-full max-w-7xl items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
                    <div className="flex flex-col items-center gap-4 text-center">
                        <div className="size-8 animate-spin rounded-full border-2 border-muted border-t-primary" />

                        <p className="text-sm text-muted-foreground">
                            Loading opportunity...
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-full">
                <div className="mx-auto flex min-h-[70vh] w-full max-w-7xl items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
                    <Card className="w-full max-w-lg">
                        <CardContent className="flex flex-col items-center py-12 text-center">
                            <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-destructive/10">
                                <X className="size-6 text-destructive" />
                            </div>

                            <h2 className="text-xl font-semibold">
                                Unable to load opportunity
                            </h2>

                            <p className="mt-2 text-sm text-muted-foreground">
                                {error}
                            </p>

                            <Button
                                asChild
                                className="mt-6"
                            >
                                <Link to="/student/opportunities">
                                    Back to Opportunities
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    if (!opportunity) {
        return (
            <div className="w-full">
                <div className="mx-auto flex min-h-[70vh] w-full max-w-7xl items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
                    <Card className="w-full max-w-lg">
                        <CardContent className="flex flex-col items-center py-12 text-center">
                            <h2 className="text-xl font-semibold">
                                Opportunity not found
                            </h2>

                            <Button
                                asChild
                                className="mt-6"
                            >
                                <Link to="/student/opportunities">
                                    Back to Opportunities
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full">
            <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                <div className="space-y-6">

                    <Link
                        to="/student/opportunities"
                        className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                        <ArrowLeft className="size-4" />
                        Back to Opportunities
                    </Link>

                    <section className="rounded-2xl border bg-card p-6 shadow-sm sm:p-8">
                        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                            <div className="min-w-0">
                                <div className="mb-3 flex flex-wrap items-center gap-2">
                                    <Badge variant="secondary">
                                        Opportunity Details
                                    </Badge>

                                    {opportunity.is_verified && (
                                        <Badge>
                                            <CheckCircle2 className="size-3.5" />
                                            Verified
                                        </Badge>
                                    )}
                                </div>

                                <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                                    {opportunity.title ||
                                        "Untitled Opportunity"}
                                </h1>

                                <p className="mt-3 max-w-3xl text-sm leading-7 text-muted-foreground sm:text-base">
                                    {opportunity.description ||
                                        "No description available."}
                                </p>
                            </div>

                            <div className="flex shrink-0 items-center gap-2 rounded-xl border bg-muted/40 px-4 py-3">
                                <Sparkles className="size-5 text-primary" />

                                <div>
                                    <p className="text-xs text-muted-foreground">
                                        Forsa AI
                                    </p>

                                    <p className="text-sm font-medium">
                                        AI-powered matching
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section>
                        <Card>
                            <CardHeader>
                                <CardTitle>
                                    Basic Information
                                </CardTitle>

                                <CardDescription>
                                    Key information about this
                                    opportunity
                                </CardDescription>
                            </CardHeader>

                            <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                <div className="rounded-xl border p-4">
                                    <div className="mb-3 flex size-9 items-center justify-center rounded-lg bg-muted">
                                        <Building2 className="size-4 text-muted-foreground" />
                                    </div>

                                    <p className="text-xs text-muted-foreground">
                                        University
                                    </p>

                                    <p className="mt-1 font-medium">
                                        {getUniversityName(
                                            opportunity
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
                                            opportunity
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
                                        {getOpportunityType(
                                            opportunity
                                        )}
                                    </p>
                                </div>

                                <div className="rounded-xl border p-4">
                                    <div className="mb-3 flex size-9 items-center justify-center rounded-lg bg-muted">
                                        <Award className="size-4 text-muted-foreground" />
                                    </div>

                                    <p className="text-xs text-muted-foreground">
                                        Funding
                                    </p>

                                    <p className="mt-1 font-medium">
                                        {getFundingType(
                                            opportunity
                                        )}
                                    </p>
                                </div>

                                <div className="rounded-xl border p-4">
                                    <div className="mb-3 flex size-9 items-center justify-center rounded-lg bg-muted">
                                        <CalendarDays className="size-4 text-muted-foreground" />
                                    </div>

                                    <p className="text-xs text-muted-foreground">
                                        Deadline
                                    </p>

                                    <p className="mt-1 font-medium">
                                        {formatDate(
                                            opportunity.deadline
                                        )}
                                    </p>
                                </div>

                                <div className="rounded-xl border p-4">
                                    <div className="mb-3 flex size-9 items-center justify-center rounded-lg bg-muted">
                                        <Clock3 className="size-4 text-muted-foreground" />
                                    </div>

                                    <p className="text-xs text-muted-foreground">
                                        Start Date
                                    </p>

                                    <p className="mt-1 font-medium">
                                        {formatDate(
                                            opportunity.start_date
                                        )}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </section>

                    <section className="grid gap-6 lg:grid-cols-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>
                                    Academic Fields
                                </CardTitle>
                            </CardHeader>

                            <CardContent>
                                {opportunity.fields?.length >
                                    0 ? (
                                    <div className="flex flex-wrap gap-2">
                                        {opportunity.fields.map(
                                            (field) => (
                                                <Badge
                                                    key={
                                                        field.id
                                                    }
                                                    variant="outline"
                                                    className="px-3 py-1.5"
                                                >
                                                    {
                                                        field.name
                                                    }
                                                </Badge>
                                            )
                                        )}
                                    </div>
                                ) : (
                                    <p className="text-sm text-muted-foreground">
                                        No fields specified.
                                    </p>
                                )}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>
                                    Degrees
                                </CardTitle>
                            </CardHeader>

                            <CardContent>
                                {opportunity.degrees?.length >
                                    0 ? (
                                    <div className="flex flex-wrap gap-2">
                                        {opportunity.degrees.map(
                                            (degree) => (
                                                <Badge
                                                    key={
                                                        degree.id
                                                    }
                                                    variant="outline"
                                                    className="px-3 py-1.5"
                                                >
                                                    {
                                                        degree.name
                                                    }

                                                    {degree.code
                                                        ? ` (${degree.code})`
                                                        : ""}
                                                </Badge>
                                            )
                                        )}
                                    </div>
                                ) : (
                                    <p className="text-sm text-muted-foreground">
                                        No degree requirement.
                                    </p>
                                )}
                            </CardContent>
                        </Card>
                    </section>

                    <section className="grid gap-6 lg:grid-cols-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>
                                    Skills
                                </CardTitle>

                                <CardDescription>
                                    Skills required or preferred
                                    for this opportunity
                                </CardDescription>
                            </CardHeader>

                            <CardContent>
                                {opportunity.skills?.length >
                                    0 ? (
                                    <div className="space-y-3">
                                        {opportunity.skills.map(
                                            (skill) => (
                                                <div
                                                    key={
                                                        skill.id
                                                    }
                                                    className="flex items-center justify-between gap-4 rounded-xl border p-4"
                                                >
                                                    <span className="font-medium">
                                                        {
                                                            skill.name
                                                        }
                                                    </span>

                                                    <Badge
                                                        variant={
                                                            skill.is_mandatory
                                                                ? "default"
                                                                : "secondary"
                                                        }
                                                    >
                                                        {skill.is_mandatory
                                                            ? "Required"
                                                            : "Optional"}
                                                    </Badge>
                                                </div>
                                            )
                                        )}
                                    </div>
                                ) : (
                                    <p className="text-sm text-muted-foreground">
                                        No skills specified.
                                    </p>
                                )}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>
                                    Nationalities
                                </CardTitle>

                                <CardDescription>
                                    Eligibility by nationality
                                </CardDescription>
                            </CardHeader>

                            <CardContent>
                                {opportunity.nationalities?.length >
                                    0 ? (
                                    <div className="space-y-3">
                                        {opportunity.nationalities.map(
                                            (
                                                nationality,
                                                index
                                            ) => (
                                                <div
                                                    key={
                                                        nationality.id ??
                                                        index
                                                    }
                                                    className="flex items-center justify-between gap-4 rounded-xl border p-4"
                                                >
                                                    <span className="font-medium">
                                                        {
                                                            nationality.country_name
                                                        }
                                                    </span>

                                                    <Badge
                                                        variant="outline"
                                                    >
                                                        {
                                                            nationality.eligibility_type
                                                        }
                                                    </Badge>
                                                </div>
                                            )
                                        )}
                                    </div>
                                ) : (
                                    <p className="text-sm text-muted-foreground">
                                        No nationality restriction.
                                    </p>
                                )}
                            </CardContent>
                        </Card>
                    </section>

                    <Card>
                        <CardHeader>
                            <CardTitle>
                                Requirements
                            </CardTitle>

                            <CardDescription>
                                Requirements listed by the
                                opportunity
                            </CardDescription>
                        </CardHeader>

                        <CardContent>
                            {opportunity.requirements?.length >
                                0 ? (
                                <div className="space-y-3">
                                    {opportunity.requirements.map(
                                        (requirement) => (
                                            <div
                                                key={
                                                    requirement.id
                                                }
                                                className="flex gap-3 rounded-xl border p-4"
                                            >
                                                <FileCheck2 className="mt-0.5 size-5 shrink-0 text-primary" />

                                                <p className="text-sm leading-6 text-muted-foreground">
                                                    {
                                                        requirement.description
                                                    }
                                                </p>
                                            </div>
                                        )
                                    )}
                                </div>
                            ) : (
                                <p className="text-sm text-muted-foreground">
                                    No requirements specified.
                                </p>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>
                                Eligibility & Match
                            </CardTitle>

                            <CardDescription>
                                Check your eligibility and calculate
                                your profile match.
                            </CardDescription>
                        </CardHeader>

                        <CardContent className="space-y-6">
                            {actionError && (
                                <div className="rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
                                    {actionError}
                                </div>
                            )}

                            <div className="flex flex-col gap-3 sm:flex-row">
                                <Button
                                    type="button"
                                    onClick={
                                        handleCheckEligibility
                                    }
                                    disabled={
                                        eligibilityLoading
                                    }
                                >
                                    <CheckCircle2 className="size-4" />

                                    {eligibilityLoading
                                        ? "Checking..."
                                        : "Check Eligibility"}
                                </Button>

                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handleMatch}
                                    disabled={matchLoading}
                                >
                                    <Sparkles className="size-4" />

                                    {matchLoading
                                        ? "Calculating..."
                                        : "Calculate Match"}
                                </Button>
                            </div>

                            {eligibility && (
                                <div className="rounded-2xl border bg-muted/20 p-5">
                                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                                        <div>
                                            <p className="text-sm text-muted-foreground">
                                                Eligibility Result
                                            </p>

                                            <h3 className="mt-1 text-xl font-semibold">
                                                {eligibility.eligible
                                                    ? "Eligible"
                                                    : "Not Eligible"}
                                            </h3>
                                        </div>

                                        <Badge
                                            variant={
                                                eligibility.eligible
                                                    ? "default"
                                                    : "destructive"
                                            }
                                            className="w-fit"
                                        >
                                            {eligibility.status ||
                                                (eligibility.eligible
                                                    ? "eligible"
                                                    : "not eligible")}
                                        </Badge>
                                    </div>

                                    {eligibility.checks?.length >
                                        0 && (
                                            <div className="mt-6">
                                                <h4 className="mb-3 text-sm font-semibold">
                                                    Checks
                                                </h4>

                                                <div className="space-y-2">
                                                    {eligibility.checks.map(
                                                        (
                                                            check,
                                                            index
                                                        ) => (
                                                            <div
                                                                key={
                                                                    index
                                                                }
                                                                className="flex gap-3 rounded-lg border bg-background p-3"
                                                            >
                                                                <Check className="mt-0.5 size-4 shrink-0 text-emerald-600" />

                                                                <div className="min-w-0">
                                                                    <p className="text-sm font-medium capitalize">
                                                                        {
                                                                            check.type
                                                                        }
                                                                    </p>

                                                                    <p className="mt-1 text-sm text-muted-foreground">
                                                                        {
                                                                            check.message
                                                                        }
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        )
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                    {eligibility.failed_checks
                                        ?.length > 0 && (
                                            <div className="mt-6">
                                                <h4 className="mb-3 text-sm font-semibold text-destructive">
                                                    Failed Checks
                                                </h4>

                                                <div className="space-y-2">
                                                    {eligibility.failed_checks.map(
                                                        (
                                                            check,
                                                            index
                                                        ) => (
                                                            <div
                                                                key={
                                                                    index
                                                                }
                                                                className="flex gap-3 rounded-lg border border-destructive/20 bg-destructive/5 p-3"
                                                            >
                                                                <X className="mt-0.5 size-4 shrink-0 text-destructive" />

                                                                <p className="text-sm text-destructive">
                                                                    {
                                                                        check.message
                                                                    }
                                                                </p>
                                                            </div>
                                                        )
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                </div>
                            )}

                            {match && (
                                <div className="rounded-2xl border bg-background p-5">
                                    <div className="flex flex-col gap-5 md:flex-row">
                                        <div className="flex min-w-40 flex-col items-center justify-center rounded-2xl bg-primary p-6 text-primary-foreground">
                                            <p className="text-sm opacity-80">
                                                Match Score
                                            </p>

                                            <p className="mt-1 text-4xl font-bold">
                                                {
                                                    match.match_score
                                                }
                                            </p>

                                            <p className="mt-1 text-sm capitalize opacity-80">
                                                {getMatchLevelLabel(
                                                    match.level
                                                )}
                                            </p>
                                        </div>

                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-center justify-between gap-4">
                                                <div>
                                                    <h3 className="font-semibold">
                                                        Match Result
                                                    </h3>

                                                    <p className="mt-1 text-sm text-muted-foreground">
                                                        Based on your
                                                        profile and
                                                        opportunity
                                                        requirements.
                                                    </p>
                                                </div>

                                                <Badge
                                                    variant={
                                                        match.eligible_for_opportunity
                                                            ? "default"
                                                            : "destructive"
                                                    }
                                                >
                                                    {match.eligible_for_opportunity
                                                        ? "Eligible"
                                                        : "Not Eligible"}
                                                </Badge>
                                            </div>

                                            <Separator className="my-4" />

                                            <div className="grid gap-3 sm:grid-cols-2">
                                                {[
                                                    [
                                                        "Academic Field",
                                                        match
                                                            .breakdown
                                                            ?.academic_field,
                                                    ],
                                                    [
                                                        "Skills",
                                                        match
                                                            .breakdown
                                                            ?.skills,
                                                    ],
                                                    [
                                                        "GPA",
                                                        match
                                                            .breakdown
                                                            ?.gpa,
                                                    ],
                                                    [
                                                        "Language",
                                                        match
                                                            .breakdown
                                                            ?.language,
                                                    ],
                                                    [
                                                        "Experience",
                                                        match
                                                            .breakdown
                                                            ?.experience,
                                                    ],
                                                ].map(
                                                    ([
                                                        label,
                                                        section,
                                                    ]) => (
                                                        <div
                                                            key={
                                                                label
                                                            }
                                                            className="rounded-xl border p-3"
                                                        >
                                                            <p className="text-xs text-muted-foreground">
                                                                {
                                                                    label
                                                                }
                                                            </p>

                                                            <p className="mt-1 text-sm font-semibold">
                                                                {getScore(
                                                                    section
                                                                )}
                                                                /
                                                                {getMaxScore(
                                                                    section
                                                                )}
                                                            </p>
                                                        </div>
                                                    )
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>
                                Application
                            </CardTitle>

                            <CardDescription>
                                Submit and track your application
                                for this opportunity.
                            </CardDescription>
                        </CardHeader>

                        <CardContent>
                            {applicationError && (
                                <div className="mb-5 rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
                                    {applicationError}
                                </div>
                            )}

                            {existingApplication ? (
                                <div className="space-y-5">
                                    <div className="flex flex-col gap-4 rounded-2xl border bg-muted/20 p-5 sm:flex-row sm:items-center sm:justify-between">
                                        <div>
                                            <p className="text-sm text-muted-foreground">
                                                Application Status
                                            </p>

                                            <h3 className="mt-1 text-xl font-semibold">
                                                Already Applied
                                            </h3>
                                        </div>

                                        <Badge
                                            variant={getStatusVariant(
                                                existingApplication.status
                                            )}
                                            className="w-fit"
                                        >
                                            {getStatusLabel(
                                                existingApplication.status
                                            )}
                                        </Badge>
                                    </div>

                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <div className="rounded-xl border p-4">
                                            <p className="text-xs text-muted-foreground">
                                                Application ID
                                            </p>

                                            <p className="mt-1 font-medium">
                                                #
                                                {
                                                    existingApplication.id
                                                }
                                            </p>
                                        </div>

                                        <div className="rounded-xl border p-4">
                                            <p className="text-xs text-muted-foreground">
                                                Applied At
                                            </p>

                                            <p className="mt-1 font-medium">
                                                {formatDateTime(
                                                    existingApplication.applied_at ||
                                                    existingApplication.created_at
                                                )}
                                            </p>
                                        </div>
                                    </div>

                                    {existingApplication.notes && (
                                        <div className="rounded-xl border p-4">
                                            <p className="text-xs text-muted-foreground">
                                                Notes
                                            </p>

                                            <p className="mt-2 whitespace-pre-wrap text-sm leading-6">
                                                {
                                                    existingApplication.notes
                                                }
                                            </p>
                                        </div>
                                    )}

                                    <Button asChild>
                                        <Link
                                            to={`/student/applications/${existingApplication.id}`}
                                        >
                                            View Application Details
                                        </Link>
                                    </Button>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div>
                                        <label
                                            htmlFor="application-notes"
                                            className="text-sm font-medium"
                                        >
                                            Notes
                                        </label>

                                        <p className="mb-2 mt-1 text-sm text-muted-foreground">
                                            Add any information you
                                            want to include with your
                                            application.
                                        </p>

                                        <textarea
                                            id="application-notes"
                                            value={notes}
                                            onChange={(event) =>
                                                setNotes(
                                                    event.target.value
                                                )
                                            }
                                            rows={6}
                                            maxLength={5000}
                                            placeholder="Add notes for your application..."
                                            className="w-full resize-y rounded-xl border bg-background px-3 py-3 text-sm outline-none transition-shadow placeholder:text-muted-foreground focus:ring-2 focus:ring-ring"
                                        />
                                    </div>

                                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                        <p className="text-xs text-muted-foreground">
                                            {notes.length}/5000
                                        </p>

                                        <Button
                                            type="button"
                                            onClick={
                                                handleApply
                                            }
                                            disabled={
                                                applicationLoading ||
                                                eligibility?.eligible !==
                                                true
                                            }
                                        >
                                            {applicationLoading
                                                ? "Submitting..."
                                                : "Submit Application"}
                                        </Button>
                                    </div>

                                    {eligibility?.eligible !==
                                        true && (
                                            <div className="rounded-xl border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
                                                Check your eligibility
                                                before submitting an
                                                application.
                                            </div>
                                        )}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {(opportunity.application_url ||
                        opportunity.source_url) && (
                            <section className="flex flex-col gap-3 pb-6 sm:flex-row">
                                {opportunity.application_url && (
                                    <Button
                                        asChild
                                        className="sm:flex-1"
                                    >
                                        <a
                                            href={
                                                opportunity.application_url
                                            }
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            <ExternalLink className="size-4" />
                                            Apply on Official Website
                                        </a>
                                    </Button>
                                )}

                                {opportunity.source_url && (
                                    <Button
                                        asChild
                                        variant="outline"
                                        className="sm:flex-1"
                                    >
                                        <a
                                            href={
                                                opportunity.source_url
                                            }
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            <ExternalLink className="size-4" />
                                            View Source
                                        </a>
                                    </Button>
                                )}
                            </section>
                        )}
                </div>
            </div>
        </div>
    );
}

export default OpportunityDetails;
