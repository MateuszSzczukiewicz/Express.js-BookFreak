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
});

export const User = model("User", UserSchema);
