import express from "express";
import { BookRecord } from "../records/book.record";

export const bookRouter = express.Router();

bookRouter
	.post("/profile/:userId/books", BookRecord.saveBook)
	.get("/profile/:userId/books", BookRecord.getAllBooks)
	.get("/profile/:userId/books/:id", BookRecord.getBook)
	.put("/profile/:userId/books/:id", BookRecord.updateBook)
	.patch("/profile/:userId/books/:id", BookRecord.changeShelf)
	.delete("/profile/:userId/books/:id", BookRecord.deleteBook);
