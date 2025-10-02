import { db } from "./db";
import { users } from "@shared/schema";
import { randomUUID } from "crypto";

async function seed() {
  console.log("Seeding database...");

  // Check if admin user already exists
  const existingAdmin = await db.select().from(users).limit(1);
  
  if (existingAdmin.length === 0) {
    // Create default admin user
    const adminId = randomUUID();
    await db.insert(users).values({
      id: adminId,
      nome: "Admin Opus",
      email: "admin@opus.com",
      senha: "opus@@2025$%",
      perfil: "Admin",
      ativo: true,
      createdAt: new Date(),
    });
    
    console.log("✓ Admin user created successfully");
    console.log("  Email: admin@opus.com");
    console.log("  Password: opus@@2025$%");
  } else {
    console.log("✓ Database already seeded");
  }

  process.exit(0);
}

seed().catch((error) => {
  console.error("Error seeding database:", error);
  process.exit(1);
});
