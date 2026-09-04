import {
    Building2,
    Users,
    Globe2,
    BarChart3,
    ArrowRight,
} from "lucide-react";

import { Link } from "react-router-dom";

function ForInstitutions() {
    return (
        <section className="institutions-section" id="institutions">

            <div className="institutions-content">

                <span className="section-label">
                    FOR INSTITUTIONS
                </span>

                <h2>
                    Reach the right students
                    <span>with EduMatch</span>
                </h2>

                <p>
                    EduMatch helps universities and educational institutions
                    reach students who are actively searching for programmes
                    that match their academic goals, interests, and preferences.
                </p>

                <div className="institutions-features">

                    <div className="institution-feature">

                        <div className="institution-feature-icon">
                            <Users size={18} />
                        </div>

                        <div>
                            <h3>Reach qualified students</h3>

                            <p>
                                Connect your programmes with students whose
                                profiles match your admission requirements.
                            </p>
                        </div>

                    </div>

                    <div className="institution-feature">

                        <div className="institution-feature-icon">
                            <Globe2 size={18} />
                        </div>

                        <div>
                            <h3>Expand your global reach</h3>

                            <p>
                                Present your programmes to students searching
                                for study opportunities around the world.
                            </p>
                        </div>

                    </div>

                    <div className="institution-feature">

                        <div className="institution-feature-icon">
                            <BarChart3 size={18} />
                        </div>

                        <div>
                            <h3>Understand student demand</h3>

                            <p>
                                Use student search and matching data to better
                                understand programme demand and interests.
                            </p>
                        </div>

                    </div>

                </div>

                <Link
                    to="/institution/register"
                    className="institutions-button"
                >
                    Join EduMatch

                    <ArrowRight size={15} />
                </Link>

            </div>


            <div className="institutions-visual">

                <div className="institution-main-card">

                    <div className="institution-card-header">

                        <div className="institution-card-icon">
                            <Building2 size={21} />
                        </div>

                        <div>
                            <strong>Institution Dashboard</strong>
                            <span>Student recruitment overview</span>
                        </div>

                    </div>


                    <div className="institution-metrics">

                        <div className="institution-metric">
                            <span>Student views</span>
                            <strong>24.8K</strong>
                        </div>

                        <div className="institution-metric">
                            <span>Programme matches</span>
                            <strong>8.4K</strong>
                        </div>

                        <div className="institution-metric">
                            <span>Applications</span>
                            <strong>1.2K</strong>
                        </div>

                    </div>


                    <div className="institution-chart">

                        <div className="chart-header">
                            <span>Student interest</span>
                            <strong>+28.4%</strong>
                        </div>

                        <div className="chart-bars">

                            <span style={{ height: "35%" }} />
                            <span style={{ height: "48%" }} />
                            <span style={{ height: "42%" }} />
                            <span style={{ height: "63%" }} />
                            <span style={{ height: "58%" }} />
                            <span style={{ height: "76%" }} />
                            <span style={{ height: "90%" }} />

                        </div>

                    </div>

                </div>


                <div className="institution-floating-card">

                    <div className="institution-floating-icon">
                        <Users size={16} />
                    </div>

                    <div>
                        <strong>Best-fit students</strong>
                        <span>92% match quality</span>
                    </div>

                </div>

            </div>

        </section>
    );
}

export default ForInstitutions;
