import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import CitySelector from "@/components/CitySelector"; 
import LanguageSelector from "@/components/LanguageSelector"; 
import womensFashion from "@/assets/womens-fashion.jpg";
import mensFashion from "@/assets/mens-fashion.jpg";
import redLehenga from "@/assets/red-lehenga.jpg";

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen bg-primary flex items-center overflow-hidden">
      <div className="container relative z-10 mx-auto px-6 py-32 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
          {/* Left — Text */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-accent font-sans font-medium tracking-[0.2em] uppercase text-xs mb-6 block">
              India's Bespoke Fashion Marketplace
            </span>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-bold text-primary-foreground leading-[1.1] mb-8">
              Wear something made
              <br />
              for you, and{" "}
              <span className="italic text-accent">only you</span>.
            </h1>

            <p className="text-base md:text-lg text-primary-foreground/70 font-sans mb-10 max-w-lg leading-relaxed">
              Describe your dream outfit. Verified artisans across India compete to craft it. Escrow-protected. Delivered to your door.
            </p>

            {/* Social proof strip */}
            <div className="flex items-center gap-0 mb-10">
              {[
                { value: "500+", label: "Verified Artisans" },
                { value: "12", label: "Cities" },
                { value: "4.8★", label: "Avg Rating" },
              ].map((stat, i) => (
                <div key={stat.label} className={`${i > 0 ? "border-l border-primary-foreground/20 pl-6 ml-6" : ""}`}>
                  <p className="text-2xl md:text-3xl font-serif font-bold text-accent">{stat.value}</p>
                  <p className="text-xs font-sans text-primary-foreground/50 mt-0.5">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <Button variant="gold" size="hero" onClick={() => navigate("/start")}>
                Start My Order →
              </Button>
            </div>
            <button
              onClick={() => navigate("/for-tailors")}
              className="text-sm text-accent font-sans hover:underline"
            >
              Are you an artisan? Join Naapio →
            </button>

            {/* City & Language selectors */}
            <div className="flex items-center gap-4 mt-6">
              <CitySelector />
              <LanguageSelector />
            </div>
          </motion.div>

          {/* Right — Image collage (desktop) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="hidden md:block"
          >
            <div className="relative h-[520px] w-full">
              {/* Card 1 — top left */}
              <div className="absolute top-0 left-0 -rotate-3 z-0">
                <img
                  src={womensFashion}
                  alt="Women's bespoke fashion"
                  className="w-48 h-64 object-cover rounded-2xl shadow-lg"
                />
              </div>
              {/* Card 2 — centre */}
              <div className="absolute top-12 left-1/2 -translate-x-1/2 rotate-2 z-10">
                <div className="relative">
                  <img
                    src={redLehenga}
                    alt="Red bridal lehenga"
                    className="w-56 h-72 object-cover rounded-2xl shadow-xl"
                  />
                  <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-card/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-md">
                    <span className="text-xs font-sans font-medium text-foreground whitespace-nowrap">
                      ₹499 to post · Escrow protected
                    </span>
                  </div>
                </div>
              </div>
              {/* Card 3 — bottom right */}
              <div className="absolute bottom-0 right-0 -rotate-1 z-0">
                <img
                  src={mensFashion}
                  alt="Men's bespoke fashion"
                  className="w-48 h-64 object-cover rounded-2xl shadow-lg"
                />
              </div>
            </div>
          </motion.div>

          {/* Mobile single image */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="md:hidden"
          >
            <img
              src={redLehenga}
              alt="Red bridal lehenga"
              className="w-full rounded-2xl shadow-xl"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
