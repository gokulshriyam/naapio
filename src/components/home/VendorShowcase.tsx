import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import artisanSewing from "@/assets/artisan-sewing.jpg";
import artisanFabric from "@/assets/artisan-fabric.jpg";
import tailorReputation from "@/assets/tailor-reputation.jpg";

const craftOrigins = [
  { emoji: "🪡", craft: "Zardozi", origin: "Lucknow" },
  { emoji: "🧵", craft: "Chikankari", origin: "Lucknow" },
  { emoji: "🥻", craft: "Kanchipuram Silk", origin: "Tamil Nadu" },
  { emoji: "🌈", craft: "Bandhani", origin: "Kutch, Gujarat" },
  { emoji: "🌸", craft: "Phulkari", origin: "Punjab" },
  { emoji: "✨", craft: "Banarasi Brocade", origin: "Varanasi" },
  { emoji: "🎨", craft: "Kalamkari", origin: "Srikalahasti" },
  { emoji: "🪞", craft: "Mirror Work", origin: "Kutch" },
  { emoji: "🟡", craft: "Pochampally Ikat", origin: "Telangana" },
  { emoji: "🧶", craft: "Kantha", origin: "West Bengal" },
  { emoji: "🌿", craft: "Chanderi", origin: "Madhya Pradesh" },
  { emoji: "🔶", craft: "Sambalpuri Ikat", origin: "Odisha" },
  { emoji: "💛", craft: "Muga Silk", origin: "Assam" },
  { emoji: "🌺", craft: "Paithani", origin: "Aurangabad" },
  { emoji: "🪢", craft: "Bagh Print", origin: "Madhya Pradesh" },
  { emoji: "🔵", craft: "Ajrakh", origin: "Kutch" },
  { emoji: "🌟", craft: "Mysore Silk", origin: "Karnataka" },
  { emoji: "🌀", craft: "Pashmina Embroidery", origin: "Kashmir" },
  { emoji: "🌻", craft: "Madhubani", origin: "Bihar" },
  { emoji: "💠", craft: "Patola", origin: "Patan, Gujarat" },
];

const artisans = [
  {
    image: artisanSewing,
    badge: "🪡 Zardozi Embroiderer",
    name: "Fatima S. · Srinagar, Kashmir",
    tier: "⭐ Gold Tier · 4.9 · 312 orders",
    before: "₹18,000/month",
    after: "₹54,000/month",
    craft: "22 years · Zardozi embroidery",
  },
  {
    image: artisanFabric,
    badge: "🥻 Master Weaver",
    name: "Rajan M. · Kanchipuram, Tamil Nadu",
    tier: "⭐ Gold Tier · 4.8 · 187 orders",
    before: "₹22,000/month",
    after: "₹61,000/month",
    craft: "34 years · Kanchipuram silk",
  },
  {
    image: tailorReputation,
    badge: "✂️ Master Tailor",
    name: "Priya D. · Jayanagar, Bangalore",
    tier: "⭐ Gold Tier · 4.9 · 234 orders",
    before: "₹20,000/month",
    after: "₹52,000/month",
    craft: "15 years · Bridal lehenga specialist",
  },
];

const VendorShowcase = () => {
  const navigate = useNavigate();

  return (
    <section className="py-24 bg-secondary">
      <style>{`@keyframes naapio-marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }`}</style>

      <div className="container mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-flex px-4 py-1 rounded-full bg-accent/10 text-accent font-sans text-xs font-medium mb-6">
            13 million artisans. Finally visible.
          </span>
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">
            Heritage craft meets digital trust.
          </h2>
          <p className="font-sans text-muted-foreground text-lg max-w-2xl mx-auto">
            Zardozi embroiderers in Kashmir. Kanchipuram weavers in Tamil Nadu. Bandhani artists in Rajasthan. For the first time, they have a platform — verified identity, structured income, escrow-protected payment.
          </p>
        </motion.div>
      </div>

      {/* Marquee strip (full-bleed) */}
      <div className="w-full overflow-hidden py-6 mb-16 border-y border-border">
        <div
          className="flex gap-8 whitespace-nowrap"
          style={{ animation: "naapio-marquee 60s linear infinite", width: "max-content" }}
        >
          {[...craftOrigins, ...craftOrigins].map((c, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-2 font-sans text-sm text-muted-foreground whitespace-nowrap"
            >
              <span>{c.emoji}</span>
              <span className="text-foreground">{c.craft}</span>
              <span>·</span>
              <span>{c.origin}</span>
              <span className="text-accent ml-6">✦</span>
            </span>
          ))}
        </div>
      </div>

      <div className="container mx-auto px-6">
        {/* Artisan cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {artisans.map((a, i) => (
            <motion.div
              key={a.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-card rounded-2xl border border-border overflow-hidden"
            >
              <div className="relative">
                <img src={a.image} alt={a.name} className="w-full h-48 object-cover" />
                <span className="absolute top-3 left-3 bg-black/60 backdrop-blur text-white font-sans text-xs px-3 py-1 rounded-full">
                  {a.badge}
                </span>
              </div>
              <div className="p-5">
                <p className="font-serif font-bold text-foreground text-base">{a.name}</p>
                <span className="inline-flex bg-amber-400 text-amber-950 font-sans text-[10px] font-bold px-2 py-0.5 rounded-full mb-3 mt-2">
                  {a.tier}
                </span>
                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground font-sans text-xs">Before Naapio:</span>
                    <span className="text-foreground font-sans text-sm">{a.before}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-accent font-sans text-xs font-medium">On Naapio:</span>
                    <span className="text-foreground font-sans text-sm font-semibold">{a.after}</span>
                  </div>
                </div>
                <p className="font-sans text-xs text-muted-foreground mt-3">{a.craft}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Dual CTA */}
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-card rounded-2xl border border-border p-8"
          >
            <span className="text-4xl block mb-4">👗</span>
            <h3 className="font-serif text-xl font-bold mb-3">For Fashion Lovers</h3>
            <p className="font-sans text-sm text-muted-foreground mb-6">
              Post a brief. Receive bids from verified artisans within 7 days. Every rupee protected by escrow until you approve.
            </p>
            <ul className="space-y-3">
              {[
                "Bespoke made-to-measure outfits",
                "Blind bidding ensures honest market prices",
                "Escrow releases only at your final approval",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm font-sans text-foreground">
                  <Check className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
            <Button variant="gold" className="w-full mt-6" onClick={() => navigate("/start")}>
              Start My Order →
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-card rounded-2xl border border-border p-8"
          >
            <span className="text-4xl block mb-4">✂️</span>
            <h3 className="font-serif text-xl font-bold mb-3">For Master Artisans</h3>
            <p className="font-sans text-sm text-muted-foreground mb-6">
              No client hunting. No payment chasing. Naapio brings verified customers with confirmed budgets — and pays you through escrow, on time, every time.
            </p>
            <ul className="space-y-3">
              {[
                "Escrow-guaranteed payment — never chase a client",
                "Verified digital identity and order history",
                "Gold Tier artisans earn 3x their offline income",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm font-sans text-foreground">
                  <Check className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
            <Button
              variant="outline"
              className="w-full mt-6 border-accent text-accent hover:bg-accent hover:text-accent-foreground"
              onClick={() => navigate("/for-tailors")}
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
