import {
    HeartHandshake,
    Globe2,
    GraduationCap,
    ArrowRight,
} from "lucide-react";

function BeyondEduMatch() {
    return (
        <section className="beyond-section">

            <div className="beyond-content">

                <span className="section-label">
                    BEYOND EDUMATCH
                </span>

                <h2>
                    Education should be
                    <span>accessible to everyone.</span>
                </h2>

                <p>
                    EduMatch is built around the idea that students
                    should have access to clear information about
                    their education options regardless of where
                    they come from.
                </p>

                <p>
                    We use technology, data, and AI to reduce the
                    complexity of finding the right programme and
                    help students make decisions based on their
                    goals and preferences.
                </p>

                <a
                    href="#contact"
                    className="beyond-button"
                >
                    Learn more
                    <ArrowRight size={14} />
                </a>

            </div>

            <div className="beyond-visual">

                <div className="beyond-main-card">

                    <div className="beyond-card-icon">
                        <HeartHandshake size={27} />
                    </div>

                    <h3>
                        Better access to education
                    </h3>

                    <p>
                        Connecting students with opportunities
                        that fit their academic journey.
                    </p>

                    <div className="beyond-card-items">

                        <div>
                            <Globe2 size={17} />
                            <span>
                                Global opportunities
                            </span>
                        </div>

                        <div>
                            <GraduationCap size={17} />
                            <span>
                                Student-focused discovery
                            </span>
                        </div>

                    </div>

                </div>

                <div className="beyond-floating-card">
                    <strong>
                        Education for everyone
                    </strong>

                    <span>
                        Discover. Match. Apply.
                    </span>
                </div>

            </div>

        </section>
    );
}

export default BeyondEduMatch;
