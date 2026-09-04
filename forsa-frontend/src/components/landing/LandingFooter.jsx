import {
    GraduationCap,
} from "lucide-react";

import { Link } from "react-router-dom";

function LandingFooter() {
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
                        matching for students.
                    </p>


                    <div className="footer-status">

                        <span className="status-dot" />

                        <span>
                            Helping students discover opportunities
                        </span>

                    </div>

                </div>


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

                    <a href="#why-edumatch">
                        Why EduMatch
                    </a>

                    <a href="#faq">
                        FAQ
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
                        Student Sign Up
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


            <div className="footer-divider" />


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
    );
}

export default LandingFooter;
