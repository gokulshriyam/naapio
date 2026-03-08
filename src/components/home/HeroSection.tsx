import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Upload, Sparkles, User } from "lucide-react";
import { Button } from "@/components/ui/button";

const HeroSection = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src="https://source.unsplash.com/featured/?indian+bridal+lehenga+ethnic+fashion&1001"
          alt="Luxury Indian fashion atelier"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/70 to-primary/40" />
      </div>

      <div className="container relative z-10 mx-auto px-6 py-20">
        <div className="max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center gap-2 mb-6">
              <Sparkles className="w-5 h-5 text-accent" />
              <span className="text-accent font-sans font-medium tracking-wide uppercase text-sm">India's Premier Bespoke Marketplace</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-serif font-bold text-primary-foreground leading-tight mb-6">
              {t('hero.headline').split('.')[0]}.<br />
              <span className="italic text-accent">{t('hero.headline').split('.')[1]?.trim() || 'Stitch It'}.</span>
            </h1>
            <p className="text-lg md:text-xl text-primary-foreground/80 font-sans mb-10 max-w-lg leading-relaxed">
              {t('hero.subheadline')}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Button
              variant="gold"
              size="hero"
              onClick={() => navigate("/start")}
              className="animate-pulse-gold"
            >
              <Upload className="w-5 h-5" />
              {t('hero.primaryCta')}
            </Button>
            <Button
              variant="outline"
              size="hero"
              onClick={() => {
                document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="bg-primary-foreground/20 border-primary-foreground/40 text-primary-foreground hover:bg-primary-foreground/30 hover:border-primary-foreground/60"
            >
              {t('hero.secondaryCta')}
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="mt-12 flex items-center gap-6 text-primary-foreground/60 font-sans text-sm"
          >
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-8 h-8 rounded-full bg-accent/30 border-2 border-primary-foreground/20 flex items-center justify-center">
                  <User className="w-4 h-4 text-primary-foreground/70" />
                </div>
              ))}
            </div>
            <span>2,400+ happy customers this month</span>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
