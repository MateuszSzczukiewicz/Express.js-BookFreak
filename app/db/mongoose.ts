import mongoose from "mongoose";
import { config } from "../config";

mongoose
	.connect(config.database)
	.then(() => {
		console.log("Connected to MongoDB");
	})
	.catch((error) => {
		if (error.name === "MongoServerError" && error.code === 8000) {
			console.error("MongoDB authentication failed. Check your credentials.");
		} else {
			console.error("Error connecting to MongoDB:", error);
		}
	});
