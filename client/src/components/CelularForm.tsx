import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CelularFormData {
  responsavel: string;
  numeroCelular: string;
  uf: string;
  centroCusto: string;
  segmento: string;
  cnpj: string;
  modelo: string;
  status: string;
  emailLogin: string;
  senhaLogin: string;
  emailSupervisao: string;
  senhaSupervisao: string;
  imei: string;
  dataRecebimento: string;
  valor: string;
  dataChecagem: string;
  termoLink: string;
  fotoLink: string;
}

interface CelularFormProps {
  data: Partial<CelularFormData>;
  onChange: (data: Partial<CelularFormData>) => void;
}

export default function CelularForm({ data, onChange }: CelularFormProps) {
  const updateField = (field: keyof CelularFormData, value: any) => {
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
            <Label htmlFor="numeroCelular">Número do Celular *</Label>
            <Input
              id="numeroCelular"
              type="tel"
              value={data.numeroCelular || ""}
              onChange={(e) => updateField("numeroCelular", e.target.value)}
              data-testid="input-numero-celular"
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
          <CardTitle>Dados do Equipamento</CardTitle>
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
            <Label htmlFor="imei">IMEI</Label>
            <Input
              id="imei"
              className="font-mono"
              value={data.imei || ""}
              onChange={(e) => updateField("imei", e.target.value)}
              data-testid="input-imei"
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
          <CardTitle>Credenciais de Acesso</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="emailLogin">Email de Login</Label>
            <Input
              id="emailLogin"
              type="email"
              value={data.emailLogin || ""}
              onChange={(e) => updateField("emailLogin", e.target.value)}
              data-testid="input-email-login"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="senhaLogin">Senha de Login</Label>
            <Input
              id="senhaLogin"
              type="password"
              value={data.senhaLogin || ""}
              onChange={(e) => updateField("senhaLogin", e.target.value)}
              data-testid="input-senha-login"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="emailSupervisao">Email de Supervisão</Label>
            <Input
              id="emailSupervisao"
              type="email"
              value={data.emailSupervisao || ""}
              onChange={(e) => updateField("emailSupervisao", e.target.value)}
              data-testid="input-email-supervisao"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="senhaSupervisao">Senha de Supervisão</Label>
            <Input
              id="senhaSupervisao"
              type="password"
              value={data.senhaSupervisao || ""}
              onChange={(e) => updateField("senhaSupervisao", e.target.value)}
              data-testid="input-senha-supervisao"
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
