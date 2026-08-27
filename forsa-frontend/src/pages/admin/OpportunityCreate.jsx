import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import {
    ArrowLeft,
    Check,
    Plus,
    Trash2,
    XCircle,
} from "lucide-react"

import {
    createAdminOpportunity,
    getAdminLookups,
} from "../../api/admin"

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

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
})

const createEmptySkill = () => ({
    skill_id: "",
    is_mandatory: true,
})

const createEmptyNationality = () => ({
    country_id: "",
    eligibility_type: "eligible",
})

const createEmptyRequirement = () => ({
    requirement_type: "",
    language_id: "",
    operator: ">=",
    value: "",
    unit: "",
    metadata: "",
    is_mandatory: true,
    description: "",
})

const initialLookups = {
    universities: [],
    countries: [],
    opportunity_types: [],
    funding_types: [],
    fields: [],
    degrees: [],
    skills: [],
    languages: [],
}

const createSlug = (value = "") => {
    return value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
}

const getErrorMessage = (error, fallback) => {
    const response = error?.response?.data

    if (response?.message) {
        return response.message
    }

    if (error?.message) {
        return error.message
    }

    return fallback
}

const getValidationErrors = (error) => {
    return error?.response?.data?.errors ?? {}
}

const getLookupArray = (response, key) => {
    if (Array.isArray(response?.[key])) {
        return response[key]
    }

    if (Array.isArray(response?.data?.[key])) {
        return response.data[key]
    }

    return []
}

const getItemId = (item) => {
    return String(item?.id ?? "")
}

