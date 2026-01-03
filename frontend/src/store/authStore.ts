import { create } from "zustand";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase"; // Importar cliente

interface AuthState {
  session: Session | null;
  user: User | null;
  hasOrganization: boolean | null; // Nuevo estado: null = no sabemos, true/false
  isLoading: boolean;
  setSession: (session: Session | null) => Promise<void>; // Ahora es asíncrona
}

export const useAuthStore = create<AuthState>((set, get) => ({
  session: null,
  user: null,
  hasOrganization: null,
  isLoading: true,

  setSession: async (session) => {
    // 1. Guardamos sesión básica
    set({
      session,
      user: session ? session.user : null,
      isLoading: session ? true : false, // Si hay sesión, seguimos cargando hasta chequear la org
    });

    // 2. Si hay usuario, verificamos si tiene organización
    if (session?.user) {
      const { data, error } = await supabase
        .from("organizations")
        .select("id")
        .eq("owner_id", session.user.id)
        .maybeSingle(); // maybeSingle no tira error si no hay resultados, devuelve null

      // Actualizamos estado final
      set({
        hasOrganization: !!data, // true si encontró algo, false si es null
        isLoading: false,
      });
    } else {
      // Si no hay sesión, terminamos carga
      set({ hasOrganization: false, isLoading: false });
    }
  },
}));