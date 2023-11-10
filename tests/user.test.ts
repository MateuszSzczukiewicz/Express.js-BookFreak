import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UserRecord } from "../app/records/user.record";
import { Request, Response } from "express";

jest.mock("../db/models/user");
jest.mock("../db/models/refreshToken");

describe("UserRecord", () => {
	describe("registerUser", () => {
		it("should register a new user", async () => {
			const req: Request = {
				body: { username: "testuser", password: "testpassword" },
				params: {},
				query: {},
				headers: {},
				get: () => "",
			} as any;
			const res: Response = { status: jest.fn(), json: jest.fn() } as any;

			bcrypt.hash = jest.fn().mockResolvedValue("hashedPassword");

			const saveMock = jest.fn().mockResolvedValueOnce({ _id: "mockedUserId" });
			const userMock = jest.fn(() => ({ save: saveMock }));
			require("../db/models/user").User = userMock;

			await UserRecord.registerUser(req, res);

			expect(bcrypt.hash).toHaveBeenCalledWith("testpassword", 10);
			expect(userMock).toHaveBeenCalledWith({ username: "testuser", password: "hashedPassword" });
			expect(saveMock).toHaveBeenCalled();
			expect(res.status).toHaveBeenCalledWith(201);
			expect(res.json).toHaveBeenCalledWith({ _id: "mockedUserId" });
		});

		it("should handle registration error", async () => {
			const req: Request = {
				body: { username: "testuser", password: "testpassword" },
				params: {},
				query: {},
				headers: {},
				get: () => "",
			} as any;
			const res: Response = { status: jest.fn(), json: jest.fn() } as any;

			bcrypt.hash = jest.fn().mockRejectedValue(new Error("Mocked Error"));

			await UserRecord.registerUser(req, res);

			expect(res.status).toHaveBeenCalledWith(422);
			expect(res.json).toHaveBeenCalledWith({ message: "Mocked Error" });
		});
	});

	describe("loginUser", () => {
		it("should login a user and return tokens", async () => {
			const req: Request = {
				body: { username: "testuser", password: "testpassword" },
				params: {},
				query: {},
				headers: {},
				get: () => "",
			} as any;
			const res = { status: jest.fn(), json: jest.fn() };

			const userMock = {
				_id: "mockedUserId",
				username: "testuser",
				password: await bcrypt.hash("testpassword", 10),
			};
			require("../db/models/user").User = {
				findOne: jest.fn().mockResolvedValueOnce(userMock),
			};

			jwt.sign = jest.fn().mockReturnValue("mockedAccessToken");
			jwt.verify = jest
				.fn()
				.mockImplementation((token, secret, callback) => callback(null, { _id: "mockedUserId" }));

			const refreshTokenMock = {
				token: "mockedRefreshToken",
				save: jest.fn().mockResolvedValueOnce({ _id: "mockedUserId" }),
			};
			require("../db/models/refreshToken").RefreshToken = jest.fn(() => refreshTokenMock);

			await UserRecord.loginUser(req as any, res as any);

			expect(res.status).toHaveBeenCalledWith(200);
			expect(res.json).toHaveBeenCalledWith({
				token: "mockedAccessToken",
				refreshToken: "mockedRefreshToken",
				user: { id: "mockedUserId", username: "testuser" },
			});
			expect(refreshTokenMock.save).toHaveBeenCalled();
		});

		it("should handle login with invalid credentials", async () => {
			const req = { body: { username: "testuser", password: "testpassword" } };
			const res = { status: jest.fn(), json: jest.fn() };

			require("../db/models/user").User = {
				findOne: jest.fn().mockResolvedValueOnce(null),
			};

			await UserRecord.loginUser(req as any, res as any);

			expect(res.status).toHaveBeenCalledWith(401);
			expect(res.json).toHaveBeenCalledWith({ message: "Invalid credentials" });
		});

		it("should handle login with invalid password", async () => {
			const req = { body: { username: "testuser", password: "testpassword" } };
			const res = { status: jest.fn(), json: jest.fn() };

			const userMock = {
				_id: "mockedUserId",
				username: "testuser",
				password: await bcrypt.hash("wrongpassword", 10),
			};
			require("../db/models/user").User = {
				findOne: jest.fn().mockResolvedValueOnce(userMock),
			};

			await UserRecord.loginUser(req as any, res as any);

			expect(res.status).toHaveBeenCalledWith(401);
			expect(res.json).toHaveBeenCalledWith({ message: "Invalid credentials" });
		});

		it("should handle login with an error", async () => {
			const req = { body: { username: "testuser", password: "testpassword" } };
			const res = { status: jest.fn(), json: jest.fn() };

			require("../db/models/user").User = {
				findOne: jest.fn().mockRejectedValueOnce(new Error("Mocked Error")),
			};

			await UserRecord.loginUser(req as any, res as any);

			expect(res.status).toHaveBeenCalledWith(500);
			expect(res.json).toHaveBeenCalledWith({ message: "Internal Server Error" });
		});
	});

	describe("refreshToken", () => {
		it("should refresh the access token", async () => {
			const req: { body: { token: string } } = { body: { token: "mockedRefreshToken" } };
			const res: { json: jest.Mock; status: jest.Mock } = { json: jest.fn(), status: jest.fn() };

			(require("../db/models/refreshToken").RefreshToken as any) = {
				findOne: jest.fn().mockResolvedValueOnce({ userId: "mockedUserId" }),
			};

			(jwt.verify as jest.Mock) = jest
				.fn()
				.mockImplementation((token, secret, callback) => callback(null, { _id: "mockedUserId" }));

			(jwt.sign as jest.Mock) = jest.fn().mockReturnValue("mockedNewAccessToken");

			await UserRecord.refreshToken(req as any, res as any);

			expect(res.json).toHaveBeenCalledWith({ token: "mockedNewAccessToken" });
		});

		it("should handle refreshToken with invalid token", async () => {
			const req: { body: { token: string } } = { body: { token: "invalidToken" } };
			const res: { json: jest.Mock; status: jest.Mock } = { json: jest.fn(), status: jest.fn() };

			(require("../db/models/refreshToken").RefreshToken as any) = {
				findOne: jest.fn().mockResolvedValueOnce(null),
			};

			await UserRecord.refreshToken(req as any, res as any);

			expect(res.status).toHaveBeenCalledWith(403);
			expect(res.json).toHaveBeenCalledWith({ message: "Invalid token" });
		});

		it("should handle refreshToken with verification error", async () => {
			const req: { body: { token: string } } = { body: { token: "mockedRefreshToken" } };
			const res: { json: jest.Mock; status: jest.Mock } = { json: jest.fn(), status: jest.fn() };

			(require("../db/models/refreshToken").RefreshToken as any) = {
				findOne: jest.fn().mockResolvedValueOnce({}),
			};

			(jwt.verify as jest.Mock) = jest
				.fn()
				.mockImplementation((token, secret, callback) =>
					callback(new Error("Mocked Verification Error")),
				);

			await UserRecord.refreshToken(req as any, res as any);

			expect(res.status).toHaveBeenCalledWith(403);
			expect(res.json).toHaveBeenCalledWith({ message: "Invalid token" });
		});

		it("should handle refreshToken with general error", async () => {
			const req: { body: { token: string } } = { body: { token: "mockedRefreshToken" } };
			const res: { json: jest.Mock; status: jest.Mock } = { json: jest.fn(), status: jest.fn() };

			(require("../db/models/refreshToken").RefreshToken as any) = {
				findOne: jest.fn().mockRejectedValueOnce(new Error("Mocked Error")),
			};

			await UserRecord.refreshToken(req as any, res as any);

			expect(res.status).toHaveBeenCalledWith(500);
			expect(res.json).toHaveBeenCalledWith({ message: "Internal Server Error" });
		});
	});

	describe("logoutUser", () => {
		it("should logout a user by deleting the refresh token", async () => {
			const req: { body: { refreshToken: string } } = {
				body: { refreshToken: "mockedRefreshToken" },
			};
			const res: { sendStatus: jest.Mock; status: jest.Mock } = {
				sendStatus: jest.fn(),
				status: jest.fn(),
			};

			(require("../db/models/refreshToken").RefreshToken as any) = {
				findOneAndDelete: jest.fn().mockResolvedValueOnce({}),
			};

			await UserRecord.logoutUser(req as any, res as any);

			expect(res.sendStatus).toHaveBeenCalledWith(204);
		});

		it("should handle logout with an error", async () => {
			const req: { body: { refreshToken: string } } = {
				body: { refreshToken: "mockedRefreshToken" },
			};
			const res: { status: jest.Mock; json: jest.Mock } = { status: jest.fn(), json: jest.fn() };

			(require("../db/models/refreshToken").RefreshToken as any) = {
				findOneAndDelete: jest.fn().mockRejectedValueOnce(new Error("Mocked Error")),
			};

			await UserRecord.logoutUser(req as any, res as any);

			expect(res.status).toHaveBeenCalledWith(500);
			expect(res.json).toHaveBeenCalledWith({ message: "Internal Server Error" });
		});
	});

	describe("updateUserPassword", () => {
		it("should update a user's password", async () => {
			const req: Partial<Request> = {
				params: { id: "mockedUserId" },
				body: { password: "newpassword" },
			};
			const res: Partial<Response> = { status: jest.fn(), json: jest.fn() };

			const findOneMock = jest
				.fn()
				.mockResolvedValueOnce({ password: "oldpassword", save: jest.fn() });
			(require("../db/models/user").User as any) = {
				findOne: findOneMock,
			};

			await UserRecord.updateUserPassword(req as Request, res as Response);

			expect(findOneMock).toHaveBeenCalledWith({ _id: "mockedUserId" });
			expect(findOneMock().save).toHaveBeenCalled();
			expect(res.status).toHaveBeenCalledWith(201);
			expect(res.json).toHaveBeenCalledWith({ password: "newpassword" });
		});

		it("should handle updating password for a non-existing user", async () => {
			const req: Partial<Request> = {
				params: { id: "nonExistingUserId" },
				body: { password: "newpassword" },
			};
			const res: Partial<Response> = { status: jest.fn(), json: jest.fn() };

			(require("../db/models/user").User as any) = {
				findOne: jest.fn().mockResolvedValueOnce(null),
			};

			await UserRecord.updateUserPassword(req as Request, res as Response);

			expect(res.status).toHaveBeenCalledWith(404);
			expect(res.json).toHaveBeenCalledWith({ message: "User not found" });
		});

		it("should handle updating password with an error", async () => {
			const req: Partial<Request> = {
				params: { id: "mockedUserId" },
				body: { password: "newpassword" },
			};
			const res: Partial<Response> = { status: jest.fn(), json: jest.fn() };

			(require("../db/models/user").User as any) = {
				findOne: jest.fn().mockRejectedValueOnce(new Error("Mocked Error")),
			};

			await UserRecord.updateUserPassword(req as Request, res as Response);

			expect(res.status).toHaveBeenCalledWith(500);
			expect(res.json).toHaveBeenCalledWith({ message: "Internal Server Error" });
		});
	});

	describe("deleteUserProfile", () => {
		it("should delete a user profile", async () => {
			const req: Partial<Request> = { params: { id: "mockedUserId" } };
			const res: Partial<Response> = { status: jest.fn(), json: jest.fn(), sendStatus: jest.fn() };

			const deleteOneMock = jest.fn().mockResolvedValueOnce({ deletedCount: 1 });
			(require("../db/models/user").User as any) = {
				deleteOne: deleteOneMock,
			};

			await UserRecord.deleteUserProfile(req as Request, res as Response);

			expect(deleteOneMock).toHaveBeenCalledWith({ _id: "mockedUserId" });
			expect(res.sendStatus).toHaveBeenCalledWith(204);
		});

		it("should handle deleting a non-existing user profile", async () => {
			const req: Partial<Request> = { params: { id: "nonExistingUserId" } };
			const res: Partial<Response> = { status: jest.fn(), json: jest.fn(), sendStatus: jest.fn() };

			(require("../db/models/user").User as any) = {
				deleteOne: jest.fn().mockResolvedValueOnce({ deletedCount: 0 }),
			};

			await UserRecord.deleteUserProfile(req as Request, res as Response);

			expect(res.status).toHaveBeenCalledWith(404);
			expect(res.json).toHaveBeenCalledWith({ message: "User not found" });
		});

		it("should handle deleting a user profile with an error", async () => {
			const req: Partial<Request> = { params: { id: "mockedUserId" } };
			const res: Partial<Response> = { status: jest.fn(), json: jest.fn(), sendStatus: jest.fn() };

			(require("../db/models/user").User as any) = {
				deleteOne: jest.fn().mockRejectedValueOnce(new Error("Mocked Error")),
			};

			await UserRecord.deleteUserProfile(req as Request, res as Response);

			expect(res.status).toHaveBeenCalledWith(500);
			expect(res.json).toHaveBeenCalledWith({ message: "Internal Server Error" });
		});
	});
});
