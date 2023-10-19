import { Book } from "../db/models/book";
import { Request, Response } from "express";
import { ObjectId } from "mongoose";
import { BookEntity } from "../types";

export class BookActions implements BookEntity {
  public _id: ObjectId;
  public title: string;
  public author: string;

  static async saveBook(req: Request, res: Response) {
    const { title, author } = req.body;

    try {
      const book = new Book({ title, author });
      await book.save();
      res.status(201).json(book);
    } catch (err) {
      res.status(422).json({ message: err.message });
    }
  }

  static async getAllBooks(req: Request, res: Response) {
    try {
      const books = await Book.find({});
      res.status(200).json(books);
    } catch (err) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  static async getBook(req: Request, res: Response) {
    const id = req.params.id;
    try {
      const book = await Book.findOne({ _id: id });
      if (!book) {
        res.status(404).json({ message: "Book not found" });
      } else {
        res.status(200).json(book);
      }
    } catch (err) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  static async updateBook(req: Request, res: Response) {
    const id = req.params.id;
    const { title, author } = req.body;

    try {
      const book = await Book.findOne({ _id: id });
      if (!book) {
        res.status(404).json({ message: "Book not found" });
      } else {
        book.title = title;
        book.author = author;
        await book.save();
        res.status(201).json(book);
      }
    } catch (err) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  static async deleteBook(req: Request, res: Response) {
    const id = req.params.id;

    try {
      const result = await Book.deleteOne({ _id: id });
      if (result.deletedCount === 0) {
        res.status(404).json({ message: "Book not found" });
      } else {
        res.sendStatus(204);
      }
    } catch (err) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
}
