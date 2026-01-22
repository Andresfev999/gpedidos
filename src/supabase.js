import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dyxltewztkzyujpglyex.supabase.co';
const supabaseKey = 'sb_publishable_we1in31z8-P8u2GADfmtkA_gJKKAEBC';

export const supabase = createClient(supabaseUrl, supabaseKey);
