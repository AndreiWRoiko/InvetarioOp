import DashboardStats from '../DashboardStats';

const mockData = {
  totalEquipment: 145,
  byStatus: {
    "EM USO": 98,
    "DEVOLVER": 12,
    "CORREIO": 8,
    "GUARDADO": 20,
    "TROCA": 7,
  },
  byUF: {
    "SP": 65,
    "RJ": 45,
    "MG": 20,
    "RS": 15,
  },
};

export default function DashboardStatsExample() {
  return <DashboardStats {...mockData} />;
}
