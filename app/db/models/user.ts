import { Schema, model } from "mongoose";

const UserSchema = new Schema({
	username: {
		type: "string",
		required: true,
		unique: true,
	},
	password: {
		type: "string",
		required: true,
	},
	books: [
		{
			type: Schema.Types.ObjectId,
			ref: "Book",
		},
	],
});

export const User = model("User", UserSchema);
