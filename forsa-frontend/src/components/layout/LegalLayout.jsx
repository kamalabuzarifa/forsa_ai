import {
    ArrowLeft,
    ShieldCheck,
    FileText,
    GraduationCap,
} from "lucide-react";

import { Link } from "react-router-dom";

import "./LegalLayout.css";

function LegalLayout({
    icon: Icon = ShieldCheck,
    label,
    title,
    description,
    lastUpdated = "August 2026",
    sections = [],
    children,
}) {
    const handleLogoClick = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    return (
        <div className="legal-page">

            <div className="legal-background">

                <main className="legal-container">

                    {/* Navbar */}

                    <header className="legal-navbar">

                        <Link
                            to="/"
                            className="legal-logo"
                            onClick={handleLogoClick}
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


                        <div className="legal-navbar-action">

                            <Link
                                to="/"
                                className="legal-back"
                            >

                                <ArrowLeft size={17} />

                                <span>
                                    Back to Home
                                </span>

                            </Link>

                        </div>

                    </header>


                    {/* Hero */}

                    <section className="legal-hero">

                        <div className="legal-hero-icon">

                            <Icon
                                size={30}
                                strokeWidth={2}
                            />

                        </div>


                        <span className="legal-label">

                            <FileText size={13} />

                            <span>
                                {label}
                            </span>

                        </span>


                        <h1>
                            {title}
                        </h1>


                        <p>
                            {description}
                        </p>


                        <span className="legal-updated">
                            Last updated: {lastUpdated}
                        </span>

                    </section>


                    {/* Content */}

                    <section className="legal-content">

                        {sections.length > 0 && (
                            <aside className="legal-toc">

                                <div className="legal-toc-header">
                                    On this page
                                </div>


                                <nav>

                                    {sections.map((section) => (
                                        <a
                                            key={section.id}
                                            href={`#${section.id}`}
                                        >
                                            {section.title}
                                        </a>
                                    ))}

                                </nav>

                            </aside>
                        )}


                        <article className="legal-article">

                            {children}

                        </article>

                    </section>


                    {/* Footer */}

                    <footer className="legal-footer">

                        <div className="legal-footer-main">

                            <div className="legal-footer-brand">

                                <Link
                                    to="/"
                                    className="legal-logo"
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

                            </div>


                            <div className="legal-footer-column">

                                <h3>
                                    Platform
                                </h3>

                                <Link to="/student/opportunities">
                                    Opportunities
                                </Link>

                                <Link to="/">
                                    Home
                                </Link>

                            </div>


                            <div className="legal-footer-column">

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

                            </div>


                            <div className="legal-footer-column">

                                <h3>
                                    Legal
                                </h3>

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


                        <div className="legal-footer-divider" />


                        <div className="legal-footer-bottom">

                            <p>
                                © {new Date().getFullYear()} EduMatch.
                                All rights reserved.
                            </p>


                            <div className="legal-footer-links">

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

export default LegalLayout;
