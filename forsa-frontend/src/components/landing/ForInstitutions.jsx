import {
    ArrowRight,
    BarChart3,
    Building2,
    Globe2,
    Users,
} from "lucide-react";

import { Link } from "react-router-dom";

function ForInstitutions() {
    const features = [
        {
            icon: Users,
            title: "Reach students who fit",
            description:
                "Show your programs to students whose academic background, skills and goals align with what you offer.",
        },
        {
            icon: Globe2,
            title: "Reach students worldwide",
            description:
                "Make your programs discoverable to students looking for study opportunities across different countries.",
        },
        {
            icon: BarChart3,
            title: "Build your presence",
            description:
                "Create an institution profile and present your programs, requirements and opportunities in one place.",
        },
    ];

    return (
        <section
            className="institutions-section"
            id="institutions"
        >
            <div className="institutions-content">

                <span className="section-label">
                    FOR INSTITUTIONS
                </span>

                <h2>
                    Put your programs
                    <span>in front of the right students</span>
                </h2>

                <p className="institutions-description">
                    EduMatch connects universities and educational
                    institutions with students who are actively looking
                    for programs that fit their academic goals and interests.
                </p>

                <div className="institutions-features">

                    {features.map((feature) => {
                        const Icon = feature.icon;

                        return (
                            <div
                                className="institution-feature"
                                key={feature.title}
                            >
                                <div className="institution-feature-icon">
                                    <Icon size={18} />
                                </div>

                                <div className="institution-feature-content">

                                    <h3>
                                        {feature.title}
                                    </h3>

                                    <p>
                                        {feature.description}
                                    </p>

                                </div>
                            </div>
                        );
                    })}

                </div>

                <Link
                    to="#contact"
                    className="institutions-button"
                >
                    Join EduMatch
                    <ArrowRight size={16} />
                </Link>

            </div>

            <div className="institutions-visual">

                <div className="institution-dashboard">

                    <div className="institution-dashboard-header">

                        <div className="institution-brand">

                            <div className="institution-card-icon">
                                <Building2 size={20} />
                            </div>

                            <div>
                                <strong>
                                    Institution Profile
                                </strong>

                                <span>
                                    Your programs on EduMatch
                                </span>
                            </div>

                        </div>

                        <span className="institution-status">
                            Conceptual view
                        </span>

                    </div>

                    <div className="institution-program">

                        <div className="institution-program-icon">
                            <Building2 size={19} />
                        </div>

                        <div className="institution-program-content">

                            <span>
                                Featured Program
                            </span>

                            <strong>
                                Your featured program
                            </strong>

                            <p>
                                Graduate Program
                            </p>

                        </div>

                        <div className="institution-program-match">
                            <strong>
                                Student fit
                            </strong>

                            <span>
                                Profile signals
                            </span>
                        </div>

                    </div>

                    <div className="institution-student-group">

                        <div className="student-group-header">

                            <div>
                                <strong>
                                    Student interest
                                </strong>

                                <span>
                                    Students matching your program
                                </span>
                            </div>

                            <Users size={18} />

                        </div>

                        <div className="student-interest-bars">

                            <span style={{ height: "42%" }} />
                            <span style={{ height: "55%" }} />
                            <span style={{ height: "48%" }} />
                            <span style={{ height: "67%" }} />
                            <span style={{ height: "61%" }} />
                            <span style={{ height: "78%" }} />
                            <span style={{ height: "88%" }} />

                        </div>

                    </div>

                    <div className="institution-dashboard-footer">

                        <span>
                            Global student discovery
                        </span>

                        <Globe2 size={15} />

                    </div>

                </div>

                <div className="institution-floating-card">

                    <div className="institution-floating-icon">
                        <Users size={16} />
                    </div>

                    <div className="institution-floating-content">

                        <strong>
                            Best-fit students
                        </strong>

                        <span>
                            Matched by profile
                        </span>

                    </div>

                </div>

            </div>
        </section>
    );
}

export default ForInstitutions;
