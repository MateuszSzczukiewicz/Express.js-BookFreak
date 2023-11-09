import { ObjectId } from "mongoose";
import { BookShelvesEnum } from "./book.enum";

export interface BookEntity {
	_id: ObjectId;
	title: string;
	author: string;
	bookImage: string | ArrayBuffer | null;
	bookShelf: BookShelvesEnum;
}
