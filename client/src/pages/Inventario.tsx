import { useState, useMemo } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EquipmentFilters from "@/components/EquipmentFilters";
import EquipmentTable from "@/components/EquipmentTable";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";
import { Clock, User, FileEdit, Laptop, Smartphone, Monitor, CheckCircle, XCircle } from "lucide-react";
import StatusBadge from "@/components/StatusBadge";
import { Badge } from "@/components/ui/badge";
import type { Notebook, Celular, Terminal, Historico } from "@shared/schema";

interface InventarioProps {
  userRole?: "Admin" | "Suporte" | "Controle";
}

type EquipmentItem = {
  id: string;
  tipo: string;
  responsavel: string;
  modelo: string;
  status: string;
  uf: string;
  segmento: string;
  fornecedor?: string;
};

export default function Inventario({ userRole = "Admin" }: InventarioProps) {
  const [activeTab, setActiveTab] = useState("todos");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [ufFilter, setUFFilter] = useState("");
  const [segmentoFilter, setSegmentoFilter] = useState("");
  const [fornecedorFilter, setFornecedorFilter] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [equipmentToDelete, setEquipmentToDelete] = useState<{ id: string; tipo: string } | null>(null);
  const [historyDialogOpen, setHistoryDialogOpen] = useState(false);
  const [selectedEquipmentId, setSelectedEquipmentId] = useState<string | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [viewEquipment, setViewEquipment] = useState<{ id: string; tipo: string } | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  const { data: notebooks = [], isLoading: loadingNotebooks } = useQuery<Notebook[]>({
    queryKey: ["/api/notebooks"],
  });

  const { data: celulares = [], isLoading: loadingCelulares } = useQuery<Celular[]>({
    queryKey: ["/api/celulares"],
  });

  const { data: terminais = [], isLoading: loadingTerminais } = useQuery<Terminal[]>({
    queryKey: ["/api/terminais"],
  });

  const { data: equipmentHistory = [], isLoading: loadingHistory } = useQuery<Historico[]>({
    queryKey: ["/api/historico/equipment", selectedEquipmentId],
    queryFn: async () => {
      if (!selectedEquipmentId) return [];
      const response = await fetch(`/api/historico/equipment/${selectedEquipmentId}`);
      if (!response.ok) throw new Error("Failed to fetch history");
      return response.json();
    },
    enabled: !!selectedEquipmentId,
  });

  const deleteMutation = useMutation({
    mutationFn: async ({ id, tipo }: { id: string; tipo: string }) => {
      const endpoint = tipo === "Notebook" ? "/api/notebooks" 
                     : tipo === "Celular" ? "/api/celulares"
                     : "/api/terminais";
      
      await apiRequest("DELETE", `${endpoint}/${id}`, {
        _userId: user?.id,
        _userName: user?.nome,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/notebooks"] });
      queryClient.invalidateQueries({ queryKey: ["/api/celulares"] });
      queryClient.invalidateQueries({ queryKey: ["/api/terminais"] });
      queryClient.invalidateQueries({ queryKey: ["/api/historico"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
      
      toast({
        title: "Equipamento excluído",
        description: "O equipamento foi removido do inventário com sucesso",
      });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Erro ao excluir",
        description: error.message || "Não foi possível excluir o equipamento",
      });
    },
  });

  const allEquipment: EquipmentItem[] = useMemo(() => {
    const notebooksData = notebooks.map(n => ({
      id: n.id,
      tipo: "Notebook",
      responsavel: n.responsavel,
      modelo: n.modelo,
      status: n.status,
      uf: n.uf,
      segmento: n.segmento,
      fornecedor: n.fornecedor,
    }));

    const celularesData = celulares.map(c => ({
      id: c.id,
      tipo: "Celular",
      responsavel: c.responsavel,
      modelo: c.modelo,
      status: c.status,
      uf: c.uf,
      segmento: c.segmento,
    }));

    const terminaisData = terminais.map(t => ({
      id: t.id,
      tipo: "Terminal",
      responsavel: t.uf,
      modelo: t.numeroRelogio,
      status: t.status,
      uf: t.uf,
      segmento: t.segmento,
    }));

    return [...notebooksData, ...celularesData, ...terminaisData];
  }, [notebooks, celulares, terminais]);

  const filteredEquipment = useMemo(() => {
    return allEquipment.filter(item => {
      // Filtro de tipo (tabs)
      if (activeTab === "notebook" && item.tipo !== "Notebook") return false;
      if (activeTab === "celular" && item.tipo !== "Celular") return false;
      if (activeTab === "terminal" && item.tipo !== "Terminal") return false;

      // Filtro de busca
      if (searchQuery) {
        const search = searchQuery.toLowerCase();
        const matchesSearch = 
          item.responsavel.toLowerCase().includes(search) ||
          item.modelo.toLowerCase().includes(search) ||
          item.segmento.toLowerCase().includes(search);
        if (!matchesSearch) return false;
      }

      // Filtro de status
      if (statusFilter && item.status !== statusFilter) return false;

      // Filtro de UF
      if (ufFilter && item.uf !== ufFilter) return false;

      // Filtro de segmento
      if (segmentoFilter && item.segmento !== segmentoFilter) return false;

      // Filtro de fornecedor
      if (fornecedorFilter && item.fornecedor !== fornecedorFilter) return false;

      return true;
    });
  }, [allEquipment, activeTab, searchQuery, statusFilter, ufFilter, segmentoFilter, fornecedorFilter]);

  const handleView = (id: string) => {
    const equipment = allEquipment.find(e => e.id === id);
    if (equipment) {
      setViewEquipment({ id, tipo: equipment.tipo });
      setViewDialogOpen(true);
    }
  };

  const handleEdit = (id: string) => {
    toast({
      title: "Editar Equipamento",
      description: `Funcionalidade em desenvolvimento`,
    });
  };

  const handleDelete = (id: string) => {
    const equipment = allEquipment.find(e => e.id === id);
    if (equipment) {
      setEquipmentToDelete({ id, tipo: equipment.tipo });
      setDeleteDialogOpen(true);
    }
  };

  const handleHistory = (id: string) => {
    setSelectedEquipmentId(id);
    setHistoryDialogOpen(true);
  };

  const currentEquipment = useMemo(() => {
    if (!viewEquipment) return null;
    
    if (viewEquipment.tipo === "Notebook") {
      return notebooks.find(n => n.id === viewEquipment.id);
    } else if (viewEquipment.tipo === "Celular") {
      return celulares.find(c => c.id === viewEquipment.id);
    } else if (viewEquipment.tipo === "Terminal") {
      return terminais.find(t => t.id === viewEquipment.id);
    }
    return null;
  }, [viewEquipment, notebooks, celulares, terminais]);

  const confirmDelete = () => {
    if (equipmentToDelete) {
      deleteMutation.mutate(equipmentToDelete);
      setDeleteDialogOpen(false);
      setEquipmentToDelete(null);
    }
  };

  const isLoading = loadingNotebooks || loadingCelulares || loadingTerminais;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Inventário</h1>
          <p className="text-muted-foreground">Gerenciar todos os equipamentos cadastrados</p>
        </div>
        <Skeleton className="h-96" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold" data-testid="heading-inventario">Inventário</h1>
        <p className="text-muted-foreground">Gerenciar todos os equipamentos cadastrados</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="todos" data-testid="tab-todos">Todos ({allEquipment.length})</TabsTrigger>
          <TabsTrigger value="notebook" data-testid="tab-notebooks">Notebooks ({notebooks.length})</TabsTrigger>
          <TabsTrigger value="celular" data-testid="tab-celulares">Celulares ({celulares.length})</TabsTrigger>
          <TabsTrigger value="terminal" data-testid="tab-terminais">Terminais ({terminais.length})</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          <EquipmentFilters
            onSearchChange={setSearchQuery}
            onStatusChange={setStatusFilter}
            onUFChange={setUFFilter}
            onSegmentoChange={setSegmentoFilter}
            onFornecedorChange={setFornecedorFilter}
            showFornecedor={activeTab === "notebook" || activeTab === "todos"}
          />

          <EquipmentTable
            equipment={filteredEquipment}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onHistory={handleHistory}
            canEdit={userRole !== "Controle"}
            canDelete={userRole === "Admin"}
          />
        </TabsContent>
      </Tabs>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este equipamento? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-testid="button-cancel-delete">Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete}
              data-testid="button-confirm-delete"
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={historyDialogOpen} onOpenChange={(open) => {
        setHistoryDialogOpen(open);
        if (!open) setSelectedEquipmentId(null);
      }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Histórico do Equipamento</DialogTitle>
            <DialogDescription>
              Registro de todas as modificações realizadas neste equipamento
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[500px] pr-4">
            {loadingHistory ? (
              <div className="space-y-4">
                <Skeleton className="h-20" />
                <Skeleton className="h-20" />
                <Skeleton className="h-20" />
              </div>
            ) : equipmentHistory.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                Nenhum histórico encontrado para este equipamento
              </div>
            ) : (
              <div className="space-y-4">
                {equipmentHistory.map((entry) => (
                  <div
                    key={entry.id}
                    className="border rounded-lg p-4 space-y-2 bg-card"
                    data-testid={`history-entry-${entry.id}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <FileEdit className="w-4 h-4 text-muted-foreground" />
                        <span className="font-medium">
                          {entry.action === "criacao" && "Criação"}
                          {entry.action === "edicao" && "Edição"}
                          {entry.action === "exclusao" && "Exclusão"}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        {format(new Date(entry.timestamp), "dd/MM/yyyy HH:mm")}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <User className="w-3 h-3 text-muted-foreground" />
                      <span className="text-muted-foreground">{entry.userName}</span>
                    </div>
                    <p className="text-sm">{entry.details}</p>
                    {entry.equipment && (
                      <p className="text-sm text-muted-foreground italic">{entry.equipment}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>

      <Dialog open={viewDialogOpen} onOpenChange={(open) => {
        setViewDialogOpen(open);
        if (!open) setViewEquipment(null);
      }}>
        <DialogContent className="max-w-3xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {viewEquipment?.tipo === "Notebook" && <Laptop className="w-5 h-5" />}
              {viewEquipment?.tipo === "Celular" && <Smartphone className="w-5 h-5" />}
              {viewEquipment?.tipo === "Terminal" && <Monitor className="w-5 h-5" />}
              Detalhes do {viewEquipment?.tipo}
            </DialogTitle>
            <DialogDescription>
              Visualização completa das informações do equipamento
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[calc(90vh-150px)] pr-4">
            {!currentEquipment ? (
              <div className="text-center text-muted-foreground py-8">
                Equipamento não encontrado
              </div>
            ) : (
              <div className="space-y-6">
                {viewEquipment?.tipo === "Notebook" && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Responsável</p>
                        <p className="text-sm">{(currentEquipment as Notebook).responsavel}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Status</p>
                        <StatusBadge status={(currentEquipment as Notebook).status} />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">UF</p>
                        <p className="text-sm">{(currentEquipment as Notebook).uf}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Segmento</p>
                        <p className="text-sm">{(currentEquipment as Notebook).segmento}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Modelo</p>
                        <p className="text-sm">{(currentEquipment as Notebook).modelo}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Fornecedor</p>
                        <Badge variant="outline">{(currentEquipment as Notebook).fornecedor}</Badge>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Centro de Custo</p>
                        <p className="text-sm">{(currentEquipment as Notebook).centroCusto || "—"}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">CNPJ</p>
                        <p className="text-sm">{(currentEquipment as Notebook).cnpj || "—"}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Processador</p>
                        <p className="text-sm">{(currentEquipment as Notebook).processador || "—"}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Office</p>
                        <p className="text-sm">{(currentEquipment as Notebook).office || "—"}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Senha Admin</p>
                        <p className="text-sm font-mono text-xs">{(currentEquipment as Notebook).senhaAdmin || "—"}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Patrimônio</p>
                        <p className="text-sm">{(currentEquipment as Notebook).patrimonio || "—"}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Data Recebimento</p>
                        <p className="text-sm">{(currentEquipment as Notebook).dataRecebimento || "—"}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Valor</p>
                        <p className="text-sm">{(currentEquipment as Notebook).valor ? `R$ ${(currentEquipment as Notebook).valor}` : "—"}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Data Checagem</p>
                        <p className="text-sm">{(currentEquipment as Notebook).dataChecagem || "—"}</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <h4 className="text-sm font-semibold">Checklist</h4>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="flex items-center gap-2">
                          {(currentEquipment as Notebook).checklistTermo ? 
                            <CheckCircle className="w-4 h-4 text-green-500" /> : 
                            <XCircle className="w-4 h-4 text-muted-foreground" />
                          }
                          <span className="text-sm">Termo</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {(currentEquipment as Notebook).checklistAntivirus ? 
                            <CheckCircle className="w-4 h-4 text-green-500" /> : 
                            <XCircle className="w-4 h-4 text-muted-foreground" />
                          }
                          <span className="text-sm">Antivírus</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {(currentEquipment as Notebook).checklistFerramentaA ? 
                            <CheckCircle className="w-4 h-4 text-green-500" /> : 
                            <XCircle className="w-4 h-4 text-muted-foreground" />
                          }
                          <span className="text-sm">Ferramenta A</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {(currentEquipment as Notebook).checklistFerramentaB ? 
                            <CheckCircle className="w-4 h-4 text-green-500" /> : 
                            <XCircle className="w-4 h-4 text-muted-foreground" />
                          }
                          <span className="text-sm">Ferramenta B</span>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <h4 className="text-sm font-semibold">Links</h4>
                      <div className="grid grid-cols-1 gap-2">
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-muted-foreground">Termo</p>
                          {(currentEquipment as Notebook).termoLink ? (
                            <a href={(currentEquipment as Notebook).termoLink!} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-500 hover:underline break-all">
                              {(currentEquipment as Notebook).termoLink}
                            </a>
                          ) : (
                            <p className="text-sm">—</p>
                          )}
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-muted-foreground">Foto</p>
                          {(currentEquipment as Notebook).fotoLink ? (
                            <a href={(currentEquipment as Notebook).fotoLink!} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-500 hover:underline break-all">
                              {(currentEquipment as Notebook).fotoLink}
                            </a>
                          ) : (
                            <p className="text-sm">—</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {viewEquipment?.tipo === "Celular" && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">Responsável</p>
                      <p className="text-sm">{(currentEquipment as Celular).responsavel}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">Status</p>
                      <StatusBadge status={(currentEquipment as Celular).status} />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">UF</p>
                      <p className="text-sm">{(currentEquipment as Celular).uf}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">Segmento</p>
                      <p className="text-sm">{(currentEquipment as Celular).segmento}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">Modelo</p>
                      <p className="text-sm">{(currentEquipment as Celular).modelo}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">IMEI</p>
                      <p className="text-sm font-mono text-xs">{(currentEquipment as Celular).imei || "—"}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">Número Celular</p>
                      <p className="text-sm">{(currentEquipment as Celular).numeroCelular}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">Centro de Custo</p>
                      <p className="text-sm">{(currentEquipment as Celular).centroCusto || "—"}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">CNPJ</p>
                      <p className="text-sm">{(currentEquipment as Celular).cnpj || "—"}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">Email Login</p>
                      <p className="text-sm break-all">{(currentEquipment as Celular).emailLogin || "—"}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">Senha Login</p>
                      <p className="text-sm font-mono text-xs">{(currentEquipment as Celular).senhaLogin || "—"}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">Email Supervisão</p>
                      <p className="text-sm break-all">{(currentEquipment as Celular).emailSupervisao || "—"}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">Senha Supervisão</p>
                      <p className="text-sm font-mono text-xs">{(currentEquipment as Celular).senhaSupervisao || "—"}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">Data Recebimento</p>
                      <p className="text-sm">{(currentEquipment as Celular).dataRecebimento || "—"}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">Valor</p>
                      <p className="text-sm">{(currentEquipment as Celular).valor ? `R$ ${(currentEquipment as Celular).valor}` : "—"}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">Data Checagem</p>
                      <p className="text-sm">{(currentEquipment as Celular).dataChecagem || "—"}</p>
                    </div>
                    <div className="space-y-1 col-span-2">
                      <h4 className="text-sm font-semibold mb-2">Links</h4>
                      <div className="grid grid-cols-1 gap-2">
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-muted-foreground">Termo</p>
                          {(currentEquipment as Celular).termoLink ? (
                            <a href={(currentEquipment as Celular).termoLink!} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-500 hover:underline break-all">
                              {(currentEquipment as Celular).termoLink}
                            </a>
                          ) : (
                            <p className="text-sm">—</p>
                          )}
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-muted-foreground">Foto</p>
                          {(currentEquipment as Celular).fotoLink ? (
                            <a href={(currentEquipment as Celular).fotoLink!} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-500 hover:underline break-all">
                              {(currentEquipment as Celular).fotoLink}
                            </a>
                          ) : (
                            <p className="text-sm">—</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {viewEquipment?.tipo === "Terminal" && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">Número do Relógio</p>
                      <p className="text-sm font-semibold">{(currentEquipment as Terminal).numeroRelogio}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">Status</p>
                      <StatusBadge status={(currentEquipment as Terminal).status} />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">UF</p>
                      <p className="text-sm">{(currentEquipment as Terminal).uf}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">Segmento</p>
                      <p className="text-sm">{(currentEquipment as Terminal).segmento}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">Centro de Custo</p>
                      <p className="text-sm">{(currentEquipment as Terminal).centroCusto || "—"}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">Status Next</p>
                      <p className="text-sm">{(currentEquipment as Terminal).statusNext || "—"}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">Data Checagem</p>
                      <p className="text-sm">{(currentEquipment as Terminal).dataChecagem || "—"}</p>
                    </div>
                    <div className="space-y-1 col-span-2">
                      <p className="text-sm font-medium text-muted-foreground">Observação</p>
                      <p className="text-sm">{(currentEquipment as Terminal).observacao || "—"}</p>
                    </div>
                    <div className="space-y-1 col-span-2">
                      <h4 className="text-sm font-semibold mb-2">Links</h4>
                      <div className="grid grid-cols-1 gap-2">
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-muted-foreground">Termo</p>
                          {(currentEquipment as Terminal).termoLink ? (
                            <a href={(currentEquipment as Terminal).termoLink!} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-500 hover:underline break-all">
                              {(currentEquipment as Terminal).termoLink}
                            </a>
                          ) : (
                            <p className="text-sm">—</p>
                          )}
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-muted-foreground">Foto</p>
                          {(currentEquipment as Terminal).fotoLink ? (
                            <a href={(currentEquipment as Terminal).fotoLink!} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-500 hover:underline break-all">
                              {(currentEquipment as Terminal).fotoLink}
                            </a>
                          ) : (
                            <p className="text-sm">—</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
}
