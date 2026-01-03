"use client"

import * as React from "react"
import {
  LayoutDashboard,
  FolderOpen,
  Send,
  History,
  Users,
  Settings,
  CreditCard,
  Building2,
  PieChart,
  Megaphone
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

// This is sample data.
// Datos adaptados a PublicaFácil
const data = {
  user: {
    name: "Efrael Dev",
    email: "efrael@admin.com",
    avatar: "/avatars/shadcn.jpg",
  },
  // ESTO ES CLAVE: Las "Teams" son tus Organizaciones
  teams: [
    {
      name: "Agencia Marketing",
      logo: Building2,
      plan: "Pro",
    },
    {
      name: "Startup Personal",
      logo: PieChart,
      plan: "Free",
    },
  ],
  // Menú Principal: Acciones y Gestión
  navMain: [
    {
      title: "Resumen",
      url: "/dashboard",
      icon: LayoutDashboard,
      isActive: true, // Abierto por defecto
      items: [
        {
          title: "Estadísticas",
          url: "/dashboard",
        },
        {
          title: "Actividad Reciente",
          url: "/dashboard/activity",
        },
      ],
    },
    {
      title: "Publicar",
      url: "#",
      icon: Send,
      items: [
        {
          title: "Nueva Publicación",
          url: "/dashboard/publish/new",
        },
        {
          title: "Programados (Cola)",
          url: "/dashboard/publish/scheduled",
        },
        {
          title: "Historial",
          url: "/dashboard/publish/history",
        },
      ],
    },
    {
      title: "Administración",
      url: "#",
      icon: Settings,
      items: [
        {
          title: "Miembros (Usuarios)",
          url: "/dashboard/settings/members",
        },
        {
          title: "Roles y Permisos",
          url: "/dashboard/settings/roles",
        },
        {
          title: "Facturación",
          url: "/dashboard/settings/billing",
        },
      ],
    },
  ],
  // Proyectos: Acceso rápido a tus marcas/clientes
  // Esto usa tu componente "NavProjects"
  projects: [
    {
      name: "Restaurante Luigi", // Un proyecto dentro de la Org
      url: "/dashboard/project/1",
      icon: Megaphone,
    },
    {
      name: "Gimnasio Power",
      url: "/dashboard/project/2",
      icon: FolderOpen,
    },
    {
      name: "Campaña Navidad",
      url: "/dashboard/project/3",
      icon: FolderOpen,
    },
  ],
}
export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  console.log("AppSidebar props", props);
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={props.org} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={props.profile} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
