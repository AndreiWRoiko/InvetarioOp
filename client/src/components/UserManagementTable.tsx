import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2 } from "lucide-react";

interface User {
  id: string;
  nome: string;
  email: string;
  perfil: "Admin" | "Suporte" | "Controle";
  ativo: boolean;
}

interface UserManagementTableProps {
  users: User[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onToggleActive?: (id: string, currentStatus: boolean) => void;
}

const perfilColors: Record<string, string> = {
  Admin: "bg-primary/15 text-primary",
  Suporte: "bg-[hsl(38,92%,50%)]/15 text-[hsl(38,92%,50%)]",
  Controle: "bg-[hsl(142,76%,36%)]/15 text-[hsl(142,76%,36%)]",
};

export default function UserManagementTable({ users, onEdit, onDelete, onToggleActive }: UserManagementTableProps) {
  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Perfil</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id} className="hover-elevate" data-testid={`row-user-${user.id}`}>
              <TableCell className="font-medium">{user.nome}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                <Badge variant="secondary" className={`${perfilColors[user.perfil]} border-0`}>
                  {user.perfil}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant={user.ativo ? "secondary" : "outline"} className={user.ativo ? "bg-[hsl(142,76%,36%)]/15 text-[hsl(142,76%,36%)] border-0" : ""}>
                  {user.ativo ? "Ativo" : "Inativo"}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex justify-end gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onEdit(user.id)}
                    data-testid={`button-edit-user-${user.id}`}
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onDelete(user.id)}
                    data-testid={`button-delete-user-${user.id}`}
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
