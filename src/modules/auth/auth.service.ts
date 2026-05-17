import { Pool } from "pg";
import type { IAuth } from "./auth.type";
import { pool } from "../../db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import config from "../../config";

const loginUserService = async (payload: IAuth) => {
  const { email, password } = payload;
  //   1.Check if the user exists:
  const userData = await pool.query(
    `    SELECT * from users where email = $1`,
    [email],
  );
  if (userData.rows.length === 0) {
    throw new Error("Invalid Credentials");
  }
  const user = userData.rows[0];

  //   2.Compare password:
  const matchPassWord = await bcrypt.compare(password, user.password);
  if (!matchPassWord) {
    throw new Error("Password does not match");
  }
  //   3.Generate token
  const jwtPayload = {
    id: user.id,
    name: user.name,
    email: user.email,
    is_active: user.is_active,
  };
  const accessToken = jwt.sign(jwtPayload, config.secret as string, {
    expiresIn: "1d",
  });
  return { accessToken };
};

export const authService = {
  loginUserService,
};
