import { createBrowserRouter } from "react-router-dom";

// Componentes
import { Login } from "@/pages/Login";
import { Register } from "@/pages/Register";
import { NotFound } from "@/pages/NotFound"; // Corregí el typo 'NotFoun'
import { Dashboard } from "@/pages/Dashboard";
import MembersView from "@/pages/MembersView";
import { CreateOrganization } from "@/pages/CreateOrganization";

// El Guardián que acabamos de crear
import { ProtectedRoute } from "@/routes/ProtectedRoute";

export const router = createBrowserRouter([
  // ---------------------------------------------------
  // 🔓 RUTAS PÚBLICAS (No requieren sesión)
  // ---------------------------------------------------
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },

  // ---------------------------------------------------
  // 🔒 RUTAS PROTEGIDAS (Requieren Login)
  // ---------------------------------------------------
  {
    element: <ProtectedRoute />, // 🛡️ Aquí está la magia
    children: [
      {
        path: "/create-organization",
        element: <CreateOrganization />,
      },
      {
        path: "/dashboard",
        // Si tienes un Layout con Sidebar/Navbar, úsalo aquí como 'element'
        children: [
          {
            index: true, // Esto hace que /dashboard renderice <Dashboard />
            element: <Dashboard />, 
          },
          {
            path: "settings/members", // /dashboard/settings/members
            element: <MembersView />,
          },
        ],
      },
    ],
  },

  // ---------------------------------------------------
  // ❌ RUTA 404
  // ---------------------------------------------------
  {
    path: "*",
    element: <NotFound />,
  },
]);