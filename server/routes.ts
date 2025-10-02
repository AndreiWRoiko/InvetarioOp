import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import {
  insertUserSchema,
  insertNotebookSchema,
  insertCelularSchema,
  insertTerminalSchema,
} from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // ========== Autenticação ==========
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, senha } = req.body;

      if (!email || !senha) {
        return res.status(400).json({ error: "Email e senha são obrigatórios" });
      }

      const user = await storage.getUserByEmail(email);
      
      if (!user || user.senha !== senha) {
        return res.status(401).json({ error: "Credenciais inválidas" });
      }

      if (!user.ativo) {
        return res.status(403).json({ error: "Usuário inativo" });
      }

      // Não retornar senha
      const { senha: _, ...userWithoutPassword } = user;
      res.json({ user: userWithoutPassword });
    } catch (error) {
      res.status(500).json({ error: "Erro ao fazer login" });
    }
  });

  // ========== Usuários ==========
  app.get("/api/users", async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      // Remover senhas
      const usersWithoutPasswords = users.map(({ senha, ...user }) => user);
      res.json(usersWithoutPasswords);
    } catch (error) {
      res.status(500).json({ error: "Erro ao buscar usuários" });
    }
  });

  app.get("/api/users/:id", async (req, res) => {
    try {
      const user = await storage.getUser(req.params.id);
      if (!user) {
        return res.status(404).json({ error: "Usuário não encontrado" });
      }
      const { senha, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ error: "Erro ao buscar usuário" });
    }
  });

  app.post("/api/users", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Verificar se email já existe
      const existingUser = await storage.getUserByEmail(userData.email);
      if (existingUser) {
        return res.status(400).json({ error: "Email já cadastrado" });
      }

      const user = await storage.createUser(userData);
      const { senha, ...userWithoutPassword } = user;
      
      res.status(201).json(userWithoutPassword);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Erro ao criar usuário" });
    }
  });

  app.patch("/api/users/:id", async (req, res) => {
    try {
      const updateData = req.body;
      const user = await storage.updateUser(req.params.id, updateData);
      
      if (!user) {
        return res.status(404).json({ error: "Usuário não encontrado" });
      }

      const { senha, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ error: "Erro ao atualizar usuário" });
    }
  });

  app.delete("/api/users/:id", async (req, res) => {
    try {
      const success = await storage.deleteUser(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "Usuário não encontrado" });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Erro ao deletar usuário" });
    }
  });

  // ========== Notebooks ==========
  app.get("/api/notebooks", async (req, res) => {
    try {
      const notebooks = await storage.getAllNotebooks();
      res.json(notebooks);
    } catch (error) {
      res.status(500).json({ error: "Erro ao buscar notebooks" });
    }
  });

  app.get("/api/notebooks/:id", async (req, res) => {
    try {
      const notebook = await storage.getNotebook(req.params.id);
      if (!notebook) {
        return res.status(404).json({ error: "Notebook não encontrado" });
      }
      res.json(notebook);
    } catch (error) {
      res.status(500).json({ error: "Erro ao buscar notebook" });
    }
  });

  app.post("/api/notebooks", async (req, res) => {
    try {
      const notebookData = insertNotebookSchema.parse(req.body);
      const notebook = await storage.createNotebook(notebookData);
      
      // Registrar no histórico
      const userId = req.body._userId || "system";
      const userName = req.body._userName || "Sistema";
      
      await storage.createHistorico({
        action: "criacao",
        userId,
        userName,
        equipmentType: "notebook",
        equipmentId: notebook.id,
        details: "Cadastrou novo equipamento",
        equipment: `Notebook ${notebook.modelo} - ${notebook.responsavel}`,
      });

      res.status(201).json(notebook);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Erro ao criar notebook" });
    }
  });

  app.patch("/api/notebooks/:id", async (req, res) => {
    try {
      const updateData = req.body;
      const { _userId, _userName, ...notebookData } = updateData;
      
      const notebook = await storage.updateNotebook(req.params.id, notebookData);
      
      if (!notebook) {
        return res.status(404).json({ error: "Notebook não encontrado" });
      }

      // Registrar no histórico
      const userId = _userId || "system";
      const userName = _userName || "Sistema";
      
      await storage.createHistorico({
        action: "edicao",
        userId,
        userName,
        equipmentType: "notebook",
        equipmentId: notebook.id,
        details: "Atualizou informações do equipamento",
        equipment: `Notebook ${notebook.modelo} - ${notebook.responsavel}`,
      });

      res.json(notebook);
    } catch (error) {
      res.status(500).json({ error: "Erro ao atualizar notebook" });
    }
  });

  app.delete("/api/notebooks/:id", async (req, res) => {
    try {
      const notebook = await storage.getNotebook(req.params.id);
      if (!notebook) {
        return res.status(404).json({ error: "Notebook não encontrado" });
      }

      const userId = req.body._userId || "system";
      const userName = req.body._userName || "Sistema";

      const success = await storage.deleteNotebook(req.params.id);
      
      if (success) {
        // Registrar no histórico
        await storage.createHistorico({
          action: "exclusao",
          userId,
          userName,
          equipmentType: "notebook",
          equipmentId: notebook.id,
          details: "Removeu equipamento do inventário",
          equipment: `Notebook ${notebook.modelo} - ${notebook.responsavel}`,
        });
      }

      res.json({ success });
    } catch (error) {
      res.status(500).json({ error: "Erro ao deletar notebook" });
    }
  });

  // ========== Celulares ==========
  app.get("/api/celulares", async (req, res) => {
    try {
      const celulares = await storage.getAllCelulares();
      res.json(celulares);
    } catch (error) {
      res.status(500).json({ error: "Erro ao buscar celulares" });
    }
  });

  app.get("/api/celulares/:id", async (req, res) => {
    try {
      const celular = await storage.getCelular(req.params.id);
      if (!celular) {
        return res.status(404).json({ error: "Celular não encontrado" });
      }
      res.json(celular);
    } catch (error) {
      res.status(500).json({ error: "Erro ao buscar celular" });
    }
  });

  app.post("/api/celulares", async (req, res) => {
    try {
      const celularData = insertCelularSchema.parse(req.body);
      const celular = await storage.createCelular(celularData);
      
      const userId = req.body._userId || "system";
      const userName = req.body._userName || "Sistema";
      
      await storage.createHistorico({
        action: "criacao",
        userId,
        userName,
        equipmentType: "celular",
        equipmentId: celular.id,
        details: "Cadastrou novo equipamento",
        equipment: `Celular ${celular.modelo} - ${celular.responsavel}`,
      });

      res.status(201).json(celular);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Erro ao criar celular" });
    }
  });

  app.patch("/api/celulares/:id", async (req, res) => {
    try {
      const updateData = req.body;
      const { _userId, _userName, ...celularData } = updateData;
      
      const celular = await storage.updateCelular(req.params.id, celularData);
      
      if (!celular) {
        return res.status(404).json({ error: "Celular não encontrado" });
      }

      const userId = _userId || "system";
      const userName = _userName || "Sistema";
      
      await storage.createHistorico({
        action: "edicao",
        userId,
        userName,
        equipmentType: "celular",
        equipmentId: celular.id,
        details: "Atualizou informações do equipamento",
        equipment: `Celular ${celular.modelo} - ${celular.responsavel}`,
      });

      res.json(celular);
    } catch (error) {
      res.status(500).json({ error: "Erro ao atualizar celular" });
    }
  });

  app.delete("/api/celulares/:id", async (req, res) => {
    try {
      const celular = await storage.getCelular(req.params.id);
      if (!celular) {
        return res.status(404).json({ error: "Celular não encontrado" });
      }

      const userId = req.body._userId || "system";
      const userName = req.body._userName || "Sistema";

      const success = await storage.deleteCelular(req.params.id);
      
      if (success) {
        await storage.createHistorico({
          action: "exclusao",
          userId,
          userName,
          equipmentType: "celular",
          equipmentId: celular.id,
          details: "Removeu equipamento do inventário",
          equipment: `Celular ${celular.modelo} - ${celular.responsavel}`,
        });
      }

      res.json({ success });
    } catch (error) {
      res.status(500).json({ error: "Erro ao deletar celular" });
    }
  });

  // ========== Terminais ==========
  app.get("/api/terminais", async (req, res) => {
    try {
      const terminais = await storage.getAllTerminais();
      res.json(terminais);
    } catch (error) {
      res.status(500).json({ error: "Erro ao buscar terminais" });
    }
  });

  app.get("/api/terminais/:id", async (req, res) => {
    try {
      const terminal = await storage.getTerminal(req.params.id);
      if (!terminal) {
        return res.status(404).json({ error: "Terminal não encontrado" });
      }
      res.json(terminal);
    } catch (error) {
      res.status(500).json({ error: "Erro ao buscar terminal" });
    }
  });

  app.post("/api/terminais", async (req, res) => {
    try {
      const terminalData = insertTerminalSchema.parse(req.body);
      const terminal = await storage.createTerminal(terminalData);
      
      const userId = req.body._userId || "system";
      const userName = req.body._userName || "Sistema";
      
      await storage.createHistorico({
        action: "criacao",
        userId,
        userName,
        equipmentType: "terminal",
        equipmentId: terminal.id,
        details: "Cadastrou novo equipamento",
        equipment: `Terminal ${terminal.numeroRelogio} - ${terminal.segmento}`,
      });

      res.status(201).json(terminal);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Erro ao criar terminal" });
    }
  });

  app.patch("/api/terminais/:id", async (req, res) => {
    try {
      const updateData = req.body;
      const { _userId, _userName, ...terminalData } = updateData;
      
      const terminal = await storage.updateTerminal(req.params.id, terminalData);
      
      if (!terminal) {
        return res.status(404).json({ error: "Terminal não encontrado" });
      }

      const userId = _userId || "system";
      const userName = _userName || "Sistema";
      
      await storage.createHistorico({
        action: "edicao",
        userId,
        userName,
        equipmentType: "terminal",
        equipmentId: terminal.id,
        details: "Atualizou informações do equipamento",
        equipment: `Terminal ${terminal.numeroRelogio} - ${terminal.segmento}`,
      });

      res.json(terminal);
    } catch (error) {
      res.status(500).json({ error: "Erro ao atualizar terminal" });
    }
  });

  app.delete("/api/terminais/:id", async (req, res) => {
    try {
      const terminal = await storage.getTerminal(req.params.id);
      if (!terminal) {
        return res.status(404).json({ error: "Terminal não encontrado" });
      }

      const userId = req.body._userId || "system";
      const userName = req.body._userName || "Sistema";

      const success = await storage.deleteTerminal(req.params.id);
      
      if (success) {
        await storage.createHistorico({
          action: "exclusao",
          userId,
          userName,
          equipmentType: "terminal",
          equipmentId: terminal.id,
          details: "Removeu equipamento do inventário",
          equipment: `Terminal ${terminal.numeroRelogio} - ${terminal.segmento}`,
        });
      }

      res.json({ success });
    } catch (error) {
      res.status(500).json({ error: "Erro ao deletar terminal" });
    }
  });

  // ========== Histórico ==========
  app.get("/api/historico", async (req, res) => {
    try {
      const historico = await storage.getAllHistorico();
      res.json(historico);
    } catch (error) {
      res.status(500).json({ error: "Erro ao buscar histórico" });
    }
  });

  app.get("/api/historico/equipment/:equipmentId", async (req, res) => {
    try {
      const historico = await storage.getHistoricoByEquipment(req.params.equipmentId);
      res.json(historico);
    } catch (error) {
      res.status(500).json({ error: "Erro ao buscar histórico do equipamento" });
    }
  });

  // ========== Dashboard Stats ==========
  app.get("/api/dashboard/stats", async (req, res) => {
    try {
      const notebooks = await storage.getAllNotebooks();
      const celulares = await storage.getAllCelulares();
      const terminais = await storage.getAllTerminais();
      
      const allEquipment = [
        ...notebooks.map(n => ({ tipo: 'notebook', status: n.status, uf: n.uf, segmento: n.segmento, fornecedor: n.fornecedor })),
        ...celulares.map(c => ({ tipo: 'celular', status: c.status, uf: c.uf, segmento: c.segmento, fornecedor: null })),
        ...terminais.map(t => ({ tipo: 'terminal', status: t.status, uf: t.uf, segmento: t.segmento, fornecedor: null })),
      ];

      const totalEquipment = allEquipment.length;
      
      const byStatus: Record<string, number> = {};
      const byUF: Record<string, number> = {};
      const bySegmento: Record<string, number> = {};
      const byFornecedor: Record<string, number> = {};

      allEquipment.forEach(eq => {
        byStatus[eq.status] = (byStatus[eq.status] || 0) + 1;
        byUF[eq.uf] = (byUF[eq.uf] || 0) + 1;
        bySegmento[eq.segmento] = (bySegmento[eq.segmento] || 0) + 1;
        if (eq.fornecedor) {
          byFornecedor[eq.fornecedor] = (byFornecedor[eq.fornecedor] || 0) + 1;
        }
      });

      res.json({
        totalEquipment,
        byStatus,
        byUF,
        bySegmento,
        byFornecedor,
      });
    } catch (error) {
      res.status(500).json({ error: "Erro ao buscar estatísticas" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
