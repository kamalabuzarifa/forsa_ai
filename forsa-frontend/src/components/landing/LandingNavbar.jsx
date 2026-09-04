import {
    GraduationCap,
    Search,
} from "lucide-react";

import {
    Link,
    useNavigate,
} from "react-router-dom";

function LandingNavbar() {

    const navigate = useNavigate();

    return (
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

                <button
                    type="button"
                    className="search-button"
                    aria-label="Search opportunities"
                    onClick={() =>
                        navigate("/student/opportunities")
                    }
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
    );
}

export default LandingNavbar;
