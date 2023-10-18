import { Book } from "../db/models/book";
import { Request, Response } from "express";

export class BookActions {
  async saveBook(req: Request, res: Response) {
    const title: string = req.body.title;
    const author: string = req.body.author;

    let book;

    try {
      book = new Book({ title, author });
      await book.save();
    } catch (err) {
      return res.status(422).json({ message: err.message });
    }

    res.status(201).json(book);
  }

  static async getAllBooks(req: Request, res: Response) {
    const doc = await Book.find({});

    res.status(200).json(doc);
  }

  static async getBook(req: Request, res: Response) {
    const id: string = req.params.id;
    const book = await Book.findOne({ _id: id });

    res.status(200).json(book);
  }

  async updateBook(req: Request, res: Response) {
    const id: string = req.params.id;
    const title: string = req.body.title;
    const author: string = req.body.author;

    const book = await Book.findOne({ _id: id });
    book.title = title;
    book.author = author;
    await book.save();

    res.status(201).json(book);
  }

  async deleteBook(req: Request, res: Response) {
    const id: string = req.params.id;
    await Book.deleteOne({ _id: id });

    res.sendStatus(204);
  }
}
