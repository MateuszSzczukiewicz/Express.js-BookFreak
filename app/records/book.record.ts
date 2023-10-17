import { Book } from "../db/models/book";
import { ObjectId } from "mongoose";
import { BookEntity } from "../types";
import { Response } from "express";

export class BookRecord {
  private readonly _id: ObjectId | undefined;
  private readonly title: string;
  private readonly author: string;

  constructor(obj: BookEntity) {
    this._id = obj._id;
    this.title = obj.title;
    this.author = obj.author;
  }

  async saveBook(res: Response) {
    const title = this.title;
    const author = this.author;

    let book;

    try {
      book = new Book({ title, author });
      await book.save();
    } catch (err) {
      return res.status(422);
    }

    res.status(201).json(book);
  }

  static async getAllBooks(res: Response) {
    const doc = await Book.find({});
    res.status(200).json(doc);
  }

  async getBook(res: Response) {
    const id = this._id;
    const book = await Book.findOne({ _id: id });
    res.status(200).json(book);
  }

  async updateBook(res: Response) {
    const _id = this._id;
    const title = this.title;
    const author = this.author;

    const book = await Book.findOne({ _id: _id });

    if (book) {
      book.title = title;
      book.author = author;
      await book.save();

      res.status(201).json(book);
    } else {
      res.status(404).json({ message: "Not found" });
    }
  }

  async deleteBook(res: Response) {
    const _id = this._id;

    try {
      await Book.deleteOne({ _id: _id });
      res.sendStatus(204);
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
  }
}
