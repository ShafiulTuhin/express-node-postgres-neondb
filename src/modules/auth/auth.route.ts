import { Router } from "express";

import { authController } from "./auth.controller";

const router = Router();

router.use("/login", authController.loginUser);

export const authRoute = router;
