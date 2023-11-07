import express from "express";
import { BookRecord } from "../records/book.record";

export const bookRouter = express.Router();

bookRouter
	.get("/books", BookRecord.getAllBooks)
	.get("/books/:id", BookRecord.getBook)
	.post("/books", BookRecord.saveBook)
	.put("/books/:id", BookRecord.updateBook)
	.delete("/books/:id", BookRecord.deleteBook);
