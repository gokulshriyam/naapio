import { motion } from "framer-motion";

const steps = [
  {
    num: "01",
    emoji: "📸",
    title: "Upload Your Inspiration",
    sub: "Any Instagram screenshot, WhatsApp forward, or Pinterest save. AI converts it into a structured garment brief in under 60 seconds.",
  },
  {
    num: "02",
    emoji: "🔐",
    title: "Pay ₹499 to Post",
    sub: "₹49 platform fee. ₹451 moves to escrow immediately. Your brief goes live to 500+ verified artisans in your city.",
  },
  {
    num: "03",
    emoji: "🎯",
    title: "Artisans Bid Blind",
    sub: "Identities hidden until you accept. Review quality scores, portfolios, and delivery timelines. Chat before you commit.",
  },
  {
    num: "04",
    emoji: "🪡",
    title: "5 Milestones, All Escrow-Locked",
    sub: "Measurements → Fabric approval → Stitching update → Virtual fitting → Delivery. Escrow releases only at your approval. Never before.",
  },
  {
    num: "05",
    emoji: "✅",
    title: "Delivered. Loved.",
    sub: "Rate your artisan. Their verified score improves. Their income is formally documented — many for the first time.",
  },
];

const milestonePills = ["M1 Measure", "M2 Fabric", "M3 Stitch", "M4 Trial", "M5 Deliver"];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <p className="font-sans text-xs text-muted-foreground uppercase tracking-widest mb-4">
            The Naapio Flow
          </p>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4">
            From Instagram to your door.
          </h2>
          <p className="font-sans text-muted-foreground text-lg">
            Five steps. Every rupee protected. Every stitch accountable.
          </p>
        </motion.div>

        <div className="md:grid md:grid-cols-5 gap-6 relative space-y-12 md:space-y-0">
          <div className="hidden md:block absolute top-10 left-[10%] right-[10%] h-px border-t border-dashed border-border" />

          {steps.map((step, i) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="relative text-center px-4"
            >
              <div className="relative">
                <span className="text-7xl md:text-8xl font-serif font-bold text-accent/10 select-none leading-none">
                  {step.num}
                </span>
                <span className="absolute inset-0 flex items-center justify-center text-3xl">
                  {step.emoji}
                </span>
              </div>

              <h3 className="text-base font-serif font-bold text-foreground mt-4 mb-2">{step.title}</h3>
              <p className="text-sm font-sans text-muted-foreground leading-relaxed max-w-[200px] mx-auto">
                {step.sub}
              </p>

              {step.num === "04" && (
                <div className="flex justify-center gap-1 mt-3 flex-wrap">
                  {milestonePills.map((p) => (
                    <span
                      key={p}
                      className="font-sans text-[9px] px-2 py-0.5 rounded-full bg-accent/10 text-accent"
                    >
                      {p}
                    </span>
                  ))}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
