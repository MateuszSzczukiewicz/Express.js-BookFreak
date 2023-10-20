import mongoose from "mongoose";
import { config } from "../config";

mongoose
	.connect(config.database)
	.then(() => {
		console.log("Connected to MongoDB");
	})
	.catch((error) => {
		console.error("Error connecting to MongoDB:", error);
	});
