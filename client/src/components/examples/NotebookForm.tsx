import { useState } from 'react';
import NotebookForm from '../NotebookForm';

export default function NotebookFormExample() {
  const [data, setData] = useState({});
  
  return (
    <div className="p-6 max-w-4xl">
      <NotebookForm data={data} onChange={setData} />
    </div>
  );
}
