import express, {
  type Application,
  type Request,
  type Response,
} from "express";
const app: Application = express();
const port = 5000;
import { Pool } from "pg";

// Middleware
app.use(express.json());
app.use(express.text());

// Connection Database
const pool = new Pool({
  connectionString:
    "postgresql://neondb_owner:npg_5nmGU0uEKiky@ep-tiny-fire-apn6miq4-pooler.c-7.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require",
});
// Create Database:
const initDB = async () => {
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

initDB();

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "First express server",
  });
});

app.post("/api/users", async (req: Request, res: Response) => {
  const { name, email, password, age } = req.body;

  try {
    const result = await pool.query(
      ` 
    insert into users(name,email,password,age)
    values($1, $2, $3, $4) RETURNING *
    `,
      [name, email, password, age],
    );
    res.status(201).json({
      message: "User created successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    res.status(500).json({
      message: error.message,
      data: error,
    });
  }
});
app.listen(port, () => {
  console.log(`Express app listening on port ${port}`);
});
