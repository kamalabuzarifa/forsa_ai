import {
    ArrowRight,
    Brain,
    Check,
    Sparkles,
    Target,
} from "lucide-react";

import { Link } from "react-router-dom";

function AISection() {
    return (
        <section
            className="ai-section"
            id="ai-matching"
        >
            <div className="ai-glow" />

            <div className="ai-section-inner">

                <div className="ai-section-content">

                    <div className="ai-icon-large">
                        <Sparkles size={27} />
                    </div>

                    <span className="section-label">
                        AI-POWERED MATCHING
                    </span>

                    <h2>
                        Less searching.
                        <span>
                            Better matches.
                        </span>
                    </h2>

                    <p>
                        EduMatch analyzes the information in your
                        profile and compares it with opportunity
                        requirements to help you find better matches.
                    </p>

                    <Link
                        to="/register"
                        className="ai-button"
                    >
                        Build your profile
                        <ArrowRight size={18} />
                    </Link>

                </div>

                <div className="ai-visual">

                    <div className="ai-profile-card">

                        <div className="ai-card-header">

                            <div className="ai-card-avatar">
                                <Target size={17} />
                            </div>

                            <div>
                                <strong>
                                    Your profile
                                </strong>

                                <span>
                                    Matching factors
                                </span>
                            </div>

                        </div>

                        <div className="ai-profile-items">

                            <div>
                                <span>
                                    Education
                                </span>

                                <strong>
                                    Education
                                </strong>
                            </div>

                            <div>
                                <span>
                                    Skills
                                </span>

                                <strong>
                                    Skills
                                </strong>
                            </div>

                            <div>
                                <span>
                                    Eligibility
                                </span>

                                <strong>
                                    Eligibility
                                </strong>
                            </div>

                            <div>
                                <span>
                                    Goals
                                </span>

                                <strong>
                                    Goals
                                </strong>
                            </div>

                        </div>

                    </div>

                    <div className="ai-connection">

                        <div className="ai-connection-line" />

                        <div className="ai-connection-icon">
                            <Brain size={19} />
                        </div>

                        <span>
                            AI matching
                        </span>

                    </div>

                    <div className="ai-result-card">

                        <div className="ai-result-header">

                            <div className="ai-result-icon">
                                <Sparkles size={17} />
                            </div>

                            <div>
                                <strong>
                                    Recommended opportunity
                                </strong>

                                <span>
                                    Based on your profile
                                </span>
                            </div>

                        </div>

                        <div className="ai-result-title">
                            A recommendation shaped by your goals
                        </div>

                        <div className="ai-result-match">

                            <div className="ai-result-score">
                                <strong>
                                    Review fit
                                </strong>

                                <span>
                                    Before you apply
                                </span>
                            </div>

                            <div className="ai-result-progress">
                                <span />
                            </div>

                        </div>

                        <div className="ai-result-reasons">

                            <span>
                                <Check size={13} />
                                Education
                            </span>

                            <span>
                                <Check size={13} />
                                Skills
                            </span>

                            <span>
                                <Check size={13} />
                                Requirements
                            </span>

                        </div>

                    </div>

                </div>

            </div>
        </section>
    );
}

export default AISection;
