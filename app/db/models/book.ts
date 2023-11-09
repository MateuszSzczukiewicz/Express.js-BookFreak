import { Schema, model } from "mongoose";
import { BookShelvesEnum } from "../../types/book/book.enum";

const BookSchema = new Schema({
	title: {
		type: "string",
		required: true,
	},
	author: {
		type: "string",
		required: true,
	},
	bookImage: {
		type: "string",
	},
	user: {
		type: Schema.Types.ObjectId,
		ref: "User",
	},
	bookShelf: {
		type: String,
		enum: Object.values(BookShelvesEnum),
		required: true,
	},
});

export const Book = model("Book", BookSchema);
