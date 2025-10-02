import EquipmentTable from '../EquipmentTable';

const mockEquipment = [
  { id: "1", tipo: "Notebook", responsavel: "João Silva", modelo: "Dell Latitude 5420", status: "EM USO", uf: "SP", segmento: "TI" },
  { id: "2", tipo: "Celular", responsavel: "Maria Santos", modelo: "iPhone 13", status: "DEVOLVER", uf: "RJ", segmento: "Vendas" },
  { id: "3", tipo: "Terminal", responsavel: "Pedro Costa", modelo: "REP 100", status: "GUARDADO", uf: "MG", segmento: "Administrativo" },
];

export default function EquipmentTableExample() {
  return (
    <EquipmentTable
      equipment={mockEquipment}
      onView={(id) => console.log('View:', id)}
      onEdit={(id) => console.log('Edit:', id)}
      onDelete={(id) => console.log('Delete:', id)}
    />
  );
}
