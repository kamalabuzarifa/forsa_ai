import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
    ArrowLeft,
    CalendarDays,
    CheckCircle2,
    FileText,
    GraduationCap,
    Mail,
    UserRound,
    XCircle,
} from "lucide-react";

import {
    getAdminApplication,
    updateAdminApplication,
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
    switch (String(status).toLowerCase()) {
        case "accepted":
            return "default";

        case "rejected":
            return "destructive";

        case "under_review":
        case "under review":
            return "secondary";

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

function AdminApplicationDetails() {
    const { id } = useParams();

    const [application, setApplication] =
        useState(null);

    const [status, setStatus] =
        useState("pending");

    const [loading, setLoading] =
        useState(true);

    const [saving, setSaving] =
        useState(false);

    const [error, setError] =
        useState("");

    const [success, setSuccess] =
        useState("");

    const fetchApplication = async () => {
        try {
            setLoading(true);
            setError("");

            const response =
                await getAdminApplication(id);

            const data =
                response?.data ??
                response;

            setApplication(data);

            setStatus(
                data?.status ??
                "pending"
            );
        } catch (err) {
            console.error(
                "Failed to load application:",
                err
            );

            setError(
                err?.response?.data?.message ??
                "Failed to load application."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchApplication();
    }, [id]);

    const handleStatusUpdate = async () => {
        try {
            setSaving(true);
            setError("");
            setSuccess("");

            const response =
                await updateAdminApplication(
                    id,
                    {
                        status,
                    }
                );

            const updated =
                response?.data ??
                response;

            setApplication(updated);

            setStatus(
                updated?.status ??
                status
            );

            setSuccess(
                "Application status updated successfully."
            );
        } catch (err) {
            console.error(
                "Failed to update application:",
                err
            );

            setError(
                err?.response?.data?.message ??
                "Failed to update application."
            );
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="mx-auto w-full max-w-5xl px-4 py-6">
                <div className="space-y-4">
                    <div className="h-8 w-56 animate-pulse rounded bg-muted" />

                    <div className="h-48 animate-pulse rounded-xl bg-muted" />

                    <div className="h-48 animate-pulse rounded-xl bg-muted" />
                </div>
            </div>
        );
    }

    if (!application) {
        return (
            <div className="mx-auto w-full max-w-5xl px-4 py-6">
                <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-5 text-destructive">
                    {error ||
                        "Application not found."}
                </div>
            </div>
        );
    }

    const student =
        application.student ??
        application.user ??
        {};

    const opportunity =
        application.opportunity ??
        {};

    const studentName =
        getName(
            student,
            application.student_name ??
            application.user_name ??
            "N/A"
        );

    const studentEmail =
        student?.email ??
        application.student_email ??
        application.user_email ??
        "N/A";

    const opportunityTitle =
        getName(
            opportunity,
            application.opportunity_title ??
            "N/A"
        );

    const university =
        getName(
            opportunity?.university ??
            application.university
        );

    const country =
        getName(
            opportunity?.country ??
            application.country
        );

    const appliedAt =
        application.created_at ??
        application.applied_at ??
        application.application_date;

    return (
        <div className="w-full">
            <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 lg:px-8">

                <div className="space-y-6">

                    <div>
                        <Link
                            to="/admin/applications"
                            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
                        >
                            <ArrowLeft className="size-4" />

                            Back to Applications
                        </Link>

                        <Badge
                            variant="secondary"
                            className="mt-4 mb-2"
                        >
                            Admin
                        </Badge>

                        <h1 className="text-3xl font-semibold tracking-tight">
                            Application Details
                        </h1>

                        <p className="mt-2 text-sm text-muted-foreground">
                            Review and manage this student application.
                        </p>
                    </div>

                    {error && (
                        <div className="flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
                            <XCircle className="mt-0.5 size-4 shrink-0" />

                            <p>{error}</p>
                        </div>
                    )}

                    {success && (
                        <div className="flex items-start gap-3 rounded-xl border border-green-500/30 bg-green-500/5 px-4 py-3 text-sm text-green-700">
                            <CheckCircle2 className="mt-0.5 size-4 shrink-0" />

                            <p>{success}</p>
                        </div>
                    )}

                    <div className="grid gap-6 lg:grid-cols-2">

                        <Card>
                            <CardHeader>
                                <CardTitle>
                                    Student Information
                                </CardTitle>

                                <CardDescription>
                                    Applicant details
                                </CardDescription>
                            </CardHeader>

                            <CardContent className="space-y-5">

                                <div className="flex items-center gap-3">
                                    <div className="flex size-10 items-center justify-center rounded-full bg-muted">
                                        <UserRound className="size-5" />
                                    </div>

                                    <div>
                                        <p className="text-xs text-muted-foreground">
                                            Name
                                        </p>

                                        <p className="font-medium">
                                            {studentName}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="flex size-10 items-center justify-center rounded-full bg-muted">
                                        <Mail className="size-5" />
                                    </div>

                                    <div>
                                        <p className="text-xs text-muted-foreground">
                                            Email
                                        </p>

                                        <p className="font-medium">
                                            {studentEmail}
                                        </p>
                                    </div>
                                </div>

                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>
                                    Opportunity
                                </CardTitle>

                                <CardDescription>
                                    Application opportunity
                                </CardDescription>
                            </CardHeader>

                            <CardContent className="space-y-5">

                                <div className="flex items-start gap-3">
                                    <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-muted">
                                        <GraduationCap className="size-5" />
                                    </div>

                                    <div>
                                        <p className="text-xs text-muted-foreground">
                                            Title
                                        </p>

                                        <p className="font-medium">
                                            {opportunityTitle}
                                        </p>
                                    </div>
                                </div>

                                <div>
                                    <p className="text-xs text-muted-foreground">
                                        University
                                    </p>

                                    <p className="mt-1 font-medium">
                                        {university}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-xs text-muted-foreground">
                                        Country
                                    </p>

                                    <p className="mt-1 font-medium">
                                        {country}
                                    </p>
                                </div>

                            </CardContent>
                        </Card>

                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>
                                Application
                            </CardTitle>

                            <CardDescription>
                                Application status and notes
                            </CardDescription>
                        </CardHeader>

                        <CardContent className="space-y-6">

                            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                                <div>
                                    <p className="text-sm text-muted-foreground">
                                        Current Status
                                    </p>

                                    <div className="mt-2">
                                        <Badge
                                            variant={getStatusVariant(
                                                status
                                            )}
                                        >
                                            {formatStatus(
                                                status
                                            )}
                                        </Badge>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <CalendarDays className="size-4" />

                                    <span>
                                        Applied{" "}
                                        {formatDate(
                                            appliedAt
                                        )}
                                    </span>
                                </div>

                            </div>

                            <div>
                                <p className="mb-2 text-sm font-medium">
                                    Update Status
                                </p>

                                <div className="flex flex-col gap-3 sm:flex-row">

                                    <select
                                        value={status}
                                        onChange={(event) =>
                                            setStatus(
                                                event.target.value
                                            )
                                        }
                                        className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                                    >
                                        <option value="pending">
                                            Pending
                                        </option>

                                        <option value="under_review">
                                            Under Review
                                        </option>

                                        <option value="accepted">
                                            Accepted
                                        </option>

                                        <option value="rejected">
                                            Rejected
                                        </option>
                                    </select>

                                    <Button
                                        type="button"
                                        disabled={saving}
                                        onClick={
                                            handleStatusUpdate
                                        }
                                    >
                                        {saving
                                            ? "Saving..."
                                            : "Update Status"}
                                    </Button>

                                </div>
                            </div>

                            <div>
                                <div className="mb-2 flex items-center gap-2">
                                    <FileText className="size-4" />

                                    <p className="text-sm font-medium">
                                        Notes
                                    </p>
                                </div>

                                <div className="rounded-lg border bg-muted/30 p-4 text-sm leading-6 text-muted-foreground">
                                    {application.notes ||
                                        "No notes provided."}
                                </div>
                            </div>

                        </CardContent>
                    </Card>

                    <Link to="/admin/applications">
                        <Button
                            type="button"
                            variant="outline"
                        >
                            <ArrowLeft className="size-4" />

                            Back to Applications
                        </Button>
                    </Link>

                </div>
            </div>
        </div>
    );
}

export default AdminApplicationDetails;
