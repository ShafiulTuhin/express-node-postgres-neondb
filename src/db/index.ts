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
        password text NOT NULL,
        is_active BOOLEAN DEFAULT TRUE,
        age INT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
        )       
        `);
    await pool.query(`
          
          CREATE TABLE IF NOT EXISTS profile(
          id SERIAL PRIMARY KEY,
          user_id INT UNIQUE REFERENCES users(id) ON DELETE CASCADE,
          bio TEXT,
          address TEXT,
          phone varchar(20),
          gender varchar(10),
             created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
          )`);
    console.log("Database connected successfully!");
  } catch (error) {
    console.log(error);
  }
};
