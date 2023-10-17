import { Router } from "express";
import { BookRecord } from "../records/book.record";

export const bookRouter = Router();

bookRouter.get("/", BookRecord.getAllBooks);
bookRouter.get("/:id", BookRecord.getBook);
bookRouter.post("/", BookRecord.saveBook);
bookRouter.post("/:id", BookRecord.updateBook);
bookRouter.post("/:id", BookRecord.deleteBook);
