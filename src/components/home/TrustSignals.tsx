import { motion } from "framer-motion";

const stats = [
  {
    value: "₹28,000 Cr",
    label: "India's bespoke fashion market",
    sub: "Running entirely offline. No platform. No protection.",
  },
  {
    value: "1.3 Cr",
    label: "Skilled artisans across India",
    sub: "No digital identity. No payment protection. No structured income.",
  },
  {
    value: "78%",
    label: "Customers cite payment safety as #1 barrier",
    sub: "The trust layer has never existed. Until now.",
  },
];

const TrustSignals = () => {
  return (
    <section className="py-20 bg-foreground">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-card/10 backdrop-blur-sm rounded-2xl p-8 border border-white/10 text-center"
            >
              <p className="font-serif text-4xl md:text-5xl font-bold text-accent">{s.value}</p>
              <p className="font-sans text-sm text-white/70 mt-2">{s.label}</p>
              <p className="font-sans text-xs text-white/40 mt-1">{s.sub}</p>
            </motion.div>
          ))}
        </div>

        <p className="text-center font-sans text-white/60 text-sm max-w-3xl mx-auto">
          Naapio is the infrastructure layer that was missing — escrow, milestones, AI briefing, and verified artisan identity in one platform.
        </p>
      </div>
    </section>
  );
};

export default TrustSignals;
