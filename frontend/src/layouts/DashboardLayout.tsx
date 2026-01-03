import React from "react"
import { AppSidebar } from "@/components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { useCurrentUser } from "@/hooks/use-current-user"
import { Loading } from "@/components/sections/Loading"
import { AudioWaveform } from "lucide-react"

interface DashboardLayoutProps {
  children: React.ReactNode;
  breadcrumbs?: { title: string; href?: string }[]; // Para hacer dinámico el título superior
}

export default function DashboardLayout({ children, breadcrumbs = [] }: DashboardLayoutProps) {
  const { data, isLoading, isError } = useCurrentUser();
  if (isLoading) return <Loading />;
  if (isError) return <div>Error al cargar usuario</div>;
  const teams = data?.org ? [
    {
      name: data.org.name,
      logo: AudioWaveform, // TeamSwitcher suele pedir un logo/icono
      plan: "Gratis",      // TeamSwitcher suele pedir un plan
      id: data.org.id      // Mantenemos el ID original
    }
  ] : [];
  return (
    <SidebarProvider>
      <AppSidebar user={data?.user} profile={data?.profile} org={teams} />
      <SidebarInset>
        {/* HEADER */}
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                {/* Home siempre fijo */}
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                
                {/* Migas de pan dinámicas */}
                {breadcrumbs.map((item, index) => (
                  <React.Fragment key={index}>
                    <BreadcrumbItem>
                      {item.href ? (
                        <BreadcrumbLink href={item.href}>{item.title}</BreadcrumbLink>
                      ) : (
                        <BreadcrumbPage>{item.title}</BreadcrumbPage>
                      )}
                    </BreadcrumbItem>
                    {index < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
                  </React.Fragment>
                ))}
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        {/* CONTENIDO PRINCIPAL (Aquí es donde ocurre la magia) */}
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
            {/* He eliminado los divs de ejemplo (los cuadros grises) 
               y puse {children} para que aquí se renderice tu tabla de miembros 
            */}
            {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}