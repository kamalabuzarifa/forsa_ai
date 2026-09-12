import {
    ArrowRight,
    CalendarDays,
    ChevronRight,
    Globe2,
} from "lucide-react";

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getOpportunities } from "../../api/opportunities";

const getOpportunityList = (response) => {
    if (Array.isArray(response)) return response;

    return response?.data ?? response?.opportunities ?? [];
};

const getValue = (value, fallback = "Not specified") => {
    if (!value) return fallback;
    if (typeof value === "object") return value.name ?? value.title ?? fallback;
    return value;
};

const getOpportunityId = (opportunity) =>
    opportunity?.id ?? opportunity?.opportunity_id;

function FeaturedOpportunities() {
    const [opportunities, setOpportunities] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let active = true;

        getOpportunities({ per_page: 3 })
            .then((response) => {
                if (active) setOpportunities(getOpportunityList(response).slice(0, 3));
            })
            .catch(() => {
                if (active) setOpportunities([]);
            })
            .finally(() => {
                if (active) setLoading(false);
            });

        return () => {
            active = false;
        };
    }, []);

    return (
        <section
            className="featured-section"
            id="opportunities"
        >
            <div className="featured-heading">

                <div className="featured-heading-content">

                    <span className="section-label">EXPLORE OPPORTUNITIES</span>

                    <h2>
                        Opportunities worth
                        <span> discovering</span>
                    </h2>

                    <p>
                        Explore scholarships, university programs and
                        educational opportunities that can match your goals.
                    </p>

                </div>

                <Link
                    to="/student/explore"
                    className="featured-button"
                >
                    Explore all opportunities
                    <ArrowRight size={18} />
                </Link>

            </div>

            <div className="opportunity-preview">

                {loading && <div className="opportunity-state">Loading current opportunities...</div>}

                {!loading && opportunities.length === 0 && (
                    <div className="opportunity-state">
                        Explore the full opportunity directory to find programs and scholarships.
                    </div>
                )}

                {opportunities.map((opportunity) => {
                    const id = getOpportunityId(opportunity);

                    return (
                        <Link
                            className="preview-card"
                            key={id}
                            to={id ? `/student/opportunities/${id}` : "/student/opportunities"}
                        >
                            <div className="preview-card-top">

                                <span className="preview-funding">
                                    {getValue(opportunity.funding_type ?? opportunity.funding)}
                                </span>

                            </div>

                            <div className="preview-content">

                                <span className="preview-category">
                                    {getValue(opportunity.opportunity_type ?? opportunity.type)}
                                </span>

                                <h3>
                                    {getValue(opportunity.title ?? opportunity.name, "Opportunity")}
                                </h3>

                                <p className="preview-university">
                                    {getValue(opportunity.university ?? opportunity.institution)}
                                </p>

                                <div className="preview-meta">

                                    <span>
                                        <Globe2 size={14} />
                                        {getValue(opportunity.country ?? opportunity.location)}
                                    </span>

                                    <span>
                                        <CalendarDays size={14} />
                                        {getValue(opportunity.deadline)}
                                    </span>

                                </div>

                                <div className="preview-footer">

                                    <span>
                                        View opportunity
                                    </span>

                                    <ChevronRight size={17} />

                                </div>

                            </div>
                        </Link>
                    );
                })}

            </div>

            <div className="featured-bottom">

                <div className="featured-bottom-content">

                    <div>
                        <strong>
                            Personalized recommendations
                        </strong>

                        <span>
                            Create your profile to see opportunities
                            matched to your background.
                        </span>
                    </div>

                </div>

                <Link
                    to="/register"
                    className="featured-bottom-link"
                >
                    Create your profile
                    <ArrowRight size={16} />
                </Link>

            </div>
        </section>
    );
}

export default FeaturedOpportunities;
