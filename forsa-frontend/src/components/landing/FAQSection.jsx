import {
    ChevronDown,
} from "lucide-react";

function FAQSection() {
    return (
        <section
            className="faq-section"
            id="faq"
        >

            <div className="section-heading">

                <span className="section-label">
                    FAQ
                </span>

                <h2>
                    Questions students ask
                </h2>

                <p>
                    Everything you need to know before getting started.
                </p>

            </div>


            <div className="faq-list">

                <details className="faq-item">

                    <summary>
                        What is EduMatch?

                        <span className="faq-chevron">
                            <ChevronDown size={18} />
                        </span>
                    </summary>

                    <p>
                        EduMatch is a platform that helps students
                        discover scholarships, study programs and
                        educational opportunities based on their profile.
                    </p>

                </details>


                <details className="faq-item">

                    <summary>
                        How does the AI matching work?

                        <span className="faq-chevron">
                            <ChevronDown size={18} />
                        </span>
                    </summary>

                    <p>
                        The system analyzes information in your
                        profile and compares it with opportunity
                        requirements to identify suitable matches.
                    </p>

                </details>


                <details className="faq-item">

                    <summary>
                        Is EduMatch free for students?

                        <span className="faq-chevron">
                            <ChevronDown size={18} />
                        </span>
                    </summary>

                    <p>
                        Yes. Students can create an account,
                        complete their profile and explore
                        available opportunities.
                    </p>

                </details>


                <details className="faq-item">

                    <summary>
                        What information should I add?

                        <span className="faq-chevron">
                            <ChevronDown size={18} />
                        </span>
                    </summary>

                    <p>
                        Add your academic information, skills,
                        languages, work experience and other
                        information requested by your profile.
                    </p>

                </details>


                <details className="faq-item">

                    <summary>
                        Can I track my applications?

                        <span className="faq-chevron">
                            <ChevronDown size={18} />
                        </span>
                    </summary>

                    <p>
                        Yes. After applying, you can use your
                        student dashboard to view and track
                        your application status.
                    </p>

                </details>

            </div>

        </section>
    );
}

export default FAQSection;
