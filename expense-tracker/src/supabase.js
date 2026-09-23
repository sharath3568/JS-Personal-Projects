import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://yoaxalepoxusmquipxta.supabase.co";

const supabaseKey = "sb_publishable_xOWrsdRRDC6GXdXpUIowMQ_SghKXhT1";

export const supabase = createClient(
    supabaseUrl,
    supabaseKey
);

// NEXT_PUBLIC_SUPABASE_URL=https://yoaxalepoxusmquipxta.supabase.co
// NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_xOWrsdRRDC6GXdXpUIowMQ_SghKXhT1