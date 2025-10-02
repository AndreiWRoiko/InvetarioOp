import { db } from "../server/db.js";
import { users, notebooks, celulares, terminais, historico } from "../shared/schema.js";
import { writeFileSync, mkdirSync } from "fs";
import { join } from "path";

async function exportData() {
  console.log("Exportando dados do banco de dados...");

  try {
    // Criar diretório de backups se não existir
    mkdirSync("backups", { recursive: true });

    // Buscar todos os dados
    const allUsers = await db.select().from(users);
    const allNotebooks = await db.select().from(notebooks);
    const allCelulares = await db.select().from(celulares);
    const allTerminais = await db.select().from(terminais);
    const allHistorico = await db.select().from(historico);

    // Criar objeto com todos os dados
    const exportData = {
      exportDate: new Date().toISOString(),
      version: "1.0",
      data: {
        users: allUsers,
        notebooks: allNotebooks,
        celulares: allCelulares,
        terminais: allTerminais,
        historico: allHistorico,
      },
      stats: {
        users: allUsers.length,
        notebooks: allNotebooks.length,
        celulares: allCelulares.length,
        terminais: allTerminais.length,
        historico: allHistorico.length,
      },
    };

    // Criar nome do arquivo com timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-").split("T")[0] + "_" + 
                      new Date().toTimeString().split(" ")[0].replace(/:/g, "");
    const filename = join("backups", `database_export_${timestamp}.json`);

    // Salvar arquivo
    writeFileSync(filename, JSON.stringify(exportData, null, 2));

    console.log("\n✓ Dados exportados com sucesso!");
    console.log(`  Arquivo: ${filename}`);
    console.log("\nEstatísticas:");
    console.log(`  Usuários: ${exportData.stats.users}`);
    console.log(`  Notebooks: ${exportData.stats.notebooks}`);
    console.log(`  Celulares: ${exportData.stats.celulares}`);
    console.log(`  Terminais: ${exportData.stats.terminais}`);
    console.log(`  Histórico: ${exportData.stats.historico}`);
    console.log("\nPara importar em outro servidor:");
    console.log(`  npm run db:import-json ${filename}`);
    
    process.exit(0);
  } catch (error) {
    console.error("Erro ao exportar dados:", error);
    process.exit(1);
  }
}

exportData();
