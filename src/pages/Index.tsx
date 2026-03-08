import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Sparkles, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import HeroSection from "@/components/home/HeroSection";
import HowItWorks from "@/components/home/HowItWorks";
import TrustSignals from "@/components/home/TrustSignals";
import CategoryPreview from "@/components/home/CategoryPreview";
import VendorShowcase from "@/components/home/VendorShowcase";
import FAQSection from "@/components/home/FAQSection";
import SiteFooter from "@/components/home/SiteFooter";
import CitySelector from "@/components/CitySelector";
import LanguageSelector, { TranslationBanner } from "@/components/LanguageSelector";

const Index = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
            <a href="#how-it-works" className="hover:text-foreground transition-colors">{t('nav.howItWorks')}</a>
            <a href="/#categories" className="hover:text-foreground transition-colors">{t('nav.categories')}</a>
            <a href="/for-tailors" className="hover:text-foreground transition-colors">{t('nav.forTailors')}</a>
          </div>
          <div className="hidden md:flex items-center gap-2">
            <CitySelector />
            <LanguageSelector />
            <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard")}>
              {t('nav.login')}
            </Button>
            <Button variant="gold" size="sm" onClick={() => navigate("/start")}>
              {t('nav.getStarted')}
            </Button>
          </div>
          {/* Mobile hamburger */}
          <button className="md:hidden p-2" onClick={() => { setMobileMenuOpen(!mobileMenuOpen); document.body.style.overflow = !mobileMenuOpen ? 'hidden' : ''; }}>
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-background border-t border-border px-6 py-4 space-y-2 max-h-[calc(100vh-64px)] overflow-y-auto">
            <div className="w-full mb-2"><CitySelector variant="mobile" /></div>
            <div className="w-full mb-2"><LanguageSelector variant="mobile" /></div>
            <div className="h-px bg-border my-2" />
            <a href="#how-it-works" className="flex items-center min-h-[48px] font-sans text-sm text-foreground py-2 border-l-2 border-transparent hover:border-accent pl-3" onClick={() => { setMobileMenuOpen(false); document.body.style.overflow = ''; }}>{t('nav.howItWorks')}</a>
            <a href="/#categories" className="flex items-center min-h-[48px] font-sans text-sm text-foreground py-2 border-l-2 border-transparent hover:border-accent pl-3" onClick={() => { setMobileMenuOpen(false); document.body.style.overflow = ''; }}>{t('nav.categories')}</a>
            <a href="/for-tailors" className="flex items-center min-h-[48px] font-sans text-sm text-foreground py-2 border-l-2 border-transparent hover:border-accent pl-3" onClick={() => { setMobileMenuOpen(false); document.body.style.overflow = ''; }}>{t('nav.forTailors')}</a>
            <div className="space-y-3 pt-3">
              <Button variant="ghost" size="sm" onClick={() => { navigate("/dashboard"); setMobileMenuOpen(false); document.body.style.overflow = ''; }} className="w-full justify-center min-h-[48px]">
                {t('nav.login')}
              </Button>
              <Button variant="gold" size="sm" onClick={() => { navigate("/start"); setMobileMenuOpen(false); document.body.style.overflow = ''; }} className="w-full justify-center min-h-[48px]">
                {t('nav.getStarted')}
              </Button>
            </div>
          </div>
        )}
      </nav>

      <TranslationBanner />

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
          <Button variant="gold" size="hero" onClick={() => navigate("/start")}>
            {t('hero.primaryCta')}
          </Button>
        </div>
      </section>

      <FAQSection />
      <SiteFooter />
    </div>
  );
};

export default Index;
