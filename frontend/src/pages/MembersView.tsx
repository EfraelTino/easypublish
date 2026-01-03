

import { TableGetUsers } from "../components/sections/TableGetUsers";
import DashboardLayout from "../layouts/DashboardLayout";
import { NewMember } from "@/components/sections/NewMember";

export default function MembersView() {


  const pathData = [
    { title: "Configuración", href: "/settings" }, // Nivel intermedio
    { title: "Miembros" } // Página actual (sin href)
  ];

  return (
    <DashboardLayout breadcrumbs={pathData}>
      
      {/* --- CABECERA --- */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Miembros del Equipo</h2>
          <p className="text-muted-foreground text-sm">
            Administra quién tiene acceso a la organización y sus permisos.
          </p>
        </div>

        {/* Modal de Agregar Usuario */}
        <NewMember />
      </div>

      {/* --- TABLA SIMPLE (Sin Tanstack) --- */}
      <div className="rounded-md border bg-white shadow-sm">
        <TableGetUsers />
      </div>
    </DashboardLayout>
  );
}