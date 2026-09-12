import {
    ArrowRight,
    Check,
    ClipboardList,
    Compass,
    Sparkles,
} from "lucide-react";

import { Link } from "react-router-dom";

function WhyEduMatch() {
    const benefits = [
        "One profile for your education, skills, languages and goals",
        "Opportunity details organized around the decisions that matter",
        "Clearer next steps without promises of admission or eligibility",
    ];

    return (
        <section className="why-section" id="why-edumatch">
            <div className="why-content">
                <span className="section-label">WHY EDUMATCH</span>

                <h2>
                    Search with context.
                    <span>Choose with confidence.</span>
                </h2>

                <p className="why-description">
                    EduMatch brings the parts of your academic journey together
                    so you can spend less time sorting through disconnected
                    listings and more time understanding what fits.
                </p>

                <div className="why-list">
                    {benefits.map((benefit) => (
                        <div className="why-item" key={benefit}>
                            <div className="why-item-icon">
                                <Check size={17} />
                            </div>
                            <p>{benefit}</p>
                        </div>
                    ))}
                </div>

                <Link to="/register" className="why-button">
                    Create your profile
                    <ArrowRight size={16} />
                </Link>
            </div>

            <div className="why-visual" aria-label="Illustration of profile matching flow">
                <span className="why-visual-label">
                    <Sparkles size={13} />
                    A clearer discovery flow
                </span>

                <div className="why-card-main">
                    <div className="why-card-header">
                        <div className="why-card-icon">
                            <ClipboardList size={21} />
                        </div>
                        <div className="why-card-title">
                            <strong>Your profile</strong>
                            <span>Signals you choose to share</span>
                        </div>
                    </div>

                    <div className="match-info">
                        <div><Check size={14} /> Education and experience</div>
                        <div><Check size={14} /> Skills and languages</div>
                        <div><Check size={14} /> Interests and goals</div>
                    </div>

                    <div className="why-card-footer">
                        <span>Profile context</span>
                        <Compass size={15} />
                    </div>
                </div>

                <div className="why-floating-card">
                    <div className="why-floating-icon">
                        <Sparkles size={16} />
                    </div>
                    <div className="why-floating-content">
                        <strong>Recommended opportunity</strong>
                        <span>Review the requirements and details</span>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default WhyEduMatch;
