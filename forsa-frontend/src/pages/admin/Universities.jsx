import { useEffect, useState } from "react";

import {
    Building2,
    Plus,
    Search,
    XCircle,
} from "lucide-react";

import {
    getAdminUniversities,
    createAdminUniversity,
    getAdminCountries,
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
    country_id: "",
    website: "",
    description: "",
    status: "active",
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

function Universities() {
    const [universities, setUniversities] = useState([]);
    const [countries, setCountries] = useState([]);

    const [form, setForm] = useState(initialForm);
    const [search, setSearch] = useState("");

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const loadData = async () => {
        try {
            setLoading(true);
            setError("");

            const [
                universitiesResponse,
                countriesResponse,
            ] = await Promise.all([
                getAdminUniversities(),
                getAdminCountries(),
            ]);

            setUniversities(
                Array.isArray(
                    universitiesResponse?.universities
                )
                    ? universitiesResponse.universities
                    : []
            );

            setCountries(
                Array.isArray(
                    countriesResponse?.countries
                )
                    ? countriesResponse.countries
                    : []
            );
        } catch (error) {
            console.error(
                "Failed to load universities data:",
                error
            );

            setError(
                getErrorMessage(
                    error,
                    "Failed to load universities data."
                )
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
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
        const countryId = Number(form.country_id);
        const website = form.website.trim();
        const description = form.description.trim();

        if (!name) {
            setError(
                "University name is required."
            );
            return;
        }

        if (!countryId) {
            setError(
                "Please select a country."
            );
            return;
        }

        try {
            setSaving(true);

            await createAdminUniversity({
                name,
                country_id: countryId,
                website: website || null,
                description: description || null,
                status: form.status,
            });

            setForm(initialForm);

            await loadData();

            setSuccess(
                "University created successfully."
            );
        } catch (error) {
            console.error(
                "Failed to create university:",
                error
            );

            setError(
                getErrorMessage(
                    error,
                    "Failed to create university."
                )
            );
        } finally {
            setSaving(false);
        }
    };

    const query = search.trim().toLowerCase();

    const filteredUniversities =
        universities.filter((university) => {
            if (!query) {
                return true;
            }

            const name =
                university?.name?.toLowerCase() ?? "";

            const country =
                university?.country?.name?.toLowerCase() ??
                "";

            return (
                name.includes(query) ||
                country.includes(query)
            );
        });

    const getCountryName = (university) => {
        if (university?.country?.name) {
            return university.country.name;
        }

        const country = countries.find(
            (item) =>
                Number(item.id) ===
                Number(university?.country_id)
        );

        return country?.name || "No country";
    };

    return (
        <div className="w-full">
            <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                <div className="space-y-6">

                    <section>
                        <Badge
                            variant="secondary"
                            className="mb-2"
                        >
                            Admin
                        </Badge>

                        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                            Universities
                        </h1>

                        <p className="mt-2 text-sm text-muted-foreground sm:text-base">
                            Manage universities available in the platform.
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
                                Add University
                            </CardTitle>

                            <CardDescription>
                                Add a university that can be used when creating opportunities.
                            </CardDescription>
                        </CardHeader>

                        <CardContent>
                            <form
                                onSubmit={handleCreate}
                                className="space-y-5"
                            >
                                <div className="grid gap-5 md:grid-cols-2">

                                    <div className="space-y-2">
                                        <label
                                            htmlFor="university_name"
                                            className="text-sm font-medium"
                                        >
                                            University Name
                                        </label>

                                        <Input
                                            id="university_name"
                                            name="name"
                                            value={form.name}
                                            onChange={handleInputChange}
                                            placeholder="University of Oxford"
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label
                                            htmlFor="university_country"
                                            className="text-sm font-medium"
                                        >
                                            Country
                                        </label>

                                        <select
                                            id="university_country"
                                            name="country_id"
                                            value={form.country_id}
                                            onChange={handleInputChange}
                                            required
                                            disabled={
                                                countries.length === 0
                                            }
                                            className="h-10 w-full rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                        >
                                            <option value="">
                                                Select country
                                            </option>

                                            {countries.map(
                                                (country) => (
                                                    <option
                                                        key={country.id}
                                                        value={country.id}
                                                    >
                                                        {country.name}
                                                    </option>
                                                )
                                            )}
                                        </select>
                                    </div>

                                    <div className="space-y-2">
                                        <label
                                            htmlFor="university_website"
                                            className="text-sm font-medium"
                                        >
                                            Website
                                        </label>

                                        <Input
                                            id="university_website"
                                            name="website"
                                            type="url"
                                            value={form.website}
                                            onChange={handleInputChange}
                                            placeholder="https://www.ox.ac.uk"
                                            maxLength={500}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label
                                            htmlFor="university_status"
                                            className="text-sm font-medium"
                                        >
                                            Status
                                        </label>

                                        <select
                                            id="university_status"
                                            name="status"
                                            value={form.status}
                                            onChange={handleInputChange}
                                            className="h-10 w-full rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                                        >
                                            <option value="active">
                                                Active
                                            </option>

                                            <option value="inactive">
                                                Inactive
                                            </option>
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label
                                        htmlFor="university_description"
                                        className="text-sm font-medium"
                                    >
                                        Description
                                    </label>

                                    <textarea
                                        id="university_description"
                                        name="description"
                                        value={form.description}
                                        onChange={handleInputChange}
                                        rows={4}
                                        placeholder="University description..."
                                        className="w-full resize-y rounded-xl border bg-background px-3 py-3 text-sm outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-ring"
                                    />
                                </div>

                                <div className="flex justify-end">
                                    <Button
                                        type="submit"
                                        disabled={
                                            saving ||
                                            countries.length === 0
                                        }
                                    >
                                        <Plus className="size-4" />

                                        {saving
                                            ? "Creating..."
                                            : "Add University"}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>
                                Universities
                            </CardTitle>

                            <CardDescription>
                                {universities.length} universities
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
                                    placeholder="Search universities..."
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
                            ) : filteredUniversities.length === 0 ? (
                                <div className="py-12 text-center">
                                    <Building2 className="mx-auto size-8 text-muted-foreground" />

                                    <p className="mt-3 font-medium">
                                        No universities found
                                    </p>

                                    {universities.length === 0 && (
                                        <p className="mt-1 text-sm text-muted-foreground">
                                            Add your first university above.
                                        </p>
                                    )}
                                </div>
                            ) : (
                                <div className="divide-y rounded-xl border">
                                    {filteredUniversities.map(
                                        (university) => (
                                            <div
                                                key={university.id}
                                                className="flex items-center gap-3 px-4 py-4"
                                            >
                                                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted">
                                                    <Building2 className="size-4" />
                                                </div>

                                                <div className="min-w-0">
                                                    <p className="font-medium">
                                                        {university.name}
                                                    </p>

                                                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">

                                                        <span>
                                                            ID #{university.id}
                                                        </span>

                                                        <span>
                                                            {getCountryName(
                                                                university
                                                            )}
                                                        </span>

                                                        {university.status && (
                                                            <span>
                                                                {university.status}
                                                            </span>
                                                        )}

                                                        {university.website && (
                                                            <span className="truncate">
                                                                {university.website}
                                                            </span>
                                                        )}

                                                    </div>
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

export default Universities;
