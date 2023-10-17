import { ObjectId } from "mongoose";

export interface BookEntity {
  _id?: ObjectId;
  title: string;
  author: string;
}
