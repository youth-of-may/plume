import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

let supabaseClient: ReturnType<typeof createBrowserClient> | null = null;

export const createClient = (): ReturnType<typeof createBrowserClient> => {
  // During SSR without env vars (e.g. local builds), skip instantiation.
  // All actual Supabase calls are in useEffect/event handlers which only run client-side.
  if (!supabaseUrl || !supabaseKey) {
    return {} as ReturnType<typeof createBrowserClient>;
  }
  if (!supabaseClient) {
    supabaseClient = createBrowserClient(supabaseUrl, supabaseKey);
  }
  return supabaseClient;
};
