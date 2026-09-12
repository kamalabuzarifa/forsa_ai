import {
    ChevronDown,
} from "lucide-react";

function FAQSection() {
    const faqs = [
        {
            question: "What is EduMatch?",
            answer:
                "EduMatch is a platform that helps students discover scholarships, university programs and educational opportunities based on their academic background, skills, interests and goals.",
        },
        {
            question: "How does EduMatch match me with opportunities?",
            answer:
                "EduMatch analyzes the information in your profile and compares it with opportunity requirements to identify opportunities that are relevant to your background and goals.",
        },
        {
            question: "Does a match mean I am guaranteed to be eligible?",
            answer:
                "No. A match indicates that an opportunity may be relevant to your profile. You should always review the official eligibility requirements, documents and deadlines before applying.",
        },
        {
            question: "What information should I add to my profile?",
            answer:
                "You can add information such as your education, nationality, languages, skills, work experience and other details used to understand your academic profile and interests.",
        },
        {
            question: "Can I track my applications?",
            answer:
                "Yes. Your student dashboard allows you to view your submitted applications and track their current status.",
        },
        {
            question: "Is EduMatch free for students?",
            answer:
                "Students can create an account, build their profile and explore available opportunities through the platform.",
        },
    ];

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
                    Find quick answers about EduMatch, matching,
                    profiles and applications.
                </p>

            </div>

            <div className="faq-list">

                {faqs.map((faq) => (
                    <details
                        className="faq-item"
                        key={faq.question}
                    >
                        <summary>

                            <span className="faq-question">
                                {faq.question}
                            </span>

                            <span className="faq-chevron">
                                <ChevronDown size={18} />
                            </span>

                        </summary>

                        <div className="faq-answer">
                            <p>
                                {faq.answer}
                            </p>
                        </div>

                    </details>
                ))}

            </div>

            <div className="faq-footer">

                <span>
                    Still have questions?
                </span>

                <a href="#contact">
                    Contact us
                </a>

            </div>
        </section>
    );
}

export default FAQSection;
