import express, {
  type Application,
  type Request,
  type Response,
} from "express";

import { userRoute } from "./modules/user/user.route";

const app: Application = express();

// Middleware
app.use(express.json());
app.use(express.text());

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "First express server",
  });
});

app.use("/api/users", userRoute);

export default app;
