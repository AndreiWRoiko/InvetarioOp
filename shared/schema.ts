import { sql } from "drizzle-orm";
import { pgTable, text, varchar, boolean, timestamp, decimal, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Tabela de usuários
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  nome: text("nome").notNull(),
  email: text("email").notNull().unique(),
  senha: text("senha").notNull(),
  perfil: text("perfil").notNull(), // Admin, Suporte, Controle
  ativo: boolean("ativo").notNull().default(true),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Tabela de notebooks
export const notebooks = pgTable("notebooks", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  responsavel: text("responsavel").notNull(),
  uf: text("uf").notNull(),
  centroCusto: text("centro_custo"),
  segmento: text("segmento").notNull(),
  cnpj: text("cnpj"),
  modelo: text("modelo").notNull(),
  fornecedor: text("fornecedor").notNull(), // MAGNA, OPUS, ONLY, ALLU
  status: text("status").notNull(), // EM USO, DEVOLVER, CORREIO, GUARDADO
  processador: text("processador"),
  senhaAdmin: text("senha_admin"),
  patrimonio: text("patrimonio"),
  dataRecebimento: text("data_recebimento"),
  valor: decimal("valor", { precision: 10, scale: 2 }),
  dataChecagem: text("data_checagem"),
  termoLink: text("termo_link"),
  fotoLink: text("foto_link"),
  checklistTermo: boolean("checklist_termo").default(false),
  checklistAntivirus: boolean("checklist_antivirus").default(false),
  checklistFerramentaA: boolean("checklist_ferramenta_a").default(false),
  checklistFerramentaB: boolean("checklist_ferramenta_b").default(false),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
  updatedAt: timestamp("updated_at").notNull().default(sql`now()`),
});

export const insertNotebookSchema = createInsertSchema(notebooks).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertNotebook = z.infer<typeof insertNotebookSchema>;
export type Notebook = typeof notebooks.$inferSelect;

// Tabela de celulares
export const celulares = pgTable("celulares", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  responsavel: text("responsavel").notNull(),
  numeroCelular: text("numero_celular").notNull(),
  uf: text("uf").notNull(),
  centroCusto: text("centro_custo"),
  segmento: text("segmento").notNull(),
  cnpj: text("cnpj"),
  modelo: text("modelo").notNull(),
  status: text("status").notNull(), // EM USO, DEVOLVER, CORREIO, GUARDADO
  emailLogin: text("email_login"),
  senhaLogin: text("senha_login"),
  emailSupervisao: text("email_supervisao"),
  senhaSupervisao: text("senha_supervisao"),
  imei: text("imei"),
  dataRecebimento: text("data_recebimento"),
  valor: decimal("valor", { precision: 10, scale: 2 }),
  dataChecagem: text("data_checagem"),
  termoLink: text("termo_link"),
  fotoLink: text("foto_link"),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
  updatedAt: timestamp("updated_at").notNull().default(sql`now()`),
});

export const insertCelularSchema = createInsertSchema(celulares).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertCelular = z.infer<typeof insertCelularSchema>;
export type Celular = typeof celulares.$inferSelect;

// Tabela de terminais
export const terminais = pgTable("terminais", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  numeroRelogio: text("numero_relogio").notNull(),
  status: text("status").notNull(), // EM USO, DEVOLVER, CORREIO, GUARDADO, TROCA
  uf: text("uf").notNull(),
  segmento: text("segmento").notNull(),
  centroCusto: text("centro_custo"),
  statusNext: text("status_next"),
  observacao: text("observacao"),
  dataChecagem: text("data_checagem"),
  termoLink: text("termo_link"),
  fotoLink: text("foto_link"),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
  updatedAt: timestamp("updated_at").notNull().default(sql`now()`),
});

export const insertTerminalSchema = createInsertSchema(terminais).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertTerminal = z.infer<typeof insertTerminalSchema>;
export type Terminal = typeof terminais.$inferSelect;

// Tabela de histórico
export const historico = pgTable("historico", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  action: text("action").notNull(), // criacao, edicao, exclusao
  userId: varchar("user_id").notNull().references(() => users.id),
  userName: text("user_name").notNull(),
  equipmentType: text("equipment_type").notNull(), // notebook, celular, terminal
  equipmentId: varchar("equipment_id"),
  details: text("details").notNull(),
  equipment: text("equipment"),
  timestamp: timestamp("timestamp").notNull().default(sql`now()`),
});

export const insertHistoricoSchema = createInsertSchema(historico).omit({
  id: true,
  timestamp: true,
});

export type InsertHistorico = z.infer<typeof insertHistoricoSchema>;
export type Historico = typeof historico.$inferSelect;
