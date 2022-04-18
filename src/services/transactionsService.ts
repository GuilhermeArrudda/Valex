import * as rechargeRepository from "../repositories/rechargeRepository.js"
import * as paymentRepository from "../repositories/paymentRepository.js"

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

	const balance = (credit - debit) / 100

	return {
		balance,
		transactions: debit / 100,
		recharges: credit / 100
	}
}

export async function rechargeCard(cardId: number, amount: number) {
	const convertAmount = amount * 100
	await rechargeRepository.insert({ cardId, amount: convertAmount })
}