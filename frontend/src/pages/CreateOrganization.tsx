import { FormCreateOrganization } from "@/components/sections/FormCreateOrganization";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { useEffect } from "react";

export const CreateOrganization = () => {
    const { hasOrganization, isLoading } = useAuthStore();
    const navigate = useNavigate();

    useEffect(() => {
        // Si ya cargó y SÍ tiene organización, sácalo de aquí
        if (!isLoading && hasOrganization) {
            navigate("/dashboard");
        }
    }, [hasOrganization, isLoading, navigate]);

    if (isLoading) return <div>Cargando...</div>;

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-10 px-4">
            <FormCreateOrganization continueTo="dashboard" />
        </div>
    );
};