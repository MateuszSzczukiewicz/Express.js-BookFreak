import { Schema, model, Types } from "mongoose";

const RefreshTokenSchema = new Schema({
	userId: {
		type: Types.ObjectId,
		ref: "User",
		required: true,
	},
	token: {
		type: String,
		required: true,
	},
	createdAt: {
		type: Date,
		default: Date.now,
		expires: "30d",
	},
});

export const RefreshToken = model("RefreshToken", RefreshTokenSchema);
