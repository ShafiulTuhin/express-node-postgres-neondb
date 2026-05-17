import type { Request, Response } from "express";
import { userService } from "../user/user.service";
import { userProfileService } from "./profile.service";

const createProfile = async (req: Request, res: Response) => {
  try {
    const result = await userProfileService.createProfileService(req.body);
    res.status(201).json({
      message: "Profile created successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
      error: error,
    });
  }
};

export const profileController = { createProfile };
