import {
    ArrowRight,
    Search,
    Check,
    Sparkles,
    GraduationCap,
    Brain,
    Target,
    FileCheck,
    Globe2,
    ShieldCheck,
    Users,
    BookOpen,
    ChevronRight,
    Mail,
    MessageCircle,
    Clock3,
    Send,
    ChevronDown,
    Star,
} from "lucide-react";

import { Link } from "react-router-dom";

import "./Landing.css";

function Landing() {
    return (
        <div className="landing-page">

            <div className="landing-background">

                <div className="landing-shape landing-shape-1" />
                <div className="landing-shape landing-shape-2" />
                <div className="landing-shape landing-shape-3" />

                <main className="landing-container">

                    {/* Navbar */}

                    <header className="landing-navbar">

                        <Link
                            to="/"
                            className="landing-logo"
                        >
                            <span className="logo-mark">
                                <GraduationCap
                                    size={22}
                                    strokeWidth={2.2}
                                />
                            </span>

                            <span>
                                EduMatch
                            </span>
                        </Link>


                        <nav className="landing-nav">

                            <a href="#home">
                                Home
                            </a>

                            <Link to="/student/opportunities">
                                Opportunities
                            </Link>

                            <a href="#how-it-works">
                                How It Works
                            </a>

                            <a href="#why-forsa">
                                Why EduMatch
                            </a>

                            <a href="#faq">
                                FAQ
                            </a>

                            <a href="#contact">
                                Contact
                            </a>

                        </nav>


                        <div className="landing-actions">

                            <button
                                type="button"
                                className="search-button"
                                aria-label="Search opportunities"
                                onClick={() => {
                                    window.location.href =
                                        "/student/opportunities";
                                }}
                            >
                                <Search size={18} />
                            </button>


                            <Link
                                to="/login"
                                className="login-button"
                            >
                                Student Log In
                            </Link>


                            <Link
                                to="/register"
                                className="signup-button"
                            >
                                Student Sign Up
                            </Link>

                        </div>

                    </header>


                    {/* Hero */}

                    <section
                        className="hero-section"
                        id="home"
                    >

                        <div className="hero-content">

                            <div className="hero-badge">

                                <Sparkles size={15} />

                                <span>
                                    AI-powered opportunity matching
                                </span>

                            </div>


                            <h1>
                                Find opportunities

                                <span>
                                    made for you
                                </span>

                            </h1>


                            <p className="hero-description">
                                EduMatch helps students discover scholarships,
                                study programs and educational opportunities
                                that match their education, skills and goals.
                            </p>


                            <div className="hero-search">

                                <input
                                    type="email"
                                    placeholder="Enter your email to get started"
                                    id="hero-email"
                                />


                                <Link
                                    to="/register"
                                    className="hero-search-button"
                                    aria-label="Get started"
                                >
                                    <ArrowRight size={21} />
                                </Link>

                            </div>


                            <div className="hero-features">

                                <span>
                                    <Check size={15} />
                                    Free to use
                                </span>


                                <span>
                                    <Check size={15} />
                                    Personalized matching
                                </span>


                                <span>
                                    <Check size={15} />
                                    Global opportunities
                                </span>

                            </div>


                            <div className="hero-trust">

                                <div className="trust-avatars">

                                    <span>K</span>
                                    <span>A</span>
                                    <span>M</span>
                                    <span>+</span>

                                </div>

                                <div>

                                    <div className="trust-stars">

                                        <Star
                                            size={12}
                                            fill="currentColor"
                                        />

                                        <Star
                                            size={12}
                                            fill="currentColor"
                                        />

                                        <Star
                                            size={12}
                                            fill="currentColor"
                                        />

                                        <Star
                                            size={12}
                                            fill="currentColor"
                                        />

                                        <Star
                                            size={12}
                                            fill="currentColor"
                                        />

                                    </div>

                                    <p>
                                        Built for students searching for
                                        their next opportunity
                                    </p>

                                </div>

                            </div>

                        </div>


                        {/* Hero Visual */}

                        <div className="hero-visual">

                            <div className="image-decoration image-decoration-back" />

                            <div className="image-decoration image-decoration-front" />


                            <div className="hero-image-wrapper">

                                <img
                                    src="/images/hero-student.jpeg"
                                    alt="Student graduation"
                                    className="hero-image"
                                />

                            </div>


                            <div className="floating-card floating-card-top">

                                <div className="avatar avatar-one">
                                    <Brain size={16} />
                                </div>


                                <div>

                                    <strong>
                                        Smart Matching
                                    </strong>

                                    <p>
                                        Opportunities selected for you
                                    </p>

                                </div>

                            </div>


                            <div className="floating-card floating-card-bottom">

                                <div className="avatar avatar-two">
                                    <Target size={16} />
                                </div>


                                <div>

                                    <strong>
                                        92% Match
                                    </strong>

                                    <p>
                                        Based on your profile
                                    </p>

                                </div>

                            </div>


                            <div className="hero-match-card">

                                <div className="hero-match-header">

                                    <div className="mini-icon">
                                        <Sparkles size={14} />
                                    </div>

                                    <div>
                                        <strong>
                                            AI Match
                                        </strong>

                                        <span>
                                            Your recommendation
                                        </span>
                                    </div>

                                </div>


                                <div className="hero-match-score">

                                    <strong>
                                        92%
                                    </strong>

                                    <div className="hero-score-bar">
                                        <span />
                                    </div>

                                </div>

                            </div>

                        </div>

                    </section>


                    {/* Statistics */}

                    <section className="stats-section">

                        <div className="stats-grid">

                            <div className="stat-item">

                                <div className="stat-icon">
                                    <GraduationCap size={22} />
                                </div>

                                <div>
                                    <strong>1,000+</strong>
                                    <span>Opportunities</span>
                                </div>

                            </div>


                            <div className="stat-item">

                                <div className="stat-icon">
                                    <Globe2 size={22} />
                                </div>

                                <div>
                                    <strong>50+</strong>
                                    <span>Countries</span>
                                </div>

                            </div>


                            <div className="stat-item">

                                <div className="stat-icon">
                                    <Users size={22} />
                                </div>

                                <div>
                                    <strong>5,000+</strong>
                                    <span>Students</span>
                                </div>

                            </div>


                            <div className="stat-item">

                                <div className="stat-icon">
                                    <Target size={22} />
                                </div>

                                <div>
                                    <strong>AI</strong>
                                    <span>Personalized Matching</span>
                                </div>

                            </div>

                        </div>

                    </section>


                    {/* How It Works */}

                    <section
                        className="how-section"
                        id="how-it-works"
                    >

                        <div className="section-heading">

                            <span className="section-label">
                                HOW IT WORKS
                            </span>

                            <h2>
                                From profile to opportunity
                            </h2>

                            <p>
                                A simple process designed to help you spend
                                less time searching and more time applying.
                            </p>

                        </div>


                        <div className="steps-grid">

                            <div className="step-card">

                                <div className="step-top">

                                    <span className="step-number">
                                        01
                                    </span>

                                    <div className="step-icon">
                                        <FileCheck size={25} />
                                    </div>

                                </div>

                                <h3>
                                    Complete your profile
                                </h3>

                                <p>
                                    Add your education, skills, languages,
                                    experience and other information.
                                </p>

                                <div className="step-link">
                                    Build your profile
                                    <ArrowRight size={15} />
                                </div>

                            </div>


                            <div className="step-card">

                                <div className="step-top">

                                    <span className="step-number">
                                        02
                                    </span>

                                    <div className="step-icon">
                                        <Brain size={25} />
                                    </div>

                                </div>

                                <h3>
                                    Get AI-powered matches
                                </h3>

                                <p>
                                    EduMatch analyzes your profile and finds
                                    opportunities that fit your background.
                                </p>

                                <div className="step-link">
                                    Discover matches
                                    <ArrowRight size={15} />
                                </div>

                            </div>


                            <div className="step-card">

                                <div className="step-top">

                                    <span className="step-number">
                                        03
                                    </span>

                                    <div className="step-icon">
                                        <GraduationCap size={25} />
                                    </div>

                                </div>

                                <h3>
                                    Apply with confidence
                                </h3>

                                <p>
                                    Compare requirements, funding and deadlines
                                    before starting your application.
                                </p>

                                <div className="step-link">
                                    Start applying
                                    <ArrowRight size={15} />
                                </div>

                            </div>

                        </div>

                    </section>



                    {/* Why EduMatch AI */}

                    <section
                        className="why-section"
                        id="why-forsa"
                    >

                        <div className="why-content">

                            <span className="section-label">
                                WHY EDUMATCH
                            </span>

                            <h2>
                                One place to find
                                <span>
                                    {" "}your next opportunity
                                </span>
                            </h2>

                            <p>
                                Stop searching through hundreds of websites.
                                EduMatch brings opportunities together and
                                helps you identify the ones that fit your profile.
                            </p>


                            <div className="why-list">

                                <div className="why-item">

                                    <div className="why-item-icon">
                                        <Brain size={20} />
                                    </div>

                                    <div>
                                        <h3>
                                            AI-powered matching
                                        </h3>

                                        <p>
                                            Get recommendations based on your
                                            academic background, skills and goals.
                                        </p>
                                    </div>

                                </div>


                                <div className="why-item">

                                    <div className="why-item-icon">
                                        <Globe2 size={20} />
                                    </div>

                                    <div>
                                        <h3>
                                            Opportunities from around the world
                                        </h3>

                                        <p>
                                            Discover scholarships and study
                                            opportunities from different countries.
                                        </p>
                                    </div>

                                </div>


                                <div className="why-item">

                                    <div className="why-item-icon">
                                        <ShieldCheck size={20} />
                                    </div>

                                    <div>
                                        <h3>
                                            Information in one place
                                        </h3>

                                        <p>
                                            Compare funding, eligibility,
                                            deadlines and requirements.
                                        </p>
                                    </div>

                                </div>

                            </div>


                            <Link
                                to="/register"
                                className="why-button"
                            >
                                Create Your Profile
                                <ArrowRight size={18} />
                            </Link>

                        </div>


                        <div className="why-visual">

                            <div className="why-card why-card-main">

                                <div className="why-card-header">

                                    <div className="why-card-icon">
                                        <Brain size={22} />
                                    </div>

                                    <div>
                                        <strong>
                                            AI Match Score
                                        </strong>

                                        <span>
                                            Your opportunity match
                                        </span>
                                    </div>

                                </div>


                                <div className="match-score">

                                    <span>
                                        92%
                                    </span>

                                    <div className="match-progress">

                                        <div
                                            className="match-progress-fill"
                                            style={{
                                                width: "92%",
                                            }}
                                        />

                                    </div>

                                </div>


                                <div className="match-info">

                                    <div>
                                        <Check size={15} />
                                        Academic background
                                    </div>

                                    <div>
                                        <Check size={15} />
                                        Skills
                                    </div>

                                    <div>
                                        <Check size={15} />
                                        Eligibility
                                    </div>

                                </div>

                            </div>


                            <div className="why-floating-card">

                                <div className="why-floating-icon">
                                    <Target size={18} />
                                </div>

                                <div>
                                    <strong>
                                        12 matches found
                                    </strong>

                                    <span>
                                        Based on your profile
                                    </span>
                                </div>

                            </div>

                        </div>

                    </section>


                    {/* Featured Opportunities */}

                    <section className="featured-section">

                        <div className="featured-heading">

                            <div>

                                <span className="section-label">
                                    EXPLORE
                                </span>

                                <h2>
                                    Featured Opportunities
                                </h2>

                                <div className="heading-line" />

                                <p>
                                    Discover opportunities that may fit your profile.
                                </p>

                            </div>


                            <Link
                                to="/student/opportunities"
                                className="featured-button"
                            >
                                View All Opportunities
                                <ArrowRight size={18} />
                            </Link>

                        </div>


                        <div className="opportunity-preview">

                            <article className="preview-card">

                                <div className="preview-amount">
                                    Full Funding
                                </div>

                                <div className="preview-image preview-image-one" />

                                <div className="preview-content">

                                    <span className="preview-category">
                                        Master's Degree
                                    </span>

                                    <h3>
                                        Master's Scholarship
                                    </h3>

                                    <p>
                                        International University
                                    </p>

                                    <div className="preview-footer">

                                        <span>
                                            <Globe2 size={14} />
                                            International
                                        </span>

                                        <ChevronRight size={17} />

                                    </div>

                                </div>

                            </article>


                            <article className="preview-card">

                                <div className="preview-amount">
                                    Scholarship
                                </div>

                                <div className="preview-image preview-image-two" />

                                <div className="preview-content">

                                    <span className="preview-category">
                                        Graduate Study
                                    </span>

                                    <h3>
                                        Graduate Study Opportunity
                                    </h3>

                                    <p>
                                        Study Abroad
                                    </p>

                                    <div className="preview-footer">

                                        <span>
                                            <Globe2 size={14} />
                                            International
                                        </span>

                                        <ChevronRight size={17} />

                                    </div>

                                </div>

                            </article>


                            <article className="preview-card">

                                <div className="preview-amount">
                                    Fully Funded
                                </div>

                                <div className="preview-image preview-image-three" />

                                <div className="preview-content">

                                    <span className="preview-category">
                                        Computer Science
                                    </span>

                                    <h3>
                                        AI & Computer Science
                                    </h3>

                                    <p>
                                        International Program
                                    </p>

                                    <div className="preview-footer">

                                        <span>
                                            <Globe2 size={14} />
                                            International
                                        </span>

                                        <ChevronRight size={17} />

                                    </div>

                                </div>

                            </article>

                        </div>

                    </section>


                    {/* AI Section */}

                    <section className="ai-section">

                        <div className="ai-glow" />

                        <div className="ai-section-inner">

                            <div className="ai-icon-large">
                                <Sparkles size={29} />
                            </div>

                            <span className="section-label">
                                POWERED BY AI
                            </span>

                            <h2>
                                Your profile.
                                <span>
                                    {" "}Your goals. Your opportunities.
                                </span>
                            </h2>

                            <p>
                                EduMatch uses your profile information to
                                help you discover opportunities aligned with
                                your academic background and goals.
                            </p>

                            <Link
                                to="/register"
                                className="ai-button"
                            >
                                Get Started
                                <ArrowRight size={18} />
                            </Link>

                        </div>

                    </section>


                    {/* FAQ */}

                    <section
                        className="faq-section"
                        id="faq"
                    >

                        <div className="section-heading">

                            <span className="section-label">
                                FAQ
                            </span>

                            <h2>
                                Questions students ask
                            </h2>

                            <p>
                                Everything you need to know before getting started.
                            </p>

                        </div>


                        <div className="faq-list">

                            <details className="faq-item">

                                <summary>
                                    What is EduMatch?

                                    <span className="faq-chevron">
                                        <ChevronDown size={18} />
                                    </span>

                                </summary>

                                <p>
                                    EduMatch is a platform that helps students
                                    discover scholarships, study programs and
                                    educational opportunities based on their
                                    profile.
                                </p>

                            </details>


                            <details className="faq-item">

                                <summary>
                                    How does the AI matching work?

                                    <span className="faq-chevron">
                                        <ChevronDown size={18} />
                                    </span>

                                </summary>

                                <p>
                                    The system analyzes information in your
                                    profile and compares it with opportunity
                                    requirements to identify suitable matches.
                                </p>

                            </details>


                            <details className="faq-item">

                                <summary>
                                    Is EduMatch free for students?

                                    <span className="faq-chevron">
                                        <ChevronDown size={18} />
                                    </span>

                                </summary>

                                <p>
                                    Yes. Students can create an account,
                                    complete their profile and explore
                                    available opportunities.
                                </p>

                            </details>


                            <details className="faq-item">

                                <summary>
                                    What information should I add?

                                    <span className="faq-chevron">
                                        <ChevronDown size={18} />
                                    </span>

                                </summary>

                                <p>
                                    Add your academic information, skills,
                                    languages, work experience and other
                                    information requested by your profile.
                                </p>

                            </details>


                            <details className="faq-item">

                                <summary>
                                    Can I track my applications?

                                    <span className="faq-chevron">
                                        <ChevronDown size={18} />
                                    </span>

                                </summary>

                                <p>
                                    Yes. After applying, you can use your
                                    student dashboard to view and track
                                    your application status.
                                </p>

                            </details>

                        </div>

                    </section>


                    {/* Contact */}

                    <section
                        className="contact-section"
                        id="contact"
                    >

                        <div className="contact-card">

                            <div className="contact-info">

                                <span className="section-label">
                                    CONTACT US
                                </span>

                                <h2>
                                    Have a question?
                                    <span>
                                        {" "}Talk to us.
                                    </span>
                                </h2>

                                <p>
                                    Need help with your account or have a
                                    question about an opportunity? Our team
                                    is here to help.
                                </p>


                                <div className="contact-details">

                                    <div className="contact-detail">

                                        <div className="contact-detail-icon">
                                            <Mail size={18} />
                                        </div>

                                        <div>
                                            <strong>
                                                Email
                                            </strong>

                                            <span>
                                                support@edumatch@ai.com
                                            </span>
                                        </div>

                                    </div>


                                    <div className="contact-detail">

                                        <div className="contact-detail-icon">
                                            <MessageCircle size={18} />
                                        </div>

                                        <div>
                                            <strong>
                                                Support
                                            </strong>

                                            <span>
                                                We are here to help you
                                            </span>
                                        </div>

                                    </div>


                                    <div className="contact-detail">

                                        <div className="contact-detail-icon">
                                            <Clock3 size={18} />
                                        </div>

                                        <div>
                                            <strong>
                                                Response time
                                            </strong>

                                            <span>
                                                Within 1–2 business days
                                            </span>
                                        </div>

                                    </div>

                                </div>

                            </div>


                            <form
                                className="contact-form"
                                onSubmit={(event) => {
                                    event.preventDefault();
                                }}
                            >

                                <div className="contact-row">

                                    <div className="contact-field">

                                        <label htmlFor="contact-name">
                                            Name
                                        </label>

                                        <input
                                            id="contact-name"
                                            type="text"
                                            placeholder="Your name"
                                            required
                                        />

                                    </div>


                                    <div className="contact-field">

                                        <label htmlFor="contact-email">
                                            Email
                                        </label>

                                        <input
                                            id="contact-email"
                                            type="email"
                                            placeholder="you@example.com"
                                            required
                                        />

                                    </div>

                                </div>


                                <div className="contact-field">

                                    <label htmlFor="contact-subject">
                                        Subject
                                    </label>

                                    <input
                                        id="contact-subject"
                                        type="text"
                                        placeholder="How can we help?"
                                        required
                                    />

                                </div>


                                <div className="contact-field">

                                    <label htmlFor="contact-message">
                                        Message
                                    </label>

                                    <textarea
                                        id="contact-message"
                                        rows="5"
                                        placeholder="Write your message..."
                                        required
                                    />

                                </div>


                                <button
                                    type="submit"
                                    className="contact-submit"
                                >
                                    Send Message
                                    <Send size={17} />
                                </button>

                            </form>

                        </div>

                    </section>


                    {/* CTA */}

                    <section className="cta-section">

                        <div className="cta-content">

                            <div className="cta-icon">
                                <BookOpen size={27} />
                            </div>

                            <div>

                                <span className="section-label">
                                    GET STARTED
                                </span>

                                <h2>
                                    Ready to find your next opportunity?
                                </h2>

                                <p>
                                    Create your profile and let EduMatch
                                    help you discover opportunities that fit you.
                                </p>

                            </div>

                        </div>


                        <Link
                            to="/register"
                            className="cta-button"
                        >
                            Create Free Account
                            <ArrowRight size={18} />
                        </Link>

                    </section>


                    {/* Footer */}

                    <footer className="landing-footer">

                        <div className="footer-main">

                            {/* Brand */}

                            <div className="footer-brand">

                                <Link
                                    to="/"
                                    className="landing-logo"
                                >
                                    <span className="logo-mark">
                                        <GraduationCap
                                            size={22}
                                            strokeWidth={2.2}
                                        />
                                    </span>

                                    <span>
                                        EduMatch
                                    </span>
                                </Link>


                                <p>
                                    AI-powered educational opportunity
                                    matching for students.
                                </p>


                                <div className="footer-status">

                                    <span className="status-dot" />

                                    <span>
                                        Helping students discover opportunities
                                    </span>

                                </div>

                            </div>


                            {/* Platform */}

                            <div className="footer-column">

                                <h3>
                                    Platform
                                </h3>

                                <Link to="/student/opportunities">
                                    Opportunities
                                </Link>

                                <a href="#how-it-works">
                                    How It Works
                                </a>

                                <a href="#why-forsa">
                                    Why EduMatch
                                </a>

                                <a href="#faq">
                                    FAQ
                                </a>

                            </div>


                            {/* Students */}

                            <div className="footer-column">

                                <h3>
                                    Students
                                </h3>

                                <Link to="/login">
                                    Student Login
                                </Link>

                                <Link to="/register">
                                    Student Sign Up
                                </Link>

                                <Link to="/student/profile">
                                    My Profile
                                </Link>

                                <Link to="/student/applications">
                                    My Applications
                                </Link>

                            </div>


                            {/* Support */}

                            <div className="footer-column">

                                <h3>
                                    Support
                                </h3>

                                <a href="#contact">
                                    Contact Us
                                </a>

                                <a href="#faq">
                                    Frequently Asked Questions
                                </a>

                                <a href="#contact">
                                    Help Center
                                </a>

                            </div>

                        </div>


                        {/* Divider */}

                        <div className="footer-divider" />


                        {/* Bottom */}

                        <div className="footer-bottom">

                            <p>
                                © {new Date().getFullYear()} EduMatch.
                                All rights reserved.
                            </p>


                            <div className="footer-bottom-links">

                                <Link to="/privacy-policy">
                                    Privacy Policy
                                </Link>

                                <Link to="/terms-of-use">
                                    Terms of Use
                                </Link>

                                <Link to="/security">
                                    Security
                                </Link>

                            </div>

                        </div>

                    </footer>

                </main>

            </div>

        </div>
    );
}

export default Landing;