function OpportunityCreate() {
    const navigate = useNavigate()

    const [form, setForm] = useState(createInitialForm)
    const [lookups, setLookups] = useState(initialLookups)

    const [loadingLookups, setLoadingLookups] = useState(true)
    const [loading, setLoading] = useState(false)

    const [error, setError] = useState("")
    const [validationErrors, setValidationErrors] = useState({})

    /*
    |--------------------------------------------------------------------------
    | Load Lookups
    |--------------------------------------------------------------------------
    */

    useEffect(() => {
        let mounted = true

        const loadLookups = async () => {
            try {
                setLoadingLookups(true)
                setError("")

                const response = await getAdminLookups()

                if (!mounted) {
                    return
                }

                setLookups({
                    universities: getLookupArray(
                        response,
                        "universities"
                    ),

                    countries: getLookupArray(
                        response,
                        "countries"
                    ),

                    opportunity_types: getLookupArray(
                        response,
                        "opportunity_types"
                    ),

                    funding_types: getLookupArray(
                        response,
                        "funding_types"
                    ),

                    fields: getLookupArray(
                        response,
                        "fields"
                    ),

                    degrees: getLookupArray(
                        response,
                        "degrees"
                    ),

                    skills: getLookupArray(
                        response,
                        "skills"
                    ),

                    languages: getLookupArray(
                        response,
                        "languages"
                    ),
                })
            } catch (err) {
                console.error(
                    "Failed to load admin lookups:",
                    err
                )

                if (mounted) {
                    setError(
                        getErrorMessage(
                            err,
                            "Failed to load form data."
                        )
                    )
                }
            } finally {
                if (mounted) {
                    setLoadingLookups(false)
                }
            }
        }

        loadLookups()

        return () => {
            mounted = false
        }
    }, [])

    /*
    |--------------------------------------------------------------------------
    | Validation Errors
    |--------------------------------------------------------------------------
    */

    const getFieldError = (field) => {
        const value = validationErrors?.[field]

        if (Array.isArray(value)) {
            return value[0]
        }

        return value
    }

    /*
    |--------------------------------------------------------------------------
    | Input Handlers
    |--------------------------------------------------------------------------
    */

    const handleInputChange = (event) => {
        const {
            name,
            value,
            type,
            checked,
        } = event.target

        setForm((current) => ({
            ...current,
            [name]:
                type === "checkbox"
                    ? checked
                    : value,
        }))
    }

    const handleTitleChange = (event) => {
        const title = event.target.value

        setForm((current) => {
            const generatedSlug = createSlug(
                current.title
            )

            const slugWasAutoGenerated =
                !current.slug ||
                current.slug === generatedSlug

            return {
                ...current,
                title,
                slug: slugWasAutoGenerated
                    ? createSlug(title)
                    : current.slug,
            }
        })
    }

    const handleSlugChange = (event) => {
        setForm((current) => ({
            ...current,
            slug: createSlug(
                event.target.value
            ),
        }))
    }

    const handleSelectChange = (
        name,
        value
    ) => {
        setForm((current) => ({
            ...current,
            [name]: value,
        }))
    }

    /*
    |--------------------------------------------------------------------------
    | University Change
    |--------------------------------------------------------------------------
    |
    | When a university is selected,
    | its country_id comes directly from the database.
    |
    */

    const handleUniversityChange = (event) => {
        const universityId = event.target.value

        if (!universityId) {
            setForm((current) => ({
                ...current,
                university_id: "",
                country_id: "",
            }))

            return
        }

        const selectedUniversity =
            lookups.universities.find(
                (university) =>
                    String(university.id) ===
                    String(universityId)
            )

        setForm((current) => ({
            ...current,

            university_id: universityId,

            country_id:
                selectedUniversity?.country_id
                    ? String(
                        selectedUniversity.country_id
                    )
                    : "",
        }))
    }

    /*
    |--------------------------------------------------------------------------
    | Multiple Selection
    |--------------------------------------------------------------------------
    */

    const toggleSelection = (
        field,
        id
    ) => {
        const normalizedId = String(id)

        setForm((current) => {
            const selected =
                current[field].some(
                    (item) =>
                        String(item) ===
                        normalizedId
                )

            if (selected) {
                return {
                    ...current,
                    [field]:
                        current[field].filter(
                            (item) =>
                                String(item) !==
                                normalizedId
                        ),
                }
            }

            return {
                ...current,
                [field]: [
                    ...current[field],
                    normalizedId,
                ],
            }
        })
    }

    /*
    |--------------------------------------------------------------------------
    | Skills
    |--------------------------------------------------------------------------
    */

    const addSkill = () => {
        setForm((current) => ({
            ...current,
            skills: [
                ...current.skills,
                createEmptySkill(),
            ],
        }))
    }

    const updateSkill = (
        index,
        field,
        value
    ) => {
        setForm((current) => ({
            ...current,
            skills: current.skills.map(
                (
                    skill,
                    skillIndex
                ) =>
                    skillIndex === index
                        ? {
                            ...skill,
                            [field]: value,
                        }
                        : skill
            ),
        }))
    }

    const removeSkill = (index) => {
        setForm((current) => ({
            ...current,
            skills: current.skills.filter(
                (
                    _,
                    skillIndex
                ) =>
                    skillIndex !== index
            ),
        }))
    }

    /*
    |--------------------------------------------------------------------------
    | Nationalities
    |--------------------------------------------------------------------------
    */

    const addNationality = () => {
        setForm((current) => ({
            ...current,
            nationalities: [
                ...current.nationalities,
                createEmptyNationality(),
            ],
        }))
    }

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
                        nationalityIndex === index
                            ? {
                                ...nationality,
                                [field]: value,
                            }
                            : nationality
                ),
        }))
    }

    const removeNationality = (index) => {
        setForm((current) => ({
            ...current,
            nationalities:
                current.nationalities.filter(
                    (
                        _,
                        nationalityIndex
                    ) =>
                        nationalityIndex !== index
                ),
        }))
    }

    /*
    |--------------------------------------------------------------------------
    | Requirements
    |--------------------------------------------------------------------------
    */

    const addRequirement = () => {
        setForm((current) => ({
            ...current,
            requirements: [
                ...current.requirements,
                createEmptyRequirement(),
            ],
        }))
    }

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
                        requirementIndex === index
                            ? {
                                ...requirement,
                                [field]: value,
                            }
                            : requirement
                ),
        }))
    }

    const removeRequirement = (index) => {
        setForm((current) => ({
            ...current,
            requirements:
                current.requirements.filter(
                    (
                        _,
                        requirementIndex
                    ) =>
                        requirementIndex !== index
                ),
        }))
    }

    /*
    |--------------------------------------------------------------------------
    | Build Payload
    |--------------------------------------------------------------------------
    */

    const buildPayload = () => {
        const title = form.title.trim()
        const slug = form.slug.trim()
        const description = form.description.trim()

        if (!title) {
            throw new Error("Title is required.")
        }

        if (!slug) {
            throw new Error("Slug is required.")
        }

        if (!description) {
            throw new Error("Description is required.")
        }

        if (!form.country_id) {
            throw new Error(
                "Please select a country."
            )
        }

        if (!form.opportunity_type_id) {
            throw new Error(
                "Please select an opportunity type."
            )
        }

        if (!form.application_url.trim()) {
            throw new Error(
                "Application URL is required."
            )
        }

        const skillIds =
            form.skills.map(
                (skill) =>
                    Number(skill.skill_id)
            )

        if (
            skillIds.some(
                (id) =>
                    !Number.isInteger(id) ||
                    id <= 0
            )
        ) {
            throw new Error(
                "Please select a valid skill for every skill entry."
            )
        }

        if (
            new Set(skillIds).size !==
            skillIds.length
        ) {
            throw new Error(
                "Each skill can only be selected once."
            )
        }

        const nationalityIds =
            form.nationalities.map(
                (item) =>
                    Number(item.country_id)
            )

        if (
            nationalityIds.some(
                (id) =>
                    !Number.isInteger(id) ||
                    id <= 0
            )
        ) {
            throw new Error(
                "Please select a valid country for every nationality rule."
            )
        }

        if (
            new Set(nationalityIds).size !==
            nationalityIds.length
        ) {
            throw new Error(
                "Each nationality can only be selected once."
            )
        }

        const requirements =
            form.requirements.map(
                (
                    requirement,
                    index
                ) => {
                    const type =
                        requirement.requirement_type.trim()

                    const operator =
                        requirement.operator.trim()

                    const value =
                        requirement.value.trim()

                    if (!type) {
                        throw new Error(
                            `Requirement ${index + 1} needs a type.`
                        )
                    }

                    if (!operator) {
                        throw new Error(
                            `Requirement ${index + 1} needs an operator.`
                        )
                    }

                    if (!value) {
                        throw new Error(
                            `Requirement ${index + 1} needs a value.`
                        )
                    }

                    let metadata = null

                    const rawMetadata =
                        requirement.metadata.trim()

                    if (rawMetadata) {
                        try {
                            metadata =
                                JSON.parse(
                                    rawMetadata
                                )
                        } catch {
                            throw new Error(
                                `Requirement ${index + 1} has invalid JSON metadata.`
                            )
                        }
                    }

                    return {
                        requirement_type:
                            type,

                        language_id:
                            requirement.language_id
                                ? Number(
                                    requirement.language_id
                                )
                                : null,

                        operator,

                        value,

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
                    }
                }
            )

        return {
            title,
            slug,
            description,

            university_id:
                form.university_id
                    ? Number(
                        form.university_id
                    )
                    : null,

            country_id:
                Number(form.country_id),

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
                form.field_ids.map(Number),

            degree_ids:
                form.degree_ids.map(Number),

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
        }
    }

    /*
    |--------------------------------------------------------------------------
    | Submit
    |--------------------------------------------------------------------------
    */

    const handleSubmit = async (event) => {
        event.preventDefault()

        setError("")
        setValidationErrors({})

        let payload

        try {
            payload = buildPayload()
        } catch (err) {
            setError(
                err?.message ??
                "Please complete the form correctly."
            )

            return
        }

        try {
            setLoading(true)

            await createAdminOpportunity(
                payload
            )

            navigate(
                "/admin/opportunities",
                {
                    replace: true,
                }
            )
        } catch (err) {
            console.error(
                "Failed to create opportunity:",
                err
            )

            setError(
                getErrorMessage(
                    err,
                    "Failed to create opportunity."
                )
            )

            setValidationErrors(
                getValidationErrors(err)
            )
        } finally {
            setLoading(false)
        }
    }

    /*
    |--------------------------------------------------------------------------
    | Loading
    |--------------------------------------------------------------------------
    */

    if (loadingLookups) {
        return (
            <div className="w-full">
                <div className="mx-auto flex min-h-[60vh] max-w-6xl items-center justify-center px-4">
                    <div className="flex flex-col items-center gap-3">
                        <div className="size-8 animate-spin rounded-full border-2 border-muted border-t-primary" />

                        <p className="text-sm text-muted-foreground">
                            Loading form data...
                        </p>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="w-full">
            <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
                <div className="space-y-6">

                    <Link
                        to="/admin/opportunities"
                        className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                        <ArrowLeft className="size-4" />
                        Back to Opportunities
                    </Link>

                    <section>
                        <Badge
                            variant="secondary"
                            className="mb-2"
                        >
                            Admin
                        </Badge>

                        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                            Create Opportunity
                        </h1>

                        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
                            Add a new opportunity to the Forsa AI platform.
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
                                        <div className="mt-2 space-y-1 text-xs">
                                            {Object.entries(
                                                validationErrors
                                            ).map(
                                                ([
                                                    field,
                                                    messages,
                                                ]) => (
                                                    <p
                                                        key={
                                                            field
                                                        }
                                                    >
                                                        {field}:{" "}
                                                        {Array.isArray(
                                                            messages
                                                        )
                                                            ? messages.join(
                                                                ", "
                                                            )
                                                            : messages}
                                                    </p>
                                                )
                                            )}
                                        </div>
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
                                        <label
                                            htmlFor="title"
                                            className="text-sm font-medium"
                                        >
                                            Title
                                        </label>

                                        <Input
                                            id="title"
                                            value={
                                                form.title
                                            }
                                            onChange={
                                                handleTitleChange
                                            }
                                            placeholder="MSc Artificial Intelligence"
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
                                        <label
                                            htmlFor="slug"
                                            className="text-sm font-medium"
                                        >
                                            Slug
                                        </label>

                                        <Input
                                            id="slug"
                                            value={
                                                form.slug
                                            }
                                            onChange={
                                                handleSlugChange
                                            }
                                            placeholder="msc-artificial-intelligence"
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
                                    <label
                                        htmlFor="description"
                                        className="text-sm font-medium"
                                    >
                                        Description
                                    </label>

                                    <textarea
                                        id="description"
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
                                        placeholder="Describe the opportunity..."
                                        className="w-full resize-y rounded-xl border bg-background px-3 py-3 text-sm outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-ring"
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
                                    Select the related records.
                                </CardDescription>
                            </CardHeader>

                            <CardContent className="space-y-6">

                                <div className="grid gap-5 md:grid-cols-2">

                                    <div className="space-y-2">
                                        <label
                                            htmlFor="university_id"
                                            className="text-sm font-medium"
                                        >
                                            University
                                        </label>

                                        <select
                                            id="university_id"
                                            value={
                                                form.university_id
                                            }
                                            onChange={
                                                handleUniversityChange
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

                                        {getFieldError(
                                            "university_id"
                                        ) && (
                                                <p className="text-xs text-destructive">
                                                    {getFieldError(
                                                        "university_id"
                                                    )}
                                                </p>
                                            )}
                                    </div>

                                    <div className="space-y-2">
                                        <label
                                            htmlFor="country_id"
                                            className="text-sm font-medium"
                                        >
                                            Country
                                        </label>

                                        <select
                                            id="country_id"
                                            value={
                                                form.country_id
                                            }
                                            onChange={(
                                                event
                                            ) =>
                                                handleSelectChange(
                                                    "country_id",
                                                    event
                                                        .target
                                                        .value
                                                )
                                            }
                                            required
                                            disabled={
                                                Boolean(
                                                    form.university_id
                                                )
                                            }
                                            className="h-10 w-full rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-70"
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

                                        {getFieldError(
                                            "country_id"
                                        ) && (
                                                <p className="text-xs text-destructive">
                                                    {getFieldError(
                                                        "country_id"
                                                    )}
                                                </p>
                                            )}
                                    </div>

                                    <div className="space-y-2">
                                        <label
                                            htmlFor="opportunity_type_id"
                                            className="text-sm font-medium"
                                        >
                                            Opportunity Type
                                        </label>

                                        <select
                                            id="opportunity_type_id"
                                            value={
                                                form.opportunity_type_id
                                            }
                                            onChange={(
                                                event
                                            ) =>
                                                handleSelectChange(
                                                    "opportunity_type_id",
                                                    event
                                                        .target
                                                        .value
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

                                        {getFieldError(
                                            "opportunity_type_id"
                                        ) && (
                                                <p className="text-xs text-destructive">
                                                    {getFieldError(
                                                        "opportunity_type_id"
                                                    )}
                                                </p>
                                            )}
                                    </div>

                                    <div className="space-y-2">
                                        <label
                                            htmlFor="funding_type_id"
                                            className="text-sm font-medium"
                                        >
                                            Funding Type
                                        </label>

                                        <select
                                            id="funding_type_id"
                                            value={
                                                form.funding_type_id
                                            }
                                            onChange={(
                                                event
                                            ) =>
                                                handleSelectChange(
                                                    "funding_type_id",
                                                    event
                                                        .target
                                                        .value
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

                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <label className="text-sm font-medium">
                                            Academic Fields
                                        </label>

                                        {form.field_ids.length >
                                            0 && (
                                                <span className="text-xs text-muted-foreground">
                                                    {
                                                        form.field_ids.length
                                                    }{" "}
                                                    selected
                                                </span>
                                            )}
                                    </div>

                                    <div className="flex flex-wrap gap-2">
                                        {lookups.fields.map(
                                            (
                                                field
                                            ) => {
                                                const id =
                                                    getItemId(
                                                        field
                                                    )

                                                const selected =
                                                    form.field_ids.includes(
                                                        id
                                                    )

                                                return (
                                                    <button
                                                        type="button"
                                                        key={
                                                            field.id
                                                        }
                                                        onClick={() =>
                                                            toggleSelection(
                                                                "field_ids",
                                                                id
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
                                                )
                                            }
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <label className="text-sm font-medium">
                                            Degrees
                                        </label>

                                        {form.degree_ids.length >
                                            0 && (
                                                <span className="text-xs text-muted-foreground">
                                                    {
                                                        form.degree_ids.length
                                                    }{" "}
                                                    selected
                                                </span>
                                            )}
                                    </div>

                                    <div className="flex flex-wrap gap-2">
                                        {lookups.degrees.map(
                                            (
                                                degree
                                            ) => {
                                                const id =
                                                    getItemId(
                                                        degree
                                                    )

                                                const selected =
                                                    form.degree_ids.includes(
                                                        id
                                                    )

                                                return (
                                                    <button
                                                        type="button"
                                                        key={
                                                            degree.id
                                                        }
                                                        onClick={() =>
                                                            toggleSelection(
                                                                "degree_ids",
                                                                id
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
                                                        }

                                                        {degree.code &&
                                                            ` (${degree.code})`}
                                                    </button>
                                                )
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
                                {form.skills.length === 0 ? (
                                    <div className="rounded-xl border border-dashed p-6 text-center">
                                        <p className="font-medium">
                                            No skills added
                                        </p>

                                        <p className="mt-1 text-sm text-muted-foreground">
                                            Add skills when the opportunity has skill requirements.
                                        </p>
                                    </div>
                                ) : (
                                    form.skills.map(
                                        (
                                            skill,
                                            index
                                        ) => (
                                            <div
                                                key={
                                                    index
                                                }
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
                                                        onChange={(
                                                            event
                                                        ) =>
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
                                {form.nationalities.length === 0 ? (
                                    <div className="rounded-xl border border-dashed p-6 text-center">
                                        <p className="font-medium">
                                            No nationality rules
                                        </p>

                                        <p className="mt-1 text-sm text-muted-foreground">
                                            Add rules when nationality restrictions apply.
                                        </p>
                                    </div>
                                ) : (
                                    form.nationalities.map(
                                        (
                                            nationality,
                                            index
                                        ) => (
                                            <div
                                                key={
                                                    index
                                                }
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
                                                        onChange={(
                                                            event
                                                        ) =>
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
                                                        onChange={(
                                                            event
                                                        ) =>
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
                                {form.requirements.length === 0 ? (
                                    <div className="rounded-xl border border-dashed p-6 text-center">
                                        <p className="font-medium">
                                            No requirements added
                                        </p>

                                        <p className="mt-1 text-sm text-muted-foreground">
                                            Add requirements such as GPA or language level.
                                        </p>
                                    </div>
                                ) : (
                                    form.requirements.map(
                                        (
                                            requirement,
                                            index
                                        ) => (
                                            <div
                                                key={
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
                                                            onChange={(
                                                                event
                                                            ) =>
                                                                updateRequirement(
                                                                    index,
                                                                    "requirement_type",
                                                                    event
                                                                        .target
                                                                        .value
                                                                )
                                                            }
                                                            placeholder="gpa"
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
                                                            onChange={(
                                                                event
                                                            ) =>
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

                                                        <select
                                                            value={
                                                                requirement.operator
                                                            }
                                                            onChange={(
                                                                event
                                                            ) =>
                                                                updateRequirement(
                                                                    index,
                                                                    "operator",
                                                                    event
                                                                        .target
                                                                        .value
                                                                )
                                                            }
                                                            className="h-10 w-full rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                                                        >
                                                            <option value=">=">
                                                                Greater than or equal
                                                            </option>

                                                            <option value=">">
                                                                Greater than
                                                            </option>

                                                            <option value="<=">
                                                                Less than or equal
                                                            </option>

                                                            <option value="<">
                                                                Less than
                                                            </option>

                                                            <option value="=">
                                                                Equal
                                                            </option>
                                                        </select>
                                                    </div>

                                                    <div className="space-y-2">
                                                        <label className="text-sm font-medium">
                                                            Value
                                                        </label>

                                                        <Input
                                                            value={
                                                                requirement.value
                                                            }
                                                            onChange={(
                                                                event
                                                            ) =>
                                                                updateRequirement(
                                                                    index,
                                                                    "value",
                                                                    event
                                                                        .target
                                                                        .value
                                                                )
                                                            }
                                                            placeholder="70"
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
                                                            onChange={(
                                                                event
                                                            ) =>
                                                                updateRequirement(
                                                                    index,
                                                                    "unit",
                                                                    event
                                                                        .target
                                                                        .value
                                                                )
                                                            }
                                                            placeholder="%"
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
                                                            onChange={(
                                                                event
                                                            ) =>
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
                                                        onChange={(
                                                            event
                                                        ) =>
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
                                                        onChange={(
                                                            event
                                                        ) =>
                                                            updateRequirement(
                                                                index,
                                                                "description",
                                                                event
                                                                    .target
                                                                    .value
                                                            )
                                                        }
                                                        rows={3}
                                                        placeholder="Minimum GPA is 70%."
                                                        className="w-full resize-y rounded-xl border bg-background px-3 py-3 text-sm outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-ring"
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
                                    <label
                                        htmlFor="application_url"
                                        className="text-sm font-medium"
                                    >
                                        Application URL
                                    </label>

                                    <Input
                                        id="application_url"
                                        name="application_url"
                                        type="url"
                                        value={
                                            form.application_url
                                        }
                                        onChange={
                                            handleInputChange
                                        }
                                        placeholder="https://example.edu/apply"
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
                                    <label
                                        htmlFor="source_url"
                                        className="text-sm font-medium"
                                    >
                                        Source URL
                                    </label>

                                    <Input
                                        id="source_url"
                                        name="source_url"
                                        type="url"
                                        value={
                                            form.source_url
                                        }
                                        onChange={
                                            handleInputChange
                                        }
                                        placeholder="https://example.edu/scholarship"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label
                                        htmlFor="deadline"
                                        className="text-sm font-medium"
                                    >
                                        Deadline
                                    </label>

                                    <Input
                                        id="deadline"
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
                                    <label
                                        htmlFor="start_date"
                                        className="text-sm font-medium"
                                    >
                                        Start Date
                                    </label>

                                    <Input
                                        id="start_date"
                                        name="start_date"
                                        type="date"
                                        value={
                                            form.start_date
                                        }
                                        onChange={
                                            handleInputChange
                                        }
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label
                                        htmlFor="end_date"
                                        className="text-sm font-medium"
                                    >
                                        End Date
                                    </label>

                                    <Input
                                        id="end_date"
                                        name="end_date"
                                        type="date"
                                        value={
                                            form.end_date
                                        }
                                        onChange={
                                            handleInputChange
                                        }
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label
                                        htmlFor="status"
                                        className="text-sm font-medium"
                                    >
                                        Status
                                    </label>

                                    <select
                                        id="status"
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
                                to="/admin/opportunities"
                                className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-4 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
                            >
                                Cancel
                            </Link>

                            <Button
                                type="submit"
                                disabled={loading}
                                className="h-10"
                            >
                                {loading
                                    ? "Creating..."
                                    : "Create Opportunity"}
                            </Button>

                        </div>

                    </form>
                </div>
            </div>
        </div>
    )
}

export default OpportunityCreate
