import {
    FileText,
    BookOpen,
    BarChart3,
    ArrowRight,
} from "lucide-react";

function ResourcesSection() {
    const resources = [
        {
            icon: FileText,
            type: "GUIDE",
            title: "How to choose the right study programme",
            description:
                "Learn how to compare programmes, universities, requirements, and funding options.",
        },
        {
            icon: BarChart3,
            type: "REPORT",
            title: "Global education trends",
            description:
                "Explore insights about international students, study destinations, and education demand.",
        },
        {
            icon: BookOpen,
            type: "ARTICLE",
            title: "Preparing for your next academic step",
            description:
                "Practical guidance to help you prepare your profile and discover new opportunities.",
        },
    ];

    return (
        <section className="resources-section">

            <div className="resources-heading">

                <div>
                    <span className="section-label">
                        RESOURCES
                    </span>

                    <h2>
                        Knowledge to help you
                        <span>make better decisions</span>
                    </h2>
                </div>

                <a
                    href="#resources"
                    className="resources-view-all"
                >
                    View all
                    <ArrowRight size={14} />
                </a>

            </div>

            <div className="resources-grid">

                {resources.map((resource, index) => {
                    const Icon = resource.icon;

                    return (
                        <article
                            className="resource-card"
                            key={index}
                        >

                            <div className="resource-image">
                                <div className="resource-image-icon">
                                    <Icon size={30} />
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

                                <a href="#contact">
                                    Read more
                                    <ArrowRight size={13} />
                                </a>

                            </div>

                        </article>
                    );
                })}

            </div>

        </section>
    );
}

export default ResourcesSection;
