import { faker } from "@faker-js/faker"
import dayjs from "dayjs"
import bcrypt from "bcrypt"
import * as cardRepository from "../repositories/cardRepository.js"
import * as errors from "../utils/errors.js"

export async function employeeCards(type: cardRepository.TransactionTypes, employeeId: number){
	const card = await cardRepository.findByTypeAndEmployeeId(type, employeeId)
	if(card){
		throw errors.conflict("This type of card already exists")
	}
}

function generateName(employeeName: string) {
	const upperName = employeeName.toUpperCase().split(" ")
	const filteredNames = upperName.filter((e) => e.length >= 3)
	const firstName = filteredNames[0]
	const lastName = filteredNames[filteredNames.length - 1]
	const middleNames = filteredNames.filter((e) => e !== firstName && e !== lastName)
	const name = []
	name.push(firstName)
	middleNames.forEach((e) => name.push(e[0]))
	name.push(lastName)
	return name.join(" ")
}

function generateDate() {
	return dayjs().add(5, "year").format("MM/YY")
}

function generateCvv() {
	const cvv = faker.finance.creditCardCVV()
	const cvvHash = bcrypt.hashSync(cvv, 10)
	return {cvv, cvvHash}
}

export function createInfo(employeeName: string){
	const cardNumber = faker.finance.creditCardNumber("mastercard")
	const formatName = generateName(employeeName)
	const expirationDate = generateDate()
	const { cvv, cvvHash } = generateCvv()
	return {cardNumber, formatName, expirationDate, cvv, cvvHash}
}

export async function createCard(
	employeeId: number,
	number: string,
	cardholderName: string,
	securityCode: string,
	expirationDate: string,
	password: string,
	isVirtual: boolean,
	originalCardId: number,
	isBlocked: boolean,
	type: cardRepository.TransactionTypes
) {
	await cardRepository.insert({
		employeeId,
		number,
		cardholderName,
		securityCode,
		expirationDate,
		password,
		isVirtual,
		originalCardId,
		isBlocked,
		type
	})
}

export function verifyCvv(cvv: string, cvvHash: string) {
	if(!bcrypt.compareSync(cvv, cvvHash)){
		throw errors.unauthorized("CVV is not correct")
	}
}

export function verifyAlreadyAtivatedCard(password: string) {
	if (password !== null) {
		throw errors.conflict("Card has already been activated")
	}
}

export function securityPassword(password: string) {
	const passwordHash = bcrypt.hashSync(password, 10)

	return passwordHash
}

export async function activateCard(cardId: number, password: string, isBlocked: boolean) {
	await cardRepository.update(cardId, { password, isBlocked })
}

export async function blockCard(cardId: number, password: string) {
	const card = await cardRepository.findById(cardId)

	if(card.isBlocked){
		throw errors.conflict("Card already blocked")
	}
	
	if(!bcrypt.compareSync(password, card.password)){
		throw errors.unauthorized("Senha incorreta")
	}

	card.isBlocked = true

	await cardRepository.update(cardId, card)
}

export async function unblockCard(cardId: number, password: string) {
	const card = await cardRepository.findById(cardId)

	if(!card.isBlocked){
		throw errors.conflict("Card already unlocked")
	}

	if(!bcrypt.compareSync(password, card.password)){
		throw errors.unauthorized("Incorrect password")
	}

	card.isBlocked = false

	await cardRepository.update(cardId, card)
}