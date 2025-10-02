import { Card } from "@/components/ui/card";
import { Laptop, Smartphone, Clock } from "lucide-react";

interface EquipmentTypeSelectorProps {
  onSelect: (type: "notebook" | "celular" | "terminal") => void;
  selectedType?: string;
}

const equipmentTypes = [
  { id: "notebook", label: "Notebook", icon: Laptop },
  { id: "celular", label: "Celular", icon: Smartphone },
  { id: "terminal", label: "Terminal", icon: Clock },
] as const;

export default function EquipmentTypeSelector({ onSelect, selectedType }: EquipmentTypeSelectorProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {equipmentTypes.map(({ id, label, icon: Icon }) => (
        <Card
          key={id}
          className={`p-6 cursor-pointer transition-all hover-elevate active-elevate-2 ${
            selectedType === id ? "ring-2 ring-primary" : ""
          }`}
          onClick={() => onSelect(id)}
          data-testid={`card-equipment-type-${id}`}
        >
          <div className="flex flex-col items-center gap-3">
            <div className={`p-3 rounded-lg ${selectedType === id ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
              <Icon className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-semibold">{label}</h3>
          </div>
        </Card>
      ))}
    </div>
  );
}
