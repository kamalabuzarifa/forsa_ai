import {
    ArrowRight,
    Brain,
    Check,
    GraduationCap,
    Sparkles,
    Target,
} from "lucide-react";

import { Link } from "react-router-dom";

function HeroSection() {
    const handleHeroSubmit = (event) => {
        event.preventDefault();

        const form = event.currentTarget;
        const email = form.email.value.trim();

        if (!email) {
            return;
        }

        window.location.href =
            `/register?email=${encodeURIComponent(email)}`;
    };

    return (
        <section
            className="hero-section"
            id="home"
        >
            <div className="hero-content">

                <div className="hero-badge">
                    <Sparkles size={15} />

                    <span>
                        AI-powered opportunity matching
                    </span>
                </div>

                <h1>
                    Find opportunities
                    <span>made for you</span>
                </h1>

                <p className="hero-description">
                    Discover scholarships, university programs,
                    and educational opportunities matched to your
                    academic background, skills, interests, and goals.
                </p>

                <form
                    className="hero-search"
                    onSubmit={handleHeroSubmit}
                >
                    <input
                        type="email"
                        name="email"
                        placeholder="Enter your email to get started"
                        aria-label="Email address"
                        required
                    />

                    <button
                        type="submit"
                        className="hero-search-button"
                        aria-label="Get started"
                    >
                        <ArrowRight size={21} />
                    </button>
                </form>

                <div className="hero-features">

                    <span>
                        <Check size={15} />
                        Free to get started
                    </span>

                    <span>
                        <Check size={15} />
                        Personalized matches
                    </span>

                    <span>
                        <Check size={15} />
                        Global opportunities
                    </span>

                </div>

                <div className="hero-actions">

                    <Link
                        to="/student/explore"
                        className="hero-secondary-link"
                    >
                        Explore opportunities
                        <ArrowRight size={16} />
                    </Link>

                </div>

            </div>

            <div className="hero-visual">

                <div className="hero-image-decoration hero-image-decoration-back" />

                <div className="hero-image-decoration hero-image-decoration-front" />

                <div className="hero-image-wrapper">

                    <img
                        src="/images/hero-student.jpeg"
                        alt="Student celebrating graduation"
                        className="hero-image"
                    />

                    <div className="hero-image-overlay" />

                </div>

                <div className="floating-card floating-card-top">

                    <div className="floating-card-icon">
                        <Brain size={17} />
                    </div>

                    <div className="floating-card-content">

                        <strong>
                            Smart Matching
                        </strong>

                        <p>
                            Built around your profile
                        </p>

                    </div>

                    <div className="floating-card-status">
                        <span />
                    </div>

                </div>

                <div className="floating-card floating-card-bottom">

                    <div className="floating-card-icon">
                        <Target size={17} />
                    </div>

                    <div className="floating-card-content">

                        <strong>
                            Profile fit
                        </strong>

                        <p>
                            Compare your profile with requirements
                        </p>

                    </div>

                </div>

                <div className="hero-opportunity-card">

                    <div className="hero-opportunity-header">

                        <div className="hero-opportunity-icon">
                            <GraduationCap size={17} />
                        </div>

                        <div className="hero-opportunity-title">

                            <strong>
                                MSc Artificial Intelligence
                            </strong>

                            <span>
                                University Program
                            </span>

                        </div>

                    </div>

                    <div className="hero-opportunity-match">

                        <div className="hero-opportunity-score">
                            <strong>
                                Match signals
                            </strong>

                            <span>
                                Based on your profile
                            </span>
                        </div>

                        <div className="hero-score-progress">
                            <span />
                        </div>

                    </div>

                    <div className="hero-opportunity-reasons">

                        <span>
                            <Check size={12} />
                            Academic fit
                        </span>

                        <span>
                            <Check size={12} />
                            Skills match
                        </span>

                        <span>
                            <Check size={12} />
                            Eligible
                        </span>

                    </div>

                </div>

                <div className="hero-ai-badge">

                    <div className="hero-ai-icon">
                        <Sparkles size={14} />
                    </div>

                    <div>
                        <strong>
                            AI Recommendation
                        </strong>

                        <span>
                            Personalized for you
                        </span>
                    </div>

                </div>

            </div>
        </section>
    );
}

export default HeroSection;
