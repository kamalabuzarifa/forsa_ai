import { useEffect, useState } from "react";

import {
    getStudentProfile,
    updateStudentProfile,
    getStudentProfileLookups,
} from "../../api/profile";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

import {
    Pencil,
    Save,
    X,
    User,
    GraduationCap,
    Languages,
    Code2,
    Briefcase,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";

function Profile() {
    const { setUser } = useAuth();

    const [profile, setProfile] = useState(null);

    const [lookups, setLookups] = useState({
        countries: [],
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [editing, setEditing] = useState(false);

    const [form, setForm] = useState({
        name: "",
        date_of_birth: "",
        nationality_id: "",
        country_of_residence_id: "",
        phone: "",
        bio: "",
    });

    useEffect(() => {
        loadProfile();
        loadLookups();
    }, []);

    const getProfileFormData = (profileData) => {
        const user = profileData?.user;
        const personalProfile = profileData?.profile;

        return {
            name: user?.name || "",

            date_of_birth: personalProfile?.date_of_birth
                ? personalProfile.date_of_birth.substring(0, 10)
                : "",

            nationality_id: personalProfile?.nationality_id
                ? String(personalProfile.nationality_id)
                : "",

            country_of_residence_id:
                personalProfile?.country_of_residence_id
                    ? String(
                        personalProfile.country_of_residence_id
                    )
                    : "",

            phone: personalProfile?.phone || "",
            bio: personalProfile?.bio || "",
        };
    };

    const loadProfile = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await getStudentProfile();

            setProfile(response);
            setForm(getProfileFormData(response));
        } catch (error) {
            console.error("Failed to load profile:", error);

            setError(
                error?.response?.data?.message ||
                "Failed to load profile."
            );
        } finally {
            setLoading(false);
        }
    };

    const loadLookups = async () => {
        try {
            const response =
                await getStudentProfileLookups();

            setLookups({
                countries:
                    response?.countries ||
                    response?.data?.countries ||
                    [],
            });
        } catch (error) {
            console.error(
                "Failed to load profile lookups:",
                error
            );
        }
    };

    const handleChange = (event) => {
        const { name, value } = event.target;

        setForm((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    const handleEdit = () => {
        setSuccess("");
        setError("");
        setEditing(true);
    };

    const handleCancel = () => {
        setForm(getProfileFormData(profile));

        setEditing(false);
        setError("");
        setSuccess("");
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            setSaving(true);
            setError("");
            setSuccess("");

            const response =
                await updateStudentProfile({
                    name: form.name,

                    date_of_birth:
                        form.date_of_birth || null,

                    nationality_id: form.nationality_id
                        ? Number(form.nationality_id)
                        : null,

                    country_of_residence_id:
                        form.country_of_residence_id
                            ? Number(
                                form.country_of_residence_id
                            )
                            : null,

                    phone: form.phone || null,
                    bio: form.bio || null,
                });

            const updatedProfile = response;

            setProfile(updatedProfile);
            setForm(getProfileFormData(updatedProfile));

            if (updatedProfile?.user) {
                setUser(updatedProfile.user);

                localStorage.setItem(
                    "user",
                    JSON.stringify(
                        updatedProfile.user
                    )
                );
            }

            setEditing(false);

            setSuccess(
                "Profile updated successfully."
            );
        } catch (error) {
            console.error(
                "Failed to update profile:",
                error
            );

            const validationErrors =
                error?.response?.data?.errors;

            if (validationErrors) {
                const firstError =
                    Object.values(
                        validationErrors
                    )?.[0]?.[0];

                setError(
                    firstError ||
                    "Please check your information."
                );
            } else {
                setError(
                    error?.response?.data?.message ||
                    "Failed to update profile."
                );
            }
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="w-full">
                <div className="mx-auto max-w-7xl p-6">
                    <div className="space-y-4">
                        <div className="h-8 w-48 animate-pulse rounded bg-muted" />

                        <div className="h-4 w-80 animate-pulse rounded bg-muted" />

                        <div className="h-64 animate-pulse rounded-xl bg-muted" />
                    </div>
                </div>
            </div>
        );
    }

    if (error && !profile) {
        return (
            <div className="w-full">
                <div className="mx-auto max-w-7xl p-6">
                    <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6 text-destructive">
                        {error}
                    </div>
                </div>
            </div>
        );
    }

    const user = profile?.user;
    const personalProfile = profile?.profile;

    return (
        <div className="w-full">
            <div className="mx-auto max-w-7xl p-6">

                {/* Header */}

                <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-3xl font-semibold tracking-tight">
                            My Profile
                        </h1>

                        <p className="mt-2 text-muted-foreground">
                            Manage your personal and academic information.
                        </p>
                    </div>

                    {!editing ? (
                        <Button
                            type="button"
                            onClick={handleEdit}
                        >
                            <Pencil className="mr-2 size-4" />
                            Edit Profile
                        </Button>
                    ) : (
                        <div className="flex gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleCancel}
                                disabled={saving}
                            >
                                <X className="mr-2 size-4" />
                                Cancel
                            </Button>

                            <Button
                                type="submit"
                                form="profile-form"
                                disabled={saving}
                            >
                                <Save className="mr-2 size-4" />

                                {saving
                                    ? "Saving..."
                                    : "Save Changes"}
                            </Button>
                        </div>
                    )}
                </div>

                {/* Messages */}

                {success && (
                    <div className="mb-6 rounded-xl border border-green-500/30 bg-green-500/5 p-4 text-sm text-green-700">
                        {success}
                    </div>
                )}

                {error && (
                    <div className="mb-6 rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
                        {error}
                    </div>
                )}

                {/* Personal Information */}

                <Card>
                    <CardHeader>
                        <div className="flex items-start gap-3">
                            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                                <User className="size-5 text-primary" />
                            </div>

                            <div>
                                <CardTitle>
                                    Personal Information
                                </CardTitle>

                                <CardDescription>
                                    Your basic account information
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent>
                        {editing ? (
                            <form
                                id="profile-form"
                                onSubmit={handleSubmit}
                                className="space-y-6"
                            >
                                <div className="grid gap-6 sm:grid-cols-2">

                                    {/* Full Name */}

                                    <div className="space-y-2">
                                        <Label htmlFor="name">
                                            Full Name
                                        </Label>

                                        <Input
                                            id="name"
                                            name="name"
                                            value={form.name}
                                            onChange={handleChange}
                                            placeholder="Enter your full name"
                                            required
                                        />
                                    </div>

                                    {/* Email */}

                                    <div className="space-y-2">
                                        <Label htmlFor="email">
                                            Email
                                        </Label>

                                        <Input
                                            id="email"
                                            value={user?.email || ""}
                                            disabled
                                        />

                                        <p className="text-xs text-muted-foreground">
                                            Email cannot be changed here.
                                        </p>
                                    </div>

                                    {/* Phone */}

                                    <div className="space-y-2">
                                        <Label htmlFor="phone">
                                            Phone
                                        </Label>

                                        <Input
                                            id="phone"
                                            name="phone"
                                            value={form.phone}
                                            onChange={handleChange}
                                            placeholder="+970..."
                                        />
                                    </div>

                                    {/* Date of Birth */}

                                    <div className="space-y-2">
                                        <Label htmlFor="date_of_birth">
                                            Date of Birth
                                        </Label>

                                        <Input
                                            id="date_of_birth"
                                            name="date_of_birth"
                                            type="date"
                                            value={
                                                form.date_of_birth
                                            }
                                            onChange={handleChange}
                                        />
                                    </div>

                                    {/* Nationality */}

                                    <div className="space-y-2">
                                        <Label htmlFor="nationality_id">
                                            Nationality
                                        </Label>

                                        <select
                                            id="nationality_id"
                                            name="nationality_id"
                                            value={
                                                form.nationality_id
                                            }
                                            onChange={handleChange}
                                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
                                        >
                                            <option value="">
                                                Select nationality
                                            </option>

                                            {lookups.countries.map(
                                                (country) => (
                                                    <option
                                                        key={
                                                            country.id
                                                        }
                                                        value={
                                                            country.id
                                                        }
                                                    >
                                                        {
                                                            country.name
                                                        }
                                                    </option>
                                                )
                                            )}
                                        </select>
                                    </div>

                                    {/* Country of Residence */}

                                    <div className="space-y-2">
                                        <Label htmlFor="country_of_residence_id">
                                            Country of Residence
                                        </Label>

                                        <select
                                            id="country_of_residence_id"
                                            name="country_of_residence_id"
                                            value={
                                                form.country_of_residence_id
                                            }
                                            onChange={handleChange}
                                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
                                        >
                                            <option value="">
                                                Select country
                                            </option>

                                            {lookups.countries.map(
                                                (country) => (
                                                    <option
                                                        key={
                                                            country.id
                                                        }
                                                        value={
                                                            country.id
                                                        }
                                                    >
                                                        {
                                                            country.name
                                                        }
                                                    </option>
                                                )
                                            )}
                                        </select>
                                    </div>
                                </div>

                                {/* Bio */}

                                <div className="space-y-2">
                                    <Label htmlFor="bio">
                                        Bio
                                    </Label>

                                    <Textarea
                                        id="bio"
                                        name="bio"
                                        value={form.bio}
                                        onChange={handleChange}
                                        placeholder="Tell us about yourself..."
                                        rows={5}
                                    />
                                </div>
                            </form>
                        ) : (
                            <>
                                <div className="grid gap-6 sm:grid-cols-2">

                                    <div>
                                        <p className="text-sm text-muted-foreground">
                                            Full Name
                                        </p>

                                        <p className="mt-1 font-medium">
                                            {user?.name ||
                                                "Not available"}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-sm text-muted-foreground">
                                            Email
                                        </p>

                                        <p className="mt-1 font-medium">
                                            {user?.email ||
                                                "Not available"}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-sm text-muted-foreground">
                                            Phone
                                        </p>

                                        <p className="mt-1 font-medium">
                                            {personalProfile?.phone ||
                                                "Not available"}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-sm text-muted-foreground">
                                            Date of Birth
                                        </p>

                                        <p className="mt-1 font-medium">
                                            {personalProfile?.date_of_birth
                                                ? personalProfile.date_of_birth.substring(
                                                    0,
                                                    10
                                                )
                                                : "Not available"}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-sm text-muted-foreground">
                                            Nationality
                                        </p>

                                        <p className="mt-1 font-medium">
                                            {personalProfile?.nationality?.name ||
                                                "Not available"}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-sm text-muted-foreground">
                                            Country of Residence
                                        </p>

                                        <p className="mt-1 font-medium">
                                            {personalProfile?.country_of_residence?.name ||
                                                "Not available"}
                                        </p>
                                    </div>
                                </div>

                                <Separator className="my-6" />

                                <div>
                                    <p className="text-sm text-muted-foreground">
                                        Bio
                                    </p>

                                    <p className="mt-2 text-sm leading-6">
                                        {personalProfile?.bio ||
                                            "No bio added yet."}
                                    </p>
                                </div>
                            </>
                        )}
                    </CardContent>
                </Card>

                {/* Two Column Layout */}

                <div className="mt-6 grid gap-6 lg:grid-cols-2">

                    {/* Profile Completion */}

                    <Card>
                        <CardHeader>
                            <CardTitle>
                                Profile Completion
                            </CardTitle>

                            <CardDescription>
                                Complete your profile to improve recommendations.
                            </CardDescription>
                        </CardHeader>

                        <CardContent>
                            <div className="flex items-center justify-between">
                                <span className="text-3xl font-semibold">
                                    {
                                        personalProfile?.profile_completion ??
                                        0
                                    }
                                    %
                                </span>

                                <Badge variant="secondary">
                                    Student
                                </Badge>
                            </div>

                            <div className="mt-4 h-2 overflow-hidden rounded-full bg-muted">
                                <div
                                    className="h-full rounded-full bg-primary transition-all"
                                    style={{
                                        width: `${personalProfile?.profile_completion ?? 0}%`,
                                    }}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Academic Information */}

                    <Card>
                        <CardHeader>
                            <div className="flex items-start gap-3">
                                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                                    <GraduationCap className="size-5 text-primary" />
                                </div>

                                <div>
                                    <CardTitle>
                                        Academic Information
                                    </CardTitle>

                                    <CardDescription>
                                        Your education history
                                    </CardDescription>
                                </div>
                            </div>
                        </CardHeader>

                        <CardContent>
                            {profile?.academic_records?.length > 0 ? (
                                <div className="space-y-4">
                                    {profile.academic_records.map(
                                        (record) => (
                                            <div
                                                key={record.id}
                                                className="rounded-xl border p-4"
                                            >
                                                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                                                    <div>
                                                        <p className="font-medium">
                                                            {record.degree?.name ||
                                                                "Degree"}
                                                        </p>

                                                        <p className="text-sm text-muted-foreground">
                                                            {record.university?.name ||
                                                                "University not available"}
                                                        </p>

                                                        <p className="text-sm text-muted-foreground">
                                                            {record.field?.name ||
                                                                "Field not available"}
                                                        </p>
                                                    </div>

                                                    {record.is_current && (
                                                        <Badge>
                                                            Current
                                                        </Badge>
                                                    )}
                                                </div>

                                                <div className="mt-4 text-sm">
                                                    GPA{" "}
                                                    {record.gpa ??
                                                        "N/A"}

                                                    {record.gpa_scale
                                                        ? ` / ${record.gpa_scale}`
                                                        : ""}
                                                </div>
                                            </div>
                                        )
                                    )}
                                </div>
                            ) : (
                                <p className="text-sm text-muted-foreground">
                                    No academic records added yet.
                                </p>
                            )}
                        </CardContent>
                    </Card>

                    {/* Languages */}

                    <Card>
                        <CardHeader>
                            <div className="flex items-start gap-3">
                                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                                    <Languages className="size-5 text-primary" />
                                </div>

                                <div>
                                    <CardTitle>
                                        Languages
                                    </CardTitle>

                                    <CardDescription>
                                        Languages and proficiency levels
                                    </CardDescription>
                                </div>
                            </div>
                        </CardHeader>

                        <CardContent>
                            {profile?.languages?.length > 0 ? (
                                <div className="grid gap-3 sm:grid-cols-2">
                                    {profile.languages.map(
                                        (language) => (
                                            <div
                                                key={language.id}
                                                className="rounded-xl border p-4"
                                            >
                                                <p className="font-medium">
                                                    {
                                                        language.name
                                                    }
                                                </p>

                                                <Badge
                                                    variant="secondary"
                                                    className="mt-2"
                                                >
                                                    {language.pivot
                                                        ?.level ||
                                                        "N/A"}
                                                </Badge>

                                                {language.pivot
                                                    ?.test_type && (
                                                        <p className="mt-2 text-xs text-muted-foreground">
                                                            Test{" "}
                                                            {
                                                                language
                                                                    .pivot
                                                                    .test_type
                                                            }
                                                        </p>
                                                    )}
                                            </div>
                                        )
                                    )}
                                </div>
                            ) : (
                                <p className="text-sm text-muted-foreground">
                                    No languages added yet.
                                </p>
                            )}
                        </CardContent>
                    </Card>

                    {/* Skills */}

                    <Card>
                        <CardHeader>
                            <div className="flex items-start gap-3">
                                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                                    <Code2 className="size-5 text-primary" />
                                </div>

                                <div>
                                    <CardTitle>
                                        Skills
                                    </CardTitle>

                                    <CardDescription>
                                        Your technical and professional skills
                                    </CardDescription>
                                </div>
                            </div>
                        </CardHeader>

                        <CardContent>
                            {profile?.skills?.length > 0 ? (
                                <div className="flex flex-wrap gap-3">
                                    {profile.skills.map(
                                        (skill) => (
                                            <div
                                                key={skill.id}
                                                className="rounded-xl border px-4 py-3"
                                            >
                                                <p className="font-medium">
                                                    {
                                                        skill.name
                                                    }
                                                </p>

                                                <p className="mt-1 text-xs text-muted-foreground">
                                                    {skill.pivot
                                                        ?.level ||
                                                        "N/A"}
                                                </p>
                                            </div>
                                        )
                                    )}
                                </div>
                            ) : (
                                <p className="text-sm text-muted-foreground">
                                    No skills added yet.
                                </p>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Work Experience */}

                <Card className="mt-6">
                    <CardHeader>
                        <div className="flex items-start gap-3">
                            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                                <Briefcase className="size-5 text-primary" />
                            </div>

                            <div>
                                <CardTitle>
                                    Work Experience
                                </CardTitle>

                                <CardDescription>
                                    Your professional experience
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent>
                        {profile?.work_experiences?.length > 0 ? (
                            <div className="space-y-4">
                                {profile.work_experiences.map(
                                    (experience) => (
                                        <div
                                            key={experience.id}
                                            className="rounded-xl border p-4"
                                        >
                                            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                                                <div>
                                                    <p className="font-medium">
                                                        {
                                                            experience.job_title
                                                        }
                                                    </p>

                                                    <p className="text-sm text-muted-foreground">
                                                        {
                                                            experience.company
                                                        }
                                                    </p>
                                                </div>

                                                {experience.is_current && (
                                                    <Badge>
                                                        Current
                                                    </Badge>
                                                )}
                                            </div>

                                            {experience.description && (
                                                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                                                    {
                                                        experience.description
                                                    }
                                                </p>
                                            )}
                                        </div>
                                    )
                                )}
                            </div>
                        ) : (
                            <p className="text-sm text-muted-foreground">
                                No work experience added yet.
                            </p>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

export default Profile;
