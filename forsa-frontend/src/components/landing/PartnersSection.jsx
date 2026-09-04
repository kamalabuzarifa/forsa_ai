import {
    Handshake,
    Users,
    Globe2,
    BookOpen,
} from "lucide-react";

function PartnersSection() {
    const partners = [
        {
            icon: Handshake,
            title: "Education Partners",
            text: "Working with organisations that support students and institutions.",
        },
        {
            icon: Users,
            title: "Student Communities",
            text: "Building connections with communities that help students plan their future.",
        },
        {
            icon: Globe2,
            title: "Global Networks",
            text: "Connecting education opportunities across countries and regions.",
        },
        {
            icon: BookOpen,
            title: "Academic Networks",
            text: "Supporting institutions and academic communities through technology.",
        },
    ];

    return (
        <section className="partners-section">

            <div className="section-heading">

                <span className="section-label">
                    OUR PARTNERS
                </span>

                <h2>
                    Building an education
                    <span>network together</span>
                </h2>

                <p>
                    We collaborate with educational organisations,
                    universities, communities, and academic networks
                    to make education discovery easier.
                </p>

            </div>

            <div className="partners-grid">

                {partners.map((partner, index) => {
                    const Icon = partner.icon;

                    return (
                        <div
                            className="partner-card"
                            key={index}
                        >
                            <div className="partner-icon">
                                <Icon size={23} />
                            </div>

                            <h3>
                                {partner.title}
                            </h3>

                            <p>
                                {partner.text}
                            </p>

                            <a href="#contact">
                                Meet our partners
                            </a>
                        </div>
                    );
                })}

            </div>

        </section>
    );
}

export default PartnersSection;
