import {
  type User,
  type InsertUser,
  type Notebook,
  type InsertNotebook,
  type Celular,
  type InsertCelular,
  type Terminal,
  type InsertTerminal,
  type Historico,
  type InsertHistorico,
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Usuários
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, user: Partial<InsertUser>): Promise<User | undefined>;
  deleteUser(id: string): Promise<boolean>;
  getAllUsers(): Promise<User[]>;

  // Notebooks
  getNotebook(id: string): Promise<Notebook | undefined>;
  createNotebook(notebook: InsertNotebook): Promise<Notebook>;
  updateNotebook(id: string, notebook: Partial<InsertNotebook>): Promise<Notebook | undefined>;
  deleteNotebook(id: string): Promise<boolean>;
  getAllNotebooks(): Promise<Notebook[]>;

  // Celulares
  getCelular(id: string): Promise<Celular | undefined>;
  createCelular(celular: InsertCelular): Promise<Celular>;
  updateCelular(id: string, celular: Partial<InsertCelular>): Promise<Celular | undefined>;
  deleteCelular(id: string): Promise<boolean>;
  getAllCelulares(): Promise<Celular[]>;

  // Terminais
  getTerminal(id: string): Promise<Terminal | undefined>;
  createTerminal(terminal: InsertTerminal): Promise<Terminal>;
  updateTerminal(id: string, terminal: Partial<InsertTerminal>): Promise<Terminal | undefined>;
  deleteTerminal(id: string): Promise<boolean>;
  getAllTerminais(): Promise<Terminal[]>;

  // Histórico
  createHistorico(historico: InsertHistorico): Promise<Historico>;
  getAllHistorico(): Promise<Historico[]>;
  getHistoricoByEquipment(equipmentId: string): Promise<Historico[]>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private notebooks: Map<string, Notebook>;
  private celulares: Map<string, Celular>;
  private terminais: Map<string, Terminal>;
  private historico: Map<string, Historico>;

  constructor() {
    this.users = new Map();
    this.notebooks = new Map();
    this.celulares = new Map();
    this.terminais = new Map();
    this.historico = new Map();

    // Criar usuário admin padrão
    const adminId = randomUUID();
    const adminUser: User = {
      id: adminId,
      nome: "Admin Opus",
      email: "admin@opus.com",
      senha: "opus@@2025$%",
      perfil: "Admin",
      ativo: true,
      createdAt: new Date(),
    };
    this.users.set(adminId, adminUser);
  }

  // Usuários
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find((user) => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = {
      id,
      nome: insertUser.nome,
      email: insertUser.email,
      senha: insertUser.senha,
      perfil: insertUser.perfil,
      ativo: insertUser.ativo ?? true,
      createdAt: new Date(),
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: string, updateData: Partial<InsertUser>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    const updated = { ...user, ...updateData };
    this.users.set(id, updated);
    return updated;
  }

  async deleteUser(id: string): Promise<boolean> {
    return this.users.delete(id);
  }

  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  // Notebooks
  async getNotebook(id: string): Promise<Notebook | undefined> {
    return this.notebooks.get(id);
  }

  async createNotebook(insertNotebook: InsertNotebook): Promise<Notebook> {
    const id = randomUUID();
    const now = new Date();
    const notebook: Notebook = {
      id,
      responsavel: insertNotebook.responsavel,
      uf: insertNotebook.uf,
      centroCusto: insertNotebook.centroCusto ?? null,
      segmento: insertNotebook.segmento,
      cnpj: insertNotebook.cnpj ?? null,
      modelo: insertNotebook.modelo,
      fornecedor: insertNotebook.fornecedor,
      status: insertNotebook.status,
      processador: insertNotebook.processador ?? null,
      senhaAdmin: insertNotebook.senhaAdmin ?? null,
      patrimonio: insertNotebook.patrimonio ?? null,
      dataRecebimento: insertNotebook.dataRecebimento ?? null,
      valor: insertNotebook.valor ?? null,
      dataChecagem: insertNotebook.dataChecagem ?? null,
      termoLink: insertNotebook.termoLink ?? null,
      fotoLink: insertNotebook.fotoLink ?? null,
      checklistTermo: insertNotebook.checklistTermo ?? false,
      checklistAntivirus: insertNotebook.checklistAntivirus ?? false,
      checklistFerramentaA: insertNotebook.checklistFerramentaA ?? false,
      checklistFerramentaB: insertNotebook.checklistFerramentaB ?? false,
      createdAt: now,
      updatedAt: now,
    };
    this.notebooks.set(id, notebook);
    return notebook;
  }

  async updateNotebook(id: string, updateData: Partial<InsertNotebook>): Promise<Notebook | undefined> {
    const notebook = this.notebooks.get(id);
    if (!notebook) return undefined;
    const updated = { ...notebook, ...updateData, updatedAt: new Date() };
    this.notebooks.set(id, updated);
    return updated;
  }

  async deleteNotebook(id: string): Promise<boolean> {
    return this.notebooks.delete(id);
  }

  async getAllNotebooks(): Promise<Notebook[]> {
    return Array.from(this.notebooks.values());
  }

  // Celulares
  async getCelular(id: string): Promise<Celular | undefined> {
    return this.celulares.get(id);
  }

  async createCelular(insertCelular: InsertCelular): Promise<Celular> {
    const id = randomUUID();
    const now = new Date();
    const celular: Celular = {
      id,
      responsavel: insertCelular.responsavel,
      numeroCelular: insertCelular.numeroCelular,
      uf: insertCelular.uf,
      centroCusto: insertCelular.centroCusto ?? null,
      segmento: insertCelular.segmento,
      cnpj: insertCelular.cnpj ?? null,
      modelo: insertCelular.modelo,
      status: insertCelular.status,
      emailLogin: insertCelular.emailLogin ?? null,
      senhaLogin: insertCelular.senhaLogin ?? null,
      emailSupervisao: insertCelular.emailSupervisao ?? null,
      senhaSupervisao: insertCelular.senhaSupervisao ?? null,
      imei: insertCelular.imei ?? null,
      dataRecebimento: insertCelular.dataRecebimento ?? null,
      valor: insertCelular.valor ?? null,
      dataChecagem: insertCelular.dataChecagem ?? null,
      termoLink: insertCelular.termoLink ?? null,
      fotoLink: insertCelular.fotoLink ?? null,
      createdAt: now,
      updatedAt: now,
    };
    this.celulares.set(id, celular);
    return celular;
  }

  async updateCelular(id: string, updateData: Partial<InsertCelular>): Promise<Celular | undefined> {
    const celular = this.celulares.get(id);
    if (!celular) return undefined;
    const updated = { ...celular, ...updateData, updatedAt: new Date() };
    this.celulares.set(id, updated);
    return updated;
  }

  async deleteCelular(id: string): Promise<boolean> {
    return this.celulares.delete(id);
  }

  async getAllCelulares(): Promise<Celular[]> {
    return Array.from(this.celulares.values());
  }

  // Terminais
  async getTerminal(id: string): Promise<Terminal | undefined> {
    return this.terminais.get(id);
  }

  async createTerminal(insertTerminal: InsertTerminal): Promise<Terminal> {
    const id = randomUUID();
    const now = new Date();
    const terminal: Terminal = {
      id,
      numeroRelogio: insertTerminal.numeroRelogio,
      status: insertTerminal.status,
      uf: insertTerminal.uf,
      segmento: insertTerminal.segmento,
      centroCusto: insertTerminal.centroCusto ?? null,
      statusNext: insertTerminal.statusNext ?? null,
      observacao: insertTerminal.observacao ?? null,
      dataChecagem: insertTerminal.dataChecagem ?? null,
      termoLink: insertTerminal.termoLink ?? null,
      fotoLink: insertTerminal.fotoLink ?? null,
      createdAt: now,
      updatedAt: now,
    };
    this.terminais.set(id, terminal);
    return terminal;
  }

  async updateTerminal(id: string, updateData: Partial<InsertTerminal>): Promise<Terminal | undefined> {
    const terminal = this.terminais.get(id);
    if (!terminal) return undefined;
    const updated = { ...terminal, ...updateData, updatedAt: new Date() };
    this.terminais.set(id, updated);
    return updated;
  }

  async deleteTerminal(id: string): Promise<boolean> {
    return this.terminais.delete(id);
  }

  async getAllTerminais(): Promise<Terminal[]> {
    return Array.from(this.terminais.values());
  }

  // Histórico
  async createHistorico(insertHistorico: InsertHistorico): Promise<Historico> {
    const id = randomUUID();
    const historico: Historico = {
      id,
      action: insertHistorico.action,
      userId: insertHistorico.userId,
      userName: insertHistorico.userName,
      equipmentType: insertHistorico.equipmentType,
      equipmentId: insertHistorico.equipmentId ?? null,
      details: insertHistorico.details,
      equipment: insertHistorico.equipment ?? null,
      timestamp: new Date(),
    };
    this.historico.set(id, historico);
    return historico;
  }

  async getAllHistorico(): Promise<Historico[]> {
    return Array.from(this.historico.values()).sort((a, b) => 
      b.timestamp.getTime() - a.timestamp.getTime()
    );
  }

  async getHistoricoByEquipment(equipmentId: string): Promise<Historico[]> {
    return Array.from(this.historico.values())
      .filter((h) => h.equipmentId === equipmentId)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }
}

export const storage = new MemStorage();
