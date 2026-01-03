import { useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "@/components/ui/sonner";

// Importaciones tuyas
import { router } from "./routes/routers"; // Asegúrate que la ruta sea correcta
import { queryClient } from "@/lib/react-query";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/store/authStore";

export default function App() {
  const { setSession } = useAuthStore();

  useEffect(() => {
    // 1. Verificamos sesión al cargar la página
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session); // Esto cambiará isLoading a false
    });

    // 2. Escuchamos cambios (login, logout, etc.)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, [setSession]);

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <ReactQueryDevtools initialIsOpen={false} />
      <Toaster closeButton richColors />
    </QueryClientProvider>
  );
}