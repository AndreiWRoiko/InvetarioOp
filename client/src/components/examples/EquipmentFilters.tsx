import EquipmentFilters from '../EquipmentFilters';

export default function EquipmentFiltersExample() {
  return (
    <EquipmentFilters
      onSearchChange={(val) => console.log('Search:', val)}
      onStatusChange={(val) => console.log('Status:', val)}
      onUFChange={(val) => console.log('UF:', val)}
      onSegmentoChange={(val) => console.log('Segmento:', val)}
      onFornecedorChange={(val) => console.log('Fornecedor:', val)}
      showFornecedor={true}
    />
  );
}
