import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const token = Deno.env.get('INSTAGRAM_ACCESS_TOKEN');
    if (!token) throw new Error('INSTAGRAM_ACCESS_TOKEN not configured');

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, serviceKey);

    const url = `https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,thumbnail_url,permalink,timestamp&limit=12&access_token=${token}`;
    const igRes = await fetch(url);
    if (!igRes.ok) {
      const errText = await igRes.text();
      throw new Error(`Instagram API error ${igRes.status}: ${errText}`);
    }
    const igJson = await igRes.json();
    const posts: any[] = (igJson.data || []).filter(
      (p: any) => p.media_type === 'IMAGE' || p.media_type === 'VIDEO'
    );

    const rows = posts.map((p) => ({
      id: p.id,
      caption: p.caption || null,
      media_type: p.media_type,
      media_url: p.media_url,
      thumbnail_url: p.thumbnail_url || null,
      permalink: p.permalink,
      posted_at: p.timestamp,
      synced_at: new Date().toISOString(),
    }));

    if (rows.length > 0) {
      const { error } = await supabase.from('instagram_posts_cache').upsert(rows, { onConflict: 'id' });
      if (error) throw error;
    }

    return new Response(
      JSON.stringify({ synced: rows.length, ids: rows.map((r) => r.id) }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('instagram-sync error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
