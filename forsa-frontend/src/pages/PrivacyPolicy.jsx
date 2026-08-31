import {
    ShieldCheck,
    Lock,
    Database,
    UserCheck,
    Eye,
    FileText,
} from "lucide-react";

import LegalLayout from "../components/layout/LegalLayout";

function PrivacyPolicy() {
    return (
        <LegalLayout
            icon={ShieldCheck}
            label="LEGAL"
            title="Privacy Policy"
            description="This Privacy Policy explains how EduMatch collects, uses, stores and protects your information when you use our platform."
            lastUpdated="August 2026"
            sections={[
                {
                    id: "information",
                    title: "Information We Collect",
                },
                {
                    id: "use",
                    title: "How We Use Information",
                },
                {
                    id: "data",
                    title: "Data Storage",
                },
                {
                    id: "protection",
                    title: "Data Protection",
                },
                {
                    id: "sharing",
                    title: "Information Sharing",
                },
                {
                    id: "rights",
                    title: "Your Rights",
                },
                {
                    id: "cookies",
                    title: "Cookies",
                },
                {
                    id: "changes",
                    title: "Changes to This Policy",
                },
                {
                    id: "contact",
                    title: "Contact Us",
                },
            ]}
        >

            <section id="information">

                <div className="legal-section-icon">
                    <FileText size={20} />
                </div>

                <h2>
                    Information We Collect
                </h2>

                <p>
                    When you create an account or use EduMatch,
                    we may collect information that you provide
                    directly to us.
                </p>

                <p>
                    This may include your name, email address,
                    date of birth, nationality, country of residence,
                    academic information, skills, languages and
                    other profile information.
                </p>

                <p>
                    We may also collect information related to
                    your use of the platform, such as applications,
                    saved opportunities and interactions with
                    platform features.
                </p>

            </section>


            <section id="use">

                <div className="legal-section-icon">
                    <Eye size={20} />
                </div>

                <h2>
                    How We Use Information
                </h2>

                <p>
                    We use the information you provide to operate
                    and improve EduMatch.
                </p>

                <ul>
                    <li>
                        Create and manage your account
                    </li>

                    <li>
                        Maintain your profile
                    </li>

                    <li>
                        Recommend scholarships and educational
                        opportunities
                    </li>

                    <li>
                        Check your eligibility for opportunities
                    </li>

                    <li>
                        Process and manage applications
                    </li>

                    <li>
                        Improve platform features and services
                    </li>

                    <li>
                        Communicate with you about your account
                        and the platform
                    </li>
                </ul>

            </section>


            <section id="data">

                <div className="legal-section-icon">
                    <Database size={20} />
                </div>

                <h2>
                    Data Storage
                </h2>

                <p>
                    Your information may be stored in databases
                    and systems used to operate EduMatch.
                </p>

                <p>
                    We retain information for as long as needed
                    to provide the service, maintain your account,
                    meet operational requirements or comply with
                    applicable obligations.
                </p>

            </section>


            <section id="protection">

                <div className="legal-section-icon">
                    <Lock size={20} />
                </div>

                <h2>
                    Data Protection
                </h2>

                <p>
                    We use security practices designed to protect
                    your information from unauthorized access,
                    alteration, disclosure or destruction.
                </p>

                <p>
                    Access to personal information is limited to
                    authorized systems and personnel where access
                    is required to operate the platform.
                </p>

                <p>
                    You are also responsible for protecting your
                    account by keeping your password confidential
                    and using secure login credentials.
                </p>

            </section>


            <section id="sharing">

                <div className="legal-section-icon">
                    <UserCheck size={20} />
                </div>

                <h2>
                    Information Sharing
                </h2>

                <p>
                    We do not use your personal information for
                    purposes unrelated to operating and improving
                    EduMatch without an appropriate reason.
                </p>

                <p>
                    We may share information with service providers
                    that help us operate the platform, such as
                    hosting, database, security or infrastructure
                    providers.
                </p>

                <p>
                    We may also disclose information when required
                    to comply with applicable laws or to protect
                    the security and rights of EduMatch, our users
                    or others.
                </p>

            </section>


            <section id="rights">

                <h2>
                    Your Rights
                </h2>

                <p>
                    Depending on applicable law, you may have
                    rights related to the personal information
                    we hold about you.
                </p>

                <ul>
                    <li>
                        Request access to your information
                    </li>

                    <li>
                        Request correction of inaccurate information
                    </li>

                    <li>
                        Request deletion of certain information
                    </li>

                    <li>
                        Ask questions about how your information
                        is used
                    </li>
                </ul>

                <p>
                    To make a privacy-related request, contact
                    our support team.
                </p>

            </section>


            <section id="cookies">

                <h2>
                    Cookies
                </h2>

                <p>
                    EduMatch may use cookies or similar technologies
                    to support authentication, security and platform
                    functionality.
                </p>

                <p>
                    These technologies may help us keep you signed
                    in, protect your account and maintain the
                    functionality of the platform.
                </p>

            </section>


            <section id="changes">

                <h2>
                    Changes to This Policy
                </h2>

                <p>
                    We may update this Privacy Policy when our
                    platform, services or privacy practices change.
                </p>

                <p>
                    When changes are made, the updated version will
                    be published on this page with a new update date.
                </p>

            </section>


            <section id="contact">

                <h2>
                    Contact Us
                </h2>

                <p>
                    If you have questions about this Privacy Policy
                    or how EduMatch handles your information, please
                    contact our support team.
                </p>

                <a
                    href="mailto:privacy@EduMatch.com"
                    className="legal-email"
                >
                    privacy@EduMatch.com
                </a>

            </section>

        </LegalLayout>
    );
}

export default PrivacyPolicy;
