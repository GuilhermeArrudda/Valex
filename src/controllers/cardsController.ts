import { Request, Response } from "express";
import { employeeRegister } from "../middlewares/employeeCompanyMiddleware.js";
import * as cardsServices from "../services/cardsServices.js"
import * as errors from "../utils/errors.js"

export async function create(req:Request, res:Response) {
	const { employeeId, cardType } = req.body
	const { company } = res.locals

	validateCardType(cardType)

	const employee = await employeeRegister(employeeId, company.id)

	await cardsServices.employeeCards(cardType, employeeId)

	const { cardNumber, formatName, expirationDate, cvv, cvvHash } = cardsServices.createInfo(employee.fullName)

	const password = null
	const isVirtual = false
	const originalCardId = null
	const isBlocked = true

	await cardsServices.createCard(
		employee.id,
		cardNumber,
		formatName,
		cvvHash,
		expirationDate,
		password,
		isVirtual,
		originalCardId,
		isBlocked,
		cardType
	)

	res.sendStatus(201)
}

function validateCardType(cardType: string) {
	if(
		cardType !== "groceries" &&
		cardType !== "restaurant" &&
		cardType !== "transport" &&
		cardType !== "education" &&
		cardType !== "health"
	) {
		throw errors.invalidInput("Invalid type")
	}
}