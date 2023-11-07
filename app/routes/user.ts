import express from "express";
import { UserRecord } from "../records/user.record";

export const userRouter = express.Router();

userRouter
	.post("/register", UserRecord.registerUser)
	.post("/login", UserRecord.loginUser)
	.post("/refresh", UserRecord.refreshToken)
	.patch("/profile/:id", UserRecord.updateUserPassword)
	.delete("/logout", UserRecord.logoutUser)
	.delete("/profile/:id", UserRecord.deleteUserProfile);
