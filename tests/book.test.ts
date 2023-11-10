import { Request, Response } from "express";
import { BookRecord } from "../app/records/book.record";
import { User } from "../app/db/models/user";
import { Book } from "../app/db/models/book";
import { BookShelvesEnum } from "../app/types/book/book.enum";
import { DeleteResult } from "mongodb";

const existingBookData = {
	title: "The Hobbit",
	author: "J.R.R. Tolkien",
	bookImage: "the-hobbit-cover.jpg",
	user: "user123",
	bookShelf: BookShelvesEnum.READ,
};

describe("BookRecord", () => {
	let mockRequest: Partial<Request>;
	let mockResponse: Partial<Response>;

	beforeEach(() => {
		mockRequest = {};
		mockResponse = {
			status: jest.fn().mockReturnThis(),
			json: jest.fn(),
			sendStatus: jest.fn(),
		};
	});

	describe("saveBook", () => {
		it("should save a book", async () => {
			const mockUser = new User();
			jest.spyOn(User, "findById").mockResolvedValue(mockUser);
			jest.spyOn(User.prototype, "save").mockResolvedValue(undefined);
			jest.spyOn(Book.prototype, "save").mockResolvedValue(undefined);

			mockRequest.params = { userId: "user123" };
			mockRequest.body = { title: "Test Book", author: "Test Author" };

			await BookRecord.saveBook(mockRequest as Request, mockResponse as Response);

			expect(User.findById).toHaveBeenCalledWith("user123");
			expect(User.prototype.save).toHaveBeenCalled();
			expect(Book.prototype.save).toHaveBeenCalled();
			expect(mockResponse.status).toHaveBeenCalledWith(201);
			expect(mockResponse.json).toHaveBeenCalled();
		});
	});

	describe("getAllBooks", () => {
		it("should get all books for a user", async () => {
			const mockBooks = [{ title: "Book 1" }, { title: "Book 2" }];
			jest.spyOn(Book, "find").mockResolvedValue(mockBooks);

			mockRequest.params = { userId: "user123" };

			await BookRecord.getAllBooks(mockRequest as Request, mockResponse as Response);

			expect(Book.find).toHaveBeenCalledWith({ user: "user123" });
			expect(mockResponse.status).toHaveBeenCalledWith(200);
			expect(mockResponse.json).toHaveBeenCalledWith(mockBooks);
		});
	});

	describe("getBook", () => {
		it("should get a specific book for a user", async () => {
			const mockBook = { title: "Test Book" };
			jest.spyOn(Book, "findOne").mockResolvedValue(mockBook);

			mockRequest.params = { userId: "user123", id: "book456" };

			await BookRecord.getBook(mockRequest as Request, mockResponse as Response);

			expect(Book.findOne).toHaveBeenCalledWith({ _id: "book456", user: "user123" });
			expect(mockResponse.status).toHaveBeenCalledWith(200);
			expect(mockResponse.json).toHaveBeenCalledWith(mockBook);
		});
	});

	describe("updateBook", () => {
		it("should update a book for a user", async () => {
			const mockBook = new Book({
				existingBookData,
			});
			jest.spyOn(Book, "findOne").mockResolvedValue(mockBook);
			jest.spyOn(Book.prototype, "save").mockResolvedValue(undefined);

			mockRequest.params = { userId: "user123", id: "book456" };
			mockRequest.body = { title: "Updated Book" /* other updated book data */ };

			await BookRecord.updateBook(mockRequest as Request, mockResponse as Response);

			expect(Book.findOne).toHaveBeenCalledWith({ _id: "book456", user: "user123" });
			expect(Book.prototype.save).toHaveBeenCalled();
			expect(mockResponse.status).toHaveBeenCalledWith(201);
			expect(mockResponse.json).toHaveBeenCalledWith(mockBook);
		});
	});

	describe("deleteBook", () => {
		it("should delete a book for a user", async () => {
			const mockBook = new Book({
				existingBookData,
			});
			jest.spyOn(Book, "findOne").mockResolvedValue(mockBook);
			jest.spyOn(Book, "deleteOne").mockResolvedValue({ deletedCount: 1 } as DeleteResult);
			jest.spyOn(User, "findById").mockResolvedValue(new User({ username: "Admin" }));
			jest.spyOn(User.prototype, "save").mockResolvedValue(undefined);

			mockRequest.params = { userId: "user123", id: "book456" };

			await BookRecord.deleteBook(mockRequest as Request, mockResponse as Response);

			expect(Book.findOne).toHaveBeenCalledWith({ _id: "book456", user: "user123" });
			expect(Book.deleteOne).toHaveBeenCalledWith({ _id: "book456", user: "user123" });
			expect(User.findById).toHaveBeenCalledWith("user123");
			expect(User.prototype.save).toHaveBeenCalled();
			expect(mockResponse.sendStatus).toHaveBeenCalledWith(204);
		});
	});

	describe("changeShelf", () => {
		it("should change the shelf of a book for a user", async () => {
			const mockBook = new Book({
				existingBookData,
			});
			jest.spyOn(Book, "findOne").mockResolvedValue(mockBook);
			jest.spyOn(Book.prototype, "save").mockResolvedValue(undefined);

			mockRequest.params = { userId: "user123", id: "book456" };
			mockRequest.body = { bookShelf: BookShelvesEnum.READING };

			await BookRecord.changeShelf(mockRequest as Request, mockResponse as Response);

			expect(Book.findOne).toHaveBeenCalledWith({ _id: "book456", user: "user123" });
			expect(Book.prototype.save).toHaveBeenCalled();
			expect(mockResponse.status).toHaveBeenCalledWith(201);
			expect(mockResponse.json).toHaveBeenCalledWith(mockBook);
		});
	});
});
