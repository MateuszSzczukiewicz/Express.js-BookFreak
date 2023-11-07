import { Request, Response } from "express";

export class ValidationError {}

export const handleError = (err: Error, req: Request, res: Response) => {
	console.error(err);

	res.status(err instanceof ValidationError ? 400 : 500).json({
		message: err instanceof ValidationError ? err.message : "Sorry, please try again later.",
	});
};
