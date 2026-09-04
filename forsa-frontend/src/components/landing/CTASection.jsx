import {
    ArrowRight,
    BookOpen,
} from "lucide-react";

import { Link } from "react-router-dom";

function CTASection() {
    return (
        <section className="cta-section">

            <div className="cta-content">

                <div className="cta-icon">
                    <BookOpen size={27} />
                </div>


                <div>

                    <span className="section-label">
                        GET STARTED
                    </span>

                    <h2>
                        Ready to find your next opportunity?
                    </h2>

                    <p>
                        Create your profile and let EduMatch
                        help you discover opportunities that fit you.
                    </p>

                </div>

            </div>


            <Link
                to="/register"
                className="cta-button"
            >
                Create Free Account
                <ArrowRight size={18} />
            </Link>

        </section>
    );
}

export default CTASection;
