import { drizzle, NodePgDatabase } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

const databaseUrl = process.env.DATABASE_URL;

const globalForDb = globalThis as typeof globalThis & {
  __arenaNextJsPostgresqlPool?: Pool;
  __arenaNextJsPostgresqlDb?: NodePgDatabase;
};

export const pool =
  globalForDb.__arenaNextJsPostgresqlPool ??
  (databaseUrl ? new Pool({ connectionString: databaseUrl }) : (null as unknown as Pool));

if (process.env.NODE_ENV !== "production" && databaseUrl) {
  globalForDb.__arenaNextJsPostgresqlPool = pool;
}

export const db: NodePgDatabase =
  globalForDb.__arenaNextJsPostgresqlDb ??
  (databaseUrl ? drizzle(pool) : (new Proxy({} as NodePgDatabase, {
    get(_target, prop) {
      if (!process.env.DATABASE_URL) {
        throw new Error("DATABASE_URL environment variable is required to execute database operations.");
      }
      return Reflect.get(drizzle(new Pool({ connectionString: process.env.DATABASE_URL })), prop);
    },
  })));

if (process.env.NODE_ENV !== "production" && databaseUrl) {
  globalForDb.__arenaNextJsPostgresqlDb = db;
}
