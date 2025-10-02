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
import type { Notebook, Celular, Terminal } from "@shared/schema";

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
    toast({
      title: "Visualizar Equipamento",
      description: `Funcionalidade em desenvolvimento`,
    });
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
    </div>
  );
}
