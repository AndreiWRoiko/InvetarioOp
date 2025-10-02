import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import HistoryTimeline from "@/components/HistoryTimeline";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { Historico } from "@shared/schema";

export default function Historico() {
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [actionFilter, setActionFilter] = useState("all");

  const { data: historico = [], isLoading } = useQuery<Historico[]>({
    queryKey: ["/api/historico"],
  });

  const filteredHistory = useMemo(() => {
    return historico.filter(entry => {
      // Filtro de ação
      if (actionFilter !== "all" && entry.action !== actionFilter) return false;

      // Filtro de data
      if (dateFrom) {
        const entryDate = new Date(entry.timestamp);
        const fromDate = new Date(dateFrom);
        if (entryDate < fromDate) return false;
      }

      if (dateTo) {
        const entryDate = new Date(entry.timestamp);
        const toDate = new Date(dateTo);
        toDate.setHours(23, 59, 59, 999); // Incluir todo o dia
        if (entryDate > toDate) return false;
      }

      return true;
    });
  }, [historico, actionFilter, dateFrom, dateTo]);

  const formattedEntries = filteredHistory.map(entry => ({
    id: entry.id,
    action: entry.action,
    user: entry.userName,
    timestamp: new Date(entry.timestamp),
    details: entry.details,
    equipment: entry.equipment || "N/A",
  }));

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Histórico</h1>
          <p className="text-muted-foreground">Registro de todas as modificações no inventário</p>
        </div>
        <Skeleton className="h-32" />
        <Skeleton className="h-96" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold" data-testid="heading-historico">Histórico</h1>
        <p className="text-muted-foreground">Registro de todas as modificações no inventário</p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dateFrom">Data Inicial</Label>
              <Input
                id="dateFrom"
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                data-testid="input-date-from"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dateTo">Data Final</Label>
              <Input
                id="dateTo"
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                data-testid="input-date-to"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="actionFilter">Tipo de Ação</Label>
              <Select value={actionFilter} onValueChange={setActionFilter}>
                <SelectTrigger id="actionFilter" data-testid="select-action-filter">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="criacao">Criação</SelectItem>
                  <SelectItem value="edicao">Edição</SelectItem>
                  <SelectItem value="exclusao">Exclusão</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {formattedEntries.length > 0 ? (
        <HistoryTimeline entries={formattedEntries} />
      ) : (
        <Card>
          <CardContent className="pt-6 text-center text-muted-foreground">
            Nenhum registro encontrado
          </CardContent>
        </Card>
      )}
    </div>
  );
}
