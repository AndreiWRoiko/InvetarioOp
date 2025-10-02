import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";

interface EquipmentFiltersProps {
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onUFChange: (value: string) => void;
  onSegmentoChange: (value: string) => void;
  onFornecedorChange?: (value: string) => void;
  showFornecedor?: boolean;
}

export default function EquipmentFilters({
  onSearchChange,
  onStatusChange,
  onUFChange,
  onSegmentoChange,
  onFornecedorChange,
  showFornecedor = false,
}: EquipmentFiltersProps) {
  return (
    <div className="flex flex-wrap gap-4 items-center">
      <div className="relative flex-1 min-w-[200px]">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Buscar equipamentos..."
          className="pl-9"
          onChange={(e) => onSearchChange(e.target.value)}
          data-testid="input-search-equipment"
        />
      </div>
      
      <Select onValueChange={onStatusChange}>
        <SelectTrigger className="w-[180px]" data-testid="select-status-filter">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos</SelectItem>
          <SelectItem value="EM USO">Em Uso</SelectItem>
          <SelectItem value="DEVOLVER">Devolver</SelectItem>
          <SelectItem value="CORREIO">Correio</SelectItem>
          <SelectItem value="GUARDADO">Guardado</SelectItem>
          <SelectItem value="TROCA">Troca</SelectItem>
        </SelectContent>
      </Select>

      <Select onValueChange={onUFChange}>
        <SelectTrigger className="w-[120px]" data-testid="select-uf-filter">
          <SelectValue placeholder="UF" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todas</SelectItem>
          <SelectItem value="SP">SP</SelectItem>
          <SelectItem value="RJ">RJ</SelectItem>
          <SelectItem value="MG">MG</SelectItem>
          <SelectItem value="RS">RS</SelectItem>
        </SelectContent>
      </Select>

      <Select onValueChange={onSegmentoChange}>
        <SelectTrigger className="w-[160px]" data-testid="select-segmento-filter">
          <SelectValue placeholder="Segmento" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos</SelectItem>
          <SelectItem value="TI">TI</SelectItem>
          <SelectItem value="Vendas">Vendas</SelectItem>
          <SelectItem value="Administrativo">Administrativo</SelectItem>
        </SelectContent>
      </Select>

      {showFornecedor && onFornecedorChange && (
        <Select onValueChange={onFornecedorChange}>
          <SelectTrigger className="w-[140px]" data-testid="select-fornecedor-filter">
            <SelectValue placeholder="Fornecedor" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="MAGNA">MAGNA</SelectItem>
            <SelectItem value="OPUS">OPUS</SelectItem>
            <SelectItem value="ONLY">ONLY</SelectItem>
            <SelectItem value="ALLU">ALLU</SelectItem>
          </SelectContent>
        </Select>
      )}
    </div>
  );
}
