import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
    ArrowLeft,
    CalendarDays,
    CheckCircle2,
    ExternalLink,
    FileEdit,
    Globe2,
    GraduationCap,
    Languages,
    Link2,
    Loader2,
    MapPin,
    School,
    XCircle,
} from "lucide-react";

import {
    getAdminOpportunity,
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

const getName = (
    value,
    fallback = "N/A"
) => {
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

const formatDate = (date) => {
    if (!date) {
        return "N/A";
    }

    const parsedDate = new Date(date);

    if (
        Number.isNaN(
            parsedDate.getTime()
        )
    ) {
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

const formatDateTime = (date) => {
    if (!date) {
        return "N/A";
    }

    const parsedDate = new Date(date);

    if (
        Number.isNaN(
            parsedDate.getTime()
        )
    ) {
        return "N/A";
    }

    return parsedDate.toLocaleString(
        "en-GB",
        {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        }
    );
};

const getStatusVariant = (status) => {
    switch (status) {
        case "published":
            return "default";

        case "expired":
            return "destructive";

        case "archived":
            return "outline";

        case "draft":
        default:
            return "secondary";
    }
};

const getEligibilityVariant = (
    type
) => {
    switch (type) {
        case "eligible":
            return "default";

        case "excluded":
            return "destructive";

        case "restricted":
        default:
            return "secondary";
    }
};

function AdminOpportunityDetails() {
    const { id } = useParams();

    const [opportunity, setOpportunity] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    useEffect(() => {
        let active = true;

        const loadOpportunity = async () => {
            try {
                setLoading(true);
                setError("");

                const response =
                    await getAdminOpportunity(
                        id
                    );

                const data =
                    response?.data ??
                    response;

                if (active) {
                    setOpportunity(
                        data
                    );
                }
            } catch (err) {
                console.error(
                    "Failed to load admin opportunity:",
                    err
                );

                if (active) {
                    setError(
                        err?.response?.data
                            ?.message ??
                        "Failed to load opportunity."
                    );
                }
            } finally {
                if (active) {
                    setLoading(false);
                }
            }
        };

        loadOpportunity();

        return () => {
            active = false;
        };
    }, [id]);

    if (loading) {
        return (
            <div className="w-full">
                <div className="admin-content-width flex min-h-[60vh] items-center justify-center">
                    <div className="flex flex-col items-center gap-3">
                        <Loader2 className="size-7 animate-spin text-muted-foreground" />

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
                <div className="admin-content-width">
                    <Card>
                        <CardContent className="flex min-h-[400px] flex-col items-center justify-center text-center">
                            <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-destructive/10">
                                <XCircle className="size-6 text-destructive" />
                            </div>

                            <h1 className="text-xl font-semibold">
                                Unable to load opportunity
                            </h1>

                            <p className="mt-2 max-w-md text-sm text-muted-foreground">
                                {error}
                            </p>

                            <Link
                                to="/admin/opportunities"
                                className="mt-5 inline-flex h-10 items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                            >
                                <ArrowLeft className="size-4" />
                                Back to Opportunities
                            </Link>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    if (!opportunity) {
        return (
            <div className="w-full">
                <div className="admin-content-width">
                    <Card>
                        <CardContent className="flex min-h-[400px] flex-col items-center justify-center text-center">
                            <h1 className="text-xl font-semibold">
                                Opportunity not found
                            </h1>

                            <Link
                                to="/admin/opportunities"
                                className="mt-5 inline-flex h-10 items-center justify-center gap-2 rounded-md border border-input bg-background px-4 text-sm font-medium hover:bg-accent"
                            >
                                <ArrowLeft className="size-4" />
                                Back to Opportunities
                            </Link>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    const universityName =
        getName(
            opportunity.university,
            "No University"
        );

    const countryName =
        getName(
            opportunity.country
        );

    const opportunityType =
        getName(
            opportunity.opportunity_type
        );

    const fundingType =
        getName(
            opportunity.funding_type
        );

    return (
        <div className="w-full">
            <div className="admin-content-width">
                <div className="space-y-6">

                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <Link
                            to="/admin/opportunities"
                            className="inline-flex w-fit items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
                        >
                            <ArrowLeft className="size-4" />
                            Back to Opportunities
                        </Link>

                        <div className="flex flex-wrap gap-2">
                            <Link
                                to={`/admin/opportunities/${opportunity.id}/edit`}
                                className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                            >
                                <FileEdit className="size-4" />
                                Edit Opportunity
                            </Link>

                            {opportunity.application_url && (
                                <a
                                    href={
                                        opportunity.application_url
                                    }
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-input bg-background px-4 text-sm font-medium hover:bg-accent"
                                >
                                    <ExternalLink className="size-4" />
                                    Application Website
                                </a>
                            )}
                        </div>
                    </div>

                    <section>
                        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                            <div className="min-w-0">
                                <div className="mb-3 flex flex-wrap items-center gap-2">
                                    <Badge variant="secondary">
                                        Admin
                                    </Badge>

                                    <Badge
                                        variant={getStatusVariant(
                                            opportunity.status
                                        )}
                                    >
                                        {opportunity.status ??
                                            "draft"}
                                    </Badge>

                                    {opportunity.is_verified && (
                                        <Badge className="gap-1">
                                            <CheckCircle2 className="size-3.5" />
                                            Verified
                                        </Badge>
                                    )}
                                </div>

                                <h1 className="break-words text-3xl font-semibold tracking-tight sm:text-4xl">
                                    {opportunity.title ??
                                        "Untitled Opportunity"}
                                </h1>

                                <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground sm:text-base">
                                    {opportunity.description ??
                                        "No description available."}
                                </p>
                            </div>
                        </div>
                    </section>

                    <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <Card>
                            <CardContent className="flex items-start gap-3 p-5">
                                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                                    <School className="size-5 text-muted-foreground" />
                                </div>

                                <div className="min-w-0">
                                    <p className="text-xs text-muted-foreground">
                                        University
                                    </p>

                                    <p className="mt-1 truncate font-medium">
                                        {universityName}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="flex items-start gap-3 p-5">
                                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                                    <MapPin className="size-5 text-muted-foreground" />
                                </div>

                                <div className="min-w-0">
                                    <p className="text-xs text-muted-foreground">
                                        Country
                                    </p>

                                    <p className="mt-1 truncate font-medium">
                                        {countryName}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="flex items-start gap-3 p-5">
                                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                                    <GraduationCap className="size-5 text-muted-foreground" />
                                </div>

                                <div className="min-w-0">
                                    <p className="text-xs text-muted-foreground">
                                        Type
                                    </p>

                                    <p className="mt-1 truncate font-medium">
                                        {opportunityType}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="flex items-start gap-3 p-5">
                                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                                    <CalendarDays className="size-5 text-muted-foreground" />
                                </div>

                                <div className="min-w-0">
                                    <p className="text-xs text-muted-foreground">
                                        Deadline
                                    </p>

                                    <p className="mt-1 truncate font-medium">
                                        {formatDate(
                                            opportunity.deadline
                                        )}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </section>

                    <div className="grid gap-6 lg:grid-cols-[minmax(0,1.5fr)_minmax(300px,1fr)]">

                        <div className="space-y-6">

                            <Card>
                                <CardHeader>
                                    <CardTitle>
                                        Basic Information
                                    </CardTitle>

                                    <CardDescription>
                                        Main information about this opportunity.
                                    </CardDescription>
                                </CardHeader>

                                <CardContent>
                                    <div className="grid gap-5 sm:grid-cols-2">
                                        <InfoItem
                                            label="University"
                                            value={universityName}
                                        />

                                        <InfoItem
                                            label="Country"
                                            value={countryName}
                                        />

                                        <InfoItem
                                            label="Opportunity Type"
                                            value={opportunityType}
                                        />

                                        <InfoItem
                                            label="Funding Type"
                                            value={fundingType}
                                        />

                                        <InfoItem
                                            label="Status"
                                            value={
                                                opportunity.status
                                            }
                                        />

                                        <InfoItem
                                            label="Verified"
                                            value={
                                                opportunity.is_verified
                                                    ? "Yes"
                                                    : "No"
                                            }
                                        />

                                        <InfoItem
                                            label="Slug"
                                            value={
                                                opportunity.slug
                                            }
                                        />

                                        <InfoItem
                                            label="Created By"
                                            value={
                                                opportunity.created_by
                                                    ? `#${opportunity.created_by}`
                                                    : "N/A"
                                            }
                                        />
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>
                                        Academic Fields
                                    </CardTitle>

                                    <CardDescription>
                                        Fields associated with this opportunity.
                                    </CardDescription>
                                </CardHeader>

                                <CardContent>
                                    {opportunity.fields?.length ? (
                                        <div className="flex flex-wrap gap-2">
                                            {opportunity.fields.map(
                                                (field) => (
                                                    <Badge
                                                        key={
                                                            field.id
                                                        }
                                                        variant="secondary"
                                                    >
                                                        {
                                                            field.name
                                                        }
                                                    </Badge>
                                                )
                                            )}
                                        </div>
                                    ) : (
                                        <EmptySection text="No academic fields assigned." />
                                    )}
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>
                                        Degrees
                                    </CardTitle>

                                    <CardDescription>
                                        Degrees associated with this opportunity.
                                    </CardDescription>
                                </CardHeader>

                                <CardContent>
                                    {opportunity.degrees?.length ? (
                                        <div className="flex flex-wrap gap-2">
                                            {opportunity.degrees.map(
                                                (degree) => (
                                                    <Badge
                                                        key={
                                                            degree.id
                                                        }
                                                        variant="outline"
                                                    >
                                                        {
                                                            degree.name
                                                        }{" "}
                                                        (
                                                        {
                                                            degree.code
                                                        }
                                                        )
                                                    </Badge>
                                                )
                                            )}
                                        </div>
                                    ) : (
                                        <EmptySection text="No degrees assigned." />
                                    )}
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>
                                        Skills
                                    </CardTitle>

                                    <CardDescription>
                                        Required and optional skills.
                                    </CardDescription>
                                </CardHeader>

                                <CardContent>
                                    {opportunity.skills?.length ? (
                                        <div className="space-y-2">
                                            {opportunity.skills.map(
                                                (skill) => (
                                                    <div
                                                        key={
                                                            skill.id
                                                        }
                                                        className="flex items-center justify-between gap-3 rounded-lg border px-4 py-3"
                                                    >
                                                        <div>
                                                            <p className="font-medium">
                                                                {
                                                                    skill.name
                                                                }
                                                            </p>

                                                            {skill.category && (
                                                                <p className="mt-1 text-xs text-muted-foreground">
                                                                    {
                                                                        skill.category
                                                                    }
                                                                </p>
                                                            )}
                                                        </div>

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
                                        <EmptySection text="No skills assigned." />
                                    )}
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>
                                        Nationalities
                                    </CardTitle>

                                    <CardDescription>
                                        Nationality eligibility rules.
                                    </CardDescription>
                                </CardHeader>

                                <CardContent>
                                    {opportunity.nationalities?.length ? (
                                        <div className="space-y-2">
                                            {opportunity.nationalities.map(
                                                (
                                                    nationality,
                                                    index
                                                ) => (
                                                    <div
                                                        key={
                                                            nationality.country_id ??
                                                            index
                                                        }
                                                        className="flex items-center justify-between gap-3 rounded-lg border px-4 py-3"
                                                    >
                                                        <div>
                                                            <p className="font-medium">
                                                                {nationality.country_name ??
                                                                    "Unknown Country"}
                                                            </p>
                                                        </div>

                                                        <Badge
                                                            variant={getEligibilityVariant(
                                                                nationality.eligibility_type
                                                            )}
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
                                        <EmptySection text="No nationality restrictions." />
                                    )}
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>
                                        Requirements
                                    </CardTitle>

                                    <CardDescription>
                                        Eligibility requirements for this opportunity.
                                    </CardDescription>
                                </CardHeader>

                                <CardContent>
                                    {opportunity.requirements?.length ? (
                                        <div className="space-y-3">
                                            {opportunity.requirements.map(
                                                (
                                                    requirement
                                                ) => (
                                                    <div
                                                        key={
                                                            requirement.id
                                                        }
                                                        className="rounded-xl border p-4"
                                                    >
                                                        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                                                            <div>
                                                                <p className="font-medium">
                                                                    {
                                                                        requirement.requirement_type
                                                                    }
                                                                </p>

                                                                {requirement.description && (
                                                                    <p className="mt-1 text-sm text-muted-foreground">
                                                                        {
                                                                            requirement.description
                                                                        }
                                                                    </p>
                                                                )}
                                                            </div>

                                                            <Badge
                                                                variant={
                                                                    requirement.is_mandatory
                                                                        ? "default"
                                                                        : "secondary"
                                                                }
                                                            >
                                                                {requirement.is_mandatory
                                                                    ? "Mandatory"
                                                                    : "Optional"}
                                                            </Badge>
                                                        </div>

                                                        <div className="mt-4 grid gap-3 sm:grid-cols-3">
                                                            <InfoItem
                                                                label="Operator"
                                                                value={
                                                                    requirement.operator
                                                                }
                                                            />

                                                            <InfoItem
                                                                label="Value"
                                                                value={
                                                                    requirement.value
                                                                }
                                                            />

                                                            <InfoItem
                                                                label="Unit"
                                                                value={
                                                                    requirement.unit ??
                                                                    "N/A"
                                                                }
                                                            />

                                                            {requirement.language_name && (
                                                                <InfoItem
                                                                    label="Language"
                                                                    value={
                                                                        requirement.language_name
                                                                    }
                                                                />
                                                            )}
                                                        </div>
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    ) : (
                                        <EmptySection text="No requirements assigned." />
                                    )}
                                </CardContent>
                            </Card>
                        </div>

                        <div className="space-y-6">

                            <Card>
                                <CardHeader>
                                    <CardTitle>
                                        Dates
                                    </CardTitle>

                                    <CardDescription>
                                        Opportunity timeline.
                                    </CardDescription>
                                </CardHeader>

                                <CardContent className="space-y-4">
                                    <InfoItem
                                        label="Deadline"
                                        value={formatDate(
                                            opportunity.deadline
                                        )}
                                    />

                                    <InfoItem
                                        label="Start Date"
                                        value={formatDate(
                                            opportunity.start_date
                                        )}
                                    />

                                    <InfoItem
                                        label="End Date"
                                        value={formatDate(
                                            opportunity.end_date
                                        )}
                                    />
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>
                                        Links
                                    </CardTitle>

                                    <CardDescription>
                                        External opportunity resources.
                                    </CardDescription>
                                </CardHeader>

                                <CardContent className="space-y-3">
                                    {opportunity.application_url && (
                                        <a
                                            href={
                                                opportunity.application_url
                                            }
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-3 rounded-lg border p-3 text-sm transition-colors hover:bg-muted/50"
                                        >
                                            <Link2 className="size-4 shrink-0" />

                                            <span className="min-w-0 flex-1 truncate">
                                                Application Website
                                            </span>

                                            <ExternalLink className="size-4 shrink-0 text-muted-foreground" />
                                        </a>
                                    )}

                                    {opportunity.source_url && (
                                        <a
                                            href={
                                                opportunity.source_url
                                            }
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-3 rounded-lg border p-3 text-sm transition-colors hover:bg-muted/50"
                                        >
                                            <Globe2 className="size-4 shrink-0" />

                                            <span className="min-w-0 flex-1 truncate">
                                                Source Website
                                            </span>

                                            <ExternalLink className="size-4 shrink-0 text-muted-foreground" />
                                        </a>
                                    )}

                                    {!opportunity.application_url &&
                                        !opportunity.source_url && (
                                            <EmptySection text="No external links available." />
                                        )}
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>
                                        Record Information
                                    </CardTitle>
                                </CardHeader>

                                <CardContent className="space-y-4">
                                    <InfoItem
                                        label="Opportunity ID"
                                        value={`#${opportunity.id}`}
                                    />

                                    <InfoItem
                                        label="Created"
                                        value={formatDateTime(
                                            opportunity.created_at
                                        )}
                                    />

                                    <InfoItem
                                        label="Last Updated"
                                        value={formatDateTime(
                                            opportunity.updated_at
                                        )}
                                    />
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>
                                        Admin Actions
                                    </CardTitle>

                                    <CardDescription>
                                        Manage this opportunity.
                                    </CardDescription>
                                </CardHeader>

                                <CardContent className="space-y-2">
                                    <Link
                                        to={`/admin/opportunities/${opportunity.id}/edit`}
                                        className="flex h-10 w-full items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                                    >
                                        <FileEdit className="size-4" />
                                        Edit Opportunity
                                    </Link>

                                    <Link
                                        to="/admin/opportunities"
                                        className="flex h-10 w-full items-center justify-center gap-2 rounded-md border border-input bg-background px-4 text-sm font-medium hover:bg-accent"
                                    >
                                        <ArrowLeft className="size-4" />
                                        Back to Opportunities
                                    </Link>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Languages className="size-3.5" />
                        Admin opportunity view
                    </div>
                </div>
            </div>
        </div>
    );
}

function InfoItem({
    label,
    value,
}) {
    return (
        <div className="min-w-0">
            <p className="text-xs text-muted-foreground">
                {label}
            </p>

            <p className="mt-1 break-words text-sm font-medium">
                {value ?? "N/A"}
            </p>
        </div>
    );
}

function EmptySection({
    text,
}) {
    return (
        <div className="rounded-xl border border-dashed p-6 text-center">
            <p className="text-sm text-muted-foreground">
                {text}
            </p>
        </div>
    );
}

export default AdminOpportunityDetails;
