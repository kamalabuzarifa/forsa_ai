import { useEffect, useState } from "react";
import { Activity, ChevronLeft, ChevronRight } from "lucide-react";

import { getAdminAuditLogs } from "../../api/admin";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const getErrorMessage = (error) => error?.response?.data?.message || "Failed to load audit logs.";

function AuditLogs() {
    const [logs, setLogs] = useState([]);
    const [action, setAction] = useState("");
    const [page, setPage] = useState(1);
    const [meta, setMeta] = useState({ current_page: 1, last_page: 1 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let mounted = true;

        const loadLogs = async () => {
            try {
                setLoading(true);
                setError("");
                const response = await getAdminAuditLogs(page, action ? { action } : {});

                if (!mounted) {
                    return;
                }

                setLogs(response?.data || []);
                setMeta({
                    current_page: response?.current_page || 1,
                    last_page: response?.last_page || 1,
                });
            } catch (loadError) {
                if (mounted) {
                    setError(getErrorMessage(loadError));
                }
            } finally {
                if (mounted) {
                    setLoading(false);
                }
            }
        };

        loadLogs();

        return () => {
            mounted = false;
        };
    }, [action, page]);

    const handleActionChange = (event) => {
        setPage(1);
        setAction(event.target.value);
    };

    return (
        <div className="w-full">
            <div className="mx-auto w-full max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
                <section>
                    <Badge variant="secondary" className="mb-2">Security</Badge>
                    <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Audit logs</h1>
                    <p className="mt-2 text-sm text-muted-foreground sm:text-base">Read-only history of sensitive administrative actions.</p>
                </section>

                {error && <div className="rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">{error}</div>}

                <Card>
                    <CardHeader className="gap-4 border-b sm:flex-row sm:items-center sm:justify-between">
                        <div><CardTitle>Activity history</CardTitle><CardDescription>Audit records cannot be edited or deleted from the application.</CardDescription></div>
                        <Input className="w-full sm:w-64" value={action} onChange={handleActionChange} placeholder="Filter action, e.g. role.updated" />
                    </CardHeader>
                    <CardContent className="p-0">
                        {loading ? <p className="p-6 text-sm text-muted-foreground">Loading audit logs...</p> : logs.length === 0 ? <p className="p-6 text-sm text-muted-foreground">No audit records found.</p> : <div className="overflow-x-auto"><table className="w-full min-w-[800px] text-sm"><thead className="bg-muted/40 text-left text-xs uppercase tracking-wide text-muted-foreground"><tr><th className="px-6 py-3">Action</th><th className="px-6 py-3">Actor</th><th className="px-6 py-3">Target</th><th className="px-6 py-3">Date</th><th className="px-6 py-3">Details</th></tr></thead><tbody className="divide-y">{logs.map((log) => <tr key={log.id}><td className="px-6 py-4"><div className="flex items-center gap-2"><Activity className="size-4 text-primary" /><span className="font-medium">{log.action}</span></div></td><td className="px-6 py-4">{log.user?.name || "System"}</td><td className="px-6 py-4 text-muted-foreground">{log.auditable_type ? `${log.auditable_type.split("\\").pop()} #${log.auditable_id}` : "System"}</td><td className="px-6 py-4 text-muted-foreground">{log.created_at ? new Date(log.created_at).toLocaleString() : "-"}</td><td className="max-w-xs truncate px-6 py-4 text-muted-foreground">{Object.keys(log.after || log.before || {}).join(", ") || "Metadata"}</td></tr>)}</tbody></table></div>}
                    </CardContent>
                    <div className="flex items-center justify-between border-t px-6 py-4 text-sm text-muted-foreground"><span>Page {meta.current_page} of {meta.last_page}</span><div className="flex gap-2"><Button type="button" variant="outline" size="icon" disabled={page <= 1 || loading} onClick={() => setPage((current) => current - 1)}><ChevronLeft className="size-4" /></Button><Button type="button" variant="outline" size="icon" disabled={page >= meta.last_page || loading} onClick={() => setPage((current) => current + 1)}><ChevronRight className="size-4" /></Button></div></div>
                </Card>
            </div>
        </div>
    );
}

export default AuditLogs;
