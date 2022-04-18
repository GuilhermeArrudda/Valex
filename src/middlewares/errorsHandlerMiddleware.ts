import { Request, Response, NextFunction } from "express";

export function errorsHandlerMiddleware(err: any, req: Request, res: Response, next: NextFunction) {
	if (err.type === "unauthorized") {
		return res.status(err.code).send(err.message)
	}
	if(err.type === "not_found") {
		return res.status(err.code).send(err.message)
	}
	if(err.type === "conflict") {
		return res.status(err.code).send(err.message)
	}
	if(err.type === "invalid_input") {
		return res.status(err.code).send(err.message)
	}
	if(err.type == "forbidden") {
		return res.status(err.code).send(err.message)
	}
}