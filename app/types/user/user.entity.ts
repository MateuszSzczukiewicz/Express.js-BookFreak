import { ObjectId } from "mongoose";

export interface UserEntity {
	_id: ObjectId;
	username: string;
	password: string;
}
