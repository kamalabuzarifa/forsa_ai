import {
    ArrowLeft,
    ArrowRight,
    Bookmark,
    CheckCircle2,
    Clock3,
    DollarSign,
    ExternalLink,
    Globe2,
    GraduationCap,
    Heart,
    MapPin,
    Share2,
    ShieldCheck,
    University,
} from "lucide-react";

import {
    Link,
    useParams,
} from "react-router-dom";

import "./ScholarshipDetails.css";


function ScholarshipDetails() {

    const { id } = useParams();

    const scholarship = {
        id,
        title: "Global Excellence Scholarship",

        university: "University of Oxford",

        country: "United Kingdom",

        city: "Oxford, United Kingdom",

        degree: "Master's",

        funding: "Fully Funded",

        amount: "£25,000",

        deadline: "15 January 2027",

        duration: "1 year",

        match: 96,

        description:
            "The Global Excellence Scholarship supports international students who demonstrate strong academic performance, leadership potential, and a clear commitment to their field of study.",

        longDescription:
            "This scholarship provides financial support for international students who want to pursue postgraduate study at the University of Oxford. The program is designed to support students with strong academic records and a clear study plan.",

        eligibility: [
            "You must be an international student.",
            "You must hold an offer for an eligible master's program.",
            "You must meet the academic requirements of the university.",
            "You must demonstrate academic excellence.",
            "You must submit the scholarship application before the deadline.",
        ],

        benefits: [
            "Tuition fee support",
            "Living cost contribution",
            "Academic support",
            "Access to university resources",
            "International student community",
        ],

        applicationSteps: [
            "Choose an eligible master's program.",
            "Submit your university application.",
            "Receive or secure your admission status.",
            "Prepare the scholarship documents.",
            "Submit your scholarship application.",
        ],

        documents: [
            "Academic transcripts",
            "CV or resume",
            "Personal statement",
            "Academic references",
            "Proof of English proficiency",
        ],
    };


    return (
        <div className="scholarship-details-page">

            {/* =================================================
                Top Navigation
            ================================================= */}

            <div className="scholarship-details-top">

                <Link
                    to="/student/scholarships"
                    className="back-to-scholarships"
                >
                    <ArrowLeft size={16} />

                    Back to scholarships
                </Link>

            </div>


            {/* =================================================
                Hero
            ================================================= */}

            <section className="scholarship-details-hero">

                <div className="scholarship-hero-content">

                    <div className="scholarship-breadcrumb">

                        <Link to="/student/explore">
                            Explore
                        </Link>

                        <span>/</span>

                        <Link to="/student/scholarships">
                            Scholarships
                        </Link>

                        <span>/</span>

                        <span>
                            Details
                        </span>

                    </div>


                    <div className="scholarship-hero-grid">

                        <div className="scholarship-hero-main">

                            <div className="scholarship-university-icon">
                                <University size={28} />
                            </div>


                            <div className="scholarship-match-badge">

                                <CheckCircle2 size={14} />

                                {scholarship.match}% match for you

                            </div>


                            <h1>
                                {scholarship.title}
                            </h1>


                            <Link
                                to="/student/universities/1"
                                className="scholarship-university-link"
                            >
                                {scholarship.university}
                            </Link>


                            <div className="scholarship-location">

                                <MapPin size={15} />

                                {scholarship.city}

                            </div>


                            <p className="scholarship-hero-description">
                                {scholarship.description}
                            </p>


                            <div className="scholarship-hero-actions">

                                <a
                                    href="#apply"
                                    className="scholarship-apply-button"
                                >
                                    Apply for this scholarship

                                    <ArrowRight size={16} />

                                </a>


                                <button className="scholarship-save-button">

                                    <Bookmark size={16} />

                                    Save

                                </button>


                                <button className="scholarship-share-button">

                                    <Share2 size={16} />

                                </button>

                            </div>

                        </div>


                        <aside className="scholarship-summary-card">

                            <div className="summary-card-header">

                                <span>
                                    Scholarship overview
                                </span>

                                <ShieldCheck size={18} />

                            </div>


                            <div className="summary-items">

                                <div className="summary-item">

                                    <div className="summary-icon">
                                        <DollarSign size={17} />
                                    </div>

                                    <div>
                                        <span>
                                            Funding
                                        </span>

                                        <strong>
                                            {scholarship.funding}
                                        </strong>
                                    </div>

                                </div>


                                <div className="summary-item">

                                    <div className="summary-icon">
                                        <GraduationCap size={17} />
                                    </div>

                                    <div>
                                        <span>
                                            Study level
                                        </span>

                                        <strong>
                                            {scholarship.degree}
                                        </strong>
                                    </div>

                                </div>


                                <div className="summary-item">

                                    <div className="summary-icon">
                                        <Clock3 size={17} />
                                    </div>

                                    <div>
                                        <span>
                                            Deadline
                                        </span>

                                        <strong>
                                            {scholarship.deadline}
                                        </strong>
                                    </div>

                                </div>


                                <div className="summary-item">

                                    <div className="summary-icon">
                                        <Globe2 size={17} />
                                    </div>

                                    <div>
                                        <span>
                                            Destination
                                        </span>

                                        <strong>
                                            {scholarship.country}
                                        </strong>
                                    </div>

                                </div>

                            </div>


                            <div className="summary-funding">

                                <span>
                                    Estimated funding
                                </span>

                                <strong>
                                    {scholarship.amount}
                                </strong>

                            </div>

                        </aside>

                    </div>

                </div>

            </section>


            {/* =================================================
                Main Content
            ================================================= */}

            <main className="scholarship-details-content">

                <div className="scholarship-details-layout">


                    {/* =================================================
                        Main Column
                    ================================================= */}

                    <div className="scholarship-details-main">


                        {/* Overview */}

                        <section className="details-section">

                            <div className="details-section-heading">

                                <span>
                                    ABOUT THIS SCHOLARSHIP
                                </span>

                                <h2>
                                    Scholarship overview
                                </h2>

                            </div>


                            <p>
                                {scholarship.longDescription}
                            </p>

                            <p>
                                Students who receive this scholarship can
                                focus on their academic goals while receiving
                                financial support during their studies.
                            </p>

                        </section>


                        {/* Benefits */}

                        <section className="details-section">

                            <div className="details-section-heading">

                                <span>
                                    FUNDING
                                </span>

                                <h2>
                                    What does it cover?
                                </h2>

                            </div>


                            <div className="benefits-grid">

                                {scholarship.benefits.map(
                                    (benefit, index) => (

                                        <div
                                            className="benefit-item"
                                            key={index}
                                        >

                                            <CheckCircle2 size={17} />

                                            <span>
                                                {benefit}
                                            </span>

                                        </div>

                                    )
                                )}

                            </div>

                        </section>


                        {/* Eligibility */}

                        <section className="details-section">

                            <div className="details-section-heading">

                                <span>
                                    ELIGIBILITY
                                </span>

                                <h2>
                                    Who can apply?
                                </h2>

                            </div>


                            <div className="eligibility-list">

                                {scholarship.eligibility.map(
                                    (item, index) => (

                                        <div
                                            className="eligibility-item"
                                            key={index}
                                        >

                                            <div className="eligibility-number">
                                                {index + 1}
                                            </div>

                                            <p>
                                                {item}
                                            </p>

                                        </div>

                                    )
                                )}

                            </div>

                        </section>


                        {/* Documents */}

                        <section className="details-section">

                            <div className="details-section-heading">

                                <span>
                                    REQUIREMENTS
                                </span>

                                <h2>
                                    Documents you may need
                                </h2>

                            </div>


                            <div className="documents-list">

                                {scholarship.documents.map(
                                    (document, index) => (

                                        <div
                                            className="document-item"
                                            key={index}
                                        >

                                            <CheckCircle2 size={16} />

                                            <span>
                                                {document}
                                            </span>

                                        </div>

                                    )
                                )}

                            </div>

                        </section>


                        {/* Application */}

                        <section
                            className="details-section"
                            id="apply"
                        >

                            <div className="details-section-heading">

                                <span>
                                    APPLICATION
                                </span>

                                <h2>
                                    How to apply
                                </h2>

                            </div>


                            <div className="application-steps">

                                {scholarship.applicationSteps.map(
                                    (step, index) => (

                                        <div
                                            className="application-step"
                                            key={index}
                                        >

                                            <div className="step-number">
                                                {index + 1}
                                            </div>

                                            <div className="step-content">

                                                <strong>
                                                    Step {index + 1}
                                                </strong>

                                                <p>
                                                    {step}
                                                </p>

                                            </div>

                                        </div>

                                    )
                                )}

                            </div>


                            <div className="official-application">

                                <div>

                                    <strong>
                                        Ready to apply?
                                    </strong>

                                    <p>
                                        Continue to the official
                                        university application page.
                                    </p>

                                </div>


                                <a
                                    href="#"
                                    className="official-application-button"
                                >
                                    Official application

                                    <ExternalLink size={14} />

                                </a>

                            </div>

                        </section>

                    </div>


                    {/* =================================================
                        Sidebar
                    ================================================= */}

                    <aside className="scholarship-details-sidebar">


                        {/* Deadline */}

                        <div className="sidebar-card deadline-card">

                            <div className="sidebar-card-icon">
                                <Clock3 size={19} />
                            </div>

                            <span>
                                Application deadline
                            </span>

                            <strong>
                                {scholarship.deadline}
                            </strong>

                            <p>
                                Make sure your application is submitted
                                before the deadline.
                            </p>

                        </div>


                        {/* University */}

                        <div className="sidebar-card">

                            <div className="sidebar-card-header">

                                <span>
                                    Offered by
                                </span>

                                <University size={17} />

                            </div>


                            <div className="sidebar-university">

                                <div className="sidebar-university-icon">
                                    <GraduationCap size={20} />
                                </div>

                                <div>

                                    <strong>
                                        {scholarship.university}
                                    </strong>

                                    <span>
                                        {scholarship.country}
                                    </span>

                                </div>

                            </div>


                            <Link
                                to="/student/universities/1"
                                className="sidebar-link"
                            >
                                View university

                                <ArrowRight size={14} />

                            </Link>

                        </div>


                        {/* Quick Facts */}

                        <div className="sidebar-card">

                            <div className="sidebar-card-header">

                                <span>
                                    Quick facts
                                </span>

                            </div>


                            <div className="quick-facts">

                                <div>
                                    <span>
                                        Study level
                                    </span>

                                    <strong>
                                        {scholarship.degree}
                                    </strong>
                                </div>


                                <div>
                                    <span>
                                        Duration
                                    </span>

                                    <strong>
                                        {scholarship.duration}
                                    </strong>
                                </div>


                                <div>
                                    <span>
                                        Funding
                                    </span>

                                    <strong>
                                        {scholarship.funding}
                                    </strong>
                                </div>


                                <div>
                                    <span>
                                        Amount
                                    </span>

                                    <strong>
                                        {scholarship.amount}
                                    </strong>
                                </div>

                            </div>

                        </div>


                        {/* Save */}

                        <div className="sidebar-save-card">

                            <Heart size={19} />

                            <strong>
                                Interested in this scholarship?
                            </strong>

                            <p>
                                Save it to your profile and come back
                                to it later.
                            </p>

                            <button>
                                <Bookmark size={14} />

                                Save scholarship
                            </button>

                        </div>

                    </aside>

                </div>

            </main>

        </div>
    );
}


export default ScholarshipDetails;
