import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import mensFashion from "@/assets/mens-fashion.jpg";
import womensFashion from "@/assets/womens-fashion.jpg";

const categories = [
  {
    title: "Men's Bespoke",
    items: ["Sherwani", "Bandhgala", "Suit", "Kurta", "Indo-Western", "Veshti / Mundu", "Regional Traditional"],
    image: mensFashion,
    gender: "Men",
  },
  {
    title: "Women's Bespoke",
    items: ["Lehenga", "Saree Blouse", "Anarkali", "Gown", "Salwar Kameez", "Chaniya Choli", "Maternity Wear"],
    image: womensFashion,
    gender: "Women",
  },
];

const occasions = [
  { emoji: "💒", label: "Bridal & Wedding", sub: "Lehengas, Sherwanis, Anarkalis" },
  { emoji: "🎉", label: "Festive & Party", sub: "Salwar Kameez, Gowns, Kurtis" },
  { emoji: "💼", label: "Formal & Office", sub: "Suits, Blazers, Formal Shirts" },
  { emoji: "🛕", label: "Religious & Puja", sub: "Dhoti, Saree Blouses, Dhotis" },
  { emoji: "📸", label: "Pre-Wedding Shoots", sub: "Matching outfits, Indo-Western" },
  { emoji: "✂️", label: "Alterations & Repairs", sub: "Quick fixes, resizing, restoration" },
];

const CategoryPreview = () => {
  const navigate = useNavigate();

  return (
    <section id="categories" className="py-24 bg-secondary">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4">Explore Categories</h2>
          <p className="text-muted-foreground font-sans text-lg">From regal sherwanis to breathtaking lehengas</p>
        </motion.div>

        {/* Main category cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.title}
              initial={{ opacity: 0, x: i === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="group relative overflow-hidden rounded-2xl cursor-pointer"
              onClick={() => {
                localStorage.setItem('naapio_prefill', JSON.stringify({
                  gender: cat.gender,
                  orderType: 'New Order',
                }));
                navigate('/start');
              }}
            >
              <img src={cat.image} alt={cat.title} className="w-full h-[400px] object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/40 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <h3 className="text-2xl font-serif font-bold text-primary-foreground mb-3">{cat.title}</h3>
                <div className="flex flex-wrap gap-2 mb-4">
                  {cat.items.map((item) => (
                    <button
                      key={item}
                      onClick={(e) => {
                        e.stopPropagation();
                        localStorage.setItem('naapio_prefill', JSON.stringify({
                          gender: cat.gender,
                          category: item,
                          orderType: 'New Order',
                        }));
                        navigate('/start');
                      }}
                      className="px-3 py-1 text-xs font-sans font-medium bg-primary-foreground/20 text-primary-foreground rounded-full backdrop-blur-sm hover:bg-primary-foreground/40 transition-colors"
                    >
                      {item}
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-2 text-accent font-sans font-medium text-sm group-hover:gap-3 transition-all">
                  <span>Start your order</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Occasion tiles */}
        <div className="flex items-center gap-4 max-w-4xl mx-auto mb-10">
          <div className="flex-1 h-px bg-border" />
          <p className="text-sm font-sans font-semibold text-muted-foreground uppercase tracking-wider">
            Shop by occasion
          </p>
          <div className="flex-1 h-px bg-border" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
          {occasions.map((occ, i) => (
            <motion.button
              key={occ.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              onClick={() => navigate('/start')}
              className="bg-card rounded-2xl border border-border p-5 text-left hover:shadow-md hover:border-accent/30 transition-all cursor-pointer"
            >
              <span className="text-3xl block mb-3">{occ.emoji}</span>
              <h3 className="font-serif font-bold text-foreground text-sm mb-1">{occ.label}</h3>
              <p className="text-xs font-sans text-muted-foreground">{occ.sub}</p>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryPreview;
