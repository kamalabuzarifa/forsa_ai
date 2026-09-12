import {
    ArrowRight,
    Brain,
    FileCheck,
    GraduationCap,
} from "lucide-react";

import { Link } from "react-router-dom";

function HowItWorks() {
    const steps = [
        {
            number: "01",
            icon: FileCheck,
            title: "Build your profile",
            description:
                "Tell EduMatch about your education, skills, languages, experience and goals.",
            link: "/register",
            linkText: "Create your profile",
        },
        {
            number: "02",
            icon: Brain,
            title: "Get matched",
            description:
                "Our matching system compares your profile with opportunities and highlights the ones that fit you.",
            link: "/student/explore",
            linkText: "Explore matches",
        },
        {
            number: "03",
            icon: GraduationCap,
            title: "Apply with confidence",
            description:
                "Review eligibility, requirements, funding and deadlines before you apply.",
            link: "/student/opportunities",
            linkText: "Explore opportunities",
        },
    ];

    return (
        <section
            className="how-section"
            id="how-it-works"
        >
            <div className="section-heading">

                <span className="section-label">
                    HOW IT WORKS
                </span>

                <h2>
                    Your path to the right opportunity
                </h2>

                <p>
                    EduMatch turns your profile into personalized
                    opportunities you can explore and apply for.
                </p>

            </div>

            <div className="steps-wrapper">

                <div className="steps-line" />

                <div className="steps-grid">

                    {steps.map((step) => {
                        const Icon = step.icon;

                        return (
                            <article
                                className="step-card"
                                key={step.number}
                            >
                                <div className="step-top">

                                    <span className="step-number">
                                        {step.number}
                                    </span>

                                    <div className="step-icon">
                                        <Icon size={24} />
                                    </div>

                                </div>

                                <h3>
                                    {step.title}
                                </h3>

                                <p>
                                    {step.description}
                                </p>

                                <Link
                                    to={step.link}
                                    className="step-link"
                                >
                                    {step.linkText}

                                    <ArrowRight size={15} />
                                </Link>

                            </article>
                        );
                    })}

                </div>

            </div>

            <div className="how-bottom">

                <div className="how-bottom-content">

                    <Brain size={18} />

                    <span>
                        Your profile powers every recommendation
                    </span>

                </div>

                <Link
                    to="/register"
                    className="how-bottom-link"
                >
                    Get started
                    <ArrowRight size={16} />
                </Link>

            </div>

        </section>
    );
}

export default HowItWorks;
