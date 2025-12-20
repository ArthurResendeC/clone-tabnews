import { Client } from "pg";

async function query(queryObject) {
  let client;

  if (process.env.DATABASE_URL) {
    client = new Client({
      connectionString: process.env.DATABASE_URL,
      ssl: getSSLValues(),
    });
  } else {
    client = await getNewClient();
  }

  try {
    await client.connect();
    const result = await client.query(queryObject);
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    await client.end();
  }
}

async function getNewClient() {
  const client = new Client({
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT,
    user: process.env.POSTGRES_USER,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
    ssl: getSSLValues(),
  });

  await client.connect();
  return client;
}

export default {
  query,
  getNewClient,
};

function getSSLValues() {
  if (process.env.NODE_ENV === "production") {
    return {
      rejectUnauthorized: false,
    };
  }
  return false;
}
