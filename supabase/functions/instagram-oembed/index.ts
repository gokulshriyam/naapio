import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const token = Deno.env.get('INSTAGRAM_ACCESS_TOKEN');
    if (!token) throw new Error('INSTAGRAM_ACCESS_TOKEN not configured');

    const { urls } = await req.json();
    if (!Array.isArray(urls)) {
      return new Response(JSON.stringify({ error: 'urls must be an array' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const results = await Promise.all(
      urls.map(async (url: string) => {
        try {
          const endpoint = `https://graph.facebook.com/v25.0/instagram_oembed?url=${encodeURIComponent(
            url
          )}&omitscript=true&access_token=${token}`;
          const res = await fetch(endpoint);
          if (!res.ok) {
            const errText = await res.text();
            console.error(`oEmbed failed for ${url}: ${res.status} ${errText}`);
            return null;
          }
          const json = await res.json();
          if (!json.thumbnail_url) return null;
          return {
            url,
            thumbnailUrl: json.thumbnail_url,
            authorName: json.author_name || null,
          };
        } catch (e) {
          console.error(`oEmbed exception for ${url}:`, e);
          return null;
        }
      })
    );

    const filtered = results.filter((r) => r !== null);
    return new Response(JSON.stringify({ results: filtered }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('instagram-oembed error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
