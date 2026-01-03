import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { Loader2 } from "lucide-react";

export const ProtectedRoute = () => {
  const { user, isLoading } = useAuthStore();
    console.log("ProtectedRoute - user:", user, "isLoading:", isLoading);
  // 1. Mientras Supabase verifica la sesión, mostramos un spinner
  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-50">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  // 2. Si terminó de cargar y NO hay usuario, lo mandamos al Login
  if (!user || user === null) {
    return <Navigate to="/" replace />;
  }

  // 3. Si hay usuario, renderizamos las rutas hijas (Outlet)
  return <Outlet />;
};