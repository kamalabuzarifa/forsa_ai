import {
    ArrowRight,
    BookOpen,
    Globe2,
    Handshake,
    Users,
} from "lucide-react";

import { Link } from "react-router-dom";

function PartnersSection() {
    const ecosystem = [
        {
            icon: Handshake,
            title: "Education organizations",
            text:
                "Organizations supporting students can use EduMatch to help them discover relevant educational opportunities.",
        },
        {
            icon: Users,
            title: "Student communities",
            text:
                "Communities can give students a simpler way to explore programs, scholarships and opportunities.",
        },
        {
            icon: Globe2,
            title: "Global networks",
            text:
                "EduMatch is designed to make opportunities easier to discover across countries and education systems.",
        },
        {
            icon: BookOpen,
            title: "Academic communities",
            text:
                "Academic organizations can help students connect their educational goals with suitable programs.",
        },
    ];

    return (
        <section
            className="partners-section"
            id="ecosystem"
        >
            <div className="section-heading">

                <span className="section-label">
                    EDUMATCH ECOSYSTEM
                </span>

                <h2>
                    Education works better
                    <span>when everyone is connected</span>
                </h2>

                <p>
                    EduMatch is built to bring students, universities,
                    educational organizations and academic communities
                    closer together through one discovery platform.
                </p>

            </div>

            <div className="partners-grid">

                {ecosystem.map((item) => {
                    const Icon = item.icon;

                    return (
                        <article
                            className="partner-card"
                            key={item.title}
                        >
                            <div className="partner-icon">
                                <Icon
                                    size={23}
                                    strokeWidth={1.8}
                                />
                            </div>

                            <h3>
                                {item.title}
                            </h3>

                            <p>
                                {item.text}
                            </p>

                            <Link
                                to="#contact"
                                className="partner-link"
                            >
                                Learn more
                                <ArrowRight size={14} />
                            </Link>
                        </article>
                    );
                })}

            </div>

            <div className="partners-bottom">

                <div className="partners-bottom-content">

                    <div className="partners-bottom-icon">
                        <Globe2 size={18} />
                    </div>

                    <div>
                        <strong>
                            Built for a connected education ecosystem
                        </strong>

                        <span>
                            Students discover. Institutions connect.
                            Opportunities move forward.
                        </span>
                    </div>

                </div>

                <Link
                    to="#contact"
                    className="partners-bottom-link"
                >
                    Partner with EduMatch
                    <ArrowRight size={15} />
                </Link>

            </div>
        </section>
    );
}

export default PartnersSection;
