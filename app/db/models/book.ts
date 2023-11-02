import { Schema, model } from "mongoose";
import { BookType } from "../../types/book/book";

const BookSchema = new Schema<BookType>({
	title: {
		type: "string",
		required: true,
	},
	author: {
		type: "string",
		required: true,
	},
});

export const Book = model<BookType>("Book", BookSchema);
