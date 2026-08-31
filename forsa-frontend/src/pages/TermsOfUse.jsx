import {
    FileText,
    UserCheck,
    AlertCircle,
    Scale,
} from "lucide-react";

import LegalLayout from "../components/layout/LegalLayout";

function TermsOfUse() {
    return (
        <LegalLayout
            icon={FileText}
            label="LEGAL"
            title="Terms of Use"
            description="These terms explain the rules for using EduMatch and the responsibilities that apply when you use our platform."
            lastUpdated="August 2026"
            sections={[
                {
                    id: "acceptance",
                    title: "Acceptance of Terms",
                },
                {
                    id: "account",
                    title: "Your Account",
                },
                {
                    id: "service",
                    title: "Our Service",
                },
                {
                    id: "responsibilities",
                    title: "User Responsibilities",
                },
                {
                    id: "content",
                    title: "User Content",
                },
                {
                    id: "disclaimer",
                    title: "Disclaimer",
                },
                {
                    id: "contact",
                    title: "Contact Us",
                },
            ]}
        >

            <section id="acceptance">

                <div className="legal-section-icon">
                    <Scale size={20} />
                </div>

                <h2>
                    Acceptance of Terms
                </h2>

                <p>
                    By accessing or using EduMatch, you agree
                    to comply with these Terms of Use. If you
                    do not agree with these terms, you should
                    not use the platform.
                </p>

            </section>


            <section id="account">

                <div className="legal-section-icon">
                    <UserCheck size={20} />
                </div>

                <h2>
                    Your Account
                </h2>

                <p>
                    You are responsible for providing accurate
                    information when creating your account and
                    keeping your account credentials secure.
                </p>

                <p>
                    You should not share your password or allow
                    another person to use your account.
                </p>

            </section>


            <section id="service">

                <h2>
                    Our Service
                </h2>

                <p>
                    EduMatch provides a platform for discovering
                    scholarships, study programs and educational
                    opportunities.
                </p>

                <p>
                    Our matching system provides recommendations
                    based on information available in your profile.
                </p>

                <p>
                    A recommendation does not guarantee
                    eligibility, admission, funding or acceptance
                    by an educational institution or scholarship
                    provider.
                </p>

            </section>


            <section id="responsibilities">

                <div className="legal-section-icon">
                    <AlertCircle size={20} />
                </div>

                <h2>
                    User Responsibilities
                </h2>

                <p>
                    When using EduMatch, you agree not to:
                </p>

                <ul>
                    <li>
                        Provide false or misleading information
                    </li>

                    <li>
                        Use the platform for unlawful purposes
                    </li>

                    <li>
                        Attempt to access another user's account
                    </li>

                    <li>
                        Interfere with the operation of the platform
                    </li>

                    <li>
                        Attempt to gain unauthorized access to
                        our systems
                    </li>
                </ul>

            </section>


            <section id="content">

                <h2>
                    User Content
                </h2>

                <p>
                    You remain responsible for the information
                    and content you provide through your account.
                    You should make sure that the information
                    you provide is accurate and does not violate
                    the rights of others.
                </p>

            </section>


            <section id="disclaimer">

                <h2>
                    Disclaimer
                </h2>

                <p>
                    EduMatch provides opportunity information
                    and recommendations for informational
                    purposes. You are responsible for reviewing
                    the official requirements and application
                    instructions of each opportunity before
                    applying.
                </p>

            </section>


            <section id="contact">

                <h2>
                    Contact Us
                </h2>

                <p>
                    If you have questions about these Terms of
                    Use, please contact our support team.
                </p>

                <a
                    href="mailto:support@EduMatch.com"
                    className="legal-email"
                >
                    support@EduMatch.com
                </a>

            </section>

        </LegalLayout>
    );
}

export default TermsOfUse;
