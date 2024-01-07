import dotenv from "dotenv";
dotenv.config({ path: ".env" });

import express from "express";
import bodyParser from "body-parser";
import "./app/db/mongoose";
import { bookRouter } from "./app/routes/book";
import { userRouter } from "./app/routes/user";
// import rateLimit from "express-rate-limit";
const app = express();

app.get("/", (req, res) => {
	res.send("Express on Vercel");
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
