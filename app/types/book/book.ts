import { BookEntity } from "./book.entity";

export type BookType = Omit<BookEntity, "_id">;
