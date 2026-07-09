import { motion } from "framer-motion";

const badges = [
  { emoji: "🔒", label: "Escrow Protected" },
  { emoji: "🎯", label: "Milestone-by-Milestone Approval", sub: "You approve every stage before funds release" },
  { emoji: "✅", label: "Verified Artisans Only" },
];

const TrustSignals = () => {
  return (
    <section className="py-16 bg-foreground">
      <div className="max-w-3xl mx-auto px-6 text-center">
        <p className="font-sans text-white/70 text-lg leading-relaxed mb-8">
          Paying a stranger online for something this personal? That's exactly the problem escrow was built to solve. Your money sits safely in escrow — the artisan is only paid once you approve the finished piece.
        </p>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="flex justify-center gap-8 flex-wrap"
        >
          {badges.map((b, i) => (
            <motion.div
              key={b.label}
              variants={{
                hidden: { opacity: 0, y: 10 },
                visible: { opacity: 1, y: 0, transition: { delay: i * 0.15 } },
              }}
              className="flex flex-col items-center"
            >
              <span className="text-2xl mb-2">{b.emoji}</span>
              <span className="font-sans text-sm text-white font-medium">{b.label}</span>
              {b.sub && (
                <span className="font-sans text-xs text-white/50 mt-1">{b.sub}</span>
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default TrustSignals;
