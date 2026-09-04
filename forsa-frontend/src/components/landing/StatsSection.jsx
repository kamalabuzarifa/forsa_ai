import {
    GraduationCap,
    Globe2,
    Target,
    Users,
} from "lucide-react";

function StatsSection() {
    return (
        <section className="stats-section">

            <div className="stats-grid">

                <div className="stat-item">

                    <div className="stat-icon">
                        <GraduationCap size={22} />
                    </div>

                    <div>
                        <strong>1,000+</strong>
                        <span>Opportunities</span>
                    </div>

                </div>


                <div className="stat-item">

                    <div className="stat-icon">
                        <Globe2 size={22} />
                    </div>

                    <div>
                        <strong>50+</strong>
                        <span>Countries</span>
                    </div>

                </div>


                <div className="stat-item">

                    <div className="stat-icon">
                        <Users size={22} />
                    </div>

                    <div>
                        <strong>5,000+</strong>
                        <span>Students</span>
                    </div>

                </div>


                <div className="stat-item">

                    <div className="stat-icon">
                        <Target size={22} />
                    </div>

                    <div>
                        <strong>AI</strong>
                        <span>Personalized Matching</span>
                    </div>

                </div>

            </div>

        </section>
    );
}

export default StatsSection;
