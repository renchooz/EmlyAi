import "../styles/landing.css";
import { ScrollProgressBar } from "../components/landing/ScrollProgressBar";
import { LandingHeader } from "../components/landing/LandingHeader";
import { HeroSection } from "../components/landing/HeroSection";
import { StatsMarquee } from "../components/landing/StatsMarquee";
import { WhySection } from "../components/landing/WhySection";
import { PricingSection } from "../components/landing/PricingSection";
import { FAQSection } from "../components/landing/FAQSection";
import { FinalCTASection } from "../components/landing/FinalCTASection";
import Footer from "../components/landing/Footer";

const LandingPage = () => {
  return (
    <div className="landing-root min-h-screen">
      <ScrollProgressBar />
      <LandingHeader />
      <HeroSection />
      <StatsMarquee />
      <WhySection />
      <PricingSection />
      <FAQSection />
      <FinalCTASection />
      <Footer />
    </div>
  );
};

export default LandingPage;
