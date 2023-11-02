import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import "express-async-errors";
import { config } from "./app/config";
import "./app/db/mongoose";
import { bookRouter } from "./app/routes/book";
import { userRouter } from "./app/routes/user";
import { handleError } from "./app/utils/errors";
import rateLimit from "express-rate-limit";

const app = express();

app.use(bodyParser.json());
app.use(cors());
app.use(
	rateLimit({
		windowMs: 5 * 60 * 1000,
		limit: 100,
	}),
);

app.use("/api/", bookRouter);
app.use("/api/", userRouter);

app.use(handleError);

app.listen(config.port);
