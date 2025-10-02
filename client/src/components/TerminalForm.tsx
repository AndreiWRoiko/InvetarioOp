import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface TerminalFormData {
  numeroRelogio: string;
  status: string;
  uf: string;
  segmento: string;
  centroCusto: string;
  statusNext: string;
  observacao: string;
  dataChecagem: string;
  termoLink: string;
  fotoLink: string;
}

interface TerminalFormProps {
  data: Partial<TerminalFormData>;
  onChange: (data: Partial<TerminalFormData>) => void;
}

export default function TerminalForm({ data, onChange }: TerminalFormProps) {
  const updateField = (field: keyof TerminalFormData, value: any) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Informações do Terminal</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="numeroRelogio">Número do Relógio *</Label>
            <Input
              id="numeroRelogio"
              className="font-mono"
              value={data.numeroRelogio || ""}
              onChange={(e) => updateField("numeroRelogio", e.target.value)}
              data-testid="input-numero-relogio"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status *</Label>
            <Select value={data.status} onValueChange={(val) => updateField("status", val)}>
              <SelectTrigger id="status" data-testid="select-status">
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="EM USO">EM USO</SelectItem>
                <SelectItem value="DEVOLVER">DEVOLVER</SelectItem>
                <SelectItem value="CORREIO">CORREIO</SelectItem>
                <SelectItem value="GUARDADO">GUARDADO</SelectItem>
                <SelectItem value="TROCA">TROCA</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="uf">UF *</Label>
            <Select value={data.uf} onValueChange={(val) => updateField("uf", val)}>
              <SelectTrigger id="uf" data-testid="select-uf">
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="SP">SP</SelectItem>
                <SelectItem value="RJ">RJ</SelectItem>
                <SelectItem value="MG">MG</SelectItem>
                <SelectItem value="RS">RS</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="segmento">Segmento *</Label>
            <Input
              id="segmento"
              value={data.segmento || ""}
              onChange={(e) => updateField("segmento", e.target.value)}
              data-testid="input-segmento"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="centroCusto">Centro de Custo</Label>
            <Input
              id="centroCusto"
              value={data.centroCusto || ""}
              onChange={(e) => updateField("centroCusto", e.target.value)}
              data-testid="input-centro-custo"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="statusNext">Status Next</Label>
            <Input
              id="statusNext"
              value={data.statusNext || ""}
              onChange={(e) => updateField("statusNext", e.target.value)}
              data-testid="input-status-next"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dataChecagem">Data de Checagem</Label>
            <Input
              id="dataChecagem"
              type="date"
              value={data.dataChecagem || ""}
              onChange={(e) => updateField("dataChecagem", e.target.value)}
              data-testid="input-data-checagem"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Observações</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="observacao">Observação</Label>
            <Textarea
              id="observacao"
              rows={4}
              value={data.observacao || ""}
              onChange={(e) => updateField("observacao", e.target.value)}
              data-testid="textarea-observacao"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Documentação</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4">
          <div className="space-y-2">
            <Label htmlFor="termoLink">Link do Termo</Label>
            <Input
              id="termoLink"
              type="url"
              placeholder="https://..."
              value={data.termoLink || ""}
              onChange={(e) => updateField("termoLink", e.target.value)}
              data-testid="input-termo-link"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="fotoLink">Link da Foto do Equipamento</Label>
            <Input
              id="fotoLink"
              type="url"
              placeholder="https://..."
              value={data.fotoLink || ""}
              onChange={(e) => updateField("fotoLink", e.target.value)}
              data-testid="input-foto-link"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
