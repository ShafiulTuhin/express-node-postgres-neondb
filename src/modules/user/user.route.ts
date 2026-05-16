import express, {
  type Application,
  type Request,
  type Response,
  Router,
} from "express";
import { pool } from "../../db";
import { userController } from "./user.Controller";

const router = Router();

// Create user
router.post("/", userController.createUser);
// Get all users:
router.get("/", userController.getAllUser);

// Get single user
router.get("/:id", async (req: Request, res: Response) => {
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
router.put("//:id", async (req: Request, res: Response) => {
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
router.delete("//:id", async (req: Request, res: Response) => {
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

export const userRoute = router;
