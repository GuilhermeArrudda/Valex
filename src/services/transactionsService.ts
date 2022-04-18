import * as rechargeRepository from "../repositories/rechargeRepository.js"
import * as paymentRepository from "../repositories/paymentRepository.js"
import * as businessRepository from "../repositories/businessRepository.js"
import * as errors from "../utils/errors.js"
import bcrypt from "bcrypt"

export async function getBalance(cardId: number) {
	const creditResult = await rechargeRepository.findByCardId(cardId)

	let credit = 0
	creditResult.forEach((e) => {
		credit += e.amount
	})

	const debitResult = await paymentRepository.findByCardId(cardId)
	let debit = 0
	debitResult.forEach((e) => {
		debit += e.amount
	})

	const balance = credit - debit

	return {
		balance,
		transactions: debit,
		recharges: credit
	}
}

export async function rechargeCard(cardId: number, amount: number) {
	const convertAmount = amount * 100
	await rechargeRepository.insert({ cardId, amount: convertAmount })
}

export async function verifyBalance(cardId: number, purchaseAmount: number) {
	const convertAmount = purchaseAmount * 100

	const cardBalance = await getBalance(Number(cardId))
	if(cardBalance.balance < convertAmount) {
		throw errors.conflict("Card has insufficient balance")
	}
}

export async function businessRegister(businessId: number) {
	const business = await businessRepository.findById(businessId)
	if(!business) {
		throw errors.notFound("Business was not found")
	}
	return business
}

export function businessType(cardType: string, businessType: string) {
	if(cardType !== businessType) {
		throw errors.conflict("This type of card cannot be used in this type of business")
	}
}

export function verifyPassword(password: string, passwordHash: string) {
	if(!bcrypt.compareSync(password, passwordHash)) {
		throw errors.unauthorized("The password is not correct")
	}
}

export async function makePurchase(cardId: number, businessId: number, amount: number) {
	const convertAmount = amount * 100
	await paymentRepository.insert({
		cardId,
		businessId,
		amount: convertAmount
	})
}