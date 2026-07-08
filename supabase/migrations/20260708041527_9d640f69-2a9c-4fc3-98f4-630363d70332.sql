CREATE TABLE public.instagram_posts_cache (
  id text PRIMARY KEY,
  caption text,
  media_type text,
  media_url text,
  thumbnail_url text,
  permalink text,
  posted_at timestamptz,
  synced_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.instagram_posts_cache TO anon;
GRANT SELECT ON public.instagram_posts_cache TO authenticated;
GRANT ALL ON public.instagram_posts_cache TO service_role;

ALTER TABLE public.instagram_posts_cache ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read of cached Instagram posts"
  ON public.instagram_posts_cache
  FOR SELECT
  USING (true);

CREATE INDEX instagram_posts_cache_posted_at_idx
  ON public.instagram_posts_cache (posted_at DESC);