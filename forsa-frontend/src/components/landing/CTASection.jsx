import {
    ArrowRight,
    Sparkles,
} from "lucide-react";

import { Link } from "react-router-dom";

function CTASection() {
    return (
        <section
            className="cta-section"
            id="get-started"
        >
            <div className="cta-content">

                <div className="cta-icon">
                    <Sparkles size={25} />
                </div>

                <div className="cta-text">

                    <span className="section-label">
                        GET STARTED
                    </span>

                    <h2>
                        Your next opportunity
                        <span>could start here.</span>
                    </h2>

                    <p>
                        Build your profile, discover relevant opportunities,
                        and take the next step with EduMatch.
                    </p>

                </div>

            </div>

            <div className="cta-actions">

                <Link
                    to="/register"
                    className="cta-button"
                >
                    Create your profile
                    <ArrowRight size={18} />
                </Link>

                <Link
                    to="/student/explore"
                    className="cta-secondary"
                >
                    Explore opportunities
                </Link>

            </div>
        </section>
    );
}

export default CTASection;
