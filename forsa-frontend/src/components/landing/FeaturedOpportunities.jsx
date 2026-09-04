import {
    ArrowRight,
    ChevronRight,
    Globe2,
} from "lucide-react";

import { Link } from "react-router-dom";

function FeaturedOpportunities() {
    return (
        <section className="featured-section">

            <div className="featured-heading">

                <div>

                    <span className="section-label">
                        EXPLORE
                    </span>

                    <h2>
                        Featured Opportunities
                    </h2>

                    <div className="heading-line" />

                    <p>
                        Discover opportunities that may fit your profile.
                    </p>

                </div>


                <Link
                    to="/student/opportunities"
                    className="featured-button"
                >
                    View All Opportunities
                    <ArrowRight size={18} />
                </Link>

            </div>


            <div className="opportunity-preview">

                <article className="preview-card">

                    <div className="preview-amount">
                        Full Funding
                    </div>

                    <div className="preview-image preview-image-one" />

                    <div className="preview-content">

                        <span className="preview-category">
                            Master's Degree
                        </span>

                        <h3>
                            Master's Scholarship
                        </h3>

                        <p>
                            International University
                        </p>


                        <div className="preview-footer">

                            <span>
                                <Globe2 size={14} />
                                International
                            </span>

                            <ChevronRight size={17} />

                        </div>

                    </div>

                </article>


                <article className="preview-card">

                    <div className="preview-amount">
                        Scholarship
                    </div>

                    <div className="preview-image preview-image-two" />

                    <div className="preview-content">

                        <span className="preview-category">
                            Graduate Study
                        </span>

                        <h3>
                            Graduate Study Opportunity
                        </h3>

                        <p>
                            Study Abroad
                        </p>


                        <div className="preview-footer">

                            <span>
                                <Globe2 size={14} />
                                International
                            </span>

                            <ChevronRight size={17} />

                        </div>

                    </div>

                </article>


                <article className="preview-card">

                    <div className="preview-amount">
                        Fully Funded
                    </div>

                    <div className="preview-image preview-image-three" />

                    <div className="preview-content">

                        <span className="preview-category">
                            Computer Science
                        </span>

                        <h3>
                            AI & Computer Science
                        </h3>

                        <p>
                            International Program
                        </p>


                        <div className="preview-footer">

                            <span>
                                <Globe2 size={14} />
                                International
                            </span>

                            <ChevronRight size={17} />

                        </div>

                    </div>

                </article>

            </div>

        </section>
    );
}

export default FeaturedOpportunities;
