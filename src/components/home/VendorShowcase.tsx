import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

const VendorShowcase = () => {
  const navigate = useNavigate();

  return (
    <section className="py-24 bg-secondary">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4">
            A Platform Built for Both Sides of Fashion
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Customer card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-card rounded-2xl border border-border p-8"
          >
            <span className="text-4xl block mb-4">👗</span>
            <h3 className="text-xl font-serif font-bold text-foreground mb-3">For Fashion Lovers</h3>
            <p className="text-sm font-sans text-muted-foreground mb-6 leading-relaxed">
              Post a brief in 4 minutes. Get bids from 50+ skilled artisans within 7 days. Your payment stays in escrow until you're happy.
            </p>
            <ul className="space-y-3 mb-8">
              {[
                "Bespoke made-to-measure outfits",
                "Verified artisans with portfolios",
                "Escrow-backed payment protection",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm font-sans text-foreground">
                  <Check className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
            <Button variant="gold" onClick={() => navigate('/start')} className="w-full">
              Start My Order →
            </Button>
          </motion.div>

          {/* Vendor card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-card rounded-2xl border border-border p-8"
          >
            <span className="text-4xl block mb-4">✂️</span>
            <h3 className="text-xl font-serif font-bold text-foreground mb-3">For Master Artisans</h3>
            <p className="text-sm font-sans text-muted-foreground mb-6 leading-relaxed">
              Earn ₹60,000/month on 5 orders. No client hunting, no payment chasing. Naapio brings verified customers with confirmed budgets directly to you.
            </p>
            <ul className="space-y-3 mb-8">
              {[
                "Guaranteed escrow payments",
                "Build a verified reputation score",
                "Gold Tier artisans get priority leads",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm font-sans text-foreground">
                  <Check className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
            <Button
              variant="outline"
              onClick={() => navigate('/for-tailors')}
              className="w-full border-accent text-accent hover:bg-accent hover:text-accent-foreground"
            >
              Join as Artisan →
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default VendorShowcase;
