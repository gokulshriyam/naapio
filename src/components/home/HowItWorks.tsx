import { motion } from "framer-motion";
import { Upload, Users, MessageSquare, Package } from "lucide-react";

const steps = [
  { icon: Upload, title: "Upload", desc: "Share your design inspiration — a photo, screenshot, or sketch." },
  { icon: Users, title: "Get Bids", desc: "Receive competitive bids from verified master tailors across India." },
  { icon: MessageSquare, title: "Chat & Accept", desc: "Compare portfolios, chat with artisans, and pick your perfect match." },
  { icon: Package, title: "Track & Receive", desc: "Monitor every milestone from fabric to delivery with escrow protection." },
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-24 bg-secondary">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-serif font-bold text-foreground mb-4">How Naapio Works</h2>
          <p className="text-muted-foreground font-sans text-lg max-w-xl mx-auto">
            From inspiration to your doorstep in four simple steps
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="relative text-center"
            >
              {i < 3 && (
                <div className="hidden md:block absolute top-10 left-[60%] w-[80%] h-px bg-border" />
              )}
              <div className="relative z-10 w-20 h-20 mx-auto mb-6 rounded-2xl bg-primary flex items-center justify-center shadow-lg">
                <step.icon className="w-8 h-8 text-primary-foreground" />
              </div>
              <span className="inline-block text-accent font-sans font-bold text-sm mb-2">Step {i + 1}</span>
              <h3 className="text-xl font-serif font-semibold text-foreground mb-2">{step.title}</h3>
              <p className="text-muted-foreground font-sans text-sm leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
