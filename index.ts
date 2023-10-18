import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import "express-async-errors";
import { config } from "./app/config";
import "./app/db/mongoose";
import { bookRouter } from "./app/routes/book";

const app = express();

app.use(bodyParser.json());
app.use(
  cors({
    origin: `http://localhost:${config.port}`,
  }),
);

app.use("/api/", bookRouter);

app.listen(config.port, () => {
  console.log(`Listening on http://localhost:${config.port}`);
});
