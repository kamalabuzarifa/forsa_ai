import "./styles/Landing.css";

import LandingNavbar from "../components/landing/LandingNavbar";
import HeroSection from "../components/landing/HeroSection";
import StatsSection from "../components/landing/StatsSection";
import HowItWorks from "../components/landing/HowItWorks";
import WhyEduMatch from "../components/landing/WhyEduMatch";
import FeaturedOpportunities from "../components/landing/FeaturedOpportunities";
import AISection from "../components/landing/AISection";

import ForInstitutions from "../components/landing/ForInstitutions";
import TrustedInstitutions from "../components/landing/TrustedInstitutions";
import CaseStudies from "../components/landing/CaseStudies";
import PartnersSection from "../components/landing/PartnersSection";
import BeyondEduMatch from "../components/landing/BeyondEduMatch";
import ResourcesSection from "../components/landing/ResourcesSection";

import FAQSection from "../components/landing/FAQSection";
import ContactSection from "../components/landing/ContactSection";
import CTASection from "../components/landing/CTASection";
import LandingFooter from "../components/landing/LandingFooter";

function Landing() {
    return (
        <div className="landing-page">

            <div className="landing-background">

                <div className="landing-shape landing-shape-1" />
                <div className="landing-shape landing-shape-2" />
                <div className="landing-shape landing-shape-3" />

                <main className="landing-container">

                    <LandingNavbar />

                    <HeroSection />

                    <StatsSection />

                    <HowItWorks />

                    <WhyEduMatch />

                    <FeaturedOpportunities />

                    <AISection />

                    <ForInstitutions />

                    <TrustedInstitutions />

                    <CaseStudies />

                    <PartnersSection />

                    <BeyondEduMatch />

                    <ResourcesSection />

                    <FAQSection />

                    <ContactSection />

                    <CTASection />

                    <LandingFooter />

                </main>

            </div>

        </div>
    );
}

export default Landing;
