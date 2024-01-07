import dotenv from "dotenv";
dotenv.config({ path: ".env" });

import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import "./app/db/mongoose";
import { bookRouter } from "./app/routes/book";
import { userRouter } from "./app/routes/user";

const app = express();

app.use(
	cors({
		credentials: true,
		origin: ["*"],
		allowedHeaders: ["*"],
		methods: ["GET", "POST", "PUT", "DELETE"],
		optionsSuccessStatus: 204,
	}),
);

// Obsługa błędów CORS
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
	console.error(err);
	res.status(500).json({ error: "Internal Server Error" });
});

app.get("/", (req, res) => {
	res.send("Express on Vercel, CORS issue");
});

app.use(bodyParser.json());
app.use("/", bookRouter);
app.use("/", userRouter);

app.listen(process.env.PORT);

module.exports = app;
