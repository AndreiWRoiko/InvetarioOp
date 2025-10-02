import { useState } from 'react';
import CelularForm from '../CelularForm';

export default function CelularFormExample() {
  const [data, setData] = useState({});
  
  return (
    <div className="p-6 max-w-4xl">
      <CelularForm data={data} onChange={setData} />
    </div>
  );
}
