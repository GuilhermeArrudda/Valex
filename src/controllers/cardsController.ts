import { Request, Response } from "express";
import { cardExistence } from "../middlewares/cardExistenceMiddleware.js";
import { employeeRegister } from "../middlewares/employeeCompanyMiddleware.js";
import { expirationDate } from "../middlewares/expirationDate.js";
import cardActivateSchema from "../schemas/activateSchema.js";
import passwordSchema from "../schemas/passwordSchema.js";
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

	console.log({ cvv })

	res.sendStatus(201)
}

export async function activate(req:Request, res:Response) {
	const { cardId } = req.params
	const { cvv, password } = req.body

	validateActivateInput(req.body)

	const card = await cardExistence(Number(cardId))

	cardsServices.verifyCvv(cvv, card.securityCode)

	cardsServices.verifyAlreadyAtivatedCard(card.password)

	expirationDate(card.expirationDate)

	const passwordHash = cardsServices.securityPassword(password)

	const isBlocked = false
	
	await cardsServices.activateCard(
		Number(cardId),
		passwordHash,
		isBlocked
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

function validateActivateInput(body: any) {
	const validation = cardActivateSchema.validate(body)

	if(validation.error) {
		throw errors.invalidInput("invalid data")
	}
}

export async function blockCard (req: Request, res: Response) {
	const { id: cardId } = req.params
	const { password } = req.body

	validatePassword(req.body)
	
	const card = await cardExistence(Number(cardId))

	expirationDate(card.expirationDate)

	await cardsServices.blockCard(Number(cardId), password)

	res.sendStatus(200)
}

export async function unblockCard(req: Request, res: Response) {
	const { id: cardId } = req.params
	const { password } = req.body

	validatePassword(req.body)

	const card = await cardExistence(Number(cardId))

	expirationDate(card.expirationDate)

	await cardsServices.unblockCard(Number(cardId), password)

	res.sendStatus(200)
}

function validatePassword(body: any) {
	const validation = passwordSchema.validate(body)

	if(validation.error) {
		throw errors.invalidInput("invalid data")
	}
}