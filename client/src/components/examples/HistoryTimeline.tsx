import HistoryTimeline from '../HistoryTimeline';

const mockHistory = [
  {
    id: "1",
    action: "edicao",
    user: "Admin",
    timestamp: new Date(2025, 0, 2, 14, 30),
    details: "Alterou o status de EM USO para DEVOLVER",
    equipment: "Notebook Dell Latitude 5420 - João Silva",
  },
  {
    id: "2",
    action: "criacao",
    user: "Suporte TI",
    timestamp: new Date(2025, 0, 2, 10, 15),
    details: "Cadastrou novo equipamento",
    equipment: "Celular iPhone 13 - Maria Santos",
  },
  {
    id: "3",
    action: "exclusao",
    user: "Admin",
    timestamp: new Date(2025, 0, 1, 16, 45),
    details: "Removeu equipamento do inventário",
    equipment: "Terminal REP 50 - Equipamento danificado",
  },
];

export default function HistoryTimelineExample() {
  return <HistoryTimeline entries={mockHistory} />;
}
