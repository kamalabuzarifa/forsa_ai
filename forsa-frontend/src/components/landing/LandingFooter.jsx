import {
    ArrowUpRight,
    GraduationCap,
} from "lucide-react";

import {
    Link,
} from "react-router-dom";

function LandingFooter() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="landing-footer">

            <div className="footer-main">

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
                        matching that helps students discover
                        programs and opportunities aligned with
                        their goals.
                    </p>

                    <a
                        href="#get-started"
                        className="footer-brand-link"
                    >
                        Start your journey
                        <ArrowUpRight size={15} />
                    </a>

                </div>


                <div className="footer-column">

                    <h3>
                        Platform
                    </h3>

                    <Link to="/student/explore">
                        Explore
                    </Link>

                    <Link to="/student/opportunities">
                        Opportunities
                    </Link>

                    <Link to="/student/universities">
                        Universities
                    </Link>

                    <a href="#how-it-works">
                        How It Works
                    </a>

                    <a href="#why-edumatch">
                        Why EduMatch
                    </a>

                </div>


                <div className="footer-column">

                    <h3>
                        Students
                    </h3>

                    <Link to="/login">
                        Student Login
                    </Link>

                    <Link to="/register">
                        Create an Account
                    </Link>

                    <Link to="/student/profile">
                        My Profile
                    </Link>

                    <Link to="/student/applications">
                        My Applications
                    </Link>

                </div>


                <div className="footer-column">

                    <h3>
                        Resources
                    </h3>

                    <a href="#faq">
                        FAQ
                    </a>

                    <a href="#resources">
                        Learning Resources
                    </a>

                    <a href="#institutions">
                        For Institutions
                    </a>

                    <a href="#contact">
                        Contact Us
                    </a>

                </div>

            </div>


            <div className="footer-divider" />


            <div className="footer-bottom">

                <p>
                    © {currentYear} EduMatch. All rights reserved.
                </p>

                <div className="footer-bottom-links">

                    <Link to="/privacy-policy">
                        Privacy Policy
                    </Link>

                    <Link to="/terms-of-use">
                        Terms of Use
                    </Link>

                </div>

            </div>

        </footer>
    );
}

export default LandingFooter;
