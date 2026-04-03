import { createClient } from '@supabase/supabase-js';

// NM MART Retail OS - Supabase Configuration
const supabaseUrl = 'https://gmbacynvygbibbtlgkrv.supabase.co';
const supabaseAnonKey = 'sb_publishable_i4uvTlszQ6fXx8M_-bE2LA_Bt62q4CE';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
