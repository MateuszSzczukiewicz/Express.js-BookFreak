import mongoose from "mongoose";

export const BookSchema = new mongoose.Schema({
  title: {
    type: "string",
    required: true,
  },
  author: {
    type: "string",
    required: true,
  },
});

const Book = mongoose.model("Book", BookSchema);
