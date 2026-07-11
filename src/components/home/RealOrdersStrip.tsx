import { useEffect } from "react";
import { featuredPosts } from "@/data/featuredPosts";

declare global {
  interface Window {
    instgrm?: {
      Embeds: {
        process: () => void;
      };
    };
  }
}

const RealOrdersStrip = () => {
  useEffect(() => {
    const scriptId = "instagram-embed-script";
    const existing = document.getElementById(scriptId) as HTMLScriptElement | null;
    if (!existing) {
      const script = document.createElement("script");
      script.id = scriptId;
      script.src = "https://www.instagram.com/embed.js";
      script.async = true;
      script.onload = () => {
        if (window.instgrm) window.instgrm.Embeds.process();
      };
      document.body.appendChild(script);
    } else if (window.instgrm) {
      window.instgrm.Embeds.process();
    }
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

        <div className="overflow-x-auto -mx-6 px-6 pb-4">
          <div className="flex gap-4">
            {featuredPosts.map((url) => (
              <div
                key={url}
                className="flex-shrink-0 w-[328px] rounded-2xl overflow-hidden bg-card"
                style={{ minHeight: 500 }}
              >
                <blockquote
                  className="instagram-media"
                  data-instgrm-permalink={url}
                  data-instgrm-version="14"
                  style={{
                    background: "#FFF",
                    border: 0,
                    borderRadius: 12,
                    boxShadow: "none",
                    margin: 0,
                    padding: 0,
                    width: "100%",
                    minWidth: 326,
                  }}
                >
                  <div className="p-6 animate-pulse">
                    <div className="h-4 w-24 bg-muted rounded mb-4" />
                    <div className="h-64 w-full bg-muted rounded" />
                  </div>
                </blockquote>
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
