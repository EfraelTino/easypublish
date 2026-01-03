import { createClient } from '@supabase/supabase-js';

// 1. Leemos las variables de entorno
// NOTA: Si usas Next.js cambia import.meta.env.VITE_... por process.env.NEXT_PUBLIC_...
const supabaseUrl = import.meta.env.VITE_PUBLIC_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY;

// 2. Validación para evitar errores si olvidas el .env
if (!supabaseUrl || !supabaseKey) {
  throw new Error('Faltan las variables de entorno de Supabase (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY)');
}

// 3. Exportamos el cliente instanciado
export const supabase = createClient(supabaseUrl, supabaseKey);