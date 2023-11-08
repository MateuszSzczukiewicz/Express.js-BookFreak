import { Schema, model } from "mongoose";

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
});

export const Book = model("Book", BookSchema);
