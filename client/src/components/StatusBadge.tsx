import { Badge } from "@/components/ui/badge";

interface StatusBadgeProps {
  status: string;
}

const statusConfig: Record<string, { color: string; bg: string }> = {
  "EM USO": { color: "text-[hsl(142,76%,36%)]", bg: "bg-[hsl(142,76%,36%)]/15" },
  "DEVOLVER": { color: "text-[hsl(38,92%,50%)]", bg: "bg-[hsl(38,92%,50%)]/15" },
  "CORREIO": { color: "text-[hsl(210,85%,55%)]", bg: "bg-[hsl(210,85%,55%)]/15" },
  "GUARDADO": { color: "text-muted-foreground", bg: "bg-muted" },
  "TROCA": { color: "text-[hsl(280,65%,55%)]", bg: "bg-[hsl(280,65%,55%)]/15" },
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status] || statusConfig["GUARDADO"];
  
  return (
    <Badge
      variant="secondary"
      className={`${config.bg} ${config.color} border-0 font-medium`}
      data-testid={`badge-status-${status.toLowerCase().replace(/\s/g, '-')}`}
    >
      {status}
    </Badge>
  );
}
