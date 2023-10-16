import { Router } from "express";

export const bookRouter = Router();

bookRouter.get("/books", async (req, res) => {
  res.send("Działa!");
});
