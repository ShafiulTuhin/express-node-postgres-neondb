import { Pool } from "pg";
import config from "../config";

// Connection Database
export const pool = new Pool({
  connectionString: config.connection_string,
});

// Create Database:
export const initDB = async () => {
  try {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS users(
        id SERIAL PRIMARY KEY,
        name varchar(20),
        email varchar(20) UNIQUE NOT NULL,
        password varchar(20) NOT NULL,
        is_active BOOLEAN DEFAULT TRUE,
        age INT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
        )       
        `);
    console.log("Database connected successfully!");
  } catch (error) {
    console.log(error);
  }
};
