import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { craftHeritage } from "@/data/craftHeritage";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import SiteNavbar from "@/components/SiteNavbar";
import SiteFooter from "@/components/home/SiteFooter";

const REGION_ORDER: Array<"North" | "East" | "Northeast" | "South" | "West" | "Central"> = [
  "North",
  "East",
  "Northeast",
  "South",
  "West",
  "Central",
];

const OurStoryPage = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-background">
      <SiteNavbar />


      {/* SECTION 1 — Opening */}
      <section className="min-h-screen bg-foreground flex items-center justify-center relative overflow-hidden">
        <div className="max-w-3xl px-6 text-center">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="font-sans text-white/50 text-sm uppercase tracking-[0.3em] mb-6"
          >
            The Naapio Story
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="font-serif text-5xl md:text-7xl font-bold text-white leading-tight mb-8"
          >
            Before there were markets,
            <br />
            there was India.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="font-sans text-white/60 text-lg max-w-xl mx-auto leading-relaxed"
          >
            For over five thousand years, the world came here — for spices, for silk, for craftsmanship no other civilisation had mastered.
          </motion.p>
        </div>
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/40"
        >
          <ChevronDown className="w-6 h-6" />
        </motion.div>
      </section>

      {/* SECTION 2 — Founding story */}
      <section className="py-32 bg-background">
        <div className="max-w-3xl mx-auto px-6">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-8"
          >
            It started with a search that led nowhere.
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-6 font-sans text-lg text-muted-foreground leading-relaxed"
          >
            <p>
              Someone had seen an outfit — on a screen, on someone else, at someone else's wedding — and wanted it made. Not bought. Made. For them.
            </p>
            <p>
              So they searched. And found nothing that could take them from that photo to that garment. No platform. No price. No way to know who could actually make it, or whether the money they sent would come back to them if it didn't work out.
            </p>
            <p>
              What they found instead was what's always existed: a phone number, passed along by someone who knew someone. A walk-in visit, hoping the tailor was good. A payment made on trust alone, because trust was the only mechanism available.
            </p>
            <p>
              That gap — between finding a design and getting it made — had never been closed. Not because no one wanted to close it. Because closing it meant solving three hard problems at once: turning a photo into something a tailor could actually bid on, protecting a payment between two strangers who'd never worked together, and giving India's artisans — some of the most skilled hands in the world — a way to be found by people who didn't already know them.
            </p>
            <p>
              Naapio exists because that gap was still open in a country that invented half the textile techniques the fashion world now calls luxury.
            </p>
            <p>
              We didn't build a fashion brand. We built the bridge that should have already existed.
            </p>
          </motion.div>
        </div>
      </section>


      {/* SECTION 3 — Craft geography */}
      <section className="py-24 bg-secondary">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4"
            >
              A living map of that history
            </motion.h2>
            <p className="font-sans text-muted-foreground text-lg">
              Every state carries forward a piece of it. Scroll through what survives — and thrives — today.
            </p>
          </div>

          {REGION_ORDER.map((region) => {
            const states = craftHeritage.filter((s) => s.region === region);
            if (states.length === 0) return null;
            return (
              <div key={region}>
                <h3 className="font-serif text-2xl font-bold text-foreground mb-6 mt-12 first:mt-0">
                  {region} India
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                  {states.map((state) => {
                    const headline = state.crafts[0];
                    const remaining = state.crafts.length - 1;
                    return (
                      <motion.div
                        key={state.stateSlug}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="bg-card rounded-2xl overflow-hidden border border-border"
                      >
                        <img
                          src={headline.image}
                          alt={`${headline.name} — ${state.state}`}
                          className="w-full h-56 object-cover object-center"
                        />
                        <div className="p-5">
                          <p className="font-sans text-xs text-accent uppercase tracking-wider mb-1">
                            {state.state}
                          </p>
                          <h4 className="font-serif font-bold text-foreground text-lg mb-2">
                            {headline.name}
                          </h4>
                          <p className="font-sans text-sm text-muted-foreground leading-relaxed">
                            {headline.note}
                          </p>
                          {remaining > 0 && (
                            <p className="font-sans text-xs text-muted-foreground/70 mt-3">
                              + {remaining} more craft{remaining !== 1 ? "s" : ""} from {state.state}
                            </p>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* SECTION 4 — Founding story */}
      <section className="py-32 bg-background">
        <div className="max-w-3xl mx-auto px-6">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="font-sans text-xs text-accent uppercase tracking-widest mb-4 text-center"
          >
            Why Naapio
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-8 text-center"
          >
            The gap nobody had closed
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-6 font-sans text-lg text-muted-foreground leading-relaxed"
          >
            <p>
              Every marketplace category has been digitised — groceries, cabs, hotels, even fast fashion. But bespoke fashion, the one category tied most directly to this five-thousand-year craft inheritance, still runs on phone calls, walk-ins, and luck.
            </p>
            <p>
              A customer finds a design on Instagram with no way to get it made. An artisan with decades of inherited skill has no digital identity, no payment protection, no way to reach demand beyond their own street.
            </p>
            <p>
              Naapio exists to close that gap — not by replacing the craft, but by finally giving it the infrastructure it was always owed: verified identity, escrow-protected payment, and a direct line between a customer's inspiration and the hands that can make it real.
            </p>
          </motion.div>
        </div>
      </section>

      {/* SECTION 5 — Closing */}
      <section className="py-24 bg-foreground text-center">
        <div className="max-w-2xl mx-auto px-6">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-serif text-3xl md:text-4xl font-bold text-white mb-8 leading-tight"
          >
            The next five thousand years start with the next stitch.
          </motion.h2>
          <Button variant="gold" size="hero" onClick={() => navigate("/start")}>
            Start Your Order →
          </Button>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
};

export default OurStoryPage;
