import { useEffect, useState } from "react";
import { featuredPosts } from "@/data/featuredPosts";

type OEmbedResult = {
  url: string;
  html: string | null;
  loading: boolean;
};

const RealOrdersStrip = () => {
  const [results, setResults] = useState<OEmbedResult[]>(
    () => featuredPosts.map((url) => ({ url, html: null, loading: true }))
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
              next[idx] = { url: postUrl, html: json.html || null, loading: false };
              return next;
            });
          } catch (err) {
            console.error("Instagram oEmbed failed for", postUrl, err);
            if (cancelled) return;
            setResults((prev) => {
              const next = [...prev];
              next[idx] = { url: postUrl, html: null, loading: false };
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
            {results.map((r, i) =>
              r.loading ? (
                <div
                  key={i}
                  className="bg-muted animate-pulse rounded-2xl w-64 h-80 flex-shrink-0"
                />
              ) : r.html ? (
                <div
                  key={i}
                  className="w-64 flex-shrink-0 rounded-2xl overflow-hidden border border-border bg-card"
                  dangerouslySetInnerHTML={{ __html: r.html }}
                />
              ) : (
                <a
                  key={i}
                  href={r.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-64 flex-shrink-0 rounded-2xl border border-border bg-card p-4 flex items-center justify-center text-center text-sm font-sans text-muted-foreground hover:text-accent transition-colors h-80"
                >
                  View on Instagram →
                </a>
              )
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
