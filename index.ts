import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import "express-async-errors";
import { config } from "./app/config";
import { bookRouter } from "./app/routes/book";
import "./app/db/mongoose";

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
