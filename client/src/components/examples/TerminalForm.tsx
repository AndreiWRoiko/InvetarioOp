import { useState } from 'react';
import TerminalForm from '../TerminalForm';

export default function TerminalFormExample() {
  const [data, setData] = useState({});
  
  return (
    <div className="p-6 max-w-4xl">
      <TerminalForm data={data} onChange={setData} />
    </div>
  );
}
