import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Verificação de segurança para evitar erro no build
if (!supabaseUrl || !supabaseAnonKey) {
  if (process.env.NODE_ENV === 'development') {
    console.warn('Supabase URL or Anon Key missing in environment variables');
  }
}

// Inicializa o cliente apenas se as variáveis existirem, ou usa strings vazias (que serão tratadas pelo Supabase)
// Mas aqui vamos garantir que o build passe mesmo sem as chaves (o que é comum em builds estáticos)
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co', 
  supabaseAnonKey || 'placeholder'
);
