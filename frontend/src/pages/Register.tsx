import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase"; 
import { toast } from "sonner";
import { useNavigate, Link } from "react-router-dom"; // Link añadido para UX

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export function Register() {
  const navigate = useNavigate();
  
  // Estados del formulario
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const registerMutation = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          // Metadatos que usará el Trigger para crear el perfil
          data: {
            full_name: fullName,
            role: 'admin',      
            status: 'active',   
          },
        },
      });
      console.log("Register Mutation - data:", data, "error:", error);
      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: (data) => {
      // Caso A: Auto-login activado (Supabase devuelve sesión)
      if (data.session) {
        toast.success("Cuenta creada exitosamente", {
          description: "Bienvenido a la plataforma.",
        });
        // Al ser cuenta nueva, sabemos que no tiene Org, así que lo mandamos a crearla
        navigate("/create-organization");
      } 
      // Caso B: Confirmación de email requerida
      else {
        toast.info("Revisa tu correo", {
          description: "Hemos enviado un enlace de confirmación.",
          duration: 8000,
          action: {
            label: "Entendido",
            onClick: () => console.log("Cerrado"),
          },
        });
      }
    },
    onError: (error) => {
      // Detección de usuario duplicado
      if (error.message.toLowerCase().includes("already registered") || error.message.includes("exists")) {
        toast.error("Este correo ya está registrado", {
          description: "¿Deseas iniciar sesión en su lugar?",
          action: {
            label: "Ir al Login",
            onClick: () => navigate("/"),
          },
        });
      } else {
        toast.error("Error en el registro", {
          description: error.message,
        });
      }
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 1. Validar campos vacíos
    if (!fullName || !email || !password || !confirmPassword) {
      toast.warning("Campos incompletos", { description: "Por favor completa todos los campos." });
      return;
    }

    // 2. Validar coincidencia de contraseñas
    if (password !== confirmPassword) {
      toast.error("Las contraseñas no coinciden", { description: "Verifícalas e intenta de nuevo." });
      return;
    }

    // 3. Validar longitud mínima
    if (password.length < 6) {
      toast.warning("Contraseña débil", { description: "Debe tener al menos 6 caracteres." });
      return;
    }

    registerMutation.mutate();
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 px-4 py-8">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Crear cuenta
          </CardTitle>
          <CardDescription className="text-center">
            Ingresa tus datos para comenzar como Administrador
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            
            {/* Nombre Completo */}
            <div className="space-y-2">
              <Label htmlFor="fullname">Nombre completo</Label>
              <Input
                id="fullname"
                placeholder="Ej. Juan Pérez"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                autoComplete="name"
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Correo electrónico</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@empresa.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </div>

            {/* Contraseña */}
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                placeholder="******"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
              />
            </div>

            {/* Confirmar Contraseña */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Repetir contraseña</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="******"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
              />
            </div>

            <Button 
              type="submit" 
              className="w-full bg-primary hover:bg-primary/90 mt-2" 
              disabled={registerMutation.isPending}
            >
              {registerMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creando cuenta...
                </>
              ) : (
                "Registrarse y Continuar →"
              )}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex justify-center border-t p-4">
          <p className="text-sm text-muted-foreground">
            ¿Ya tienes una cuenta?{" "}
            <Link to="/" className="text-primary hover:underline font-medium">
              Inicia sesión aquí
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}