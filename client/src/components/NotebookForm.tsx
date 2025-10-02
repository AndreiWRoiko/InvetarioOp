import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface NotebookFormData {
  responsavel: string;
  uf: string;
  centroCusto: string;
  segmento: string;
  cnpj: string;
  modelo: string;
  fornecedor: string;
  status: string;
  processador: string;
  office: string;
  senhaAdmin: string;
  patrimonio: string;
  dataRecebimento: string;
  valor: string;
  dataChecagem: string;
  termoLink: string;
  fotoLink: string;
  checklistTermo: boolean;
  checklistAntivirus: boolean;
  checklistFerramentaA: boolean;
  checklistFerramentaB: boolean;
}

interface NotebookFormProps {
  data: Partial<NotebookFormData>;
  onChange: (data: Partial<NotebookFormData>) => void;
}

export default function NotebookForm({ data, onChange }: NotebookFormProps) {
  const updateField = (field: keyof NotebookFormData, value: any) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Informações Básicas</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="responsavel">Responsável *</Label>
            <Input
              id="responsavel"
              value={data.responsavel || ""}
              onChange={(e) => updateField("responsavel", e.target.value)}
              data-testid="input-responsavel"
            />
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
            <Label htmlFor="centroCusto">Centro de Custo</Label>
            <Input
              id="centroCusto"
              value={data.centroCusto || ""}
              onChange={(e) => updateField("centroCusto", e.target.value)}
              data-testid="input-centro-custo"
            />
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
            <Label htmlFor="cnpj">CNPJ</Label>
            <Input
              id="cnpj"
              value={data.cnpj || ""}
              onChange={(e) => updateField("cnpj", e.target.value)}
              data-testid="input-cnpj"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Dados Técnicos</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="modelo">Modelo *</Label>
            <Input
              id="modelo"
              value={data.modelo || ""}
              onChange={(e) => updateField("modelo", e.target.value)}
              data-testid="input-modelo"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="fornecedor">Fornecedor *</Label>
            <Select value={data.fornecedor} onValueChange={(val) => updateField("fornecedor", val)}>
              <SelectTrigger id="fornecedor" data-testid="select-fornecedor">
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="MAGNA">MAGNA</SelectItem>
                <SelectItem value="OPUS">OPUS</SelectItem>
                <SelectItem value="ONLY">ONLY</SelectItem>
                <SelectItem value="ALLU">ALLU</SelectItem>
              </SelectContent>
            </Select>
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
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="processador">Processador</Label>
            <Input
              id="processador"
              value={data.processador || ""}
              onChange={(e) => updateField("processador", e.target.value)}
              data-testid="input-processador"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="office">Office</Label>
            <Select value={data.office} onValueChange={(val) => updateField("office", val)}>
              <SelectTrigger id="office" data-testid="select-office">
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="NÃO LICENCIADO">NÃO LICENCIADO</SelectItem>
                <SelectItem value="OFFICE BASIC">OFFICE BASIC</SelectItem>
                <SelectItem value="OFFICE STANDARD">OFFICE STANDARD</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="senhaAdmin">Senha Admin</Label>
            <Input
              id="senhaAdmin"
              type="password"
              value={data.senhaAdmin || ""}
              onChange={(e) => updateField("senhaAdmin", e.target.value)}
              data-testid="input-senha-admin"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="patrimonio">Patrimônio</Label>
            <Input
              id="patrimonio"
              className="font-mono"
              value={data.patrimonio || ""}
              onChange={(e) => updateField("patrimonio", e.target.value)}
              data-testid="input-patrimonio"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dataRecebimento">Data de Recebimento</Label>
            <Input
              id="dataRecebimento"
              type="date"
              value={data.dataRecebimento || ""}
              onChange={(e) => updateField("dataRecebimento", e.target.value)}
              data-testid="input-data-recebimento"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="valor">Valor do Equipamento</Label>
            <Input
              id="valor"
              type="number"
              step="0.01"
              value={data.valor || ""}
              onChange={(e) => updateField("valor", e.target.value)}
              data-testid="input-valor"
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

      <Card>
        <CardHeader>
          <CardTitle>Checklist</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="checklistTermo"
              checked={data.checklistTermo}
              onCheckedChange={(checked) => updateField("checklistTermo", checked)}
              data-testid="checkbox-termo"
            />
            <Label htmlFor="checklistTermo" className="font-normal cursor-pointer">
              Termo
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="checklistAntivirus"
              checked={data.checklistAntivirus}
              onCheckedChange={(checked) => updateField("checklistAntivirus", checked)}
              data-testid="checkbox-antivirus"
            />
            <Label htmlFor="checklistAntivirus" className="font-normal cursor-pointer">
              Antivírus
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="checklistFerramentaA"
              checked={data.checklistFerramentaA}
              onCheckedChange={(checked) => updateField("checklistFerramentaA", checked)}
              data-testid="checkbox-ferramenta-a"
            />
            <Label htmlFor="checklistFerramentaA" className="font-normal cursor-pointer">
              Ferramenta A
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="checklistFerramentaB"
              checked={data.checklistFerramentaB}
              onCheckedChange={(checked) => updateField("checklistFerramentaB", checked)}
              data-testid="checkbox-ferramenta-b"
            />
            <Label htmlFor="checklistFerramentaB" className="font-normal cursor-pointer">
              Ferramenta B
            </Label>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
