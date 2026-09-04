import {
    ArrowRight,
    Brain,
    Check,
    Globe2,
    ShieldCheck,
    Target,
} from "lucide-react";

import { Link } from "react-router-dom";

function WhyEduMatch() {
    return (
        <section
            className="why-section"
            id="why-edumatch"
        >

            <div className="why-content">

                <span className="section-label">
                    WHY EDUMATCH
                </span>

                <h2>
                    One place to find

                    <span>
                        your next opportunity
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
                            Personalized matches
                        </strong>

                        <span>
                            Based on your profile
                        </span>

                    </div>

                </div>

            </div>

        </section>
    );
}

export default WhyEduMatch;
