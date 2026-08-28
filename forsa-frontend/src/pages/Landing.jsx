import { ArrowRight, Search, Check, Sparkles } from "lucide-react";
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
                                <span />
                            </span>

                            <span>
                                Forsa-AI
                            </span>
                        </Link>


                        <nav className="landing-nav">

                            <Link to="/">
                                Home
                            </Link>

                            <Link to="/student/opportunities">
                                Opportunities
                            </Link>

                            <Link to="/how-it-works">
                                How It Works
                            </Link>

                            <Link to="/about">
                                About
                            </Link>

                        </nav>


                        <div className="landing-actions">

                            <button
                                type="button"
                                className="search-button"
                                aria-label="Search"
                            >
                                <Search size={19} />
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

                    <section className="hero-section">

                        <div className="hero-content">

                            <div className="hero-badge">

                                <Sparkles size={15} />

                                <span>
                                    AI-powered opportunity matching
                                </span>

                            </div>


                            <h1>
                                Get matched to

                                <span>
                                    Scholarships
                                </span>

                                that fit you
                            </h1>


                            <p className="hero-description">
                                Finding the right educational opportunity
                                should not be difficult. Forsa-AI helps you
                                discover scholarships and opportunities that
                                match your education, skills and goals.
                            </p>


                            <div className="hero-search">

                                <input
                                    type="email"
                                    placeholder="Enter your email to get started"
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


                            {/* Top Floating Card */}

                            <div className="floating-card floating-card-top">

                                <div className="avatar avatar-one">
                                    K
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


                            {/* Bottom Floating Card */}

                            <div className="floating-card floating-card-bottom">

                                <div className="avatar avatar-two">
                                    F
                                </div>


                                <div>

                                    <strong>
                                        Forsa-AI
                                    </strong>

                                    <p>
                                        Find opportunities that fit you
                                    </p>

                                </div>

                            </div>

                        </div>

                    </section>


                    {/* Featured Opportunities */}

                    <section className="featured-section">

                        <div className="featured-heading">

                            <h2>
                                Featured Opportunities
                            </h2>


                            <div className="heading-line" />


                            <p>
                                Discover opportunities that may fit your profile
                            </p>


                            <Link
                                to="/student/opportunities"
                                className="featured-button"
                            >
                                Find Opportunities Now

                                <ArrowRight size={18} />

                            </Link>

                        </div>


                        <div className="opportunity-preview">

                            {/* Card 1 */}

                            <article className="preview-card">

                                <div className="preview-amount">
                                    Full Funding
                                </div>


                                <div className="preview-image preview-image-one" />


                                <div className="preview-content">

                                    <h3>
                                        Master's Scholarship
                                    </h3>


                                    <p>
                                        International University
                                    </p>

                                </div>

                            </article>


                            {/* Card 2 */}

                            <article className="preview-card">

                                <div className="preview-amount">
                                    Scholarship
                                </div>


                                <div className="preview-image preview-image-two" />


                                <div className="preview-content">

                                    <h3>
                                        Graduate Study Opportunity
                                    </h3>


                                    <p>
                                        Study Abroad
                                    </p>

                                </div>

                            </article>


                            {/* Card 3 */}

                            <article className="preview-card">

                                <div className="preview-amount">
                                    Fully Funded
                                </div>


                                <div className="preview-image preview-image-three" />


                                <div className="preview-content">

                                    <h3>
                                        AI & Computer Science
                                    </h3>


                                    <p>
                                        International Program
                                    </p>

                                </div>

                            </article>

                        </div>

                    </section>

                </main>

            </div>

        </div>
    );
}

export default Landing;
