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
const getAllUser = async () => {
  return await pool.query(`
        select * from users
        `);
};
const getSingleUserService = async (id: string) => {
  const result = await pool.query(
    `
          select * from users where id=$1
          `,
    [id],
  );
  return result;
};

const updateUserService = async (payload: IUser, id: string) => {
  const { name, password, age, is_active } = payload;
  const result = await pool.query(
    `  update users 
        set 
        name = COALESCE($1,name),
        password=COALESCE($2,password),
        age=COALESCE($3,age),
        is_active=COALESCE($4,is_active)
            
        where id=$5 returning *
        `,
    [name, password, age, is_active, id],
  );
  return result;
};

const deleteUser = (id: string) => {
  const result = pool.query(`delete from users where id=$1`, [id]);
  return result;
};

export const userService = {
  createUserService,
  getAllUser,
  getSingleUserService,
  updateUserService,
  deleteUser,
};
