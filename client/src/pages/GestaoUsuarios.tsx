import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import UserManagementTable from "@/components/UserManagementTable";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Plus } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface UserWithoutPassword {
  id: string;
  nome: string;
  email: string;
  perfil: "Admin" | "Suporte" | "Controle";
  ativo: boolean;
}

export default function GestaoUsuarios() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const [newUserName, setNewUserName] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserPassword, setNewUserPassword] = useState("");
  const [newUserPerfil, setNewUserPerfil] = useState<"Admin" | "Suporte" | "Controle">("Suporte");
  const { toast } = useToast();

  const { data: users = [], isLoading } = useQuery<UserWithoutPassword[]>({
    queryKey: ["/api/users"],
  });

  const createMutation = useMutation({
    mutationFn: async (data: { nome: string; email: string; senha: string; perfil: string }) => {
      await apiRequest("POST", "/api/users", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users"] });
      toast({
        title: "Usuário adicionado!",
        description: `${newUserName} foi cadastrado com sucesso.`,
      });
      setIsDialogOpen(false);
      setNewUserName("");
      setNewUserEmail("");
      setNewUserPassword("");
      setNewUserPerfil("Suporte");
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Erro ao criar usuário",
        description: error.message || "Não foi possível criar o usuário",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/users/${id}`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users"] });
      toast({
        title: "Usuário excluído",
        description: "O usuário foi removido do sistema com sucesso",
      });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Erro ao excluir",
        description: error.message || "Não foi possível excluir o usuário",
      });
    },
  });

  const toggleActiveMutation = useMutation({
    mutationFn: async ({ id, ativo }: { id: string; ativo: boolean }) => {
      await apiRequest("PATCH", `/api/users/${id}`, { ativo });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users"] });
      toast({
        title: "Status atualizado",
        description: "O status do usuário foi atualizado com sucesso",
      });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Erro ao atualizar",
        description: error.message || "Não foi possível atualizar o status",
      });
    },
  });

  const handleAddUser = () => {
    if (!newUserName || !newUserEmail || !newUserPassword) {
      toast({
        variant: "destructive",
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos",
      });
      return;
    }

    createMutation.mutate({
      nome: newUserName,
      email: newUserEmail,
      senha: newUserPassword,
      perfil: newUserPerfil,
    });
  };

  const handleEdit = (id: string) => {
    toast({
      title: "Editar Usuário",
      description: "Funcionalidade em desenvolvimento",
    });
  };

  const handleDelete = (id: string) => {
    setUserToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (userToDelete) {
      deleteMutation.mutate(userToDelete);
      setDeleteDialogOpen(false);
      setUserToDelete(null);
    }
  };

  const handleToggleActive = (id: string, currentStatus: boolean) => {
    toggleActiveMutation.mutate({ id, ativo: !currentStatus });
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Gestão de Usuários</h1>
          <p className="text-muted-foreground">Gerenciar usuários e permissões do sistema</p>
        </div>
        <Skeleton className="h-96" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold" data-testid="heading-usuarios">Gestão de Usuários</h1>
          <p className="text-muted-foreground">Gerenciar usuários e permissões do sistema</p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)} data-testid="button-add-user">
          <Plus className="w-4 h-4 mr-2" />
          Adicionar Usuário
        </Button>
      </div>

      <UserManagementTable
        users={users}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onToggleActive={handleToggleActive}
      />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Novo Usuário</DialogTitle>
            <DialogDescription>
              Preencha os dados do novo usuário e selecione o perfil de acesso.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="userName">Nome *</Label>
              <Input
                id="userName"
                value={newUserName}
                onChange={(e) => setNewUserName(e.target.value)}
                data-testid="input-new-user-name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="userEmail">Email *</Label>
              <Input
                id="userEmail"
                type="email"
                value={newUserEmail}
                onChange={(e) => setNewUserEmail(e.target.value)}
                data-testid="input-new-user-email"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="userPassword">Senha *</Label>
              <Input
                id="userPassword"
                type="password"
                value={newUserPassword}
                onChange={(e) => setNewUserPassword(e.target.value)}
                data-testid="input-new-user-password"
              />
            </div>

            <div className="space-y-2">
              <Label>Perfil de Acesso</Label>
              <RadioGroup value={newUserPerfil} onValueChange={(val) => setNewUserPerfil(val as any)}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Admin" id="admin" data-testid="radio-admin" />
                  <Label htmlFor="admin" className="font-normal cursor-pointer">
                    Admin - Acesso total ao sistema
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Suporte" id="suporte" data-testid="radio-suporte" />
                  <Label htmlFor="suporte" className="font-normal cursor-pointer">
                    Suporte - Controle do inventário e modificações
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Controle" id="controle" data-testid="radio-controle" />
                  <Label htmlFor="controle" className="font-normal cursor-pointer">
                    Controle - Apenas visualização de métricas
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </div>

          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsDialogOpen(false)}
              disabled={createMutation.isPending}
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleAddUser}
              disabled={createMutation.isPending}
              data-testid="button-save-user"
            >
              {createMutation.isPending ? "Salvando..." : "Adicionar Usuário"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este usuário? Esta ação não pode ser desfeita.
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
