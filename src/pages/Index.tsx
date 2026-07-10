import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import SiteNavbar from "@/components/SiteNavbar";
import HeroSection from "@/components/home/HeroSection";
import HowItWorks from "@/components/home/HowItWorks";
import TrustSignals from "@/components/home/TrustSignals";
import CategoryPreview from "@/components/home/CategoryPreview";
import VendorShowcase from "@/components/home/VendorShowcase";
import FAQSection from "@/components/home/FAQSection";
import SiteFooter from "@/components/home/SiteFooter";
import IndiaCraftMap from "@/components/home/IndiaCraftMap";
import LivePulseStrip from "@/components/home/LivePulseStrip";
import WeddingEdit from "@/components/home/WeddingEdit";
import RealOrdersStrip from "@/components/home/RealOrdersStrip";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      <SiteNavbar />

      <HeroSection />
      <LivePulseStrip />
      <TrustSignals />
      <HowItWorks />
      <WeddingEdit />
      <CategoryPreview />

      {/* India Craft Map — 5,000 years of heritage */}
      <section id="india-craft-map" className="py-24 bg-background">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <p className="font-sans text-xs text-accent uppercase tracking-[0.25em] mb-4">
              5,000 Years in the Making
            </p>
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-5">
              India's Craft, Mapped
            </h2>
            <p className="font-sans text-muted-foreground text-lg leading-relaxed">
              Every region has given the world something no machine can replicate. This is the heritage behind every stitch on Naapio.
            </p>
          </div>
          <IndiaCraftMap />
        </div>
      </section>

      <VendorShowcase />
      <RealOrdersStrip />

      {/* CTA Banner */}
      <section className="py-24 bg-primary">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-serif font-bold text-primary-foreground mb-4">India's finest bespoke fashion, made for you.</h2>
          <p className="text-primary-foreground/70 font-sans text-lg mb-8 max-w-xl mx-auto">
            From inspiration to your doorstep — protected by escrow, every step of the way.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="gold" size="hero" onClick={() => navigate("/start")}>
              Start My Bespoke Order →
            </Button>
            <button
              className="bg-white text-[hsl(var(--primary))] font-sans font-semibold px-6 py-2.5 rounded-full hover:bg-white/90 transition-colors"
              onClick={() => navigate("/for-tailors")}
            >
              Join as Artisan
            </button>
          </div>
        </div>
      </section>

      <FAQSection />
      <SiteFooter />
    </div>
  );
};

export default Index;
