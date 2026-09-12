import {
    ArrowRight,
    BarChart3,
    BookOpen,
    FileText,
} from "lucide-react";

import { Link } from "react-router-dom";

function ResourcesSection() {
    const resources = [
        {
            icon: FileText,
            type: "GUIDE",
            title: "Build a stronger student profile",
            description:
                "Learn which academic, skills, language and experience details can help you present your background clearly.",
            link: "/student/profile",
            linkText: "Build your profile",
        },
        {
            icon: BarChart3,
            type: "DISCOVERY",
            title: "How to compare study opportunities",
            description:
                "Understand the key factors to review when comparing programs, universities, funding and eligibility.",
            link: "/student/explore",
            linkText: "Explore opportunities",
        },
        {
            icon: BookOpen,
            type: "GUIDANCE",
            title: "Prepare for your next academic step",
            description:
                "Get practical guidance for exploring programs and making decisions based on your academic goals.",
            link: "/student/universities",
            linkText: "Explore universities",
        },
    ];

    return (
        <section
            className="resources-section"
            id="resources"
        >
            <div className="resources-heading">

                <div>
                    <span className="section-label">
                        LEARNING RESOURCES
                    </span>

                    <h2>
                        Make better decisions
                        <span>with the right information</span>
                    </h2>

                    <p>
                        Useful guidance to help you understand your options,
                        improve your profile and take the next step with more
                        confidence.
                    </p>
                </div>

                <Link
                    to="/student/explore"
                    className="resources-view-all"
                >
                    Explore EduMatch
                    <ArrowRight size={14} />
                </Link>

            </div>

            <div className="resources-grid">

                {resources.map((resource) => {
                    const Icon = resource.icon;

                    return (
                        <article
                            className="resource-card"
                            key={resource.title}
                        >
                            <div className="resource-image">

                                <div className="resource-image-icon">
                                    <Icon size={28} />
                                </div>

                            </div>

                            <div className="resource-content">

                                <span className="resource-type">
                                    {resource.type}
                                </span>

                                <h3>
                                    {resource.title}
                                </h3>

                                <p>
                                    {resource.description}
                                </p>

                                <Link
                                    to={resource.link}
                                    className="resource-link"
                                >
                                    {resource.linkText}
                                    <ArrowRight size={13} />
                                </Link>

                            </div>
                        </article>
                    );
                })}

            </div>

            <div className="resources-footer">

                <div className="resources-footer-content">

                    <div className="resources-footer-icon">
                        <BookOpen size={17} />
                    </div>

                    <div>
                        <strong>
                            Start with your profile
                        </strong>

                        <span>
                            The more complete your profile, the more useful
                            your opportunity discovery can become.
                        </span>
                    </div>

                </div>

                <Link
                    to="/register"
                    className="resources-footer-link"
                >
                    Get started
                    <ArrowRight size={15} />
                </Link>

            </div>
        </section>
    );
}

export default ResourcesSection;
