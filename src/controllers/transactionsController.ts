import { Request, Response } from "express"
import { cardExistence } from "../middlewares/cardExistenceMiddleware.js"
import { employeeRegister } from "../middlewares/employeeCompanyMiddleware.js"
import { expirationDate } from "../middlewares/expirationDate.js"
import rechargeSchema from "../schemas/rechargeSchema.js"
import * as errors from "../utils/errors.js"
import * as transactionsServices from "../services/transactionsService.js"
import purchaseSchema from "../schemas/purchaseSchema.js"

export async function transactions(req: Request, res: Response) {
	const { cardId } = req.params

	await cardExistence(Number(cardId))

	const result = await transactionsServices.getBalance(Number(cardId))

	res.status(200).send(result)
}

export async function recharge(req: Request, res: Response) {
	const { cardId } = req.params
	const { company } = res.locals
	const { amount } = req.body

	validateRechargeAmount(req.body)

	const card = await cardExistence(Number(cardId))

	await employeeRegister(card.employeeId, company.id)

	expirationDate(card.expirationDate)

	await transactionsServices.rechargeCard(card.id, Number(amount))

	res.sendStatus(201)
}

function validateRechargeAmount(body: any) {
	const validation = rechargeSchema.validate(body)
	if(validation.error) {
		throw errors.invalidInput("Invalid data")
	}
}

export async function purchase(req: Request, res: Response) {
	const { cardId } = req.params
	const { amount, businessId, password } = req.body

	validatePurchase(req.body)

	const card = await cardExistence(Number(cardId))

	expirationDate(card.expirationDate)

	await transactionsServices.verifyBalance(Number(cardId), amount)

	const business = await transactionsServices.businessRegister(Number(businessId))

	transactionsServices.businessType(card.type, business.type)

	transactionsServices.verifyPassword(password, card.password)

	transactionsServices.makePurchase(card.id, business.id, amount)

	res.sendStatus(201)
}

function validatePurchase(body: any) {
	const validation = purchaseSchema.validate(body)

	if(validation.error) {
		throw errors.invalidInput("Invalid data")
	}
}