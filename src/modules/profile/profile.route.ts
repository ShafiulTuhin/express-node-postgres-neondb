import { Router } from "express";
import { profileController } from "./profile.conroller";

const router = Router();

router.post("/", profileController.createProfile);

export const userProfile = router;
