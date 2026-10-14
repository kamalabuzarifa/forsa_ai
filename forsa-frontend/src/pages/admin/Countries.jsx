import { useEffect, useState } from "react";
import {
    Globe2,
    Pencil,
    Plus,
    Search,
    Trash2,
    X,
    XCircle,
} from "lucide-react";

import {
    getAdminCountries,
    createAdminCountry,
    updateAdminCountry,
    deleteAdminCountry,
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
import { Input } from "@/components/ui/input";

const initialForm = {
    name: "",
    code: "",
    iso_code: "",
};

const getErrorMessage = (error, fallback) => {
    const response = error?.response?.data;

    if (response?.message) {
        return response.message;
    }

    if (response?.errors) {
        const firstError = Object.values(response.errors)
            .flat()
            .find(Boolean);

        if (firstError) {
            return firstError;
        }
    }

    return fallback;
};

function Countries() {
    const [countries, setCountries] = useState([]);
    const [form, setForm] = useState(initialForm);

    const [search, setSearch] = useState("");

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [deletingId, setDeletingId] = useState(null);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const loadCountries = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await getAdminCountries();

            setCountries(
                Array.isArray(response?.countries)
                    ? response.countries
                    : []
            );
        } catch (error) {
            console.error(
                "Failed to load countries:",
                error
            );

            setError(
                getErrorMessage(
                    error,
                    "Failed to load countries."
                )
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadCountries();
    }, []);

    const handleInputChange = (event) => {
        const { name, value } = event.target;

        setForm((current) => ({
            ...current,
            [name]: value,
        }));

        setError("");
        setSuccess("");
    };

    const handleCreate = async (event) => {
        event.preventDefault();

        setError("");
        setSuccess("");

        const name = form.name.trim();
        const code = form.code.trim().toUpperCase();
        const isoCode = form.iso_code
            .trim()
            .toUpperCase();

        if (!name) {
            setError("Country name is required.");
            return;
        }

        if (!code) {
            setError("Country code is required.");
            return;
        }

        if (isoCode && (isoCode.length < 2 || isoCode.length > 3)) {
            setError(
                "ISO code must contain 2 or 3 characters."
            );
            return;
        }

        try {
            setSaving(true);

            const payload = {
                name,
                code,
                iso_code: isoCode || null,
            };

            if (editingId) {
                await updateAdminCountry(editingId, payload);
            } else {
                await createAdminCountry(payload);
            }

            setForm(initialForm);
            setEditingId(null);

            await loadCountries();

            setSuccess(
                editingId
                    ? "Country updated successfully."
                    : "Country created successfully."
            );
        } catch (error) {
            console.error(
                "Failed to create country:",
                error
            );

            setError(
                getErrorMessage(
                    error,
                    "Failed to create country."
                )
            );
        } finally {
            setSaving(false);
        }
    };

    const handleEdit = (country) => {
        setEditingId(country.id);
        setForm({
            name: country.name || "",
            code: country.code || "",
            iso_code: country.iso_code || "",
        });
        setError("");
        setSuccess("");
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setForm(initialForm);
        setError("");
        setSuccess("");
    };

    const handleDelete = async (country) => {
        if (!window.confirm(`Delete ${country.name}?`)) {
            return;
        }

        try {
            setDeletingId(country.id);
            setError("");
            setSuccess("");

            await deleteAdminCountry(country.id);

            if (editingId === country.id) {
                handleCancelEdit();
            }

            setCountries((current) =>
                current.filter((item) => item.id !== country.id)
            );
            setSuccess("Country deleted successfully.");
        } catch (error) {
            setError(
                getErrorMessage(
                    error,
                    "Failed to delete country."
                )
            );
        } finally {
            setDeletingId(null);
        }
    };

    const query = search.trim().toLowerCase();

    const filteredCountries = countries.filter(
        (country) => {
            if (!query) {
                return true;
            }

            const name =
                country?.name?.toLowerCase() ?? "";

            const code =
                country?.code?.toLowerCase() ?? "";

            const isoCode =
                country?.iso_code?.toLowerCase() ?? "";

            return (
                name.includes(query) ||
                code.includes(query) ||
                isoCode.includes(query)
            );
        }
    );

    return (
        <div className="w-full">
            <div className="admin-content-width">
                <div className="space-y-6">

                    <section>
                        <Badge
                            variant="secondary"
                            className="mb-2"
                        >
                            Admin
                        </Badge>

                        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                            Countries
                        </h1>

                        <p className="mt-2 text-sm text-muted-foreground sm:text-base">
                            Manage countries available in the platform.
                        </p>
                    </section>

                    {error && (
                        <div className="flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
                            <XCircle className="mt-0.5 size-4 shrink-0" />

                            <p>{error}</p>
                        </div>
                    )}

                    {success && (
                        <div className="rounded-xl border border-green-500/30 bg-green-500/5 px-4 py-3 text-sm text-green-700">
                            {success}
                        </div>
                    )}

                    <Card>
                        <CardHeader>
                            <CardTitle>
                                {editingId
                                    ? "Edit Country"
                                    : "Add Country"}
                            </CardTitle>

                            <CardDescription>
                                Add a country that can be used when creating opportunities and universities.
                            </CardDescription>
                        </CardHeader>

                        <CardContent>
                            <form
                                onSubmit={handleCreate}
                                className="space-y-5"
                            >
                                <div className="grid gap-5 md:grid-cols-3">

                                    <div className="space-y-2">
                                        <label
                                            htmlFor="country_name"
                                            className="text-sm font-medium"
                                        >
                                            Country Name
                                        </label>

                                        <Input
                                            id="country_name"
                                            name="name"
                                            value={form.name}
                                            onChange={handleInputChange}
                                            placeholder="Brazil"
                                            maxLength={100}
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label
                                            htmlFor="country_code"
                                            className="text-sm font-medium"
                                        >
                                            Country Code
                                        </label>

                                        <Input
                                            id="country_code"
                                            name="code"
                                            value={form.code}
                                            onChange={handleInputChange}
                                            placeholder="BRA"
                                            maxLength={10}
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label
                                            htmlFor="country_iso_code"
                                            className="text-sm font-medium"
                                        >
                                            ISO Code
                                        </label>

                                        <Input
                                            id="country_iso_code"
                                            name="iso_code"
                                            value={form.iso_code}
                                            onChange={handleInputChange}
                                            placeholder="BR"
                                            minLength={2}
                                            maxLength={3}
                                        />
                                    </div>

                                </div>

                                <div className="flex justify-end">
                                    {editingId && (
                                        <Button
                                            type="button"
                                            variant="outline"
                                            className="mr-2"
                                            onClick={handleCancelEdit}
                                            disabled={saving}
                                        >
                                            <X className="size-4" />
                                            Cancel
                                        </Button>
                                    )}

                                    <Button
                                        type="submit"
                                        disabled={saving}
                                    >
                                        {editingId ? (
                                            <Pencil className="size-4" />
                                        ) : (
                                            <Plus className="size-4" />
                                        )}

                                        {saving
                                            ? editingId
                                                ? "Saving..."
                                                : "Creating..."
                                            : editingId
                                                ? "Save Changes"
                                                : "Add Country"}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>
                                Countries
                            </CardTitle>

                            <CardDescription>
                                {countries.length} countries
                            </CardDescription>
                        </CardHeader>

                        <CardContent className="space-y-4">

                            <div className="relative">
                                <Search className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                                <Input
                                    value={search}
                                    onChange={(event) =>
                                        setSearch(
                                            event.target.value
                                        )
                                    }
                                    placeholder="Search countries..."
                                    className="h-10 ps-9"
                                />
                            </div>

                            {loading ? (
                                <div className="space-y-3">
                                    {[1, 2, 3].map(
                                        (item) => (
                                            <div
                                                key={item}
                                                className="h-16 animate-pulse rounded-xl bg-muted"
                                            />
                                        )
                                    )}
                                </div>
                            ) : filteredCountries.length === 0 ? (
                                <div className="py-12 text-center">
                                    <Globe2 className="mx-auto size-8 text-muted-foreground" />

                                    <p className="mt-3 font-medium">
                                        No countries found
                                    </p>

                                    {countries.length === 0 && (
                                        <p className="mt-1 text-sm text-muted-foreground">
                                            Add your first country above.
                                        </p>
                                    )}
                                </div>
                            ) : (
                                <div className="divide-y rounded-xl border">
                                    {filteredCountries.map(
                                        (country) => (
                                            <div
                                                key={country.id}
                                                className="flex items-center gap-3 px-4 py-4"
                                            >
                                                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted">
                                                    <Globe2 className="size-4" />
                                                </div>

                                                <div className="min-w-0">
                                                    <p className="font-medium">
                                                        {country.name}
                                                    </p>

                                                    <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                                                        <span>
                                                            ID #{country.id}
                                                        </span>

                                                        {country.code && (
                                                            <span>
                                                                Code: {country.code}
                                                            </span>
                                                        )}

                                                        {country.iso_code && (
                                                            <span>
                                                                ISO: {country.iso_code}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="ml-auto flex shrink-0 items-center gap-2">
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        size="icon"
                                                        onClick={() =>
                                                            handleEdit(country)
                                                        }
                                                        aria-label={`Edit ${country.name}`}
                                                        title={`Edit ${country.name}`}
                                                    >
                                                        <Pencil className="size-4" />
                                                    </Button>

                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        size="icon"
                                                        className="text-destructive hover:text-destructive"
                                                        disabled={
                                                            deletingId ===
                                                            country.id
                                                        }
                                                        onClick={() =>
                                                            handleDelete(country)
                                                        }
                                                        aria-label={`Delete ${country.name}`}
                                                        title={`Delete ${country.name}`}
                                                    >
                                                        <Trash2 className="size-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        )
                                    )}
                                </div>
                            )}

                        </CardContent>
                    </Card>

                </div>
            </div>
        </div>
    );
}

export default Countries;
