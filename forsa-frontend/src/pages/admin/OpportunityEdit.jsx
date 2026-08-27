import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
    ArrowLeft,
    Check,
    Loader2,
    Plus,
    Save,
    Trash2,
    X,
    XCircle,
} from "lucide-react";

import {
    createAdminUniversity,
    getAdminLookups,
    getAdminOpportunity,
    updateAdminOpportunity,
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

const createEmptySkill = () => ({
    skill_id: "",
    is_mandatory: true,
});

const createEmptyNationality = () => ({
    country_id: "",
    eligibility_type: "eligible",
});

const createEmptyRequirement = () => ({
    id: null,
    requirement_type: "",
    language_id: "",
    operator: ">=",
    value: "",
    unit: "",
    metadata: "",
    is_mandatory: true,
    description: "",
});

const createInitialUniversityForm = () => ({
    name: "",
    country_id: "",
    website: "",
    description: "",
    status: "active",
});

const createInitialForm = () => ({
    title: "",
    slug: "",
    description: "",
    university_id: "",
    country_id: "",
    opportunity_type_id: "",
    funding_type_id: "",
    application_url: "",
    source_url: "",
    deadline: "",
    start_date: "",
    end_date: "",
    status: "draft",
    is_verified: false,
    field_ids: [],
    degree_ids: [],
    skills: [],
    nationalities: [],
    requirements: [],
});

const initialLookups = {
    universities: [],
    countries: [],
    opportunity_types: [],
    funding_types: [],
    fields: [],
    degrees: [],
    skills: [],
    languages: [],
};

const createSlug = (value) => {
    return value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");
};

const getErrorMessage = (error, fallback) => {
    return (
        error?.response?.data?.message ??
        error?.message ??
        fallback
    );
};

const getValidationErrors = (error) => {
    return error?.response?.data?.errors ?? {};
};

const formatDateForInput = (value) => {
    if (!value) {
        return "";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "";
    }

    const year = date.getFullYear();

    const month = String(
        date.getMonth() + 1
    ).padStart(2, "0");

    const day = String(
        date.getDate()
    ).padStart(2, "0");

    return `${year}-${month}-${day}`;
};

const normalizeMetadata = (metadata) => {
    if (
        metadata === null ||
        metadata === undefined ||
        metadata === ""
    ) {
        return "";
    }

    if (typeof metadata === "string") {
        return metadata;
    }

    try {
        return JSON.stringify(metadata);
    } catch {
        return "";
    }
};

function OpportunityEdit() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [form, setForm] = useState(
        createInitialForm
    );

    const [lookups, setLookups] =
        useState(initialLookups);

    const [loading, setLoading] =
        useState(true);

    const [saving, setSaving] =
        useState(false);

    const [error, setError] =
        useState("");

    const [
        validationErrors,
        setValidationErrors,
    ] = useState({});

    const [
        showUniversityForm,
        setShowUniversityForm,
    ] = useState(false);

    const [
        universityForm,
        setUniversityForm,
    ] = useState(
        createInitialUniversityForm
    );

    const [
        creatingUniversity,
        setCreatingUniversity,
    ] = useState(false);

    const [
        universityError,
        setUniversityError,
    ] = useState("");

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                setError("");

                const [
                    opportunityResponse,
                    lookupResponse,
                ] = await Promise.all([
                    getAdminOpportunity(id),
                    getAdminLookups(),
                ]);

                const opportunity =
                    opportunityResponse?.data?.data ??
                    opportunityResponse?.data ??
                    opportunityResponse;

                const lookupData =
                    lookupResponse?.data ??
                    lookupResponse ??
                    {};

                setLookups({
                    universities:
                        lookupData.universities ?? [],

                    countries:
                        lookupData.countries ?? [],

                    opportunity_types:
                        lookupData.opportunity_types ?? [],

                    funding_types:
                        lookupData.funding_types ?? [],

                    fields:
                        lookupData.fields ?? [],

                    degrees:
                        lookupData.degrees ?? [],

                    skills:
                        lookupData.skills ?? [],

                    languages:
                        lookupData.languages ?? [],
                });

                setForm({
                    title:
                        opportunity?.title ?? "",

                    slug:
                        opportunity?.slug ?? "",

                    description:
                        opportunity?.description ?? "",

                    university_id:
                        opportunity?.university?.id
                            ? String(
                                opportunity.university.id
                            )
                            : "",

                    country_id:
                        opportunity?.country?.id
                            ? String(
                                opportunity.country.id
                            )
                            : "",

                    opportunity_type_id:
                        opportunity?.opportunity_type?.id
                            ? String(
                                opportunity.opportunity_type.id
                            )
                            : "",

                    funding_type_id:
                        opportunity?.funding_type?.id
                            ? String(
                                opportunity.funding_type.id
                            )
                            : "",

                    application_url:
                        opportunity?.application_url ??
                        "",

                    source_url:
                        opportunity?.source_url ??
                        "",

                    deadline:
                        formatDateForInput(
                            opportunity?.deadline
                        ),

                    start_date:
                        formatDateForInput(
                            opportunity?.start_date
                        ),

                    end_date:
                        formatDateForInput(
                            opportunity?.end_date
                        ),

                    status:
                        opportunity?.status ??
                        "draft",

                    is_verified:
                        Boolean(
                            opportunity?.is_verified
                        ),

                    field_ids:
                        Array.isArray(
                            opportunity?.fields
                        )
                            ? opportunity.fields.map(
                                (field) =>
                                    Number(
                                        field.id
                                    )
                            )
                            : [],

                    degree_ids:
                        Array.isArray(
                            opportunity?.degrees
                        )
                            ? opportunity.degrees.map(
                                (degree) =>
                                    Number(
                                        degree.id
                                    )
                            )
                            : [],

                    skills:
                        Array.isArray(
                            opportunity?.skills
                        )
                            ? opportunity.skills.map(
                                (skill) => ({
                                    skill_id:
                                        Number(
                                            skill.id
                                        ),

                                    is_mandatory:
                                        Boolean(
                                            skill.is_mandatory
                                        ),
                                })
                            )
                            : [],

                    nationalities:
                        Array.isArray(
                            opportunity?.nationalities
                        )
                            ? opportunity.nationalities.map(
                                (
                                    nationality
                                ) => ({
                                    country_id:
                                        Number(
                                            nationality.country_id
                                        ),

                                    eligibility_type:
                                        nationality.eligibility_type ??
                                        "eligible",
                                })
                            )
                            : [],

                    requirements:
                        Array.isArray(
                            opportunity?.requirements
                        )
                            ? opportunity.requirements.map(
                                (
                                    requirement
                                ) => ({
                                    id:
                                        requirement.id ??
                                        null,

                                    requirement_type:
                                        requirement.requirement_type ??
                                        "",

                                    language_id:
                                        requirement.language_id
                                            ? Number(
                                                requirement.language_id
                                            )
                                            : "",

                                    operator:
                                        requirement.operator ??
                                        ">=",

                                    value:
                                        requirement.value ??
                                        "",

                                    unit:
                                        requirement.unit ??
                                        "",

                                    metadata:
                                        normalizeMetadata(
                                            requirement.metadata
                                        ),

                                    is_mandatory:
                                        Boolean(
                                            requirement.is_mandatory
                                        ),

                                    description:
                                        requirement.description ??
                                        "",
                                })
                            )
                            : [],
                });
            } catch (err) {
                console.error(
                    "Failed to load opportunity:",
                    err
                );

                setError(
                    getErrorMessage(
                        err,
                        "Failed to load opportunity."
                    )
                );
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [id]);

    const getFieldError = (field) => {
        const value =
            validationErrors?.[field];

        if (Array.isArray(value)) {
            return value[0];
        }

        return value;
    };

    const handleInputChange = (event) => {
        const {
            name,
            value,
            type,
            checked,
        } = event.target;

        setForm((current) => ({
            ...current,
            [name]:
                type === "checkbox"
                    ? checked
                    : value,
        }));
    };

    const handleTitleChange = (event) => {
        const title =
            event.target.value;

        setForm((current) => {
            const generatedSlug =
                createSlug(
                    current.title
                );

            return {
                ...current,
                title,
                slug:
                    !current.slug ||
                        current.slug ===
                        generatedSlug
                        ? createSlug(title)
                        : current.slug,
            };
        });
    };

    const handleSlugChange = (event) => {
        setForm((current) => ({
            ...current,
            slug: createSlug(
                event.target.value
            ),
        }));
    };

    const toggleSelection = (
        field,
        id
    ) => {
        setForm((current) => {
            const selected =
                current[field].includes(id);

            return {
                ...current,
                [field]: selected
                    ? current[field].filter(
                        (item) =>
                            item !== id
                    )
                    : [
                        ...current[field],
                        id,
                    ],
            };
        });
    };

    const addSkill = () => {
        setForm((current) => ({
            ...current,
            skills: [
                ...current.skills,
                createEmptySkill(),
            ],
        }));
    };

    const updateSkill = (
        index,
        field,
        value
    ) => {
        setForm((current) => ({
            ...current,
            skills: current.skills.map(
                (skill, skillIndex) =>
                    skillIndex === index
                        ? {
                            ...skill,
                            [field]:
                                field ===
                                    "skill_id"
                                    ? value
                                        ? Number(
                                            value
                                        )
                                        : ""
                                    : value,
                        }
                        : skill
            ),
        }));
    };

    const removeSkill = (index) => {
        setForm((current) => ({
            ...current,
            skills: current.skills.filter(
                (_, skillIndex) =>
                    skillIndex !== index
            ),
        }));
    };

    const addNationality = () => {
        setForm((current) => ({
            ...current,
            nationalities: [
                ...current.nationalities,
                createEmptyNationality(),
            ],
        }));
    };

    const updateNationality = (
        index,
        field,
        value
    ) => {
        setForm((current) => ({
            ...current,
            nationalities:
                current.nationalities.map(
                    (
                        nationality,
                        nationalityIndex
                    ) =>
                        nationalityIndex ===
                            index
                            ? {
                                ...nationality,
                                [field]:
                                    field ===
                                        "country_id"
                                        ? value
                                            ? Number(
                                                value
                                            )
                                            : ""
                                        : value,
                            }
                            : nationality
                ),
        }));
    };

    const removeNationality = (
        index
    ) => {
        setForm((current) => ({
            ...current,
            nationalities:
                current.nationalities.filter(
                    (
                        _,
                        nationalityIndex
                    ) =>
                        nationalityIndex !==
                        index
                ),
        }));
    };

    const addRequirement = () => {
        setForm((current) => ({
            ...current,
            requirements: [
                ...current.requirements,
                createEmptyRequirement(),
            ],
        }));
    };

    const updateRequirement = (
        index,
        field,
        value
    ) => {
        setForm((current) => ({
            ...current,
            requirements:
                current.requirements.map(
                    (
                        requirement,
                        requirementIndex
                    ) =>
                        requirementIndex ===
                            index
                            ? {
                                ...requirement,
                                [field]:
                                    field ===
                                        "language_id"
                                        ? value
                                            ? Number(
                                                value
                                            )
                                            : ""
                                        : value,
                            }
                            : requirement
                ),
        }));
    };

    const removeRequirement = (
        index
    ) => {
        setForm((current) => ({
            ...current,
            requirements:
                current.requirements.filter(
                    (
                        _,
                        requirementIndex
                    ) =>
                        requirementIndex !==
                        index
                ),
        }));
    };

    const handleUniversityInputChange = (
        event
    ) => {
        const {
            name,
            value,
        } = event.target;

        setUniversityForm((current) => ({
            ...current,
            [name]: value,
        }));
    };

    const handleCreateUniversity =
        async () => {
            setUniversityError("");

            if (
                !universityForm.name.trim()
            ) {
                setUniversityError(
                    "University name is required."
                );
                return;
            }

            if (
                !universityForm.country_id
            ) {
                setUniversityError(
                    "Please select a country."
                );
                return;
            }

            try {
                setCreatingUniversity(
                    true
                );

                const response =
                    await createAdminUniversity(
                        {
                            name:
                                universityForm.name.trim(),

                            country_id:
                                Number(
                                    universityForm.country_id
                                ),

                            website:
                                universityForm.website.trim() ||
                                null,

                            description:
                                universityForm.description.trim() ||
                                null,

                            status:
                                universityForm.status,
                        }
                    );

                const university =
                    response?.university;

                if (!university?.id) {
                    throw new Error(
                        "The server did not return the created university."
                    );
                }

                setLookups((current) => {
                    const universities = [
                        ...current.universities.filter(
                            (item) =>
                                item.id !==
                                university.id
                        ),
                        university,
                    ];

                    universities.sort(
                        (
                            first,
                            second
                        ) =>
                            first.name.localeCompare(
                                second.name
                            )
                    );

                    return {
                        ...current,
                        universities,
                    };
                });

                setForm((current) => ({
                    ...current,
                    university_id:
                        String(
                            university.id
                        ),
                }));

                setUniversityForm(
                    createInitialUniversityForm()
                );

                setShowUniversityForm(
                    false
                );
            } catch (err) {
                console.error(
                    "Failed to create university:",
                    err
                );

                setUniversityError(
                    getErrorMessage(
                        err,
                        "Failed to create university."
                    )
                );
            } finally {
                setCreatingUniversity(
                    false
                );
            }
        };

    const dateRangeError =
        form.start_date &&
            form.end_date &&
            form.end_date < form.start_date
            ? "End date must be after or equal to start date."
            : "";

    const buildPayload = () => {
        if (!form.title.trim()) {
            throw new Error(
                "Title is required."
            );
        }

        if (!form.slug.trim()) {
            throw new Error(
                "Slug is required."
            );
        }

        if (!form.description.trim()) {
            throw new Error(
                "Description is required."
            );
        }

        if (!form.country_id) {
            throw new Error(
                "Please select a country."
            );
        }

        if (
            !form.opportunity_type_id
        ) {
            throw new Error(
                "Please select an opportunity type."
            );
        }

        if (
            !form.application_url.trim()
        ) {
            throw new Error(
                "Application URL is required."
            );
        }

        if (
            form.start_date &&
            form.end_date &&
            form.end_date < form.start_date
        ) {
            throw new Error(
                "End date must be after or equal to start date."
            );
        }

        const skillIds =
            form.skills.map((skill) =>
                Number(skill.skill_id)
            );

        if (
            skillIds.some(
                (skillId) =>
                    !Number.isInteger(
                        skillId
                    ) ||
                    skillId <= 0
            )
        ) {
            throw new Error(
                "Please select a valid skill for every skill entry."
            );
        }

        if (
            new Set(skillIds).size !==
            skillIds.length
        ) {
            throw new Error(
                "Each skill can only be selected once."
            );
        }

        const nationalityIds =
            form.nationalities.map(
                (nationality) =>
                    Number(
                        nationality.country_id
                    )
            );

        if (
            nationalityIds.some(
                (countryId) =>
                    !Number.isInteger(
                        countryId
                    ) ||
                    countryId <= 0
            )
        ) {
            throw new Error(
                "Please select a valid country for every nationality rule."
            );
        }

        if (
            new Set(
                nationalityIds
            ).size !==
            nationalityIds.length
        ) {
            throw new Error(
                "Each nationality can only be selected once."
            );
        }

        const requirements =
            form.requirements.map(
                (
                    requirement,
                    index
                ) => {
                    if (
                        !requirement.requirement_type.trim()
                    ) {
                        throw new Error(
                            `Requirement ${index + 1} needs a type.`
                        );
                    }

                    if (
                        !requirement.operator.trim()
                    ) {
                        throw new Error(
                            `Requirement ${index + 1} needs an operator.`
                        );
                    }

                    if (
                        !requirement.value.trim()
                    ) {
                        throw new Error(
                            `Requirement ${index + 1} needs a value.`
                        );
                    }

                    let metadata = null;

                    if (
                        requirement.metadata.trim()
                    ) {
                        try {
                            metadata =
                                JSON.parse(
                                    requirement.metadata
                                );
                        } catch {
                            throw new Error(
                                `Requirement ${index + 1} has invalid JSON metadata.`
                            );
                        }
                    }

                    return {
                        requirement_type:
                            requirement.requirement_type.trim(),

                        language_id:
                            requirement.language_id
                                ? Number(
                                    requirement.language_id
                                )
                                : null,

                        operator:
                            requirement.operator.trim(),

                        value:
                            requirement.value.trim(),

                        unit:
                            requirement.unit.trim() ||
                            null,

                        metadata,

                        is_mandatory:
                            Boolean(
                                requirement.is_mandatory
                            ),

                        description:
                            requirement.description.trim() ||
                            null,
                    };
                }
            );

        return {
            title:
                form.title.trim(),

            slug:
                form.slug.trim(),

            description:
                form.description.trim(),

            university_id:
                form.university_id
                    ? Number(
                        form.university_id
                    )
                    : null,

            country_id:
                Number(
                    form.country_id
                ),

            opportunity_type_id:
                Number(
                    form.opportunity_type_id
                ),

            funding_type_id:
                form.funding_type_id
                    ? Number(
                        form.funding_type_id
                    )
                    : null,

            application_url:
                form.application_url.trim(),

            source_url:
                form.source_url.trim() ||
                null,

            deadline:
                form.deadline || null,

            start_date:
                form.start_date || null,

            end_date:
                form.end_date || null,

            status:
                form.status,

            is_verified:
                Boolean(
                    form.is_verified
                ),

            field_ids:
                form.field_ids.map(
                    Number
                ),

            degree_ids:
                form.degree_ids.map(
                    Number
                ),

            skills:
                form.skills.map(
                    (skill) => ({
                        skill_id:
                            Number(
                                skill.skill_id
                            ),

                        is_mandatory:
                            Boolean(
                                skill.is_mandatory
                            ),
                    })
                ),

            nationalities:
                form.nationalities.map(
                    (
                        nationality
                    ) => ({
                        country_id:
                            Number(
                                nationality.country_id
                            ),

                        eligibility_type:
                            nationality.eligibility_type,
                    })
                ),

            requirements,
        };
    };

    const handleSubmit = async (
        event
    ) => {
        event.preventDefault();

        setError("");
        setValidationErrors({});

        let payload;

        try {
            payload =
                buildPayload();
        } catch (err) {
            setError(
                err?.message ??
                "Please complete the form correctly."
            );
            return;
        }

        try {
            setSaving(true);

            await updateAdminOpportunity(
                id,
                payload
            );

            navigate(
                `/admin/opportunities/${id}`,
                {
                    replace: true,
                }
            );
        } catch (err) {
            console.error(
                "Failed to update opportunity:",
                err
            );

            setError(
                getErrorMessage(
                    err,
                    "Failed to update opportunity."
                )
            );

            setValidationErrors(
                getValidationErrors(
                    err
                )
            );
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="w-full">
                <div className="mx-auto flex min-h-[60vh] max-w-6xl items-center justify-center px-4">
                    <div className="flex flex-col items-center gap-3">
                        <Loader2 className="size-7 animate-spin text-muted-foreground" />

                        <p className="text-sm text-muted-foreground">
                            Loading opportunity...
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full">
            <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
                <div className="space-y-6">

                    <div className="flex items-center justify-between gap-3">
                        <Link
                            to={`/admin/opportunities/${id}`}
                            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
                        >
                            <ArrowLeft className="size-4" />
                            Back to Opportunity
                        </Link>
                    </div>

                    <section>
                        <Badge
                            variant="secondary"
                            className="mb-2"
                        >
                            Admin
                        </Badge>

                        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                            Edit Opportunity
                        </h1>

                        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
                            Update the opportunity information and requirements.
                        </p>
                    </section>

                    {error && (
                        <div className="flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
                            <XCircle className="mt-0.5 size-4 shrink-0" />

                            <div>
                                <p className="font-medium">
                                    {error}
                                </p>

                                {Object.keys(
                                    validationErrors
                                ).length > 0 && (
                                        <p className="mt-1 text-xs">
                                            Please review the form fields.
                                        </p>
                                    )}
                            </div>
                        </div>
                    )}

                    <form
                        onSubmit={
                            handleSubmit
                        }
                        className="space-y-6"
                    >
                        <Card>
                            <CardHeader>
                                <CardTitle>
                                    Basic Information
                                </CardTitle>

                                <CardDescription>
                                    Main information about the opportunity.
                                </CardDescription>
                            </CardHeader>

                            <CardContent className="space-y-5">
                                <div className="grid gap-5 md:grid-cols-2">

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">
                                            Title
                                        </label>

                                        <Input
                                            value={
                                                form.title
                                            }
                                            onChange={
                                                handleTitleChange
                                            }
                                            required
                                        />

                                        {getFieldError(
                                            "title"
                                        ) && (
                                                <p className="text-xs text-destructive">
                                                    {getFieldError(
                                                        "title"
                                                    )}
                                                </p>
                                            )}
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">
                                            Slug
                                        </label>

                                        <Input
                                            value={
                                                form.slug
                                            }
                                            onChange={
                                                handleSlugChange
                                            }
                                            required
                                        />

                                        {getFieldError(
                                            "slug"
                                        ) && (
                                                <p className="text-xs text-destructive">
                                                    {getFieldError(
                                                        "slug"
                                                    )}
                                                </p>
                                            )}
                                    </div>

                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium">
                                        Description
                                    </label>

                                    <textarea
                                        value={
                                            form.description
                                        }
                                        onChange={(
                                            event
                                        ) =>
                                            setForm(
                                                (
                                                    current
                                                ) => ({
                                                    ...current,
                                                    description:
                                                        event
                                                            .target
                                                            .value,
                                                })
                                            )
                                        }
                                        rows={6}
                                        required
                                        className="w-full resize-y rounded-xl border bg-background px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                                    />

                                    {getFieldError(
                                        "description"
                                    ) && (
                                            <p className="text-xs text-destructive">
                                                {getFieldError(
                                                    "description"
                                                )}
                                            </p>
                                        )}
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>
                                    Classification
                                </CardTitle>

                                <CardDescription>
                                    Select related records.
                                </CardDescription>
                            </CardHeader>

                            <CardContent className="space-y-6">

                                <div className="grid gap-5 md:grid-cols-2">

                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between gap-3">
                                            <label className="text-sm font-medium">
                                                University
                                            </label>

                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setShowUniversityForm(
                                                        true
                                                    );

                                                    setUniversityError(
                                                        ""
                                                    );
                                                }}
                                                className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                                            >
                                                <Plus className="size-3.5" />
                                                Add University
                                            </button>
                                        </div>

                                        <select
                                            value={
                                                form.university_id
                                            }
                                            onChange={(
                                                event
                                            ) =>
                                                setForm(
                                                    (
                                                        current
                                                    ) => ({
                                                        ...current,
                                                        university_id:
                                                            event
                                                                .target
                                                                .value,
                                                    })
                                                )
                                            }
                                            className="h-10 w-full rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                                        >
                                            <option value="">
                                                No University
                                            </option>

                                            {lookups.universities.map(
                                                (
                                                    university
                                                ) => (
                                                    <option
                                                        key={
                                                            university.id
                                                        }
                                                        value={
                                                            university.id
                                                        }
                                                    >
                                                        {
                                                            university.name
                                                        }
                                                    </option>
                                                )
                                            )}
                                        </select>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">
                                            Country
                                        </label>

                                        <select
                                            value={
                                                form.country_id
                                            }
                                            onChange={(
                                                event
                                            ) =>
                                                setForm(
                                                    (
                                                        current
                                                    ) => ({
                                                        ...current,
                                                        country_id:
                                                            event
                                                                .target
                                                                .value,
                                                    })
                                                )
                                            }
                                            required
                                            className="h-10 w-full rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                                        >
                                            <option value="">
                                                Select country
                                            </option>

                                            {lookups.countries.map(
                                                (
                                                    country
                                                ) => (
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

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">
                                            Opportunity Type
                                        </label>

                                        <select
                                            value={
                                                form.opportunity_type_id
                                            }
                                            onChange={(
                                                event
                                            ) =>
                                                setForm(
                                                    (
                                                        current
                                                    ) => ({
                                                        ...current,
                                                        opportunity_type_id:
                                                            event
                                                                .target
                                                                .value,
                                                    })
                                                )
                                            }
                                            required
                                            className="h-10 w-full rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                                        >
                                            <option value="">
                                                Select type
                                            </option>

                                            {lookups.opportunity_types.map(
                                                (
                                                    type
                                                ) => (
                                                    <option
                                                        key={
                                                            type.id
                                                        }
                                                        value={
                                                            type.id
                                                        }
                                                    >
                                                        {
                                                            type.name
                                                        }
                                                    </option>
                                                )
                                            )}
                                        </select>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">
                                            Funding Type
                                        </label>

                                        <select
                                            value={
                                                form.funding_type_id
                                            }
                                            onChange={(
                                                event
                                            ) =>
                                                setForm(
                                                    (
                                                        current
                                                    ) => ({
                                                        ...current,
                                                        funding_type_id:
                                                            event
                                                                .target
                                                                .value,
                                                    })
                                                )
                                            }
                                            className="h-10 w-full rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                                        >
                                            <option value="">
                                                No Funding Type
                                            </option>

                                            {lookups.funding_types.map(
                                                (
                                                    funding
                                                ) => (
                                                    <option
                                                        key={
                                                            funding.id
                                                        }
                                                        value={
                                                            funding.id
                                                        }
                                                    >
                                                        {
                                                            funding.name
                                                        }
                                                    </option>
                                                )
                                            )}
                                        </select>
                                    </div>

                                </div>

                                {showUniversityForm && (
                                    <div className="rounded-xl border bg-muted/20 p-5">

                                        <div className="mb-5 flex items-start justify-between gap-4">

                                            <div>
                                                <h3 className="font-semibold">
                                                    Add University
                                                </h3>

                                                <p className="mt-1 text-sm text-muted-foreground">
                                                    Add a university that is not available.
                                                </p>
                                            </div>

                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                onClick={() =>
                                                    setShowUniversityForm(
                                                        false
                                                    )
                                                }
                                            >
                                                <X className="size-4" />
                                            </Button>

                                        </div>

                                        {universityError && (
                                            <div className="mb-4 rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">
                                                {
                                                    universityError
                                                }
                                            </div>
                                        )}

                                        <div className="grid gap-4 md:grid-cols-2">

                                            <div className="space-y-2">
                                                <label className="text-sm font-medium">
                                                    University Name
                                                </label>

                                                <Input
                                                    name="name"
                                                    value={
                                                        universityForm.name
                                                    }
                                                    onChange={
                                                        handleUniversityInputChange
                                                    }
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-sm font-medium">
                                                    Country
                                                </label>

                                                <select
                                                    name="country_id"
                                                    value={
                                                        universityForm.country_id
                                                    }
                                                    onChange={
                                                        handleUniversityInputChange
                                                    }
                                                    className="h-10 w-full rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                                                >
                                                    <option value="">
                                                        Select country
                                                    </option>

                                                    {lookups.countries.map(
                                                        (
                                                            country
                                                        ) => (
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

                                            <div className="space-y-2">
                                                <label className="text-sm font-medium">
                                                    Website
                                                </label>

                                                <Input
                                                    name="website"
                                                    type="url"
                                                    value={
                                                        universityForm.website
                                                    }
                                                    onChange={
                                                        handleUniversityInputChange
                                                    }
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-sm font-medium">
                                                    Status
                                                </label>

                                                <select
                                                    name="status"
                                                    value={
                                                        universityForm.status
                                                    }
                                                    onChange={
                                                        handleUniversityInputChange
                                                    }
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

                                            <div className="space-y-2 md:col-span-2">
                                                <label className="text-sm font-medium">
                                                    Description
                                                </label>

                                                <textarea
                                                    name="description"
                                                    value={
                                                        universityForm.description
                                                    }
                                                    onChange={
                                                        handleUniversityInputChange
                                                    }
                                                    rows={3}
                                                    className="w-full resize-y rounded-xl border bg-background px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                                                />
                                            </div>

                                        </div>

                                        <div className="mt-5 flex justify-end gap-2">

                                            <Button
                                                type="button"
                                                variant="outline"
                                                disabled={
                                                    creatingUniversity
                                                }
                                                onClick={() =>
                                                    setShowUniversityForm(
                                                        false
                                                    )
                                                }
                                            >
                                                Cancel
                                            </Button>

                                            <Button
                                                type="button"
                                                disabled={
                                                    creatingUniversity
                                                }
                                                onClick={
                                                    handleCreateUniversity
                                                }
                                            >
                                                {creatingUniversity
                                                    ? "Adding..."
                                                    : "Add University"}
                                            </Button>

                                        </div>
                                    </div>
                                )}

                                <div className="space-y-3">

                                    <div className="flex items-center justify-between">
                                        <label className="text-sm font-medium">
                                            Academic Fields
                                        </label>

                                        <span className="text-xs text-muted-foreground">
                                            {
                                                form.field_ids.length
                                            }{" "}
                                            selected
                                        </span>
                                    </div>

                                    <div className="flex flex-wrap gap-2">

                                        {lookups.fields.map(
                                            (field) => {
                                                const selected =
                                                    form.field_ids.includes(
                                                        field.id
                                                    );

                                                return (
                                                    <button
                                                        type="button"
                                                        key={
                                                            field.id
                                                        }
                                                        onClick={() =>
                                                            toggleSelection(
                                                                "field_ids",
                                                                field.id
                                                            )
                                                        }
                                                        className={[
                                                            "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm transition-colors",
                                                            selected
                                                                ? "border-primary bg-primary text-primary-foreground"
                                                                : "bg-background hover:bg-muted",
                                                        ].join(
                                                            " "
                                                        )}
                                                    >
                                                        {selected && (
                                                            <Check className="size-3.5" />
                                                        )}

                                                        {
                                                            field.name
                                                        }
                                                    </button>
                                                );
                                            }
                                        )}

                                    </div>
                                </div>

                                <div className="space-y-3">

                                    <div className="flex items-center justify-between">
                                        <label className="text-sm font-medium">
                                            Degrees
                                        </label>

                                        <span className="text-xs text-muted-foreground">
                                            {
                                                form.degree_ids.length
                                            }{" "}
                                            selected
                                        </span>
                                    </div>

                                    <div className="flex flex-wrap gap-2">

                                        {lookups.degrees.map(
                                            (degree) => {
                                                const selected =
                                                    form.degree_ids.includes(
                                                        degree.id
                                                    );

                                                return (
                                                    <button
                                                        type="button"
                                                        key={
                                                            degree.id
                                                        }
                                                        onClick={() =>
                                                            toggleSelection(
                                                                "degree_ids",
                                                                degree.id
                                                            )
                                                        }
                                                        className={[
                                                            "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm transition-colors",
                                                            selected
                                                                ? "border-primary bg-primary text-primary-foreground"
                                                                : "bg-background hover:bg-muted",
                                                        ].join(
                                                            " "
                                                        )}
                                                    >
                                                        {selected && (
                                                            <Check className="size-3.5" />
                                                        )}

                                                        {
                                                            degree.name
                                                        }{" "}
                                                        (
                                                        {
                                                            degree.code
                                                        }
                                                        )
                                                    </button>
                                                );
                                            }
                                        )}

                                    </div>
                                </div>

                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>

                                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                                    <div>
                                        <CardTitle>
                                            Skills
                                        </CardTitle>

                                        <CardDescription>
                                            Add required and optional skills.
                                        </CardDescription>
                                    </div>

                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={
                                            addSkill
                                        }
                                    >
                                        <Plus className="size-4" />
                                        Add Skill
                                    </Button>

                                </div>

                            </CardHeader>

                            <CardContent className="space-y-3">

                                {form.skills.length ===
                                    0 ? (
                                    <EmptyState text="No skills added." />
                                ) : (
                                    form.skills.map(
                                        (
                                            skill,
                                            index
                                        ) => (
                                            <div
                                                key={index}
                                                className="grid gap-3 rounded-xl border p-4 md:grid-cols-[1fr_auto_auto]"
                                            >

                                                <div className="space-y-2">

                                                    <label className="text-sm font-medium">
                                                        Skill
                                                    </label>

                                                    <select
                                                        value={
                                                            skill.skill_id
                                                        }
                                                        onChange={(event) =>
                                                            updateSkill(
                                                                index,
                                                                "skill_id",
                                                                event
                                                                    .target
                                                                    .value
                                                            )
                                                        }
                                                        className="h-10 w-full rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                                                    >
                                                        <option value="">
                                                            Select skill
                                                        </option>

                                                        {lookups.skills.map(
                                                            (
                                                                item
                                                            ) => (
                                                                <option
                                                                    key={
                                                                        item.id
                                                                    }
                                                                    value={
                                                                        item.id
                                                                    }
                                                                >
                                                                    {
                                                                        item.name
                                                                    }
                                                                </option>
                                                            )
                                                        )}
                                                    </select>

                                                </div>

                                                <label className="flex items-center gap-2 self-end rounded-md border px-3 py-2 text-sm">

                                                    <input
                                                        type="checkbox"
                                                        checked={
                                                            skill.is_mandatory
                                                        }
                                                        onChange={(
                                                            event
                                                        ) =>
                                                            updateSkill(
                                                                index,
                                                                "is_mandatory",
                                                                event
                                                                    .target
                                                                    .checked
                                                            )
                                                        }
                                                        className="size-4"
                                                    />

                                                    Required

                                                </label>

                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="icon"
                                                    className="self-end text-destructive hover:text-destructive"
                                                    onClick={() =>
                                                        removeSkill(
                                                            index
                                                        )
                                                    }
                                                >
                                                    <Trash2 className="size-4" />
                                                </Button>

                                            </div>
                                        )
                                    )
                                )}

                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>

                                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                                    <div>
                                        <CardTitle>
                                            Nationalities
                                        </CardTitle>

                                        <CardDescription>
                                            Define nationality eligibility.
                                        </CardDescription>
                                    </div>

                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={
                                            addNationality
                                        }
                                    >
                                        <Plus className="size-4" />
                                        Add Nationality
                                    </Button>

                                </div>

                            </CardHeader>

                            <CardContent className="space-y-3">

                                {form.nationalities.length ===
                                    0 ? (
                                    <EmptyState text="No nationality rules." />
                                ) : (
                                    form.nationalities.map(
                                        (
                                            nationality,
                                            index
                                        ) => (
                                            <div
                                                key={index}
                                                className="grid gap-3 rounded-xl border p-4 md:grid-cols-[1fr_1fr_auto]"
                                            >

                                                <div className="space-y-2">

                                                    <label className="text-sm font-medium">
                                                        Country
                                                    </label>

                                                    <select
                                                        value={
                                                            nationality.country_id
                                                        }
                                                        onChange={(event) =>
                                                            updateNationality(
                                                                index,
                                                                "country_id",
                                                                event
                                                                    .target
                                                                    .value
                                                            )
                                                        }
                                                        className="h-10 w-full rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                                                    >
                                                        <option value="">
                                                            Select country
                                                        </option>

                                                        {lookups.countries.map(
                                                            (
                                                                country
                                                            ) => (
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

                                                <div className="space-y-2">

                                                    <label className="text-sm font-medium">
                                                        Eligibility
                                                    </label>

                                                    <select
                                                        value={
                                                            nationality.eligibility_type
                                                        }
                                                        onChange={(event) =>
                                                            updateNationality(
                                                                index,
                                                                "eligibility_type",
                                                                event
                                                                    .target
                                                                    .value
                                                            )
                                                        }
                                                        className="h-10 w-full rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                                                    >
                                                        <option value="eligible">
                                                            Eligible
                                                        </option>

                                                        <option value="restricted">
                                                            Restricted
                                                        </option>

                                                        <option value="excluded">
                                                            Excluded
                                                        </option>
                                                    </select>

                                                </div>

                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="icon"
                                                    className="self-end text-destructive hover:text-destructive"
                                                    onClick={() =>
                                                        removeNationality(
                                                            index
                                                        )
                                                    }
                                                >
                                                    <Trash2 className="size-4" />
                                                </Button>

                                            </div>
                                        )
                                    )
                                )}

                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>

                                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                                    <div>
                                        <CardTitle>
                                            Requirements
                                        </CardTitle>

                                        <CardDescription>
                                            Define eligibility requirements.
                                        </CardDescription>
                                    </div>

                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={
                                            addRequirement
                                        }
                                    >
                                        <Plus className="size-4" />
                                        Add Requirement
                                    </Button>

                                </div>

                            </CardHeader>

                            <CardContent className="space-y-4">

                                {form.requirements.length ===
                                    0 ? (
                                    <EmptyState text="No requirements added." />
                                ) : (
                                    form.requirements.map(
                                        (
                                            requirement,
                                            index
                                        ) => (
                                            <div
                                                key={
                                                    requirement.id ??
                                                    index
                                                }
                                                className="space-y-4 rounded-xl border p-4"
                                            >

                                                <div className="flex items-center justify-between gap-3">

                                                    <p className="font-medium">
                                                        Requirement{" "}
                                                        {index +
                                                            1}
                                                    </p>

                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        size="icon"
                                                        className="text-destructive hover:text-destructive"
                                                        onClick={() =>
                                                            removeRequirement(
                                                                index
                                                            )
                                                        }
                                                    >
                                                        <Trash2 className="size-4" />
                                                    </Button>

                                                </div>

                                                <div className="grid gap-4 md:grid-cols-2">

                                                    <div className="space-y-2">

                                                        <label className="text-sm font-medium">
                                                            Requirement Type
                                                        </label>

                                                        <Input
                                                            value={
                                                                requirement.requirement_type
                                                            }
                                                            onChange={(event) =>
                                                                updateRequirement(
                                                                    index,
                                                                    "requirement_type",
                                                                    event
                                                                        .target
                                                                        .value
                                                                )
                                                            }
                                                        />

                                                    </div>

                                                    <div className="space-y-2">

                                                        <label className="text-sm font-medium">
                                                            Language
                                                        </label>

                                                        <select
                                                            value={
                                                                requirement.language_id
                                                            }
                                                            onChange={(event) =>
                                                                updateRequirement(
                                                                    index,
                                                                    "language_id",
                                                                    event
                                                                        .target
                                                                        .value
                                                                )
                                                            }
                                                            className="h-10 w-full rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                                                        >
                                                            <option value="">
                                                                No language
                                                            </option>

                                                            {lookups.languages.map(
                                                                (
                                                                    language
                                                                ) => (
                                                                    <option
                                                                        key={
                                                                            language.id
                                                                        }
                                                                        value={
                                                                            language.id
                                                                        }
                                                                    >
                                                                        {
                                                                            language.name
                                                                        }
                                                                    </option>
                                                                )
                                                            )}
                                                        </select>

                                                    </div>

                                                    <div className="space-y-2">

                                                        <label className="text-sm font-medium">
                                                            Operator
                                                        </label>

                                                        <Input
                                                            value={
                                                                requirement.operator
                                                            }
                                                            onChange={(event) =>
                                                                updateRequirement(
                                                                    index,
                                                                    "operator",
                                                                    event
                                                                        .target
                                                                        .value
                                                                )
                                                            }
                                                        />

                                                    </div>

                                                    <div className="space-y-2">

                                                        <label className="text-sm font-medium">
                                                            Value
                                                        </label>

                                                        <Input
                                                            value={
                                                                requirement.value
                                                            }
                                                            onChange={(event) =>
                                                                updateRequirement(
                                                                    index,
                                                                    "value",
                                                                    event
                                                                        .target
                                                                        .value
                                                                )
                                                            }
                                                        />

                                                    </div>

                                                    <div className="space-y-2">

                                                        <label className="text-sm font-medium">
                                                            Unit
                                                        </label>

                                                        <Input
                                                            value={
                                                                requirement.unit
                                                            }
                                                            onChange={(event) =>
                                                                updateRequirement(
                                                                    index,
                                                                    "unit",
                                                                    event
                                                                        .target
                                                                        .value
                                                                )
                                                            }
                                                        />

                                                    </div>

                                                    <div className="space-y-2">

                                                        <label className="text-sm font-medium">
                                                            Metadata
                                                        </label>

                                                        <Input
                                                            value={
                                                                requirement.metadata
                                                            }
                                                            onChange={(event) =>
                                                                updateRequirement(
                                                                    index,
                                                                    "metadata",
                                                                    event
                                                                        .target
                                                                        .value
                                                                )
                                                            }
                                                            placeholder='{"level":"B2"}'
                                                        />

                                                    </div>

                                                </div>

                                                <label className="flex items-center gap-2 text-sm">

                                                    <input
                                                        type="checkbox"
                                                        checked={
                                                            requirement.is_mandatory
                                                        }
                                                        onChange={(event) =>
                                                            updateRequirement(
                                                                index,
                                                                "is_mandatory",
                                                                event
                                                                    .target
                                                                    .checked
                                                            )
                                                        }
                                                        className="size-4"
                                                    />

                                                    Mandatory

                                                </label>

                                                <div className="space-y-2">

                                                    <label className="text-sm font-medium">
                                                        Description
                                                    </label>

                                                    <textarea
                                                        value={
                                                            requirement.description
                                                        }
                                                        onChange={(event) =>
                                                            updateRequirement(
                                                                index,
                                                                "description",
                                                                event
                                                                    .target
                                                                    .value
                                                            )
                                                        }
                                                        rows={3}
                                                        className="w-full resize-y rounded-xl border bg-background px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                                                    />

                                                </div>

                                            </div>
                                        )
                                    )
                                )}

                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>

                                <CardTitle>
                                    Dates and Links
                                </CardTitle>

                                <CardDescription>
                                    Application and opportunity timeline.
                                </CardDescription>

                            </CardHeader>

                            <CardContent className="grid gap-5 md:grid-cols-2">

                                <div className="space-y-2">

                                    <label className="text-sm font-medium">
                                        Application URL
                                    </label>

                                    <Input
                                        name="application_url"
                                        type="url"
                                        value={
                                            form.application_url
                                        }
                                        onChange={
                                            handleInputChange
                                        }
                                        required
                                    />

                                    {getFieldError(
                                        "application_url"
                                    ) && (
                                            <p className="text-xs text-destructive">
                                                {getFieldError(
                                                    "application_url"
                                                )}
                                            </p>
                                        )}

                                </div>

                                <div className="space-y-2">

                                    <label className="text-sm font-medium">
                                        Source URL
                                    </label>

                                    <Input
                                        name="source_url"
                                        type="url"
                                        value={
                                            form.source_url
                                        }
                                        onChange={
                                            handleInputChange
                                        }
                                    />

                                </div>

                                <div className="space-y-2">

                                    <label className="text-sm font-medium">
                                        Deadline
                                    </label>

                                    <Input
                                        name="deadline"
                                        type="date"
                                        value={
                                            form.deadline
                                        }
                                        onChange={
                                            handleInputChange
                                        }
                                    />

                                </div>

                                <div className="space-y-2">

                                    <label className="text-sm font-medium">
                                        Start Date
                                    </label>

                                    <Input
                                        name="start_date"
                                        type="date"
                                        value={
                                            form.start_date
                                        }
                                        onChange={
                                            handleInputChange
                                        }
                                    />

                                    {getFieldError(
                                        "start_date"
                                    ) && (
                                            <p className="text-xs text-destructive">
                                                {getFieldError(
                                                    "start_date"
                                                )}
                                            </p>
                                        )}

                                </div>

                                <div className="space-y-2">

                                    <label className="text-sm font-medium">
                                        End Date
                                    </label>

                                    <Input
                                        name="end_date"
                                        type="date"
                                        min={
                                            form.start_date ||
                                            undefined
                                        }
                                        value={
                                            form.end_date
                                        }
                                        onChange={
                                            handleInputChange
                                        }
                                    />

                                    {dateRangeError && (
                                        <p className="text-xs text-destructive">
                                            {
                                                dateRangeError
                                            }
                                        </p>
                                    )}

                                    {getFieldError(
                                        "end_date"
                                    ) && (
                                            <p className="text-xs text-destructive">
                                                {getFieldError(
                                                    "end_date"
                                                )}
                                            </p>
                                        )}

                                </div>

                                <div className="space-y-2">

                                    <label className="text-sm font-medium">
                                        Status
                                    </label>

                                    <select
                                        name="status"
                                        value={
                                            form.status
                                        }
                                        onChange={
                                            handleInputChange
                                        }
                                        className="h-10 w-full rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                                    >
                                        <option value="draft">
                                            Draft
                                        </option>

                                        <option value="published">
                                            Published
                                        </option>

                                        <option value="expired">
                                            Expired
                                        </option>

                                        <option value="archived">
                                            Archived
                                        </option>
                                    </select>

                                </div>

                                <label className="flex items-center gap-3 rounded-xl border p-4 md:col-span-2">

                                    <input
                                        type="checkbox"
                                        name="is_verified"
                                        checked={
                                            form.is_verified
                                        }
                                        onChange={
                                            handleInputChange
                                        }
                                        className="size-4"
                                    />

                                    <div>

                                        <p className="text-sm font-medium">
                                            Verified Opportunity
                                        </p>

                                        <p className="text-xs text-muted-foreground">
                                            Mark this opportunity as verified.
                                        </p>

                                    </div>

                                </label>

                            </CardContent>
                        </Card>

                        <div className="flex flex-col-reverse gap-3 border-t pt-6 sm:flex-row sm:justify-end">

                            <Link
                                to={`/admin/opportunities/${id}`}
                                className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-4 text-sm font-medium hover:bg-accent"
                            >
                                Cancel
                            </Link>

                            <Button
                                type="submit"
                                disabled={
                                    saving ||
                                    Boolean(
                                        dateRangeError
                                    )
                                }
                                className="h-10"
                            >
                                {saving ? (
                                    <>
                                        <Loader2 className="size-4 animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <Save className="size-4" />
                                        Save Changes
                                    </>
                                )}
                            </Button>

                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

function EmptyState({ text }) {
    return (
        <div className="rounded-xl border border-dashed p-6 text-center">
            <p className="text-sm text-muted-foreground">
                {text}
            </p>
        </div>
    );
}

export default OpportunityEdit;
