import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { Loading } from "@/components/sections/Loading";


export const ProtectedRoute = () => {
  const { user, isLoading } = useAuthStore();
  // 1. Mientras Supabase verifica la sesión, mostramos un spinner
  if (isLoading) {
    return (
      <Loading />
    );
  }

  // 2. Si terminó de cargar y NO hay usuario, lo mandamos al Login
  if (!user || user === null) {
    return <Navigate to="/" replace />;
  }

  // 3. Si hay usuario, renderizamos las rutas hijas (Outlet)
  return <Outlet />;
};