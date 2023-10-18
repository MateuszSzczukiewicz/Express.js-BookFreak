import express from "express";
import { BookActions } from "../actions/bookActions";

export const bookRouter = express.Router();

const bookActionsInstance = new BookActions();

bookRouter
  .get("/books", BookActions.getAllBooks)
  .get("/books/:id", BookActions.getBook)
  .post("/books", bookActionsInstance.saveBook)
  .put("/books/:id", bookActionsInstance.updateBook)
  .delete("/books/:id", bookActionsInstance.deleteBook);
