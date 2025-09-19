import { Pool, PoolConfig } from "pg";
import dotenv from "dotenv";

dotenv.config();

const poolConfig: PoolConfig = {
  connectionString: process.env.DATABASE_URL,
  ssl:
    process.env.NODE_ENV === "production"
      ? { rejectUnauthorized: false }
      : false,
};

export const pool = new Pool(poolConfig);

// Test the database connection
export const databaseTestConnection = async (): Promise<void> => {
  try {
    const client = await pool.connect();
    console.log("Database connected successfully");
    client.release();
  } catch (error) {
    console.error("Database connection error:", error);
    process.exit(1);
  }
};
