import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import CitySelector from "@/components/CitySelector";
import LanguageSelector from "@/components/LanguageSelector";
import redLehenga from "@/assets/red-lehenga.jpg";
import mensFashion from "@/assets/mens-fashion.jpg";
import womensFashion from "@/assets/womens-fashion.jpg";

const scenarios = [
  { garment: "Party Lehenga", gender: "Women's", price: "₹18,000", fabric: "Georgette · Deep Red", surface: "Heavy Embroidery", milestone: "Milestone 4 — Virtual trial approved, ready for delivery", image: redLehenga },
  { garment: "Formal Suit", gender: "Men's", price: "₹12,500", fabric: "Wool Blend · Charcoal", surface: "Tailored Finish", milestone: "Milestone 1 — Measurements approved", image: mensFashion },
  { garment: "Anarkali", gender: "Women's", price: "₹9,000", fabric: "Chanderi Silk · Mustard", surface: "Zari Border", milestone: "Milestone 3 — Stitching in progress", image: womensFashion },
  { garment: "Sherwani", gender: "Men's", price: "₹15,000", fabric: "Brocade · Deep Maroon", surface: "Zardozi Work", milestone: "Bidding just closed — escrow active", image: mensFashion },
  { garment: "Saree Blouse", gender: "Women's", price: "₹5,500", fabric: "Silk · Emerald Green", surface: "Mirror Work", milestone: "Milestone 2 — Fabric approved", image: womensFashion },
];

const stats = [
  { value: "5", label: "Escrow-locked milestones, every order" },
  { value: "₹499", label: "To post your brief" },
  { value: "7 Days", label: "Average time to first bid" },
];

const HeroSection = () => {
  const navigate = useNavigate();
  const [scenarioIndex, setScenarioIndex] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setScenarioIndex((i) => (i + 1) % scenarios.length), 5000);
    return () => clearInterval(t);
  }, []);

  const s = scenarios[scenarioIndex];
  const colorPart = s.fabric.split(" · ")[1] || "";

  return (
    <section className="relative min-h-screen bg-primary flex items-center overflow-hidden">
      <div className="container relative z-10 mx-auto px-6 py-32 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
          {/* Left — Text (static) */}
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

            <div className="flex flex-wrap items-start gap-6 mb-10">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <p className="text-2xl font-serif font-bold text-accent">{stat.value}</p>
                  <p className="text-xs font-sans text-primary-foreground/50 mt-0.5 max-w-[140px]">{stat.label}</p>
                </div>
              ))}
            </div>

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

            <div className="flex items-center gap-3 mt-4">
              <CitySelector variant="hero" />
              <LanguageSelector variant="hero" />
            </div>
          </motion.div>

          {/* Right — Rotating scenario stack (desktop) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="hidden md:block"
          >
            <div className="relative h-[520px] w-full">
              <AnimatePresence mode="wait">
                <motion.div
                  key={scenarioIndex}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0"
                >
                  {/* Card 1 — Inspiration */}
                  <div className="absolute top-0 left-0 -rotate-2 z-0 bg-card rounded-2xl shadow-lg p-4 w-56">
                    <p className="font-sans text-xs text-muted-foreground mb-2">Your inspiration</p>
                    <img
                      src={s.image}
                      alt="Uploaded inspiration"
                      className="w-full h-32 object-cover object-top rounded-lg mb-2"
                    />
                    <p className="font-sans text-xs text-foreground">
                      {s.garment} · {colorPart} · {s.surface}
                    </p>
                  </div>

                  {/* Card 2 — AI Brief */}
                  <div className="absolute top-16 left-1/2 -translate-x-1/4 rotate-1 z-10 bg-card rounded-2xl shadow-xl p-4 w-60">
                    <p className="font-sans text-xs text-accent mb-2 flex items-center gap-1">
                      <span>✦</span> AI Brief Generated
                    </p>
                    <ul className="space-y-1">
                      <li className="font-sans text-xs text-foreground flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-accent" /> {s.gender} · {s.garment}
                      </li>
                      <li className="font-sans text-xs text-foreground flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-accent" /> {s.fabric}
                      </li>
                      <li className="font-sans text-xs text-foreground flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-accent" /> {s.surface} · {s.price}
                      </li>
                    </ul>
                  </div>

                  {/* Card 3 — Milestone */}
                  <div className="absolute bottom-0 right-0 -rotate-1 bg-card rounded-2xl shadow-lg p-4 w-64">
                    <p className="font-sans text-xs font-semibold text-success mb-1">🔒 {s.milestone}</p>
                    <p className="font-sans text-xs text-muted-foreground mt-1">{s.price} held in escrow</p>
                  </div>
                </motion.div>
              </AnimatePresence>
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
