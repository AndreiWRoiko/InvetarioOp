import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Laptop, TrendingUp, MapPin } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  description?: string;
}

function StatCard({ title, value, icon, description }: StatCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <div className="text-muted-foreground">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold" data-testid={`stat-value-${title.toLowerCase().replace(/\s/g, '-')}`}>
          {value}
        </div>
        {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
      </CardContent>
    </Card>
  );
}

interface DashboardStatsProps {
  totalEquipment: number;
  byStatus: Record<string, number>;
  byUF: Record<string, number>;
}

export default function DashboardStats({ totalEquipment, byStatus, byUF }: DashboardStatsProps) {
  const emUso = byStatus["EM USO"] || 0;
  const topUF = Object.entries(byUF).sort((a, b) => b[1] - a[1])[0];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <StatCard
        title="Total de Equipamentos"
        value={totalEquipment}
        icon={<Laptop className="w-4 h-4" />}
        description="Todos os equipamentos cadastrados"
      />
      <StatCard
        title="Em Uso"
        value={emUso}
        icon={<TrendingUp className="w-4 h-4" />}
        description={`${Math.round((emUso / totalEquipment) * 100)}% do total`}
      />
      <StatCard
        title="Principal UF"
        value={topUF ? topUF[0] : "-"}
        icon={<MapPin className="w-4 h-4" />}
        description={topUF ? `${topUF[1]} equipamentos` : ""}
      />
    </div>
  );
}
