import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Instagram } from "lucide-react";

type IGPost = {
  id: string;
  caption: string | null;
  media_type: string;
  media_url: string;
  thumbnail_url: string | null;
  permalink: string;
  posted_at: string | null;
};

const RealOrdersStrip = () => {
  const [posts, setPosts] = useState<IGPost[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from('instagram_posts_cache')
        .select('*')
        .order('posted_at', { ascending: false })
        .limit(10);
      setPosts((data as IGPost[]) || []);
      setLoading(false);
    })();
  }, []);

  if (!loading && (!posts || posts.length === 0)) return null;

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
              Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-muted animate-pulse rounded-2xl w-64 h-80 flex-shrink-0"
                />
              ))}

            {!loading &&
              posts?.map((p) => (
                <div
                  key={p.id}
                  className="w-64 flex-shrink-0 rounded-2xl overflow-hidden border border-border bg-card"
                >
                  {p.media_type === 'VIDEO' ? (
                    <video
                      src={p.media_url}
                      poster={p.thumbnail_url || undefined}
                      controls
                      muted
                      loop
                      playsInline
                      className="w-full h-64 object-cover bg-black"
                    />
                  ) : (
                    <img
                      src={p.media_url}
                      alt={p.caption?.slice(0, 80) || 'Naapio artisan work'}
                      className="w-full h-64 object-cover"
                      loading="lazy"
                    />
                  )}
                  <div className="p-3 flex items-start gap-2">
                    <p className="font-sans text-xs text-muted-foreground line-clamp-2 flex-1">
                      {p.caption || ''}
                    </p>
                    <a
                      href={p.permalink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-accent hover:text-accent/80 flex-shrink-0"
                      aria-label="View on Instagram"
                    >
                      <Instagram className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              ))}
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
