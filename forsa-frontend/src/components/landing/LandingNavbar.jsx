import {
    ArrowRight,
    GraduationCap,
    Search,
} from "lucide-react";

import {
    Link,
} from "react-router-dom";

function LandingNavbar() {
    return (
        <header className="landing-navbar">

            <Link
                to="/"
                className="landing-logo"
                aria-label="EduMatch Home"
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


            <nav
                className="landing-nav"
                aria-label="Main navigation"
            >
                <a href="#home">
                    Home
                </a>

                <Link to="/student/explore">
                    Explore
                </Link>

                <a href="#how-it-works">
                    How It Works
                </a>

                <a href="#why-edumatch">
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

                <Link
                    to="/student/explore"
                    className="search-button"
                    aria-label="Explore opportunities"
                    title="Explore opportunities"
                >
                    <Search size={18} />
                </Link>


                <Link
                    to="/login"
                    className="login-button"
                >
                    Log In
                </Link>


                <Link
                    to="/register"
                    className="signup-button"
                >
                    Get Started
                    <ArrowRight size={16} />
                </Link>

            </div>

        </header>
    );
}

export default LandingNavbar;
