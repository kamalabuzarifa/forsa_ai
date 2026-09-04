import {
    ArrowRight,
    Building2,
    GraduationCap,
    Sparkles,
} from "lucide-react";

import {
    Link,
} from "react-router-dom";

import "./StudentFooter.css";


function StudentFooter() {

    return (

        <footer className="student-footer">

            <div className="student-footer-container">


                {/* =================================================
                    Footer Main
                ================================================= */}

                <div className="student-footer-main">


                    {/* Brand */}

                    <div className="student-footer-brand">

                        <Link
                            to="/student/explore"
                            className="student-footer-logo"
                        >

                            <span className="student-footer-logo-mark">
                                E
                            </span>

                            <span className="student-footer-logo-text">
                                Edu<span>Match</span>
                            </span>

                        </Link>


                        <p>
                            Find the right study program,
                            university and scholarship for
                            your future.
                        </p>


                        <Link
                            to="/student/ai-advisor"
                            className="student-footer-ai-link"
                        >

                            <Sparkles size={15} />

                            <span>
                                Get personalized recommendations
                            </span>

                            <ArrowRight size={15} />

                        </Link>

                    </div>


                    {/* Explore */}

                    <div className="student-footer-column">

                        <h4>
                            Explore
                        </h4>


                        <Link to="/student/programs">
                            <GraduationCap size={15} />
                            Programs
                        </Link>


                        <Link to="/student/universities">
                            <Building2 size={15} />
                            Universities
                        </Link>


                        <Link to="/student/scholarships">
                            Scholarships
                        </Link>


                        <Link to="/student/ai-advisor">
                            <Sparkles size={15} />
                            AI Advisor
                        </Link>

                    </div>


                    {/* Student */}

                    <div className="student-footer-column">

                        <h4>
                            Your Journey
                        </h4>


                        <Link to="/student/profile">
                            My Profile
                        </Link>


                        <Link to="/student/saved">
                            Saved Programs
                        </Link>


                        <Link to="/student/compare">
                            Compare Programs
                        </Link>


                        <Link to="/student/applications">
                            My Applications
                        </Link>

                    </div>


                    {/* Platform */}

                    <div className="student-footer-column">

                        <h4>
                            EduMatch
                        </h4>


                        <Link to="/student/explore">
                            Explore
                        </Link>


                        <Link to="/student/programs">
                            Find Programs
                        </Link>


                        <Link to="/student/scholarships">
                            Find Scholarships
                        </Link>


                        <Link to="/student/ai-advisor">
                            AI Advisor
                        </Link>

                    </div>


                </div>


                {/* =================================================
                    Footer Bottom
                ================================================= */}

                <div className="student-footer-bottom">

                    <span>
                        © {new Date().getFullYear()} EduMatch.
                        All rights reserved.
                    </span>


                    <div className="student-footer-bottom-links">

                        <Link to="/privacy">
                            Privacy
                        </Link>

                        <Link to="/terms">
                            Terms
                        </Link>

                        <Link to="/contact">
                            Contact
                        </Link>

                    </div>

                </div>


            </div>

        </footer>

    );

}


export default StudentFooter;
