import { Book } from "../db/models/book";
import { Request, Response } from "express";
import { ObjectId } from "mongoose";
import { BookEntity } from "../types/book/book.entity";
import { User } from "../db/models/user";
import { BookShelvesEnum } from "../types/book/book.enum";

export class BookRecord implements BookEntity {
	public _id: ObjectId;
	public title: string;
	public author: string;
	public bookImage: string;
	public bookShelf: BookShelvesEnum;

	static async saveBook(req: Request, res: Response) {
		const userId: string = req.params.userId;
		const { title, author, bookImage, bookShelf } = req.body;

		try {
			const user = await User.findById(userId);
			if (!user) {
				res.status(404).json({ message: "User not found" });
				return;
			}

			const book = new Book({ title, author, bookImage, user: userId, bookShelf });
			await book.save();

			user.books.push(book._id);
			await user.save();

			res.status(201).json(book);
		} catch (err) {
			res.status(500).json({ message: "Internal Server Error" });
		}
	}

	static async getAllBooks(req: Request, res: Response) {
		const userId = req.params.userId;

		try {
			const books = await Book.find({ user: userId });
			res.status(200).json(books);
		} catch (err) {
			res.status(500).json({ message: "Internal Server Error" });
		}
	}

	static async getBook(req: Request, res: Response) {
		const userId = req.params.userId;
		const bookId = req.params.id;

		try {
			const book = await Book.findOne({ _id: bookId, user: userId });
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
		const userId = req.params.userId;
		const bookId = req.params.id;
		const { title, author, bookImage, bookShelf } = req.body;

		try {
			const book = await Book.findOne({ _id: bookId, user: userId });
			if (!book) {
				res.status(404).json({ message: "Book not found" });
				return;
			}

			book.title = title;
			book.author = author;
			book.bookImage = bookImage;
			book.bookShelf = bookShelf;
			await book.save();

			res.status(201).json(book);
		} catch (err) {
			res.status(500).json({ message: "Internal Server Error" });
		}
	}

	static async deleteBook(req: Request, res: Response) {
		const userId = req.params.userId;
		const bookId = req.params.id;

		try {
			const book = await Book.findOne({ _id: bookId, user: userId });
			if (!book) {
				res.status(404).json({ message: "Book not found" });
				return;
			}

			const result = await Book.deleteOne({ _id: bookId, user: userId });
			if (result.deletedCount === 0) {
				res.status(404).json({ message: "Book not found" });
			} else {
				const user = await User.findById(userId);
				if (user) {
					user.books = user.books.filter(
						(userBookId) => userBookId.toString() !== book._id.toString(),
					);
					await user.save();
				}

				res.sendStatus(204);
			}
		} catch (err) {
			res.status(500).json({ message: "Internal Server Error" });
		}
	}

	static async changeShelf(req: Request, res: Response) {
		const userId = req.params.userId;
		const bookId = req.params.id;
		const { bookShelf } = req.body;

		try {
			const book = await Book.findOne({ _id: bookId, user: userId });
			if (!book) {
				res.status(404).json({ message: "Book not found" });
				return;
			}

			book.bookShelf = bookShelf;
			await book.save();

			res.status(201).json(book);
		} catch (err) {
			res.status(500).json({ message: "Internal Server Error" });
		}
	}
}
