import { motion } from "framer-motion";

const signals = [
  { emoji: "🔒", label: "Escrow Protected", sub: "Artisan paid only after your approval" },
  { emoji: "✅", label: "Aadhaar-Verified Artisans", sub: "Every artisan is identity & skill verified" },
  { emoji: "⭐", label: "4.8★ Average Rating", sub: "Across 2,000+ completed orders" },
  { emoji: "🔄", label: "Free Alterations", sub: "One round of alterations included" },
];

const TrustSignals = () => {
  return (
    <section className="py-16 md:py-20 bg-primary">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-6">
          {signals.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <span className="text-3xl mb-3 block">{s.emoji}</span>
              <h3 className="text-sm md:text-base font-serif font-bold text-primary-foreground mb-1">{s.label}</h3>
              <p className="text-xs md:text-sm font-sans text-primary-foreground/60">{s.sub}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustSignals;
