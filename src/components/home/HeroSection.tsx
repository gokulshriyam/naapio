import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import CitySelector from "@/components/CitySelector";
import LanguageSelector from "@/components/LanguageSelector";
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
            <span className="inline-block px-3 py-1 rounded-full bg-accent/10 text-accent font-sans text-xs uppercase tracking-widest mb-6">
              India's bespoke fashion market
            </span>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-bold text-primary-foreground leading-[1.05] mb-8">
              Your Instagram
              <br />
              inspiration.
              <br />
              <span className="italic text-accent">Made.</span>
            </h1>

            <p className="text-base md:text-lg text-primary-foreground/70 font-sans mb-10 max-w-lg leading-relaxed">
              Upload any outfit you've seen online. AI builds the garment brief in 60 seconds. 500+ verified artisans bid honest market prices. Full payment in escrow until you approve every milestone.
            </p>

            {/* Stat strip */}
            <div className="flex flex-wrap items-start gap-6 mb-10">
              {[
                { value: "3.85%", label: "Dispute rate vs 30%+ industry" },
                { value: "₹499", label: "To post your brief" },
                { value: "7 Days", label: "Average time to first bid" },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="text-2xl font-serif font-bold text-accent">{stat.value}</p>
                  <p className="text-xs font-sans text-primary-foreground/50 mt-0.5 max-w-[140px]">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <Button variant="gold" size="hero" onClick={() => navigate("/start")}>
                Upload Your Inspiration →
              </Button>
            </div>
            <button
              onClick={() => navigate("/for-tailors")}
              className="text-sm text-accent font-sans hover:underline"
            >
              Are you an artisan? Join Naapio →
            </button>

            {/* City & Language selectors */}
            <div className="flex items-center gap-3 mt-4">
              <CitySelector variant="hero" />
              <LanguageSelector variant="hero" />
            </div>
          </motion.div>

          {/* Right — Product preview mockup (desktop) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="hidden md:block"
          >
            <div className="relative h-[520px] w-full">
              {/* Card 1 — Inspiration */}
              <div className="absolute top-0 left-0 -rotate-2 z-0 bg-card rounded-2xl shadow-lg p-4 w-56">
                <p className="font-sans text-xs text-muted-foreground mb-2">Your inspiration</p>
                <img
                  src={redLehenga}
                  alt="Uploaded inspiration"
                  className="w-full h-32 object-cover rounded-lg mb-2"
                />
                <p className="font-sans text-xs text-foreground">
                  Party Lehenga · Deep Red · Heavy Embroidery
                </p>
              </div>

              {/* Card 2 — AI Brief */}
              <div className="absolute top-16 left-1/2 -translate-x-1/4 rotate-1 z-10 bg-card rounded-2xl shadow-xl p-4 w-60">
                <p className="font-sans text-xs text-accent mb-2 flex items-center gap-1">
                  <span>✦</span> AI Brief Generated
                </p>
                <ul className="space-y-1">
                  <li className="font-sans text-xs text-foreground flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent" /> Women's · Party Lehenga
                  </li>
                  <li className="font-sans text-xs text-foreground flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent" /> Georgette · Deep Red
                  </li>
                  <li className="font-sans text-xs text-foreground flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent" /> Heavy Zardozi · ₹25K–₹35K
                  </li>
                </ul>
                <div className="border-t border-border my-3" />
                <p className="font-sans text-xs text-muted-foreground mb-2">3 artisans bidding</p>
                <div className="flex flex-wrap gap-1">
                  <span className="font-sans text-[10px] bg-muted rounded-full px-2 py-0.5">Gold-7 ₹28,500</span>
                  <span className="font-sans text-[10px] bg-muted rounded-full px-2 py-0.5">Gold-3 ₹31,200</span>
                  <span className="font-sans text-[10px] bg-muted rounded-full px-2 py-0.5">Silver-12 ₹26,800</span>
                </div>
              </div>

              {/* Card 3 — Escrow */}
              <div className="absolute bottom-0 right-0 -rotate-1 bg-card rounded-2xl shadow-lg p-4 w-52">
                <p className="font-sans text-xs font-semibold text-success mb-1">🔒 Escrow Active</p>
                <p className="font-serif text-lg font-bold text-foreground">₹28,500 held safely</p>
                <p className="font-sans text-[10px] text-muted-foreground">Releases at your final approval</p>
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
