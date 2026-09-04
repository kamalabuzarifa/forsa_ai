import {
    ArrowRight,
    TrendingUp,
    Users,
    Globe2,
} from "lucide-react";

function CaseStudies() {
    const cases = [
        {
            icon: TrendingUp,
            category: "CASE STUDY",
            title: "Helping institutions reach better-fit students",
            description:
                "See how data-driven student matching can help institutions improve visibility, reach international students, and increase qualified applications.",
            stat: "42%",
            statLabel: "more qualified engagement",
        },
        {
            icon: Globe2,
            category: "GLOBAL REACH",
            title: "Connecting education across borders",
            description:
                "EduMatch helps institutions present their programmes to students who are actively searching for opportunities that match their goals.",
            stat: "190+",
            statLabel: "countries within reach",
        },
        {
            icon: Users,
            category: "STUDENT MATCHING",
            title: "Turning discovery into opportunity",
            description:
                "Our recommendation system helps students move from browsing programmes to finding opportunities that fit their academic profile.",
            stat: "92%",
            statLabel: "match confidence",
        },
    ];

    return (
        <section className="case-studies-section">

            <div className="case-studies-heading">

                <div>
                    <span className="section-label">
                        CASE STUDIES
                    </span>

                    <h2>
                        Real results from
                        <span>better matching</span>
                    </h2>
                </div>

                <p>
                    Explore how EduMatch can help students and
                    institutions make better education decisions.
                </p>

            </div>

            <div className="case-studies-grid">

                {cases.map((item, index) => {
                    const Icon = item.icon;

                    return (
                        <article
                            className="case-study-card"
                            key={index}
                        >

                            <div className="case-study-top">
                                <div className="case-study-icon">
                                    <Icon size={21} />
                                </div>

                                <span>
                                    {item.category}
                                </span>
                            </div>

                            <h3>
                                {item.title}
                            </h3>

                            <p>
                                {item.description}
                            </p>

                            <div className="case-study-stat">
                                <strong>
                                    {item.stat}
                                </strong>

                                <span>
                                    {item.statLabel}
                                </span>
                            </div>

                            <button className="case-study-link">
                                Read case study
                                <ArrowRight size={14} />
                            </button>

                        </article>
                    );
                })}

            </div>

            <div className="case-studies-footer">
                <a href="#contact">
                    View all case studies
                    <ArrowRight size={14} />
                </a>
            </div>

        </section>
    );
}

export default CaseStudies;
