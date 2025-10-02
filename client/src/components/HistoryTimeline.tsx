import { Card } from "@/components/ui/card";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface HistoryEntry {
  id: string;
  action: string;
  user: string;
  timestamp: Date;
  details: string;
  equipment?: string;
}

interface HistoryTimelineProps {
  entries: HistoryEntry[];
}

const actionColors: Record<string, string> = {
  criacao: "bg-[hsl(142,76%,36%)]",
  edicao: "bg-[hsl(38,92%,50%)]",
  exclusao: "bg-destructive",
};

export default function HistoryTimeline({ entries }: HistoryTimelineProps) {
  return (
    <div className="space-y-4">
      {entries.map((entry, index) => (
        <div key={entry.id} className="flex gap-4" data-testid={`history-entry-${entry.id}`}>
          <div className="flex flex-col items-center">
            <div className={`w-3 h-3 rounded-full ${actionColors[entry.action] || "bg-primary"}`} />
            {index !== entries.length - 1 && <div className="w-0.5 flex-1 bg-border mt-2" />}
          </div>
          
          <Card className="flex-1 p-4 mb-2">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div className="flex-1 min-w-[200px]">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold">{entry.user}</span>
                  <span className="text-xs text-muted-foreground">
                    {format(entry.timestamp, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                  </span>
                </div>
                <p className="text-sm">{entry.details}</p>
                {entry.equipment && (
                  <p className="text-xs text-muted-foreground mt-1 font-mono">{entry.equipment}</p>
                )}
              </div>
            </div>
          </Card>
        </div>
      ))}
    </div>
  );
}
