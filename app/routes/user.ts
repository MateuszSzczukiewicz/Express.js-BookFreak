import express from "express";
import { UserRecord } from "../records/user.record";

export const userRouter = express.Router();

userRouter
	.get("/profile/:id", UserRecord.getUserProfile)
	.post("/register", UserRecord.registerUser)
	.post("/login", UserRecord.loginUser)
	.patch("/profile/:id", UserRecord.updateUserUsername)
	.patch("/profile/:id", UserRecord.updateUserPassword)
	.delete("/profile/:id", UserRecord.deleteUserProfile);
