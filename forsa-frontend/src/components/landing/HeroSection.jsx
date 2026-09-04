import {
    ArrowRight,
    Brain,
    Check,
    Sparkles,
    Star,
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

                    <span>
                        made for you
                    </span>
                </h1>


                <p className="hero-description">
                    EduMatch helps students discover scholarships,
                    study programs and educational opportunities
                    that match their education, skills and goals.
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
                        Free to use
                    </span>

                    <span>
                        <Check size={15} />
                        Personalized matching
                    </span>

                    <span>
                        <Check size={15} />
                        Global opportunities
                    </span>

                </div>


                <div className="hero-trust">

                    <div className="trust-avatars">

                        <span>K</span>
                        <span>A</span>
                        <span>M</span>
                        <span>+</span>

                    </div>


                    <div>

                        <div className="trust-stars">

                            {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                    key={star}
                                    size={12}
                                    fill="currentColor"
                                />
                            ))}

                        </div>


                        <p>
                            Built for students searching for
                            their next opportunity
                        </p>

                    </div>

                </div>

            </div>


            <div className="hero-visual">

                <div className="image-decoration image-decoration-back" />

                <div className="image-decoration image-decoration-front" />


                <div className="hero-image-wrapper">

                    <img
                        src="/images/hero-student.jpeg"
                        alt="Student celebrating graduation"
                        className="hero-image"
                    />

                </div>


                <div className="floating-card floating-card-top">

                    <div className="avatar avatar-one">
                        <Brain size={16} />
                    </div>

                    <div>

                        <strong>
                            Smart Matching
                        </strong>

                        <p>
                            Opportunities selected for you
                        </p>

                    </div>

                </div>


                <div className="floating-card floating-card-bottom">

                    <div className="avatar avatar-two">
                        <Target size={16} />
                    </div>

                    <div>

                        <strong>
                            AI Match
                        </strong>

                        <p>
                            Based on your profile
                        </p>

                    </div>

                </div>


                <div className="hero-match-card">

                    <div className="hero-match-header">

                        <div className="mini-icon">
                            <Sparkles size={14} />
                        </div>

                        <div>

                            <strong>
                                AI Match
                            </strong>

                            <span>
                                Personalized recommendation
                            </span>

                        </div>

                    </div>


                    <div className="hero-match-score">

                        <strong>
                            92%
                        </strong>

                        <div className="hero-score-bar">
                            <span />
                        </div>

                    </div>

                </div>

            </div>

        </section>
    );
}


export default HeroSection;
