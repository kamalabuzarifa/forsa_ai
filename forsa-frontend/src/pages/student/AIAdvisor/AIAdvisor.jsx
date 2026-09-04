import {
    ArrowRight,
    Brain,
    Check,
    ChevronDown,
    GraduationCap,
    MapPin,
    Sparkles,
    Target,
} from "lucide-react";

import {
    Link,
} from "react-router-dom";

import {
    useEffect,
    useState,
} from "react";

import {
    getAIAdvisorOptions,
    getAIRecommendations,
} from "../../../api/aiAdvisor";

import "./AIAdvisor.css";


function AIAdvisor() {

    const [options, setOptions] = useState({
        fields: [],
        degrees: [],
        countries: [],
    });

    const [form, setForm] = useState({
        field_id: "",
        degree_id: "",
        country_id: "",
        study_mode: "on_campus",
    });

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [recommendations, setRecommendations] = useState([]);
    const [submitted, setSubmitted] = useState(false);


    /* =========================================================
       LOAD OPTIONS
    ========================================================= */

    useEffect(() => {

        const loadOptions = async () => {

            try {

                setLoading(true);
                setError("");

                const response =
                    await getAIAdvisorOptions();

                const data =
                    response?.data ??
                    response ??
                    {};

                setOptions({
                    fields: Array.isArray(data?.fields)
                        ? data.fields
                        : [],

                    degrees: Array.isArray(data?.degrees)
                        ? data.degrees
                        : [],

                    countries: Array.isArray(data?.countries)
                        ? data.countries
                        : [],
                });

            } catch (err) {

                console.error(
                    "Failed to load AI Advisor options",
                    err
                );

                setError(
                    err?.response?.data?.message ||
                    "Unable to load advisor options."
                );

            } finally {

                setLoading(false);

            }
        };

        loadOptions();

    }, []);


    /* =========================================================
       INPUT CHANGE
    ========================================================= */

    const handleChange = (event) => {

        const {
            name,
            value,
        } = event.target;

        setForm((previous) => ({
            ...previous,
            [name]: value,
        }));

        setError("");
    };


    /* =========================================================
       STUDY MODE
    ========================================================= */

    const handleStudyModeChange = (mode) => {

        setForm((previous) => ({
            ...previous,
            study_mode: mode,
        }));

        setError("");
    };


    /* =========================================================
       SUBMIT
    ========================================================= */

    const handleSubmit = async (event) => {

        event.preventDefault();

        setError("");

        if (!form.field_id) {
            setError(
                "Please select your field of study."
            );
            return;
        }

        if (!form.degree_id) {
            setError(
                "Please select your degree level."
            );
            return;
        }

        if (!form.country_id) {
            setError(
                "Please select your preferred destination."
            );
            return;
        }

        try {

            setSubmitting(true);

            const response =
                await getAIRecommendations({

                    field_id:
                        Number(form.field_id),

                    degree_id:
                        Number(form.degree_id),

                    country_id:
                        Number(form.country_id),

                    study_mode:
                        form.study_mode,
                });


            console.log(
                "AI Advisor response:",
                response
            );


            const data =
                response?.data ??
                response ??
                {};


            let results = [];


            if (Array.isArray(data)) {

                results = data;

            } else if (
                Array.isArray(data?.data)
            ) {

                results = data.data;

            } else if (
                Array.isArray(
                    data?.recommendations
                )
            ) {

                results =
                    data.recommendations;

            } else if (
                Array.isArray(
                    data?.opportunities
                )
            ) {

                results =
                    data.opportunities;
            }


            console.log(
                "AI Advisor recommendations:",
                results
            );


            setRecommendations(results);

            setSubmitted(true);


            setTimeout(() => {

                const resultsSection =
                    document.getElementById(
                        "ai-results"
                    );

                if (resultsSection) {

                    resultsSection.scrollIntoView({
                        behavior: "smooth",
                        block: "start",
                    });

                }

            }, 100);

        } catch (err) {

            console.error(
                "Failed to load recommendations",
                err
            );

            setRecommendations([]);
            setSubmitted(false);

            setError(
                err?.response?.data?.message ||
                "Unable to load recommendations."
            );

        } finally {

            setSubmitting(false);

        }
    };


    /* =========================================================
       HELPERS
    ========================================================= */

    const getOptionId = (item) => {

        return item?.id ?? "";
    };


    const getOptionName = (item) => {

        return (
            item?.name ??
            item?.title ??
            ""
        );
    };


    const getOpportunityId = (opportunity) => {

        const id =
            Number(
                opportunity?.id
            );

        if (
            Number.isInteger(id) &&
            id > 0
        ) {

            return id;
        }

        return null;
    };


    const getUniversityName = (opportunity) => {

        return (
            opportunity?.university?.name ??
            opportunity?.university_name ??
            ""
        );
    };


    const getCountryName = (opportunity) => {

        return (
            opportunity?.country?.name ??
            opportunity?.country_name ??
            ""
        );
    };


    const getDegreeName = (opportunity) => {

        if (
            Array.isArray(opportunity?.degrees) &&
            opportunity.degrees.length > 0
        ) {

            return (
                opportunity.degrees[0]?.name ??
                opportunity.degrees[0]?.title ??
                ""
            );
        }

        return (
            opportunity?.degree?.name ??
            opportunity?.degree_name ??
            ""
        );
    };


    const getFieldName = (opportunity) => {

        if (
            Array.isArray(opportunity?.fields) &&
            opportunity.fields.length > 0
        ) {

            return (
                opportunity.fields[0]?.name ??
                opportunity.fields[0]?.title ??
                ""
            );
        }

        return (
            opportunity?.field?.name ??
            opportunity?.field_name ??
            ""
        );
    };


    /* =========================================================
       RENDER
    ========================================================= */

    return (

        <div className="ai-advisor-page">


            {/* =====================================================
                HEADER
            ===================================================== */}

            <section className="ai-advisor-header">

                <div className="ai-advisor-header-content">

                    <span className="ai-advisor-eyebrow">

                        <Sparkles size={14} />

                        AI Powered Guidance

                    </span>


                    <h1>

                        Find the right

                        <span>
                            {" "}study path for you
                        </span>

                    </h1>


                    <p>

                        Tell EduMatch what you want to study
                        and where you want to study. We will
                        compare your preferences with available
                        opportunities.

                    </p>

                </div>


                <div className="ai-advisor-header-icon">

                    <Brain size={42} />

                </div>

            </section>


            {/* =====================================================
                ADVISOR
            ===================================================== */}

            <section className="ai-advisor-section">


                {/* FORM */}

                <div className="ai-advisor-form-card">

                    <div className="ai-advisor-form-header">

                        <div>

                            <span className="ai-form-label">
                                Your preferences
                            </span>

                            <h2>
                                Build your study profile
                            </h2>

                            <p>
                                Select your study preferences
                                and find matching opportunities.
                            </p>

                        </div>


                        <div className="ai-progress">

                            <span>
                                1
                            </span>

                            <div></div>

                            <span>
                                4
                            </span>

                        </div>

                    </div>


                    {error && (

                        <div className="ai-form-error">
                            {error}
                        </div>

                    )}


                    <form onSubmit={handleSubmit}>


                        <div className="ai-form-group">

                            <label htmlFor="field_id">
                                What do you want to study?
                            </label>

                            <div className="ai-input-wrapper">

                                <GraduationCap size={18} />

                                <select
                                    id="field_id"
                                    name="field_id"
                                    value={form.field_id}
                                    onChange={handleChange}
                                    disabled={
                                        loading ||
                                        submitting
                                    }
                                >

                                    <option value="">

                                        {loading
                                            ? "Loading fields..."
                                            : "Select your field"
                                        }

                                    </option>

                                    {options.fields.map(
                                        (field) => (

                                            <option
                                                key={getOptionId(field)}
                                                value={getOptionId(field)}
                                            >
                                                {getOptionName(field)}
                                            </option>

                                        )
                                    )}

                                </select>

                                <ChevronDown size={16} />

                            </div>

                        </div>


                        <div className="ai-form-row">

                            <div className="ai-form-group">

                                <label htmlFor="degree_id">
                                    Degree level
                                </label>

                                <div className="ai-input-wrapper">

                                    <GraduationCap size={18} />

                                    <select
                                        id="degree_id"
                                        name="degree_id"
                                        value={form.degree_id}
                                        onChange={handleChange}
                                        disabled={
                                            loading ||
                                            submitting
                                        }
                                    >

                                        <option value="">

                                            {loading
                                                ? "Loading degrees..."
                                                : "Select degree"
                                            }

                                        </option>

                                        {options.degrees.map(
                                            (degree) => (

                                                <option
                                                    key={getOptionId(degree)}
                                                    value={getOptionId(degree)}
                                                >
                                                    {getOptionName(degree)}
                                                </option>

                                            )
                                        )}

                                    </select>

                                    <ChevronDown size={16} />

                                </div>

                            </div>


                            <div className="ai-form-group">

                                <label htmlFor="country_id">
                                    Preferred destination
                                </label>

                                <div className="ai-input-wrapper">

                                    <MapPin size={18} />

                                    <select
                                        id="country_id"
                                        name="country_id"
                                        value={form.country_id}
                                        onChange={handleChange}
                                        disabled={
                                            loading ||
                                            submitting
                                        }
                                    >

                                        <option value="">

                                            {loading
                                                ? "Loading countries..."
                                                : "Select country"
                                            }

                                        </option>

                                        {options.countries.map(
                                            (country) => (

                                                <option
                                                    key={getOptionId(country)}
                                                    value={getOptionId(country)}
                                                >
                                                    {getOptionName(country)}
                                                </option>

                                            )
                                        )}

                                    </select>

                                    <ChevronDown size={16} />

                                </div>

                            </div>

                        </div>


                        <div className="ai-form-group">

                            <label>
                                Study preference
                            </label>


                            <div className="ai-choice-grid">

                                <button
                                    type="button"
                                    className={
                                        `ai-choice ${form.study_mode === "on_campus"
                                            ? "active"
                                            : ""
                                        }`
                                    }
                                    onClick={() =>
                                        handleStudyModeChange(
                                            "on_campus"
                                        )
                                    }
                                    disabled={
                                        submitting
                                    }
                                >

                                    {form.study_mode === "on_campus" && (
                                        <Check size={16} />
                                    )}

                                    On campus

                                </button>


                                <button
                                    type="button"
                                    className={
                                        `ai-choice ${form.study_mode === "online"
                                            ? "active"
                                            : ""
                                        }`
                                    }
                                    onClick={() =>
                                        handleStudyModeChange(
                                            "online"
                                        )
                                    }
                                    disabled={
                                        submitting
                                    }
                                >

                                    {form.study_mode === "online" && (
                                        <Check size={16} />
                                    )}

                                    Online

                                </button>


                                <button
                                    type="button"
                                    className={
                                        `ai-choice ${form.study_mode === "hybrid"
                                            ? "active"
                                            : ""
                                        }`
                                    }
                                    onClick={() =>
                                        handleStudyModeChange(
                                            "hybrid"
                                        )
                                    }
                                    disabled={
                                        submitting
                                    }
                                >

                                    {form.study_mode === "hybrid" && (
                                        <Check size={16} />
                                    )}

                                    Hybrid

                                </button>

                            </div>

                        </div>


                        <button
                            type="submit"
                            className="ai-submit-button"
                            disabled={
                                loading ||
                                submitting
                            }
                        >

                            <Sparkles size={17} />

                            {submitting
                                ? "Finding opportunities..."
                                : "Find my opportunities"
                            }

                            {!submitting && (
                                <ArrowRight size={17} />
                            )}

                        </button>

                    </form>

                </div>


                {/* SIDE */}

                <aside className="ai-advisor-side">

                    <div className="ai-side-card">

                        <div className="ai-side-icon">
                            <Target size={21} />
                        </div>

                        <h3>
                            What will you get?
                        </h3>

                        <p>
                            EduMatch compares your preferences
                            with opportunities stored in the
                            platform.
                        </p>

                        <div className="ai-result-point">

                            <Check size={15} />

                            <span>
                                Matching programs
                            </span>

                        </div>

                        <div className="ai-result-point">

                            <Check size={15} />

                            <span>
                                Suitable universities
                            </span>

                        </div>

                        <div className="ai-result-point">

                            <Check size={15} />

                            <span>
                                Scholarship opportunities
                            </span>

                        </div>

                        <div className="ai-result-point">

                            <Check size={15} />

                            <span>
                                Eligibility insights
                            </span>

                        </div>

                    </div>


                    <div className="ai-tip-card">

                        <Sparkles size={18} />

                        <div>

                            <strong>
                                Better profile, better matches
                            </strong>

                            <p>
                                Complete your profile to improve
                                your recommendations.
                            </p>

                            <Link
                                to="/student/profile"
                            >
                                Complete profile
                                <ArrowRight size={13} />
                            </Link>

                        </div>

                    </div>

                </aside>

            </section>


            {/* =====================================================
                RESULTS
            ===================================================== */}

            {submitted && (

                <section
                    id="ai-results"
                    className="ai-results-section"
                >

                    <div className="ai-section-heading">

                        <span>
                            YOUR MATCHES
                        </span>

                        <h2>
                            Recommended opportunities
                        </h2>

                    </div>


                    {recommendations.length === 0 ? (

                        <div className="ai-empty-results">

                            <Target size={24} />

                            <p>
                                No matching opportunities
                                were found.
                            </p>

                        </div>

                    ) : (

                        <div className="ai-results-grid">

                            {recommendations.map(
                                (
                                    opportunity,
                                    index
                                ) => {

                                    const opportunityId =
                                        getOpportunityId(
                                            opportunity
                                        );


                                    const universityName =
                                        getUniversityName(
                                            opportunity
                                        );


                                    const countryName =
                                        getCountryName(
                                            opportunity
                                        );


                                    const degreeName =
                                        getDegreeName(
                                            opportunity
                                        );


                                    const fieldName =
                                        getFieldName(
                                            opportunity
                                        );


                                    return (

                                        <article
                                            className="ai-result-card"
                                            key={
                                                opportunityId ??
                                                `recommendation-${index}`
                                            }
                                        >

                                            <div>

                                                <span className="ai-result-score">
                                                    Match
                                                </span>


                                                <h3>

                                                    {
                                                        opportunity?.title ??
                                                        opportunity?.name ??
                                                        "Untitled opportunity"
                                                    }

                                                </h3>


                                                {universityName && (

                                                    <p>
                                                        {universityName}
                                                    </p>

                                                )}


                                                {countryName && (

                                                    <p>
                                                        {countryName}
                                                    </p>

                                                )}


                                                {degreeName && (

                                                    <p>
                                                        {degreeName}
                                                    </p>

                                                )}


                                                {fieldName && (

                                                    <p>
                                                        {fieldName}
                                                    </p>

                                                )}

                                            </div>


                                            {opportunityId && (

                                                <Link
                                                    to={
                                                        `/student/opportunities/${opportunityId}`
                                                    }
                                                    className="ai-result-link"
                                                >

                                                    View opportunity

                                                    <ArrowRight
                                                        size={14}
                                                    />

                                                </Link>

                                            )}

                                        </article>

                                    );

                                }
                            )}

                        </div>

                    )}

                </section>

            )}


            {/* =====================================================
                HOW IT WORKS
            ===================================================== */}

            <section className="ai-how-section">

                <div className="ai-section-heading">

                    <span>
                        HOW IT WORKS
                    </span>

                    <h2>

                        From your goals to your

                        <span>
                            {" "}next opportunity
                        </span>

                    </h2>

                </div>


                <div className="ai-how-grid">

                    <div className="ai-how-card">

                        <div className="ai-how-number">
                            01
                        </div>

                        <h3>
                            Tell us about you
                        </h3>

                        <p>
                            Select your field, degree level,
                            destination, and study preference.
                        </p>

                    </div>


                    <div className="ai-how-card">

                        <div className="ai-how-number">
                            02
                        </div>

                        <h3>
                            Match your profile
                        </h3>

                        <p>
                            EduMatch compares your selections
                            with opportunities stored in the
                            database.
                        </p>

                    </div>


                    <div className="ai-how-card">

                        <div className="ai-how-number">
                            03
                        </div>

                        <h3>
                            Explore your matches
                        </h3>

                        <p>
                            Review the opportunities that match
                            your selected criteria.
                        </p>

                    </div>

                </div>

            </section>

        </div>
    );
}


export default AIAdvisor;
