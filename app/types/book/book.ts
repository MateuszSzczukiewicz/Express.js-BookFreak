import { BookEntity } from "./book.entity";
import { ObjectId } from "mongoose";

export type CreateBookReq = Omit<BookEntity, "_id">;

export interface GetSingleBookRes {
  book: BookEntity;
  _id: ObjectId;
}
