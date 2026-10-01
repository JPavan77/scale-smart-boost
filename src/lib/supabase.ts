import { createClient } from "@supabase/supabase-js";

const url = "https://jyhwqhhtcucdeoixkjvs.supabase.co";
const key = "sb_publishable_5oU3evcIkLozGoQvtoZD_g_rg_hu9kE";

export const cloudConfigured = true;

export const supabase = createClient(url, key, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

export const catalogBucket = "catalog-images";
