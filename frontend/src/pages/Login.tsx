import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/lib/supabase";
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
import { Loader2, LogIn } from "lucide-react";

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const loginMutation = useMutation({
    mutationFn: async () => {
      // 1. Intentar iniciar sesión en Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw new Error(authError.message);
      if (!authData.user) throw new Error("No se pudo obtener el usuario.");

      // 2. Obtener el perfil para verificar estado y rol
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", authData.user.id)
        .maybeSingle();
      console.log("error", profileError);
      console.log(profileError);
      if (profileError || !profile) {
        console.log("profileError", profileError);
        console.log("profile", profile);
        throw new Error("Error al obtener tu perfil de usuario.");
      }

      // 3. VALIDACIÓN: ¿La cuenta está activa?
      if (profile.status !== "active") {
        // Cerramos la sesión inmediatamente si no está activo
        await supabase.auth.signOut();
        throw new Error("Tu cuenta está desactivada o suspendida. Contacta al soporte.");
      }

      // 4. Lógica según el Rol
      let nextRoute = "/dashboard"; // Ruta por defecto

      if (profile.role === "admin") {
        // Verificamos si el admin ya creó su organización
        const { data: org } = await supabase
          .from("organizations")
          .select("id")
          .eq("owner_id", profile.id)
          .maybeSingle(); // maybeSingle no da error si está vacío, devuelve null

        if (!org) {
          nextRoute = "/create-organization";
        }
      } else if (profile.role === "colab") {
        // Lógica para Colaborador
        // NOTA: Aquí asumimos que si está "active", tiene permiso.
        // En el futuro, si tienes una tabla 'members', aquí verificaríamos si pertenece a una org.
        nextRoute = "/dashboard";
      }

      return nextRoute;
    },
    onSuccess: (route) => {
      toast.success("Bienvenido", {
        description: "Has iniciado sesión correctamente.",
      });
      navigate(route);
    },
    onError: (error) => {
      toast.error("Error al entrar", {
        description: error.message,
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.warning("Por favor completa todos los campos");
      return;
    }
    loginMutation.mutate();
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/50 px-4">
      <Card className="w-full max-w-sm shadow-xl">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-2">
            <div className="p-3 bg-primary/10 rounded-full text-primary">
              <LogIn className="w-6 h-6" />
            </div>
          </div>
          <CardTitle className="text-2xl">Iniciar sesión</CardTitle>
          <CardDescription>
            Ingresa tus credenciales para acceder
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="email">Correo electrónico</Label>
              <Input
                id="email"
                type="email"
                placeholder="nombre@ejemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loginMutation.isPending}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Contraseña</Label>
                {/* Opcional: Link a recuperar contraseña */}
                <a href="#" className="text-xs text-muted-foreground hover:text-primary">
                  ¿Olvidaste tu contraseña?
                </a>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loginMutation.isPending}
              />
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verificando...
                </>
              ) : (
                "Entrar"
              )}
            </Button>
          </form>

          <div className="mt-4 text-center text-sm">
            <span className="text-muted-foreground">¿No tienes una cuenta? </span>
            <Link 
              to="/register" 
              className="font-medium text-primary hover:underline transition-colors"
            >
              Regístrate aquí
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}