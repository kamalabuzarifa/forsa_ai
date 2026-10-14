import { useEffect, useState } from "react";
import { BarChart3, CheckCircle2, FileText, GraduationCap, Users, XCircle } from "lucide-react";

import { getAdminDashboard } from "../../api/admin";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const number = (value) => Number(value || 0).toLocaleString();

function AdminReports() {
    const [dashboard, setDashboard] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let active = true;
        getAdminDashboard()
            .then((response) => {
                if (active) setDashboard(response);
            })
            .catch((loadError) => {
                if (active) setError(loadError?.response?.data?.message || "Failed to load reports.");
            })
            .finally(() => {
                if (active) setLoading(false);
            });

        return () => {
            active = false;
        };
    }, []);

    if (loading) {
        return <div className="admin-content-width space-y-4">{[1, 2, 3].map((item) => <div className="h-28 animate-pulse rounded-xl bg-muted" key={item} />)}</div>;
    }

    if (error) {
        return <div className="admin-content-width"><div className="flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive"><XCircle className="mt-0.5 size-4 shrink-0" /><p>{error}</p></div></div>;
    }

    const metrics = dashboard?.metrics || {};
    const statusEntries = Object.entries(dashboard?.applications_by_status || {});
    const typeEntries = dashboard?.opportunities_by_type || [];
    const maxStatus = Math.max(...statusEntries.map(([, value]) => Number(value)), 1);
    const maxType = Math.max(...typeEntries.map((item) => Number(item.total)), 1);
    const cards = [
        [Users, "Students", metrics.total_students],
        [GraduationCap, "Opportunities", metrics.total_opportunities],
        [FileText, "Applications", metrics.total_applications],
        [CheckCircle2, "Accepted", metrics.accepted_applications],
    ];

    return (
        <div className="w-full">
            <div className="admin-content-width space-y-6">
                <section><Badge variant="secondary" className="mb-2">Analytics</Badge><h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Reports</h1><p className="mt-2 text-sm text-muted-foreground sm:text-base">Monitor students, opportunities, applications, and outcomes.</p></section>

                <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{cards.map(([Icon, title, value]) => <Card key={title}><CardContent className="flex items-center gap-3 pt-5"><Icon className="size-5 text-primary" /><div><p className="text-xs text-muted-foreground">{title}</p><p className="text-2xl font-semibold">{number(value)}</p></div></CardContent></Card>)}</section>

                <section className="grid gap-6 lg:grid-cols-2">
                    <Card><CardHeader><CardTitle>Applications by status</CardTitle><CardDescription>Current application pipeline.</CardDescription></CardHeader><CardContent className="space-y-4">{statusEntries.length ? statusEntries.map(([status, value]) => <div className="space-y-2" key={status}><div className="flex justify-between text-sm"><span className="capitalize">{status.replace(/_/g, " ")}</span><strong>{number(value)}</strong></div><div className="h-2 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-primary" style={{ width: `${Math.max((Number(value) / maxStatus) * 100, 4)}%` }} /></div></div>) : <p className="text-sm text-muted-foreground">No application data yet.</p>}</CardContent></Card>
                    <Card><CardHeader><CardTitle>Opportunities by type</CardTitle><CardDescription>Catalogue distribution by opportunity type.</CardDescription></CardHeader><CardContent className="space-y-4">{typeEntries.length ? typeEntries.map((item) => <div className="space-y-2" key={item.label}><div className="flex justify-between text-sm"><span>{item.label}</span><strong>{number(item.total)}</strong></div><div className="h-2 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-primary" style={{ width: `${Math.max((Number(item.total) / maxType) * 100, 4)}%` }} /></div></div>) : <p className="text-sm text-muted-foreground">No opportunity data yet.</p>}</CardContent></Card>
                </section>

                <Card><CardHeader><CardTitle>Profile completion</CardTitle><CardDescription>Student readiness overview.</CardDescription></CardHeader><CardContent className="grid gap-4 sm:grid-cols-3"><div><p className="text-xs text-muted-foreground">Average completion</p><p className="mt-1 text-2xl font-semibold">{number(metrics.average_profile_completion)}%</p></div><div><p className="text-xs text-muted-foreground">Complete profiles</p><p className="mt-1 text-2xl font-semibold">{number(metrics.complete_profiles)}</p></div><div><p className="text-xs text-muted-foreground">Incomplete profiles</p><p className="mt-1 text-2xl font-semibold">{number(metrics.incomplete_profiles)}</p></div></CardContent></Card>
            </div>
        </div>
    );
}

export default AdminReports;
