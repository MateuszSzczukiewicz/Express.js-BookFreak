import { Request, Response } from "express";
import { Book } from "../app/db/models/book";
import { BookActions } from "../app/actions/bookActions";

describe("BookActions", () => {
  beforeAll(async () => {});

  afterEach(async () => {});

  describe("saveBook", () => {
    it("should save a book", async () => {
      const req = {
        body: { title: "Test Book", author: "Test Author" },
      } as Request;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      await BookActions.saveBook(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ title: "Test Book", author: "Test Author" }),
      );
    });

    it("should handle saveBook errors", async () => {
      const req = {
        body: { title: "Test Book", author: "Test Author" },
      } as Request;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      jest
        .spyOn(Book.prototype, "save")
        .mockRejectedValue(new Error("Test error"));

      await BookActions.saveBook(req, res);

      expect(res.status).toHaveBeenCalledWith(422);
      expect(res.json).toHaveBeenCalledWith({ message: "Test error" });
    });
  });

  describe("getAllBooks", () => {
    it("should get all books", async () => {
      const req = {} as Request;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      jest.spyOn(Book, "find").mockResolvedValue([
        { title: "Book 1", author: "Author 1" },
        { title: "Book 2", author: "Author 2" },
      ]);

      await BookActions.getAllBooks(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({ title: "Book 1", author: "Author 1" }),
          expect.objectContaining({ title: "Book 2", author: "Author 2" }),
        ]),
      );
    });

    it("should handle getAllBooks errors", async () => {
      const req = {} as Request;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      jest.spyOn(Book, "find").mockRejectedValue(new Error("Test error"));

      await BookActions.getAllBooks(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Internal Server Error",
      });
    });
  });
});
