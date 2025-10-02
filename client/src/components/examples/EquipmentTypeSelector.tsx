import { useState } from 'react';
import EquipmentTypeSelector from '../EquipmentTypeSelector';

export default function EquipmentTypeSelectorExample() {
  const [selected, setSelected] = useState<string>();
  
  return (
    <EquipmentTypeSelector 
      onSelect={(type) => {
        setSelected(type);
        console.log('Selected type:', type);
      }}
      selectedType={selected}
    />
  );
}
