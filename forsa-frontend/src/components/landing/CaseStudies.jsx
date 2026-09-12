import {
    ArrowRight,
    Brain,
    Globe2,
    Users,
} from "lucide-react";

import { Link } from "react-router-dom";

function CaseStudies() {
    const useCases = [
        {
            icon: Brain,
            category: "SMART DISCOVERY",
            title: "Help students discover better-fit opportunities",
            description:
                "EduMatch uses profile information such as education, skills, interests and goals to help students discover opportunities that align with their background.",
            link: "/student/explore",
            linkText: "Explore opportunities",
        },
        {
            icon: Globe2,
            category: "GLOBAL EDUCATION",
            title: "Make international opportunities easier to find",
            description:
                "Students can explore university programs, scholarships and educational opportunities from different countries through one platform.",
            link: "/student/universities",
            linkText: "Explore universities",
        },
        {
            icon: Users,
            category: "INSTITUTION DISCOVERY",
            title: "Help institutions reach relevant students",
            description:
                "Universities and educational institutions can present their programs to students actively searching for opportunities that fit their goals.",
            link: "#institutions",
            linkText: "For institutions",
        },
    ];

    return (
        <section
            className="case-studies-section"
            id="use-cases"
        >
            <div className="case-studies-heading">

                <div>
                    <span className="section-label">
                        HOW EDUMATCH HELPS
                    </span>

                    <h2>
                        From discovery
                        <span>to the right opportunity</span>
                    </h2>
                </div>

                <p>
                    EduMatch brings students and educational institutions
                    together through personalized discovery and smarter
                    opportunity matching.
                </p>

            </div>

            <div className="case-studies-grid">

                {useCases.map((item) => {
                    const Icon = item.icon;

                    return (
                        <article
                            className="case-study-card"
                            key={item.title}
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

                            <Link
                                to={item.link}
                                className="case-study-link"
                            >
                                {item.linkText}
                                <ArrowRight size={15} />
                            </Link>

                        </article>
                    );
                })}

            </div>

            <div className="case-studies-footer">

                <div className="case-studies-footer-content">

                    <div className="case-studies-footer-icon">
                        <Brain size={17} />
                    </div>

                    <div>
                        <strong>
                            One platform. Smarter education discovery.
                        </strong>

                        <span>
                            Discover opportunities based on what actually
                            matters to your profile.
                        </span>
                    </div>

                </div>

                <Link
                    to="/register"
                    className="case-studies-footer-link"
                >
                    Get started
                    <ArrowRight size={15} />
                </Link>

            </div>
        </section>
    );
}

export default CaseStudies;
