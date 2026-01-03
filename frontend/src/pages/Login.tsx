import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {ApiGetTest} from "@/api/test";
import { Link } from "react-router-dom";

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const {
    data,
    error,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ["test-get"],
    queryFn: ApiGetTest,
    enabled: false, // ⛔ NO se ejecuta al montar
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    refetch(); // ✅ AQUÍ se dispara la petición GET
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted px-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl text-center">
            Iniciar sesión
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="email">Correo electrónico</Label>
              <Input
                id="email"
                type="email"
                placeholder="Ingresa tu correo"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                placeholder="Ingresa tu contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <Button type="submit" className="w-full" disabled={isFetching}>
              {isFetching ? "Probando GET..." : "Entrar"}
            </Button>

            {/* Resultado */}
            {error && (
              <p className="text-sm text-red-500">
                Error en la petición GET
              </p>
            )}

            {data && (
              <pre className="rounded bg-muted p-2 text-xs overflow-auto">
                {JSON.stringify(data, null, 2)}
              </pre>
            )}
          </form>
          <Link to="/register" className="text-sm text-blue-500 hover:underline mt-4 block text-center">
            ¿No tienes una cuenta? Regístrate aquí
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
