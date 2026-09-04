import {
    ArrowRight,
    Sparkles,
} from "lucide-react";

import { Link } from "react-router-dom";


function AISection() {
    return (
        <section className="ai-section">

            <div className="ai-glow" />

            <div className="ai-section-inner">

                <div className="ai-icon-large">
                    <Sparkles size={29} />
                </div>


                <span className="section-label">
                    POWERED BY AI
                </span>


                <h2>
                    Your profile.

                    <span>
                        Your goals. Your opportunities.
                    </span>
                </h2>


                <p>
                    EduMatch uses your profile information to
                    help you discover opportunities aligned with
                    your academic background and goals.
                </p>


                <Link
                    to="/register"
                    className="ai-button"
                >
                    Get Started

                    <ArrowRight size={18} />
                </Link>

            </div>

        </section>
    );
}


export default AISection;
