import { useEffect, useState } from "react";
import { ExternalLink, GraduationCap, Search, XCircle } from "lucide-react";
import { Link } from "react-router-dom";

import { getAdminOpportunities } from "../../api/admin";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const getItems = (response) => response?.data?.data || response?.data || [];
const getName = (value) => typeof value === "object" ? value?.name || value?.title || "N/A" : value || "N/A";

function AdminPrograms() {
    const [programs, setPrograms] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        getAdminOpportunities()
            .then((response) => setPrograms(getItems(response)))
            .catch((loadError) => setError(loadError?.response?.data?.message || "Failed to load programs."))
            .finally(() => setLoading(false));
    }, []);

    const query = search.trim().toLowerCase();
    const filteredPrograms = programs.filter((program) => [program.title, getName(program.university), getName(program.country)].some((value) => String(value).toLowerCase().includes(query)));

    return (
        <div className="w-full">
            <div className="mx-auto w-full max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
                <section><Badge variant="secondary" className="mb-2">Content management</Badge><h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Programs</h1><p className="mt-2 text-sm text-muted-foreground sm:text-base">Manage academic programs currently represented by opportunities.</p></section>
                {error && <div className="flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive"><XCircle className="mt-0.5 size-4 shrink-0" /><p>{error}</p></div>}
                <Card><CardHeader className="gap-4 border-b sm:flex-row sm:items-center sm:justify-between"><div><CardTitle>Academic programs</CardTitle><CardDescription>{programs.length} programs available</CardDescription></div><div className="relative w-full sm:w-72"><Search className="absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><Input className="ps-9" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search programs" /></div></CardHeader><CardContent className="p-0">{loading ? <div className="space-y-3 p-6">{[1, 2, 3, 4].map((item) => <div className="h-20 animate-pulse rounded-xl bg-muted" key={item} />)}</div> : filteredPrograms.length === 0 ? <div className="p-8 text-center text-sm text-muted-foreground"><GraduationCap className="mx-auto mb-2 size-8" />No programs found.</div> : <div className="divide-y">{filteredPrograms.map((program) => <div className="flex items-center gap-4 px-5 py-4" key={program.id}><div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted"><GraduationCap className="size-5" /></div><div className="min-w-0 flex-1"><p className="truncate font-medium">{program.title}</p><p className="truncate text-sm text-muted-foreground">{getName(program.university)} · {getName(program.country)}</p></div><span className="hidden rounded-full bg-muted px-2.5 py-1 text-xs capitalize sm:inline-flex">{program.status || "draft"}</span><Link className="inline-flex size-9 items-center justify-center rounded-md border hover:bg-accent" to={`/admin/opportunities/${program.id}`} aria-label={`View ${program.title}`} title={`View ${program.title}`}><ExternalLink className="size-4" /></Link></div>)}</div>}</CardContent></Card>
            </div>
        </div>
    );
}

export default AdminPrograms;
