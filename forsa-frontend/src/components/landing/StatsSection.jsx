import {
    Globe2,
    GraduationCap,
    Sparkles,
    Target,
} from "lucide-react";

function StatsSection() {
    const stats = [
        {
            icon: GraduationCap,
            value: "Scholarships",
            label: "Discover funding options",
        },
        {
            icon: Globe2,
            value: "Programs",
            label: "Compare study paths",
        },
        {
            icon: Target,
            value: "Your profile",
            label: "Use your real context",
        },
        {
            icon: Sparkles,
            value: "Clearer next steps",
            label: "Move from search to action",
        },
    ];

    return (
        <section className="stats-section">
            <div className="stats-container">

                <div className="stats-intro">
                    <span>
                        <Sparkles size={14} />
                        Built for your next step
                    </span>

                    <p>
                        Everything you need to discover opportunities
                        that fit your profile.
                    </p>
                </div>

                <div className="stats-grid">

                    {stats.map((stat) => {
                        const Icon = stat.icon;

                        return (
                            <div
                                className="stat-item"
                                key={stat.label}
                            >
                                <div className="stat-icon">
                                    <Icon size={21} />
                                </div>

                                <div className="stat-content">
                                    <strong>
                                        {stat.value}
                                    </strong>

                                    <span>
                                        {stat.label}
                                    </span>
                                </div>
                            </div>
                        );
                    })}

                </div>

            </div>
        </section>
    );
}

export default StatsSection;
