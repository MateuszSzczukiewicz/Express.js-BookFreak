import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config({ path: ".env" });

mongoose
	.connect(process.env.MONGODB_URI)
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
