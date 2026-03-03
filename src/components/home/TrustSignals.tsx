import { motion } from "framer-motion";
import { Shield, Clock, Users } from "lucide-react";

const signals = [
  { icon: Users, value: "500+", label: "Verified Master Tailors", desc: "Rigorously vetted through our 5-step verification process" },
  { icon: Shield, value: "100%", label: "Escrow-Protected Payments", desc: "Your money is safe until you approve each milestone" },
  { icon: Clock, value: "7-Day", label: "Bid Guarantee", desc: "Full refund if no vendor bids on your request within 7 days" },
];

const TrustSignals = () => {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-serif font-bold text-foreground mb-4">Built on Trust</h2>
          <p className="text-muted-foreground font-sans text-lg">Every order is protected from start to finish</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {signals.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="text-center p-8 rounded-2xl border border-border hover:border-accent/30 transition-all hover:shadow-lg group"
            >
              <div className="w-16 h-16 mx-auto mb-6 rounded-xl bg-gold-light flex items-center justify-center group-hover:scale-110 transition-transform">
                <s.icon className="w-8 h-8 text-accent" />
              </div>
              <div className="text-3xl font-serif font-bold text-accent mb-2">{s.value}</div>
              <h3 className="text-lg font-sans font-semibold text-foreground mb-2">{s.label}</h3>
              <p className="text-muted-foreground font-sans text-sm">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustSignals;
