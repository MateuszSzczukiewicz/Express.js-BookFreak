import dotenv from "dotenv";
dotenv.config({ path: ".env" });

import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import "./app/db/mongoose";
import { bookRouter } from "./app/routes/book";
import { userRouter } from "./app/routes/user";

const app = express();

app.use(
	cors({
		credentials: true,
		origin: "*",
		allowedHeaders: "Origin, X-Requested-With, Content-Type, Accept",
		optionsSuccessStatus: 204,
	}),
);

app.get("/", (req, res) => {
	res.send("Express on Vercel, CORS issue");
});

app.use(bodyParser.json());
app.use("/", bookRouter);
app.use("/", userRouter);

app.listen(process.env.PORT);

module.exports = app;
