import { pool } from "../../db";
import type { IUser } from "./user.interface";

const createUserService = async (payload: IUser) => {
  const { name, email, password, age } = payload;
  const result = await pool.query(
    ` 
        insert into users(name,email,password,age)
        values($1, $2, $3, $4) RETURNING *
        `,
    [name, email, password, age],
  );

  return result;
};

export const userService = { createUserService };
