import { useEffect, useState } from "react";
import { Play } from "lucide-react";
import { featuredPosts } from "@/data/featuredPosts";

type OEmbedResult = {
  url: string;
  thumbnail: string | null;
  author: string | null;
  loading: boolean;
};

const RealOrdersStrip = () => {
  const [results, setResults] = useState<OEmbedResult[]>(
    () => featuredPosts.map((url) => ({ url, thumbnail: null, author: null, loading: true }))
  );

  useEffect(() => {
    let cancelled = false;
    (async () => {
      await Promise.all(
        featuredPosts.map(async (postUrl, idx) => {
          try {
            const endpoint = `https://graph.facebook.com/v25.0/instagram_oembed?url=${encodeURIComponent(
              postUrl
            )}&omitscript=true`;
            const res = await fetch(endpoint);
            if (!res.ok) throw new Error(`oEmbed ${res.status}`);
            const json = await res.json();
            if (cancelled) return;
            setResults((prev) => {
              const next = [...prev];
              next[idx] = {
                url: postUrl,
                thumbnail: json.thumbnail_url || null,
                author: json.author_name || null,
                loading: false,
              };
              return next;
            });
          } catch (err) {
            console.error("Instagram oEmbed failed for", postUrl, err);
            if (cancelled) return;
            setResults((prev) => {
              const next = [...prev];
              next[idx] = { url: postUrl, thumbnail: null, author: null, loading: false };
              return next;
            });
          }
        })
      );
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const anyLoading = results.some((r) => r.loading);
  const visibleCards = results.filter((r) => r.loading || r.thumbnail);

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
            {visibleCards.map((r, i) =>
              r.loading ? (
                <div
                  key={`skel-${i}`}
                  className="bg-muted animate-pulse rounded-2xl w-64 h-80 flex-shrink-0"
                />
              ) : (
                <a
                  key={r.url}
                  href={r.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative w-64 h-80 flex-shrink-0 rounded-2xl overflow-hidden border border-border bg-card"
                >
                  <img
                    src={r.thumbnail!}
                    alt={r.author ? `Reel by ${r.author}` : "Instagram reel"}
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-black/20" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-14 h-14 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Play className="w-6 h-6 text-foreground ml-0.5" fill="currentColor" />
                    </div>
                  </div>
                  {r.author && (
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <p className="font-sans text-xs text-white/90 truncate">@{r.author}</p>
                    </div>
                  )}
                </a>
              )
            )}
            {!anyLoading && visibleCards.length === 0 && (
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
