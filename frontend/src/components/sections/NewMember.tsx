import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserPlus, Mail, Lock, User, Activity } from "lucide-react"; // Importamos Activity

export const NewMember = () => {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className="w-full sm:w-auto cursor-pointer">
                    <UserPlus className="mr-2 h-4 w-4" />
                    Agregar Usuario
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]"> {/* Un poco más ancho para las 2 columnas */}
                <DialogHeader>
                    <DialogTitle>Agregar Nuevo Usuario</DialogTitle>
                    <DialogDescription>
                        Crea una cuenta para dar acceso a la organización.
                    </DialogDescription>
                </DialogHeader>
                
                <div className="grid gap-4 py-4">
                    {/* Nombre */}
                    <div className="grid gap-2">
                        <Label htmlFor="name">Nombre Completo</Label>
                        <div className="relative">
                            <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input id="name" placeholder="Juan Pérez" className="pl-9" />
                        </div>
                    </div>

                    {/* Email */}
                    <div className="grid gap-2">
                        <Label htmlFor="email">Correo Electrónico</Label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input id="email" type="email" placeholder="ejemplo@correo.com" className="pl-9" />
                        </div>
                    </div>

                    {/* Contraseña */}
                    <div className="grid gap-2">
                        <Label htmlFor="password">Contraseña</Label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input 
                                id="password" 
                                type="password" 
                                placeholder="••••••••" 
                                className="pl-9" 
                            />
                        </div>
                    </div>

                    {/* Fila de 2 columnas para Rol y Estado */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="role">Rol</Label>
                            <Select defaultValue="editor">
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Selecciona" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="admin">Admin</SelectItem>
                                    <SelectItem value="editor">Editor</SelectItem>
                                    <SelectItem value="viewer">Viewer</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="status">Estado</Label>
                            <Select defaultValue="active" >
                                <SelectTrigger className="w-full">
                                    <div className="flex items-center gap-2">
                                        <Activity className="h-3.5 w-3.5 text-muted-foreground" />
                                        <SelectValue placeholder="Estado" />
                                    </div>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="active">
                                        <div className="flex items-center gap-2">
                                            <span className="h-2 w-2 rounded-full bg-green-500" />
                                            <span>Activo</span>
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="inactive">
                                        <div className="flex items-center gap-2">
                                            <span className="h-2 w-2 rounded-full bg-slate-400" />
                                            <span>Inactivo</span>
                                        </div>
                                    </SelectItem>
                                </SelectContent>
                            </Select>
    
                        </div>
                    </div>
                </div>

                <DialogFooter>
                    <Button type="submit">Crear Cuenta</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
};