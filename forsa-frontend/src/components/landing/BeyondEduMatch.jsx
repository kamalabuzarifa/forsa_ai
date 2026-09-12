import {
    ArrowRight,
    Globe2,
    HeartHandshake,
    Sparkles,
} from "lucide-react";

import { Link } from "react-router-dom";

function BeyondEduMatch() {
    return (
        <section
            className="beyond-section"
            id="vision"
        >
            <div className="beyond-content">

                <span className="section-label">
                    OUR VISION
                </span>

                <h2>
                    Make the journey
                    <span>to education simpler.</span>
                </h2>

                <p>
                    Choosing what to study and where to study can be
                    overwhelming. Information is often spread across
                    different platforms, requirements vary, and finding
                    the right opportunity takes time.
                </p>

                <p>
                    EduMatch brings this journey together in one place,
                    helping students understand their options, discover
                    relevant opportunities, and make more informed decisions.
                </p>

                <Link
                    to="/student/explore"
                    className="beyond-button"
                >
                    Explore EduMatch
                    <ArrowRight size={15} />
                </Link>

            </div>

            <div className="beyond-visual">

                <div className="beyond-main-card">

                    <div className="beyond-card-top">

                        <div className="beyond-card-icon">
                            <HeartHandshake size={26} />
                        </div>

                        <div className="beyond-card-badge">
                            <Sparkles size={13} />
                            Student-first
                        </div>

                    </div>

                    <h3>
                        A simpler path to your next opportunity
                    </h3>

                    <p>
                        Discover opportunities based on your profile,
                        interests and academic goals.
                    </p>

                    <div className="beyond-card-items">

                        <div>
                            <Globe2 size={17} />

                            <div>
                                <strong>
                                    Explore
                                </strong>

                                <span>
                                    Discover programs and opportunities
                                </span>
                            </div>
                        </div>

                        <div>
                            <Sparkles size={17} />

                            <div>
                                <strong>
                                    Match
                                </strong>

                                <span>
                                    Find opportunities aligned with you
                                </span>
                            </div>
                        </div>

                    </div>

                </div>

                <div className="beyond-floating-card">

                    <strong>
                        Your journey starts here
                    </strong>

                    <span>
                        Explore. Match. Move forward.
                    </span>

                </div>

            </div>
        </section>
    );
}

export default BeyondEduMatch;
