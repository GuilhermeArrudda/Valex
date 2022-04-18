import * as cardRepository from "../repositories/cardRepository.js"
import * as errors from "../utils/errors.js"

export async function cardExistence(cardId: number) {
	const card = await cardRepository.findById(cardId)
	if(!card){
		throw errors.notFound("Card was not found")
	}
	return card
}