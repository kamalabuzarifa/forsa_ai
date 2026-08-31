import {
    ShieldCheck,
    LockKeyhole,
    Server,
    KeyRound,
    UserRoundCheck,
} from "lucide-react";

import LegalLayout from "../components/layout/LegalLayout";

function Security() {
    return (
        <LegalLayout
            icon={ShieldCheck}
            label="TRUST & SECURITY"
            title="Security"
            description="We design EduMatch with security in mind to help protect your account and the information you provide."
            lastUpdated="August 2026"
            sections={[
                {
                    id: "protection",
                    title: "Data Protection",
                },
                {
                    id: "access",
                    title: "Access Control",
                },
                {
                    id: "encryption",
                    title: "Encryption",
                },
                {
                    id: "infrastructure",
                    title: "Infrastructure Security",
                },
                {
                    id: "account-security",
                    title: "Account Security",
                },
                {
                    id: "report",
                    title: "Report a Security Issue",
                },
            ]}
        >

            <section id="protection">

                <div className="legal-section-icon">
                    <ShieldCheck size={20} />
                </div>

                <h2>
                    Data Protection
                </h2>

                <p>
                    We apply security practices designed to protect
                    information stored and processed by EduMatch.
                </p>

                <p>
                    Access to personal information is limited to
                    authorized systems and personnel where access
                    is required to operate the service.
                </p>

            </section>


            <section id="access">

                <div className="legal-section-icon">
                    <UserRoundCheck size={20} />
                </div>

                <h2>
                    Access Control
                </h2>

                <p>
                    We use access controls to reduce unauthorized
                    access to accounts, systems and data.
                </p>

                <p>
                    Administrative access is restricted based on
                    operational requirements.
                </p>

            </section>


            <section id="encryption">

                <div className="legal-section-icon">
                    <LockKeyhole size={20} />
                </div>

                <h2>
                    Encryption
                </h2>

                <p>
                    EduMatch uses secure communication methods to
                    protect information transmitted between your
                    browser and our platform.
                </p>

            </section>


            <section id="infrastructure">

                <div className="legal-section-icon">
                    <Server size={20} />
                </div>

                <h2>
                    Infrastructure Security
                </h2>

                <p>
                    We work to keep the systems supporting EduMatch
                    maintained and protected against unauthorized
                    access and common security risks.
                </p>

                <p>
                    Security practices may change as our infrastructure
                    and services develop.
                </p>

            </section>


            <section id="account-security">

                <div className="legal-section-icon">
                    <KeyRound size={20} />
                </div>

                <h2>
                    Account Security
                </h2>

                <p>
                    You also play a role in protecting your account.
                    Use a strong password and do not share your login
                    credentials with anyone.
                </p>

                <p>
                    If you believe someone has accessed your account
                    without permission, contact our support team as
                    soon as possible.
                </p>

            </section>


            <section id="report">

                <h2>
                    Report a Security Issue
                </h2>

                <p>
                    If you discover a security issue related to EduMatch,
                    please contact us so that we can investigate and
                    address the issue.
                </p>

                <a
                    href="mailto:security@EduMatch.com"
                    className="legal-email"
                >
                    security@EduMatch.com
                </a>

            </section>

        </LegalLayout>
    );
}

export default Security;
