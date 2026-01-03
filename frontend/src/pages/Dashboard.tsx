import DashboardLayout from "../layouts/DashboardLayout";

export const Dashboard = () => {


  return (
    // 2. Pasas la variable a la prop 'breadcrumbs'
    <DashboardLayout>
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Gika</h1>
        <p>Bienvenido a la sección de miembros.</p>
      </div>
    </DashboardLayout>
  );
};