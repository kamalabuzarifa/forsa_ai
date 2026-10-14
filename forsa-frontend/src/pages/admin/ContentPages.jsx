import { useEffect, useState } from "react";
import { Eye, EyeOff, Pencil, Plus, Save, Trash2 } from "lucide-react";

import {
    createAdminContentPage,
    createAdminContentSection,
    deleteAdminContentSection,
    getAdminContentPages,
    getAdminContentSections,
    publishAdminContentPage,
    unpublishAdminContentPage,
    updateAdminContentPage,
    updateAdminContentSection,
} from "../../api/admin";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const emptyPage = { slug: "", title: "", description: "", status: "draft" };
const emptySection = { key: "", type: "text", heading: "", body: "", image_url: "", cta_label: "", cta_url: "", sort_order: 0, is_visible: true, status: "draft" };
const getErrorMessage = (error) => error?.response?.data?.message || Object.values(error?.response?.data?.errors || {}).flat().find(Boolean) || "CMS request failed.";

function ContentPages() {
    const [pages, setPages] = useState([]);
    const [page, setPage] = useState(null);
    const [sections, setSections] = useState([]);
    const [pageForm, setPageForm] = useState(emptyPage);
    const [sectionForm, setSectionForm] = useState(emptySection);
    const [editingSectionId, setEditingSectionId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const loadPages = async () => {
        const response = await getAdminContentPages();
        const nextPages = response?.pages || [];
        setPages(nextPages);
        if (!page && nextPages[0]) {
            setPage(nextPages[0]);
            setPageForm(nextPages[0]);
        }
    };

    const loadSections = async (pageId) => {
        const response = await getAdminContentSections(pageId);
        setSections(response?.sections || []);
    };

    useEffect(() => {
        let mounted = true;
        const load = async () => {
            try {
                setLoading(true);
                const response = await getAdminContentPages();
                if (!mounted) return;
                const nextPages = response?.pages || [];
                setPages(nextPages);
                if (nextPages[0]) {
                    setPage(nextPages[0]);
                    setPageForm(nextPages[0]);
                    const sectionResponse = await getAdminContentSections(nextPages[0].id);
                    if (mounted) setSections(sectionResponse?.sections || []);
                }
            } catch (loadError) {
                if (mounted) setError(getErrorMessage(loadError));
            } finally {
                if (mounted) setLoading(false);
            }
        };
        load();
        return () => { mounted = false; };
    }, []);

    const selectPage = async (selectedPage) => {
        setPage(selectedPage);
        setPageForm(selectedPage);
        setEditingSectionId(null);
        setSectionForm(emptySection);
        await loadSections(selectedPage.id);
    };

    const savePage = async (event) => {
        event.preventDefault();
        try {
            setSaving(true);
            setError("");
            const response = page?.id
                ? await updateAdminContentPage(page.id, pageForm)
                : await createAdminContentPage(pageForm);
            setPage(response.page);
            setPageForm(response.page);
            setSuccess("Page saved successfully.");
            await loadPages();
        } catch (saveError) {
            setError(getErrorMessage(saveError));
        } finally {
            setSaving(false);
        }
    };

    const saveSection = async (event) => {
        event.preventDefault();
        if (!page) return;
        try {
            setSaving(true);
            setError("");
            if (editingSectionId) {
                await updateAdminContentSection(editingSectionId, sectionForm);
            } else {
                await createAdminContentSection(page.id, sectionForm);
            }
            setSectionForm(emptySection);
            setEditingSectionId(null);
            setSuccess("Section saved successfully.");
            await loadSections(page.id);
        } catch (saveError) {
            setError(getErrorMessage(saveError));
        } finally {
            setSaving(false);
        }
    };

    const publish = async () => {
        if (!page) return;
        try {
            const response = page.status === "published"
                ? await unpublishAdminContentPage(page.id)
                : await publishAdminContentPage(page.id);
            setPage(response.page);
            setPageForm(response.page);
            setSuccess(page.status === "published" ? "Page unpublished." : "Page published.");
            await loadPages();
        } catch (publishError) {
            setError(getErrorMessage(publishError));
        }
    };

    return (
        <div className="w-full">
            <div className="mx-auto w-full max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
                <section><Badge variant="secondary" className="mb-2">Website Management</Badge><h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Website Content</h1><p className="mt-2 text-sm text-muted-foreground sm:text-base">Manage structured page copy and optional sections without editing React source files.</p></section>
                {error && <div className="rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">{error}</div>}
                {success && <div className="rounded-xl border border-green-500/30 bg-green-500/5 px-4 py-3 text-sm text-green-700">{success}</div>}
                <div className="grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
                    <Card><CardHeader><CardTitle>Pages</CardTitle><CardDescription>Supported CMS pages</CardDescription></CardHeader><CardContent className="space-y-2">{loading ? <p className="text-sm text-muted-foreground">Loading pages...</p> : pages.map((item) => <button key={item.id} type="button" onClick={() => selectPage(item)} className={`w-full rounded-md border px-3 py-2 text-left text-sm ${page?.id === item.id ? "border-primary bg-primary/10" : "hover:bg-muted"}`}><span className="block font-medium">{item.title}</span><span className="text-xs text-muted-foreground">/{item.slug} · {item.status}</span></button>)}</CardContent></Card>
                    <div className="space-y-6">
                        <Card><CardHeader className="flex-row items-center justify-between"><div><CardTitle>{page?.title || "Create a page"}</CardTitle><CardDescription>Page title and publication state</CardDescription></div>{page && <Button type="button" variant="outline" onClick={publish}>{page.status === "published" ? <EyeOff className="size-4" /> : <Eye className="size-4" />}{page.status === "published" ? "Unpublish" : "Publish"}</Button>}</CardHeader><CardContent><form className="grid gap-4 md:grid-cols-2" onSubmit={savePage}><Input value={pageForm.slug} onChange={(event) => setPageForm((current) => ({ ...current, slug: event.target.value }))} placeholder="Page slug" required /><Input value={pageForm.title} onChange={(event) => setPageForm((current) => ({ ...current, title: event.target.value }))} placeholder="Page title" required /><textarea className="min-h-24 rounded-md border bg-background px-3 py-2 text-sm md:col-span-2" value={pageForm.description || ""} onChange={(event) => setPageForm((current) => ({ ...current, description: event.target.value }))} placeholder="Page description" /><Button type="submit" disabled={saving} className="md:col-span-2"><Save className="size-4" />Save page</Button></form></CardContent></Card>
                        {page && <Card><CardHeader><CardTitle>Sections</CardTitle><CardDescription>Structured, validated text sections ordered by sort order.</CardDescription></CardHeader><CardContent className="space-y-4">{sections.map((section) => <div key={section.id} className="flex items-start justify-between gap-4 rounded-md border p-3"><div className="min-w-0"><p className="font-medium">{section.heading || section.key}</p><p className="text-xs text-muted-foreground">{section.type} · {section.status} · {section.is_visible ? "Visible" : "Hidden"} · order {section.sort_order}</p></div><div className="flex shrink-0 gap-2"><Button type="button" variant="outline" size="icon" onClick={() => { setEditingSectionId(section.id); setSectionForm(section); }}><Pencil className="size-4" /></Button><Button type="button" variant="outline" size="icon" onClick={async () => { await deleteAdminContentSection(section.id); await loadSections(page.id); }}><Trash2 className="size-4" /></Button></div></div>)}<form className="grid gap-3 border-t pt-4 md:grid-cols-2" onSubmit={saveSection}><Input value={sectionForm.key} onChange={(event) => setSectionForm((current) => ({ ...current, key: event.target.value }))} placeholder="Section key" required /><select className="h-10 rounded-md border bg-background px-3 text-sm" value={sectionForm.type} onChange={(event) => setSectionForm((current) => ({ ...current, type: event.target.value }))}><option value="text">Text</option><option value="hero">Hero</option><option value="cta">Call to action</option><option value="notice">Notice</option></select><Input value={sectionForm.heading} onChange={(event) => setSectionForm((current) => ({ ...current, heading: event.target.value }))} placeholder="Heading" /><Input value={sectionForm.sort_order} type="number" min="0" onChange={(event) => setSectionForm((current) => ({ ...current, sort_order: Number(event.target.value) }))} placeholder="Order" /><textarea className="min-h-24 rounded-md border bg-background px-3 py-2 text-sm md:col-span-2" value={sectionForm.body} onChange={(event) => setSectionForm((current) => ({ ...current, body: event.target.value }))} placeholder="Plain text body (HTML and scripts are not accepted)" /><Input value={sectionForm.cta_label} onChange={(event) => setSectionForm((current) => ({ ...current, cta_label: event.target.value }))} placeholder="CTA label (optional)" /><Input value={sectionForm.cta_url} onChange={(event) => setSectionForm((current) => ({ ...current, cta_url: event.target.value }))} placeholder="CTA URL (https:// or /path)" /><label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={sectionForm.is_visible} onChange={(event) => setSectionForm((current) => ({ ...current, is_visible: event.target.checked }))} />Visible</label><Button type="submit" disabled={saving} className="md:col-span-2"><Plus className="size-4" />{editingSectionId ? "Save section" : "Add section"}</Button></form></CardContent></Card>}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ContentPages;
