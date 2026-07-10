import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import mehendiVideo from "@/assets/wedding/mehendi.mp4.asset.json";
import sangeetVideo from "@/assets/wedding/sangeet.mp4.asset.json";
import haldiVideo from "@/assets/wedding/haldi.mp4.asset.json";
import weddingDayVideo from "@/assets/wedding/wedding-day.mp4.asset.json";
import receptionVideo from "@/assets/wedding/reception.mp4.asset.json";

const functions = [
  { name: "Mehendi", video: mehendiVideo.url },
  { name: "Sangeet", video: sangeetVideo.url },
  { name: "Haldi", video: haldiVideo.url },
  { name: "Wedding Day", video: weddingDayVideo.url },
  { name: "Reception", video: receptionVideo.url },
];

const WeddingEdit = () => {
  const navigate = useNavigate();
  return (
    <section className="py-24 bg-foreground relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-transparent to-accent/5 pointer-events-none" />
      <div className="container mx-auto px-6 relative">
        <div className="text-center mb-12">
          <p className="font-sans text-xs text-accent uppercase tracking-widest mb-4">
            The Wedding Edit
          </p>
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-white mb-4">
            Every outfit, for every function
          </h2>
          <p className="font-sans text-white/60 text-lg max-w-2xl mx-auto">
            Mehendi to reception — bridal wear built for the whole celebration, not just the big day.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-12">
          {functions.map((f, i) => (
            <motion.div
              key={f.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="rounded-2xl overflow-hidden relative aspect-[3/4] cursor-pointer group bg-black/40"
              onClick={() => navigate('/start')}
            >
              <video
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              >
                <source src={f.video} type="video/mp4" />
              </video>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <p className="font-serif font-bold text-white text-lg">{f.name}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center">
          <Button variant="gold" size="lg" onClick={() => navigate('/start')}>
            Start Your Bridal Order →
          </Button>
        </div>
      </div>
    </section>
  );
};

export default WeddingEdit;
