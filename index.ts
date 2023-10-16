import * as express from "express";
import * as cors from "cors";
import * as bodyParser from "body-parser";
import "express-async-errors";
import { config } from "./app/config";
import { handleError } from "./app/utils/errors";

const app = express();

app.use(bodyParser.json());
app.use(
  cors({
    origin: `http://localhost:${config.port}`,
  }),
);
app.use(express.json());
app.use(handleError);

app.listen(config.port, () => {
  console.log(`Listening on http://localhost:${config.port}`);
});
