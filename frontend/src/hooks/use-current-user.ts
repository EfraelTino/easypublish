import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export function useCurrentUser() {
  return useQuery({
    queryKey: ["current-user"],
    queryFn: async () => {
      // 1. Obtener usuario de Auth
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) throw new Error("No autenticado");
      // 2. Obtener perfil de la DB
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (profileError) throw profileError;

      // 3. (Opcional) Obtener la organización si es necesaria
      // Podrías hacer otro query separado o incluirlo aquí si siempre van juntos
      const { data: org } = await supabase
        .from("organizations")
        .select("*")
        .eq("owner_id", user.id)
        .maybeSingle();

      return { user, profile, org };
    },
    staleTime: 1000 * 60 * 5, // Los datos se consideran frescos por 5 minutos
  });
}