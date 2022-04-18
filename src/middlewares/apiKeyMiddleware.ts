import { Request, Response, NextFunction  } from "express";
import { findByApiKey } from "../repositories/companyRepository.js";
import * as errors from "../utils/errors.js"

export async function validateApiKeyMiddleware(req: Request, res:Response, next:NextFunction) {
	const apiKey = req.headers["x-api-key"]
	if(!apiKey) {
		throw errors.unauthorized("invalid api-key")		
	}

	const company = await findByApiKey(apiKey.toString())
	if(!company){
		throw errors.notFound("not found")
	}

	res.locals.company = company

	next()
}