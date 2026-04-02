import { createClient } from '@supabase/supabase-js';

// आपकी सुपाबेस की सही डिटेल्स
const supabaseUrl = 'https://gmbacynvygbibbtlgkrv.supabase.co';
const supabaseAnonKey = 'sb_publishable_i4uvTlszQ6fXx8M_-bE2LA_Bt62q4CE';

// क्लाइंट बनाना
export const supabase = createClient(supabaseUrl, supabaseAnonKey);