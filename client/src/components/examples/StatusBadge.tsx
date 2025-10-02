import StatusBadge from '../StatusBadge';

export default function StatusBadgeExample() {
  return (
    <div className="flex gap-2 flex-wrap">
      <StatusBadge status="EM USO" />
      <StatusBadge status="DEVOLVER" />
      <StatusBadge status="CORREIO" />
      <StatusBadge status="GUARDADO" />
      <StatusBadge status="TROCA" />
    </div>
  );
}
