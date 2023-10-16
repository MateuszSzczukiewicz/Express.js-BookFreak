import { Router, Response, Request } from "express";

export const bookRouter = Router();

bookRouter.get("/", (req: Request, res: Response) => {
  res.send("Działaaa!");
});
