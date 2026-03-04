import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import mensFashion from "@/assets/mens-fashion.jpg";
import womensFashion from "@/assets/womens-fashion.jpg";

const categories = [
  {
    title: "Men's Bespoke",
    items: ["Sherwani", "Bandhgala", "Suit", "Kurta", "Indo-Western"],
    image: mensFashion,
  },
  {
    title: "Women's Bespoke",
    items: ["Lehenga", "Saree Blouse", "Anarkali", "Gown", "Salwar Kameez"],
    image: womensFashion,
  },
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
          <h2 className="text-4xl font-serif font-bold text-foreground mb-4">Explore Categories</h2>
          <p className="text-muted-foreground font-sans text-lg">From regal sherwanis to breathtaking lehengas</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.title}
              initial={{ opacity: 0, x: i === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="group relative overflow-hidden rounded-2xl cursor-pointer"
              onClick={() => navigate("/wizard")}
            >
              <img src={cat.image} alt={cat.title} className="w-full h-[400px] object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/40 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <h3 className="text-2xl font-serif font-bold text-primary-foreground mb-3">{cat.title}</h3>
                <div className="flex flex-wrap gap-2 mb-4">
                  {cat.items.map((item) => (
                    <span key={item} className="px-3 py-1 text-xs font-sans font-medium bg-primary-foreground/20 text-primary-foreground rounded-full backdrop-blur-sm">
                      {item}
                    </span>
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
      </div>
    </section>
  );
};

export default CategoryPreview;
