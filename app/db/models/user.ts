import { Schema, model } from "mongoose";
import { UserType } from "../../types/user/user";

const UserSchema = new Schema<UserType>({
	username: {
		type: "string",
		required: true,
	},
	password: {
		type: "string",
		required: true,
	},
});

export const User = model<UserType>("User", UserSchema);
