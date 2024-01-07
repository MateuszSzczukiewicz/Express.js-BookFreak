import dotenv from "dotenv";
dotenv.config({ path: ".env" });

import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
// import "express-async-errors";
import "./app/db/mongoose";
import { bookRouter } from "./app/routes/book";
import { userRouter } from "./app/routes/user";
// import rateLimit from "express-rate-limit";
const app = express();

app.use(
	cors({
		credentials: true,
		origin: "*",
		allowedHeaders: "Origin, X-Requested-With, Content-Type, Accept",
	}),
);

app.use((req, res, next) => {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
	res.header("Access-Control-Allow-Headers", "Content-Type");
	next();
});

app.use((req, res, next) => {
	res.header("Vary", "Origin");
	next();
});

app.get("/", (req, res) => {
	res.send("Express on Vercel, CORS issue");
});

app.use(bodyParser.json());
// app.use(
// 	rateLimit({
// 		windowMs: 5 * 60 * 1000,
// 		limit: 100,
// 	}),
// );

app.use("/", bookRouter);
app.use("/", userRouter);

app.listen(process.env.PORT);

module.exports = app;
