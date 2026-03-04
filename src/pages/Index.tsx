import { useNavigate } from "react-router-dom";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import HeroSection from "@/components/home/HeroSection";
import HowItWorks from "@/components/home/HowItWorks";
import TrustSignals from "@/components/home/TrustSignals";
import CategoryPreview from "@/components/home/CategoryPreview";
import VendorShowcase from "@/components/home/VendorShowcase";
import FAQSection from "@/components/home/FAQSection";
import SiteFooter from "@/components/home/SiteFooter";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2 cursor-pointer">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="text-xl font-serif font-bold text-foreground">Naapio</span>
          </a>
          <div className="hidden md:flex items-center gap-8 font-sans text-sm text-muted-foreground">
            <a href="#how-it-works" className="hover:text-foreground transition-colors">How It Works</a>
            <a href="/#categories" className="hover:text-foreground transition-colors">Categories</a>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard")}>
              Login
            </Button>
            <Button variant="gold" size="sm" onClick={() => navigate("/wizard")}>
              Get Started
            </Button>
          </div>
        </div>
      </nav>

      <HeroSection />
      <HowItWorks />
      <TrustSignals />
      <CategoryPreview />
      <VendorShowcase />

      {/* CTA Banner */}
      <section className="py-24 bg-primary">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-serif font-bold text-primary-foreground mb-4">Ready to bring your vision to life?</h2>
          <p className="text-primary-foreground/70 font-sans text-lg mb-8 max-w-xl mx-auto">
            Join thousands of customers who trust Naapio for their bespoke fashion needs.
          </p>
          <Button variant="gold" size="hero" onClick={() => navigate("/wizard")}>
            Upload your inspiration
          </Button>
        </div>
      </section>

      <FAQSection />
      <SiteFooter />
    </div>
  );
};

export default Index;
