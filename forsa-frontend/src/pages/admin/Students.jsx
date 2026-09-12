import { useEffect, useState } from "react";
import { Search, UserRound, UsersRound, XCircle } from "lucide-react";

import { getAdminUsers } from "../../api/admin";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const getErrorMessage = (error) => {
    return error?.response?.data?.message || "Failed to load students.";
};

function AdminStudents() {
    const [students, setStudents] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [total, setTotal] = useState(0);

    useEffect(() => {
        let active = true;
        const timer = window.setTimeout(async () => {
            try {
                setLoading(true);
                setError("");
                const response = await getAdminUsers(1, search.trim(), "student");
                if (!active) return;
                setStudents(response?.data || []);
                setTotal(response?.total || 0);
            } catch (loadError) {
                if (active) setError(getErrorMessage(loadError));
            } finally {
                if (active) setLoading(false);
            }
        }, 250);

        return () => {
            active = false;
            window.clearTimeout(timer);
        };
    }, [search]);

    return (
        <div className="w-full">
            <div className="mx-auto w-full max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
                <section>
                    <Badge variant="secondary" className="mb-2">Admin control</Badge>
                    <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Students</h1>
                    <p className="mt-2 text-sm text-muted-foreground sm:text-base">Review student accounts and profile activity.</p>
                </section>

                {error && <div className="flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive"><XCircle className="mt-0.5 size-4 shrink-0" /><p>{error}</p></div>}

                <div className="grid gap-4 sm:grid-cols-2">
                    <Card><CardContent className="flex items-center gap-3 pt-5"><UsersRound className="size-5 text-primary" /><div><p className="text-xs text-muted-foreground">Total students</p><p className="text-2xl font-semibold">{total}</p></div></CardContent></Card>
                    <Card><CardContent className="flex items-center gap-3 pt-5"><UserRound className="size-5 text-primary" /><div><p className="text-xs text-muted-foreground">Showing</p><p className="text-2xl font-semibold">{students.length}</p></div></CardContent></Card>
                </div>

                <Card>
                    <CardHeader className="gap-4 border-b sm:flex-row sm:items-center sm:justify-between">
                        <div><CardTitle>Student directory</CardTitle><CardDescription>Search student accounts by name or email.</CardDescription></div>
                        <div className="relative w-full sm:w-72"><Search className="absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><Input className="ps-9" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search students" /></div>
                    </CardHeader>
                    <CardContent className="p-0">
                        {loading ? <div className="space-y-3 p-6">{[1, 2, 3, 4].map((item) => <div className="h-16 animate-pulse rounded-xl bg-muted" key={item} />)}</div> : students.length === 0 ? <div className="p-6 text-sm text-muted-foreground">No students found.</div> : <div className="overflow-x-auto"><table className="w-full min-w-[640px] text-sm"><thead className="bg-muted/40 text-left text-xs uppercase tracking-wide text-muted-foreground"><tr><th className="px-6 py-3">Student</th><th className="px-6 py-3">Status</th><th className="px-6 py-3">Applications</th><th className="px-6 py-3">Joined</th></tr></thead><tbody className="divide-y">{students.map((student) => <tr key={student.id}><td className="px-6 py-4"><p className="font-medium">{student.name}</p><p className="text-xs text-muted-foreground">{student.email}</p></td><td className="px-6 py-4"><span className="rounded-full bg-muted px-2.5 py-1 text-xs capitalize">{student.status}</span></td><td className="px-6 py-4 text-muted-foreground">{student.applications_count ?? 0}</td><td className="px-6 py-4 text-muted-foreground">{student.created_at ? new Date(student.created_at).toLocaleDateString("en-GB") : "N/A"}</td></tr>)}</tbody></table></div>}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

export default AdminStudents;
