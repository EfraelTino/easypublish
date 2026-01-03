import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase"; // 👈 Ajusta esta ruta a tu configuración
import type {Users} from "@/lib/types";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton"; 
import { MoreHorizontal, Trash2, Edit, ShieldCheck, Ban, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Función auxiliar para extraer iniciales de full_name
const getInitials = (name: string) => {
  return name
    ? name.split(" ").map((n) => n[0]).join("").substring(0, 2).toUpperCase()
    : "U";
};

// Función fetcher para React Query
const fetchUsers = async (): Promise<Users[]> => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false }); // Opcional: ordenar por fecha
    console.log("Datos de usuarios obtenidos:", data);
    console.log("Daos obtenidos", data)
  if (error) throw new Error(error.message);
  return data as Users[];
};

export const TableGetUsers = () => {
  
  // 1. Hook de React Query
  const { data: users, isLoading, isError, error } = useQuery({
    queryKey: ['profiles'], // Clave única para caché
    queryFn: fetchUsers,
  });

  // 2. Estado de Carga (Skeleton Loader)
  if (isLoading) {
    return (
      <div className="p-4 space-y-4">
        {/* Simulamos 3 filas cargando */}
        {[1, 2, 3].map((i) => (
           <div key={i} className="flex items-center space-x-4">
             <Skeleton className="h-12 w-12 rounded-full" />
             <div className="space-y-2">
               <Skeleton className="h-4 w-[250px]" />
               <Skeleton className="h-4 w-[200px]" />
             </div>
           </div>
        ))}
      </div>
    );
  }

  // 3. Estado de Error
  if (isError) {
    return (
      <Alert variant="destructive" className="m-4">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          No se pudieron cargar los usuarios: {(error as Error).message}
        </AlertDescription>
      </Alert>
    );
  }

  // 4. Estado vacío (sin datos)
  if (!users || users.length === 0) {
     return <div className="p-8 text-center text-muted-foreground">No hay usuarios registrados.</div>;
  }

  // 5. Renderizado de Datos
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[300px]">Usuario</TableHead>
          <TableHead>Rol</TableHead>
          <TableHead>Estado</TableHead>
          <TableHead className="text-right">Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id}>
            {/* Columna Usuario */}
            <TableCell className="font-medium">
              <div className="flex items-center gap-3">
                <Avatar className="h-9 w-9">
                  <AvatarFallback className={user.status === 'inactive' ? 'bg-gray-200 text-gray-400' : ''}>
                    {getInitials(user.full_name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className={`text-sm font-semibold ${user.status === 'inactive' ? 'text-muted-foreground' : 'text-gray-900'}`}>
                    {user.full_name}
                  </span>
                  <span className="text-xs text-muted-foreground">{user.email}</span>
                </div>
              </div>
            </TableCell>
            
            {/* Columna Rol */}
            <TableCell>
              <Badge variant={user.role === 'admin' ? 'default' : 'secondary'} className="capitalize">
                {user.role}
              </Badge>
            </TableCell>
            
            {/* Columna Estado */}
            <TableCell>
              <div className="flex items-center gap-2">
                <span className={`h-2.5 w-2.5 rounded-full ${user.status === 'active' ? 'bg-green-500' : 'bg-slate-300'}`} />
                <span className="text-sm text-gray-600 capitalize">
                  {user.status === 'active' ? 'Activo' : 'Inactivo'}
                </span>
              </div>
            </TableCell>
            
            {/* Columna Acciones */}
            <TableCell className="text-right">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Abrir menú</span>
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Opciones</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  
                  <DropdownMenuItem onClick={() => console.log("Editar", user.id)}>
                    <Edit className="mr-2 h-4 w-4" /> Editar datos
                  </DropdownMenuItem>
                  
                  {user.status === 'active' ? (
                     <DropdownMenuItem onClick={() => console.log("Desactivar", user.id)}>
                        <Ban className="mr-2 h-4 w-4" /> Desactivar
                     </DropdownMenuItem>
                  ) : (
                    <DropdownMenuItem onClick={() => console.log("Activar", user.id)}>
                        <ShieldCheck className="mr-2 h-4 w-4" /> Activar
                     </DropdownMenuItem>
                  )}

                  <DropdownMenuSeparator />
                  
                  <DropdownMenuItem 
                    className="text-red-600 focus:text-red-600 focus:bg-red-50"
                    onClick={() => console.log("Eliminar", user.id)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Eliminar Cuenta
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};