import {
    ArrowRight,
    Brain,
    FileCheck,
    GraduationCap,
} from "lucide-react";

import { Link } from "react-router-dom";

function HowItWorks() {
    return (
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

                    <Link
                        to="/register"
                        className="step-link"
                    >
                        Build your profile
                        <ArrowRight size={15} />
                    </Link>

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

                    <Link
                        to="/student/opportunities"
                        className="step-link"
                    >
                        Discover matches
                        <ArrowRight size={15} />
                    </Link>

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

                    <Link
                        to="/student/opportunities"
                        className="step-link"
                    >
                        Start applying
                        <ArrowRight size={15} />
                    </Link>

                </div>

            </div>

        </section>
    );
}

export default HowItWorks;
