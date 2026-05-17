import { pool } from "../../db";

const createProfileService = async (payload: any) => {
  const { user_id, bio, address, phone, gender } = payload;

  const user = await pool.query(
    `
    SELECT * from users where id = $1`,
    [user_id],
  );
  if (user.rows.length === 0) {
    throw new Error("User not exists!");
  }
  const result = await pool.query(
    ` 
        insert into profile(user_id,bio, address, phone, gender)
        values($1, $2, $3, $4,$5) RETURNING *
        `,
    [user_id, bio, address, phone, gender],
  );

  return result;
};

export const userProfileService = { createProfileService };
