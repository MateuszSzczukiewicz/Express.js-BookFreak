import { User } from "../db/models/user";
import { Request, Response } from "express";
import { ObjectId } from "mongoose";
import { UserEntity } from "../types/user/user.entity";

export class UserRecord implements UserEntity {
	public _id: ObjectId;
	public username: string;
	public password: string;

	static async getUserProfile(req: Request, res: Response) {
		const id: string = req.params.id;

		try {
			const user = await User.findOne({ _id: id });
			if (!user) {
				res.status(404).json({ message: "User not found" });
			} else {
				res.status(200).json(user);
			}
		} catch (err: any) {
			res.status(500).json({ message: "Internal Server Error" });
		}
	}

	static async registerUser(req: Request, res: Response) {
		const { username, password } = req.body;

		try {
			const user = new User({ username, password });
			await user.save();
			res.status(201).json(user);
		} catch (err: any) {
			res.status(422).json({ message: err.message });
		}
	}

	static async loginUser(req: Request, res: Response) {
		const { username, password } = req.body;

		try {
			const user = await User.findOne({ username, password });
			if (!user) {
				res.status(401).json({ message: "Invalid credentials" });
			} else {
				res.status(200).json(user);
			}
		} catch (err: any) {
			res.status(500).json({ message: "Internal Server Error" });
		}
	}

	static async updateUserUsername(req: Request, res: Response) {
		const id: string = req.params.id;
		const { username } = req.body;

		try {
			const user = await User.findOne({ _id: id });
			if (!user) {
				res.status(404).json({ message: "User not found" });
			} else {
				user.username = username;
				await user.save();
				res.status(201).json(user);
			}
		} catch (err: any) {
			res.status(500).json({ message: "Internal Server Error" });
		}
	}

	static async updateUserPassword(req: Request, res: Response) {
		const id: string = req.params.id;
		const { password } = req.body;

		try {
			const user = await User.findOne({ _id: id });
			if (!user) {
				res.status(404).json({ message: "User not found" });
			} else {
				user.password = password;
				await user.save();
				res.status(201).json(user);
			}
		} catch (err: any) {
			res.status(500).json({ message: "Internal Server Error" });
		}
	}

	static async deleteUserProfile(req: Request, res: Response) {
		const id: string = req.params.id;

		try {
			const result = await User.deleteOne({ _id: id });
			if (result.deletedCount === 0) {
				res.status(404).json({ message: "User not found" });
			} else {
				res.sendStatus(204);
			}
		} catch (err: any) {
			res.status(500).json({ message: "Internal Server Error" });
		}
	}
}
