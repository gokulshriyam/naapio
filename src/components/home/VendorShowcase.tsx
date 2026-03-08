import { motion } from "framer-motion";
import { Star, MapPin, Award } from "lucide-react";

const vendors = [
  { name: "Master Artisan", tier: "Gold", rating: 4.9, city: "Bangalore", spec: "Bridal & Lehenga", orders: 340, img: "https://source.unsplash.com/featured/?indian+tailor+sewing+workshop&1060" },
  { name: "Heritage Weaver", tier: "Gold", rating: 4.8, city: "Jaipur", spec: "Sherwani & Kurta", orders: 280, img: "https://source.unsplash.com/featured/?master+tailor+measuring+fabric&1061" },
  { name: "Silk Studio", tier: "Silver", rating: 4.7, city: "Surat", spec: "Saree Blouse", orders: 195, img: "https://source.unsplash.com/featured/?tailor+workshop+india+stitching&1062" },
  { name: "Royal Stitch", tier: "Gold", rating: 4.9, city: "Lucknow", spec: "Indo-Western", orders: 310, img: "https://source.unsplash.com/featured/?indian+craftsman+textile+work&1063" },
];

const tierColor: Record<string, string> = {
  Gold: "bg-accent text-accent-foreground",
  Silver: "bg-muted text-foreground",
  Bronze: "bg-warning-light text-warning",
};

const VendorShowcase = () => {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-serif font-bold text-foreground mb-4">Our Master Tailors</h2>
          <p className="text-muted-foreground font-sans text-lg">Handpicked artisans from across India</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {vendors.map((v, i) => (
            <motion.div
              key={v.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="rounded-2xl border border-border hover:border-accent/30 hover:shadow-lg transition-all bg-card overflow-hidden"
            >
              <img src={v.img} alt={v.name} className="w-full h-40 object-cover" />
              <div className="p-5">
                <h3 className="font-sans font-semibold text-foreground mb-1">{v.name}</h3>
                <div className="flex items-center gap-2 mb-3">
                  <span className={`text-xs font-sans font-bold px-2 py-0.5 rounded-full ${tierColor[v.tier]}`}>
                    {v.tier.toUpperCase()}
                  </span>
                  <div className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-accent text-accent" />
                    <span className="text-sm font-sans font-medium text-foreground">{v.rating}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-muted-foreground text-sm font-sans mb-2">
                  <MapPin className="w-3.5 h-3.5" />
                  {v.city}
                </div>
                <p className="text-xs text-muted-foreground font-sans">{v.spec} • {v.orders} orders</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default VendorShowcase;
