import { User } from "../db/models/user";
import { Request, Response } from "express";
import { ObjectId } from "mongoose";
import { UserEntity } from "../types/user/user.entity";
import jwt from "jsonwebtoken";
import { RefreshToken } from "../db/models/refreshToken";

export class UserRecord implements UserEntity {
	public _id: ObjectId;
	public username: string;
	public password: string;

	static async registerUser(req: Request, res: Response) {
		const { username, password } = req.body;

		try {
			const user = new User({ username, password });
			await user.save();
			res.status(201).json(user);
		} catch (e) {
			res.status(422).json({ message: e.message });
		}
	}

	static async loginUser(req: Request, res: Response) {
		const { username, password } = req.body;

		try {
			const user = await User.findOne({ username, password });
			if (!user) {
				res.status(401).json({ message: "Invalid credentials" });
			}

			const payload = { id: user._id };
			const token = jwt.sign(payload, process.env.JWT_ACCESS, { expiresIn: "1h" });
			const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH);

			const refreshTokenDocument = new RefreshToken({ userId: user._id, token: refreshToken });
			await refreshTokenDocument.save();

			res
				.status(200)
				.json({ token, refreshToken, user: { id: user._id, username: user.username } });
		} catch (e) {
			res.status(500).json({ message: "Internal Server Error" });
		}
	}

	static async refreshToken(req: Request, res: Response) {
		const { token } = req.body;

		try {
			const refreshTokenDocument = await RefreshToken.findOne({ token });

			if (!refreshTokenDocument) {
				res.status(403).json({ message: "Invalid token" });
				return;
			}

			jwt.verify(token, process.env.JWT_REFRESH, (err: Error, user: UserEntity) => {
				if (err) {
					console.error(err);
					res.status(403).json({ message: "Invalid token" });
				}

				const newAccessToken = jwt.sign({ _id: user._id }, process.env.JWT_ACCESS, {
					expiresIn: "7d",
				});
				res.json({ token: newAccessToken });
			});
		} catch {
			res.status(500).json({ message: "Internal Server Error" });
		}
	}

	static async logoutUser(req: Request, res: Response) {
		const { refreshToken } = req.body;

		try {
			await RefreshToken.findOneAndDelete({ token: refreshToken });
			res.sendStatus(204);
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
