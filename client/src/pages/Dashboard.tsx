import { useQuery } from "@tanstack/react-query";
import DashboardStats from "@/components/DashboardStats";
import DashboardCharts from "@/components/DashboardCharts";
import { Skeleton } from "@/components/ui/skeleton";

interface DashboardStatsData {
  totalEquipment: number;
  byStatus: Record<string, number>;
  byUF: Record<string, number>;
  bySegmento: Record<string, number>;
  byFornecedor: Record<string, number>;
}

export default function Dashboard() {
  const { data, isLoading } = useQuery<DashboardStatsData>({
    queryKey: ["/api/dashboard/stats"],
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Visão geral do inventário de equipamentos</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Nenhum dado disponível</p>
        </div>
      </div>
    );
  }

  const statusData = Object.entries(data.byStatus).map(([name, value]) => ({
    name: name === "EM USO" ? "Em Uso" : 
          name === "DEVOLVER" ? "Devolver" :
          name === "CORREIO" ? "Correio" :
          name === "GUARDADO" ? "Guardado" :
          name === "TROCA" ? "Troca" : name,
    value,
  }));

  const ufData = Object.entries(data.byUF).map(([name, value]) => ({
    name,
    value,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold" data-testid="heading-dashboard">Dashboard</h1>
        <p className="text-muted-foreground">Visão geral do inventário de equipamentos</p>
      </div>

      <DashboardStats {...data} />
      <DashboardCharts statusData={statusData} ufData={ufData} />
    </div>
  );
}
