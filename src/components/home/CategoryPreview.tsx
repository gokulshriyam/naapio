import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const orderTypes = [
  {
    emoji: "🆕",
    title: "New Order",
    description: "Make a new outfit from scratch",
    color: "bg-blue-50 border-blue-200 hover:border-blue-400",
    type: "new-order",
  },
  {
    emoji: "✂️",
    title: "Alteration / Repair",
    description: "Fix or resize existing clothes",
    color: "bg-orange-50 border-orange-200 hover:border-orange-400",
    type: "alteration",
  },
  {
    emoji: "🧵",
    title: "I Have My Own Fabric",
    description: "Just need stitching & design",
    color: "bg-green-50 border-green-200 hover:border-green-400",
    type: "own-fabric",
  },
  {
    emoji: "🎨",
    title: "Customise My Garment",
    description: "Add artwork to existing piece",
    color: "bg-purple-50 border-purple-200 hover:border-purple-400",
    type: "customise",
  },
];

const categories = [
  {
    title: "Men's Bespoke",
    items: ["Sherwani", "Bandhgala", "Suit", "Kurta", "Indo-Western", "Veshti / Mundu", "Regional Traditional"],
    image: "https://source.unsplash.com/featured/?indian+man+sherwani+ethnic+fashion&1070",
  },
  {
    title: "Women's Bespoke",
    items: ["Lehenga", "Saree Blouse", "Anarkali", "Gown", "Salwar Kameez", "Chaniya Choli", "Maternity Wear"],
    image: "https://source.unsplash.com/featured/?indian+woman+lehenga+bridal+fashion&1071",
  },
];

const CategoryPreview = () => {
  const navigate = useNavigate();

  return (
    <section id="categories" className="py-24 bg-secondary">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-serif font-bold text-foreground mb-4">Explore Categories</h2>
          <p className="text-muted-foreground font-sans text-lg">From regal sherwanis to breathtaking lehengas</p>
        </motion.div>

        {/* ORDER TYPE TILES */}
        <div className="mb-12">
          <p className="text-sm font-sans font-semibold text-muted-foreground uppercase tracking-wider mb-4 text-center">
            What would you like to do?
          </p>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {orderTypes.map((type) => (
              <button
                key={type.title}
                onClick={() => {
                  localStorage.setItem('naapio_prefill', JSON.stringify({
                    orderType: type.title,
                  }));
                  navigate('/start');
                }}
                className={`border-2 rounded-xl p-5 text-left transition-all duration-200 hover:shadow-md hover:scale-[1.02] ${type.color}`}
              >
                <div className="text-3xl mb-2">{type.emoji}</div>
                <h3 className="text-sm font-serif font-bold text-foreground mb-1">
                  {type.title}
                </h3>
                <p className="text-xs font-sans text-muted-foreground leading-snug">
                  {type.description}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-4 max-w-4xl mx-auto mb-12">
          <div className="flex-1 h-px bg-border" />
          <p className="text-sm font-sans font-semibold text-muted-foreground uppercase tracking-wider">
            Browse by category
          </p>
          <div className="flex-1 h-px bg-border" />
        </div>

        {/* CATEGORY CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {categories.map((cat, i) => {
            const gender = cat.title.startsWith("Men") ? "Men" : "Women";
            return (
              <motion.div
                key={cat.title}
                initial={{ opacity: 0, x: i === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="group relative overflow-hidden rounded-2xl cursor-pointer"
                onClick={() => {
                  localStorage.setItem('naapio_prefill', JSON.stringify({
                    gender: gender,
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
                          navigate("/start", { state: { prefilledGender: gender, prefilledCategory: item } });
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
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CategoryPreview;
