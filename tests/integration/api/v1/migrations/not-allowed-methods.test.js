import database from "infra/database";
import orchestrator from "tests/orchestrator.js";

async function cleanDatabase() {
  database.query("DROP SCHEMA public CASCADE; CREATE SCHEMA public;");
}

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await cleanDatabase();
});

test("Method not allowed to api/v1/migrations should return 405", async () => {
  const methodsNotAlloweds = ["DELETE", "PUT", "PATCH"];

  for (const method of methodsNotAlloweds) {
    const response = await fetch("http://localhost:3000/api/v1/migrations", {
      method,
    });

    expect(response.status).toBe(405);
  }
});
