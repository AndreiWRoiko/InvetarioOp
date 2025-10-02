import UserManagementTable from '../UserManagementTable';

const mockUsers = [
  { id: "1", nome: "Admin Sistema", email: "admin@sistema.com", perfil: "Admin" as const, ativo: true },
  { id: "2", nome: "Suporte TI", email: "suporte@sistema.com", perfil: "Suporte" as const, ativo: true },
  { id: "3", nome: "Controle Geral", email: "controle@sistema.com", perfil: "Controle" as const, ativo: true },
];

export default function UserManagementTableExample() {
  return (
    <UserManagementTable
      users={mockUsers}
      onEdit={(id) => console.log('Edit user:', id)}
      onDelete={(id) => console.log('Delete user:', id)}
    />
  );
}
