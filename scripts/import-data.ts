import { db } from "../server/db.js";
import { users, notebooks, celulares, terminais, historico } from "../shared/schema.js";
import { readFileSync } from "fs";

async function importData(filename: string) {
  if (!filename) {
    console.error("Erro: Nenhum arquivo especificado");
    console.log("Uso: npm run db:import-json <arquivo.json>");
    process.exit(1);
  }

  console.log(`Importando dados de: ${filename}`);
  console.log("ATENÇÃO: Isso irá adicionar dados ao banco de dados atual!\n");

  try {
    // Ler arquivo
    const fileContent = readFileSync(filename, "utf-8");
    const importData = JSON.parse(fileContent);

    if (!importData.data) {
      throw new Error("Formato de arquivo inválido");
    }

    console.log("Dados a importar:");
    console.log(`  Usuários: ${importData.data.users?.length || 0}`);
    console.log(`  Notebooks: ${importData.data.notebooks?.length || 0}`);
    console.log(`  Celulares: ${importData.data.celulares?.length || 0}`);
    console.log(`  Terminais: ${importData.data.terminais?.length || 0}`);
    console.log(`  Histórico: ${importData.data.historico?.length || 0}`);
    console.log("");

    let imported = {
      users: 0,
      notebooks: 0,
      celulares: 0,
      terminais: 0,
      historico: 0,
    };

    // Importar usuários
    if (importData.data.users && importData.data.users.length > 0) {
      for (const user of importData.data.users) {
        try {
          await db.insert(users).values(user).onConflictDoNothing();
          imported.users++;
        } catch (err) {
          console.warn(`  Aviso: Usuário ${user.email} já existe, pulando...`);
        }
      }
    }

    // Importar notebooks
    if (importData.data.notebooks && importData.data.notebooks.length > 0) {
      for (const notebook of importData.data.notebooks) {
        try {
          await db.insert(notebooks).values(notebook).onConflictDoNothing();
          imported.notebooks++;
        } catch (err) {
          console.warn(`  Aviso: Notebook ${notebook.id} já existe, pulando...`);
        }
      }
    }

    // Importar celulares
    if (importData.data.celulares && importData.data.celulares.length > 0) {
      for (const celular of importData.data.celulares) {
        try {
          await db.insert(celulares).values(celular).onConflictDoNothing();
          imported.celulares++;
        } catch (err) {
          console.warn(`  Aviso: Celular ${celular.id} já existe, pulando...`);
        }
      }
    }

    // Importar terminais
    if (importData.data.terminais && importData.data.terminais.length > 0) {
      for (const terminal of importData.data.terminais) {
        try {
          await db.insert(terminais).values(terminal).onConflictDoNothing();
          imported.terminais++;
        } catch (err) {
          console.warn(`  Aviso: Terminal ${terminal.id} já existe, pulando...`);
        }
      }
    }

    // Importar histórico
    if (importData.data.historico && importData.data.historico.length > 0) {
      for (const hist of importData.data.historico) {
        try {
          await db.insert(historico).values(hist).onConflictDoNothing();
          imported.historico++;
        } catch (err) {
          console.warn(`  Aviso: Histórico ${hist.id} já existe, pulando...`);
        }
      }
    }

    console.log("\n✓ Importação concluída!");
    console.log("\nDados importados:");
    console.log(`  Usuários: ${imported.users}`);
    console.log(`  Notebooks: ${imported.notebooks}`);
    console.log(`  Celulares: ${imported.celulares}`);
    console.log(`  Terminais: ${imported.terminais}`);
    console.log(`  Histórico: ${imported.historico}`);

    process.exit(0);
  } catch (error) {
    console.error("Erro ao importar dados:", error);
    process.exit(1);
  }
}

// Pegar nome do arquivo dos argumentos
const filename = process.argv[2];
importData(filename);
