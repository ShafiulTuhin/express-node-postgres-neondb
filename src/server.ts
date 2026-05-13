import express, {
  type Application,
  type Request,
  type Response,
} from "express";
const app: Application = express();
const port = config.port;
import { Pool } from "pg";
import { config } from "./config";

// Middleware
app.use(express.json());
app.use(express.text());

// Connection Database
const pool = new Pool({
  connectionString: config.connection_string,
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

// Create user
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
      error: error,
    });
  }
});

// Get all users:
app.get("/api/users", async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`
        select * from users
        `);
    res.status(200).json({
      success: true,
      message: "Users retrieved  successfully",
      data: result.rows,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
      error: error,
    });
  }
});

// Get single user
app.get("/api/users/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  console.log(id);

  try {
    const result = await pool.query(
      `
          select * from users where id=$1
          `,
      [id],
    );
    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: "No user found!",
      });
    }
    res.status(200).json({
      success: true,
      message: "User retrieved  successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
      error: error,
    });
  }
});

// Update user
app.put("/api/users/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, password, age, is_active } = req.body;
  try {
    const result = await pool.query(
      `
        update users 
        set 
        name = COALESCE($1,name),
        password=COALESCE($2,password),
        age=COALESCE($3,age),
        is_active=COALESCE($4,is_active)
            
        where id=$5 returning *
        `,
      [name, password, age, is_active, id],
    );
    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: "No user found!",
      });
    }
    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: result.rows,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
      error: error,
    });
  }
});

// Delete user:
app.delete("/api/users/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const result = await pool.query(`delete from users where id=$1`, [id]);
    if (result.rowCount === 0) {
      res.status(404).json({
        success: false,
        message: "No user found!",
      });
    }
    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
      error: error,
    });
  }
});
app.listen(port, () => {
  console.log(`Express app listening on port ${port}`);
});
