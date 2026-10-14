import { useEffect, useState } from "react";
import { Pencil, Plus, Search, Trash2, X } from "lucide-react";

import {
    createAdminTaxonomy,
    deleteAdminTaxonomy,
    getAdminTaxonomy,
    updateAdminTaxonomy,
} from "../../api/admin";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const taxonomyOptions = [
    { value: "fields", label: "Academic fields" },
    { value: "degrees", label: "Degrees" },
    { value: "skills", label: "Skills" },
    { value: "languages", label: "Languages" },
    { value: "opportunity-types", label: "Opportunity types" },
    { value: "funding-types", label: "Funding types" },
];

const emptyForm = {
    name: "",
    code: "",
    description: "",
    category: "",
};

const getErrorMessage = (error) => {
    const response = error?.response?.data;
    const firstError = response?.errors
        ? Object.values(response.errors).flat().find(Boolean)
        : "";

    return response?.message || firstError || "Unable to update taxonomy.";
};

function Taxonomies() {
    const [taxonomy, setTaxonomy] = useState("fields");
    const [items, setItems] = useState([]);
    const [form, setForm] = useState(emptyForm);
    const [editingId, setEditingId] = useState(null);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const loadItems = async (selectedTaxonomy = taxonomy) => {
        try {
            setLoading(true);
            setError("");
            const response = await getAdminTaxonomy(selectedTaxonomy);
            setItems(response?.items || []);
        } catch (loadError) {
            setError(getErrorMessage(loadError));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        let mounted = true;

        const loadSelectedTaxonomy = async () => {
            try {
                setLoading(true);
                setError("");
                const response = await getAdminTaxonomy(taxonomy);

                if (mounted) {
                    setItems(response?.items || []);
                }
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

        loadSelectedTaxonomy();

        return () => {
            mounted = false;
        };
    }, [taxonomy]);

    const visibleItems = items.filter((item) =>
        String(item.name || "").toLowerCase().includes(search.trim().toLowerCase())
    );

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            setSaving(true);
            setError("");
            const payload = {
                name: form.name.trim(),
                code: form.code.trim() || null,
                description: form.description.trim() || null,
                category: form.category.trim() || null,
            };

            if (editingId) {
                await updateAdminTaxonomy(taxonomy, editingId, payload);
                setSuccess("Taxonomy item updated successfully.");
            } else {
                await createAdminTaxonomy(taxonomy, payload);
                setSuccess("Taxonomy item created successfully.");
            }

            setForm(emptyForm);
            setEditingId(null);
            await loadItems();
        } catch (saveError) {
            setError(getErrorMessage(saveError));
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (item) => {
        if (!window.confirm(`Delete ${item.name}?`)) return;

        try {
            setError("");
            await deleteAdminTaxonomy(taxonomy, item.id);
            setSuccess("Taxonomy item deleted successfully.");
            await loadItems();
        } catch (deleteError) {
            setError(getErrorMessage(deleteError));
        }
    };

    return (
        <div className="w-full">
            <div className="admin-content-width space-y-6">
                <section>
                    <Badge variant="secondary" className="mb-2">Academic Management</Badge>
                    <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Taxonomies</h1>
                    <p className="mt-2 text-sm text-muted-foreground sm:text-base">Manage the shared values used by student forms, filters, and recommendations.</p>
                </section>

                {error && <div className="rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">{error}</div>}
                {success && <div className="rounded-xl border border-green-500/30 bg-green-500/5 px-4 py-3 text-sm text-green-700">{success}</div>}

                <div className="flex flex-wrap gap-2">
                    {taxonomyOptions.map((option) => (
                        <Button key={option.value} type="button" variant={taxonomy === option.value ? "default" : "outline"} onClick={() => { setTaxonomy(option.value); setForm(emptyForm); setEditingId(null); }}>
                            {option.label}
                        </Button>
                    ))}
                </div>

                <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
                    <Card>
                        <CardHeader className="gap-4 border-b sm:flex-row sm:items-center sm:justify-between">
                            <div><CardTitle>{taxonomyOptions.find((option) => option.value === taxonomy)?.label}</CardTitle><CardDescription>{visibleItems.length} visible items</CardDescription></div>
                            <div className="relative w-full sm:w-64"><Search className="absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><Input className="ps-9" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search items" /></div>
                        </CardHeader>
                        <CardContent className="p-0">
                            {loading ? <p className="p-6 text-sm text-muted-foreground">Loading taxonomy...</p> : visibleItems.length === 0 ? <p className="p-6 text-sm text-muted-foreground">No items found.</p> : <div className="divide-y">{visibleItems.map((item) => <div key={item.id} className="flex items-center justify-between gap-4 px-6 py-4"><div className="min-w-0"><p className="font-medium">{item.name}</p><p className="text-xs text-muted-foreground">{item.code || item.category || item.description || "No additional metadata"}</p></div><div className="flex shrink-0 gap-2"><Button type="button" variant="outline" size="icon" onClick={() => { setEditingId(item.id); setForm({ name: item.name || "", code: item.code || "", description: item.description || "", category: item.category || "" }); }} aria-label={`Edit ${item.name}`}><Pencil className="size-4" /></Button><Button type="button" variant="outline" size="icon" onClick={() => handleDelete(item)} aria-label={`Delete ${item.name}`}><Trash2 className="size-4" /></Button></div></div>)}</div>}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader><CardTitle>{editingId ? "Edit item" : "Add item"}</CardTitle><CardDescription>Changes are reflected in forms and filters after saving.</CardDescription></CardHeader>
                        <CardContent>
                            <form className="space-y-4" onSubmit={handleSubmit}>
                                <Input value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} placeholder="Name" required />
                                <Input value={form.code} onChange={(event) => setForm((current) => ({ ...current, code: event.target.value }))} placeholder="Code (optional)" />
                                <Input value={form.category} onChange={(event) => setForm((current) => ({ ...current, category: event.target.value }))} placeholder="Category (optional)" />
                                <textarea className="min-h-24 w-full rounded-md border bg-background px-3 py-2 text-sm" value={form.description} onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))} placeholder="Description (optional)" />
                                <div className="flex gap-2"><Button type="submit" disabled={saving}><Plus className="size-4" />{saving ? "Saving..." : editingId ? "Save changes" : "Add item"}</Button>{editingId && <Button type="button" variant="ghost" onClick={() => { setEditingId(null); setForm(emptyForm); }}><X className="size-4" />Cancel</Button>}</div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

export default Taxonomies;
