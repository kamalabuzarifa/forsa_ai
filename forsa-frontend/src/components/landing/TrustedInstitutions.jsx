import {
    Building2,
    GraduationCap,
    Globe2,
    University,
} from "lucide-react";

function TrustedInstitutions() {
    const institutions = [
        {
            name: "University Partner",
            icon: University,
        },
        {
            name: "Global Education",
            icon: GraduationCap,
        },
        {
            name: "International Institute",
            icon: Building2,
        },
        {
            name: "Global University",
            icon: Globe2,
        },
        {
            name: "Academic Partner",
            icon: University,
        },
        {
            name: "Education Network",
            icon: GraduationCap,
        },
    ];

    return (
        <section className="trusted-section" id="institutions">

            <div className="trusted-heading">
                <span className="section-label">
                    OUR NETWORK
                </span>

                <h2>
                    Trusted by institutions
                    <span>around the world</span>
                </h2>

                <p>
                    EduMatch connects students with universities and
                    educational institutions through a platform built
                    around better matching and smarter discovery.
                </p>
            </div>

            <div className="trusted-grid">
                {institutions.map((institution, index) => {
                    const Icon = institution.icon;

                    return (
                        <div
                            className="trusted-institution"
                            key={index}
                        >
                            <div className="trusted-icon">
                                <Icon size={25} strokeWidth={1.7} />
                            </div>

                            <span>
                                {institution.name}
                            </span>
                        </div>
                    );
                })}
            </div>

        </section>
    );
}

export default TrustedInstitutions;
