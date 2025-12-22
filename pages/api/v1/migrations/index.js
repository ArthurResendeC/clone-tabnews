import { resolve } from "node:path";
import migrationRunner from "node-pg-migrate";
import database from "infra/database";

export default async function migrations(request, response) {
  const dbClient = await database.getNewClient();
  const defaultMigrationsOptions = {
    client: dbClient,
    databaseUrl: process.env.DATABASE_URL,
    dir: resolve("infra", "migrations"),
    dryRun: true,
    direction: "up",
    verbose: true,
    migrationsTable: "pgmigrations",
  };
  if (request.method === "GET") {
    console.log("Entrou no GET");
    const pendingMigrations = await migrationRunner({
      ...defaultMigrationsOptions,
    });
    await dbClient.end();
    return response.status(200).json(pendingMigrations);
  }

  if (request.method === "POST") {
    console.log("Entrou no POST");
    const appliedMigrations = await migrationRunner({
      ...defaultMigrationsOptions,
      dryRun: false,
    });
    await dbClient.end();
    if (appliedMigrations.length > 0) {
      return response.status(201).json(appliedMigrations);
    }
    return response.status(200).json(appliedMigrations);
  }
  console.log("Passou direto");
  await dbClient.end();
  return response.status(405).json({ message: "Method not allowed" });
}
