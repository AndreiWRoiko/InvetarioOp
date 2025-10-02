import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import EquipmentTypeSelector from "@/components/EquipmentTypeSelector";
import NotebookForm from "@/components/NotebookForm";
import CelularForm from "@/components/CelularForm";
import TerminalForm from "@/components/TerminalForm";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { ArrowLeft } from "lucide-react";

export default function CadastroEquipamento() {
  const [selectedType, setSelectedType] = useState<"notebook" | "celular" | "terminal" | null>(null);
  const [formData, setFormData] = useState({});
  const { toast } = useToast();
  const { user } = useAuth();

  const createMutation = useMutation({
    mutationFn: async ({ type, data }: { type: string; data: any }) => {
      const endpoint = type === "notebook" ? "/api/notebooks"
                     : type === "celular" ? "/api/celulares"
                     : "/api/terminais";
      
      const dataWithUser = {
        ...data,
        _userId: user?.id,
        _userName: user?.nome,
      };
      
      await apiRequest("POST", endpoint, dataWithUser);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/notebooks"] });
      queryClient.invalidateQueries({ queryKey: ["/api/celulares"] });
      queryClient.invalidateQueries({ queryKey: ["/api/terminais"] });
      queryClient.invalidateQueries({ queryKey: ["/api/historico"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
      
      toast({
        title: "Equipamento cadastrado!",
        description: `${selectedType === "notebook" ? "Notebook" : selectedType === "celular" ? "Celular" : "Terminal"} foi adicionado ao inventário com sucesso.`,
      });
      
      setSelectedType(null);
      setFormData({});
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Erro ao cadastrar",
        description: error.message || "Não foi possível cadastrar o equipamento",
      });
    },
  });

  const handleSave = () => {
    if (!selectedType) return;

    // Validação básica dos campos obrigatórios
    const requiredFields = selectedType === "notebook"
      ? ["responsavel", "uf", "segmento", "modelo", "fornecedor", "status"]
      : selectedType === "celular"
      ? ["responsavel", "numeroCelular", "uf", "segmento", "modelo", "status"]
      : ["numeroRelogio", "status", "uf", "segmento"];

    const missingFields = requiredFields.filter(field => !(formData as any)[field]);
    
    if (missingFields.length > 0) {
      toast({
        variant: "destructive",
        title: "Campos obrigatórios faltando",
        description: `Por favor, preencha todos os campos obrigatórios.`,
      });
      return;
    }

    createMutation.mutate({ type: selectedType, data: formData });
  };

  const handleCancel = () => {
    setSelectedType(null);
    setFormData({});
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold" data-testid="heading-cadastro">Cadastrar Equipamento</h1>
        <p className="text-muted-foreground">Adicionar novo equipamento ao inventário</p>
      </div>

      {!selectedType ? (
        <EquipmentTypeSelector
          onSelect={setSelectedType}
          selectedType={selectedType || undefined}
        />
      ) : (
        <div className="space-y-6">
          <Button
            variant="ghost"
            onClick={handleCancel}
            data-testid="button-back"
            disabled={createMutation.isPending}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>

          <div>
            <h2 className="text-2xl font-semibold mb-4">
              {selectedType === "notebook" && "Cadastrar Notebook"}
              {selectedType === "celular" && "Cadastrar Celular"}
              {selectedType === "terminal" && "Cadastrar Terminal"}
            </h2>

            {selectedType === "notebook" && (
              <NotebookForm data={formData} onChange={setFormData} />
            )}
            {selectedType === "celular" && (
              <CelularForm data={formData} onChange={setFormData} />
            )}
            {selectedType === "terminal" && (
              <TerminalForm data={formData} onChange={setFormData} />
            )}
          </div>

          <div className="flex justify-end gap-4">
            <Button 
              variant="outline" 
              onClick={handleCancel} 
              data-testid="button-cancel"
              disabled={createMutation.isPending}
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleSave} 
              data-testid="button-save"
              disabled={createMutation.isPending}
            >
              {createMutation.isPending ? "Salvando..." : "Salvar Equipamento"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
