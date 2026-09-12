import {
    Building2,
    CheckCircle2,
    Globe2,
    GraduationCap,
    University,
} from "lucide-react";

function TrustedInstitutions() {
    const features = [
        {
            icon: University,
            title: "Universities",
            description:
                "Present programs and academic opportunities to students looking for their next step.",
        },
        {
            icon: GraduationCap,
            title: "Education providers",
            description:
                "Make courses, programs and educational opportunities easier to discover.",
        },
        {
            icon: Globe2,
            title: "Global reach",
            description:
                "Connect your opportunities with students exploring study options worldwide.",
        },
        {
            icon: Building2,
            title: "Institutions",
            description:
                "Build a clear digital presence for your programs and opportunities.",
        },
    ];

    return (
        <section
            className="trusted-section"
            id="institution-network"
        >
            <div className="trusted-heading">

                <span className="section-label">
                    BUILT FOR EDUCATION
                </span>

                <h2>
                    A better way to
                    <span>connect education with students</span>
                </h2>

                <p>
                    EduMatch gives educational institutions a dedicated
                    place to showcase their programs and helps students
                    discover opportunities that fit their goals.
                </p>

            </div>

            <div className="trusted-grid">

                {features.map((feature) => {
                    const Icon = feature.icon;

                    return (
                        <div
                            className="trusted-institution"
                            key={feature.title}
                        >
                            <div className="trusted-icon">
                                <Icon
                                    size={24}
                                    strokeWidth={1.8}
                                />
                            </div>

                            <div className="trusted-content">

                                <h3>
                                    {feature.title}
                                </h3>

                                <p>
                                    {feature.description}
                                </p>

                            </div>

                            <CheckCircle2
                                className="trusted-check"
                                size={17}
                            />

                        </div>
                    );
                })}

            </div>

            <div className="trusted-bottom">

                <div className="trusted-bottom-icon">
                    <Globe2 size={18} />
                </div>

                <div>
                    <strong>
                        Designed for a global education ecosystem
                    </strong>

                    <span>
                        One platform for students, universities and
                        educational institutions.
                    </span>
                </div>

            </div>
        </section>
    );
}

export default TrustedInstitutions;
