import { Schema, model } from "mongoose";

interface Book {
	title: string;
	author: string;
}

const BookSchema = new Schema<Book>({
	title: {
		type: "string",
		required: true,
	},
	author: {
		type: "string",
		required: true,
	},
});

export const Book = model<Book>("Book", BookSchema);
