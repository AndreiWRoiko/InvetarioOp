import DashboardCharts from '../DashboardCharts';

const mockStatusData = [
  { name: "Em Uso", value: 98 },
  { name: "Devolver", value: 12 },
  { name: "Correio", value: 8 },
  { name: "Guardado", value: 20 },
  { name: "Troca", value: 7 },
];

const mockUFData = [
  { name: "SP", value: 65 },
  { name: "RJ", value: 45 },
  { name: "MG", value: 20 },
  { name: "RS", value: 15 },
];

export default function DashboardChartsExample() {
  return (
    <DashboardCharts
      statusData={mockStatusData}
      ufData={mockUFData}
    />
  );
}
