// @ts-ignore
import express from "express";
// @ts-ignore
import cors from "cors";
import * as bodyParser from "body-parser";
import "express-async-errors";
import { config } from "./app/config";
import { bookRouter } from "./app/routes/book";

const app = express();

app.use(bodyParser.json());
app.use(
  cors({
    origin: `http://localhost:${config.port}`,
  }),
);

app.use("/books", bookRouter);

app.listen(config.port, () => {
  console.log(`Listening on http://localhost:${config.port}`);
});
