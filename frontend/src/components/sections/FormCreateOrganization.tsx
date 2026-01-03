import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import { Loader2, Building2 } from "lucide-react";

export const FormCreateOrganization = ({continueTo}: { continueTo: string }) => {
    const [orgName, setOrgName] = useState("");
    const navigate = useNavigate();

    const createOrgMutation = useMutation({
        mutationFn: async () => {
            // 1. Obtener el usuario actual logueado
            const { data: { user }, error: authError } = await supabase.auth.getUser();

            if (authError || !user) throw new Error("No hay sesión activa. Vuelve a iniciar sesión.");

            // 2. Insertar la organización
            // OJO: Asumimos que el trigger ya creó el 'profile' del usuario, 
            // sino fallará la FK owner_id -> profiles.id
            const { data, error } = await supabase
                .from('organizations')
                .insert({
                    name: orgName,
                    owner_id: user.id, // 👈 Aquí vinculamos al Admin
                })
                .select()
                .single(); // Devuelve el objeto creado
            console.log("Create Organization Mutation - data:", data, "error:", error);
            if (error) throw new Error(error.message);
            return data;
        },
        onSuccess: (data) => {
            toast.success("Organización creada", {
                description: `Has creado "${data.name}" exitosamente.`,
            });
            // 3. Redirigir al Dashboard principal
            navigate(`/${continueTo}`);
        },
        onError: (error) => {
            toast.error("Error al crear", {
                description: error.message,
            });
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!orgName.trim()) {
            toast.warning("El nombre es obligatorio");
            return;
        }
        createOrgMutation.mutate();
    };

    return (
        <div className="flex flex-col items-center w-full justify-center px-4">
            <Card className="w-full max-w-sm shadow-lg">
                <CardHeader className="items-center text-center">
                    <div className="flex justify-center">
                        <div className="mb-2 rounded-full bg-primary/10 p-3 text-primary">
                            <Building2 className="h-8 w-8" />
                        </div>
                    </div>
                    <CardTitle className="text-2xl">Crear Organización</CardTitle>
                    <CardDescription>
                        Dale un nombre a tu espacio de trabajo.
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="orgName" className="text-base">Nombre de la Organización</Label>
                            <Input
                                id="orgName"
                                placeholder="Ej. Agencia Creativa S.A."
                                value={orgName}
                                onChange={(e) => setOrgName(e.target.value)}
                                autoFocus
                                className="h-10"
                            />
                        </div>

                        <Button
                            type="submit"
                            className="w-full h-10 cursor-pointer"
                            disabled={createOrgMutation.isPending}
                        >
                            {createOrgMutation.isPending ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Creando espacio...
                                </>
                            ) : (
                                "Finalizar Configuración"
                            )}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};