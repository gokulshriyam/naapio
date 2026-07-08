import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const pulseMessages = [
  "An artisan in Bangalore just accepted a new brief",
  "A Kanchipuram silk blouse was just approved for delivery",
  "A customer in Chennai just posted a bridal lehenga brief",
  "An embroiderer just uploaded fabric swatches for approval",
  "A Zardozi artisan's bid was just accepted",
  "A customer just approved their final fitting",
];

const LivePulseStrip = () => {
  const [i, setI] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % pulseMessages.length), 4000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="bg-accent/5 border-y border-accent/10 py-3">
      <div className="container mx-auto px-6 flex items-center justify-center gap-3">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-60" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-accent" />
        </span>
        <AnimatePresence mode="wait">
          <motion.span
            key={i}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.4 }}
            className="font-sans text-sm text-foreground/70 text-center"
          >
            {pulseMessages[i]}
          </motion.span>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default LivePulseStrip;
