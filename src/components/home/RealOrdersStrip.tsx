import { useEffect, useState } from "react";
import { Play } from "lucide-react";
import { featuredPosts } from "@/data/featuredPosts";
import { supabase } from "@/integrations/supabase/client";

type Card = {
  url: string;
  thumbnailUrl: string;
  authorName: string | null;
};

const RealOrdersStrip = () => {
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data, error } = await supabase.functions.invoke("instagram-oembed", {
          body: { urls: featuredPosts },
        });
        if (cancelled) return;
        if (error) {
          console.error("instagram-oembed invoke error", error);
          setCards([]);
        } else {
          setCards((data?.results as Card[]) || []);
        }
      } catch (e) {
        console.error("instagram-oembed fetch failed", e);
        if (!cancelled) setCards([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <p className="font-sans text-xs text-muted-foreground uppercase tracking-widest mb-4">
            From Our Artisans
          </p>
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">
            Real Orders, Real Craft
          </h2>
          <p className="font-sans text-muted-foreground text-lg">
            No stock photos. Every piece here was made for a real customer, by a real artisan.
          </p>
        </div>

        <div className="overflow-x-auto -mx-6 px-6">
          <div className="flex gap-4">
            {loading &&
              Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={`skel-${i}`}
                  className="bg-muted animate-pulse rounded-2xl w-64 h-80 flex-shrink-0"
                />
              ))}
            {!loading &&
              cards.map((r) => (
                <a
                  key={r.url}
                  href={r.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative w-64 h-80 flex-shrink-0 rounded-2xl overflow-hidden border border-border bg-card"
                >
                  <img
                    src={r.thumbnailUrl}
                    alt={r.authorName ? `Reel by ${r.authorName}` : "Instagram reel"}
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-black/20" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-14 h-14 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Play className="w-6 h-6 text-foreground ml-0.5" fill="currentColor" />
                    </div>
                  </div>
                  {r.authorName && (
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <p className="font-sans text-xs text-white/90 truncate">@{r.authorName}</p>
                    </div>
                  )}
                </a>
              ))}
            {!loading && cards.length === 0 && (
              <p className="font-sans text-sm text-muted-foreground py-12">
                Follow us on Instagram to see the latest work.
              </p>
            )}
          </div>
        </div>

        <div className="text-center mt-8">
          <a
            href="https://instagram.com/naapio.official"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 font-sans text-sm text-accent hover:text-accent/80 font-medium"
          >
            Follow @naapio.official on Instagram →
          </a>
        </div>
      </div>
    </section>
  );
};

export default RealOrdersStrip;
