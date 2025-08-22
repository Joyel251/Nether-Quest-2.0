import { createClient } from "@supabase/supabase-js";

export async function createAdminClient () {
    return createClient(
        process.env.SUPABASE_URL!,
        process.env.SERVICE_ROLE_KEY!,
        {
            auth: {
                autoRefreshToken: false,
                persistSession: false
            },
            global: {
                headers: {
                    'X-Client-Info': 'nether-quest-admin'
                }
            },
            // Add timeout and retry configuration
            realtime: {
                timeout: 10000
            }
        }
    );
}
