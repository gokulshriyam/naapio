import { motion } from "framer-motion";

const steps = [
  { num: "01", emoji: "🖊️", title: "Describe your vision", sub: "Tell us the garment, occasion, fabric feel, budget, and deadline. Takes 4 minutes." },
  { num: "02", emoji: "🎯", title: "Receive bids from vetted artisans", sub: "Verified artisans in your city compete for your brief. Review portfolios and chat before choosing." },
  { num: "03", emoji: "🪡", title: "Track every stitch", sub: "Five escrow-locked milestones: measurements → fabric → stitching → fitting video → delivery." },
  { num: "04", emoji: "🚚", title: "Delivered. Loved.", sub: "Your bespoke outfit arrives. Pay only after your final approval." },
];

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
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4">How Naapio Works</h2>
          <p className="text-muted-foreground font-sans text-lg max-w-xl mx-auto">
            From inspiration to your doorstep in four simple steps
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-6 relative">
          {/* Connecting dashed line (desktop only) */}
          <div className="hidden md:block absolute top-16 left-[12.5%] right-[12.5%] h-px border-t-2 border-dashed border-border" />

          {steps.map((step, i) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12 }}
              className="relative text-center"
            >
              {/* Background number */}
              <div className="relative">
                <span className="text-7xl md:text-8xl font-serif font-bold text-accent/10 select-none leading-none">
                  {step.num}
                </span>
                <span className="absolute inset-0 flex items-center justify-center text-3xl">
                  {step.emoji}
                </span>
              </div>

              <h3 className="text-lg font-serif font-bold text-foreground mt-4 mb-2">{step.title}</h3>
              <p className="text-sm font-sans text-muted-foreground leading-relaxed max-w-xs mx-auto">{step.sub}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
