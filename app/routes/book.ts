import express from "express";
import { BookActions } from "../actions/bookActions";

export const bookRouter = express.Router();

bookRouter
	.get("/books", BookActions.getAllBooks)
	.get("/books/:id", BookActions.getBook)
	.post("/books", BookActions.saveBook)
	.put("/books/:id", BookActions.updateBook)
	.delete("/books/:id", BookActions.deleteBook);
