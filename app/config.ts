import * as dotenv from "dotenv";

dotenv.config();

export const config = {
  port: process.env.PORT,
  database: process.env.DATABASE || "mongodb://127.0.0.1:27017/BookFreak",
};
