import dayjs from "dayjs";
import * as errors from "../utils/errors.js"

export function expirationDate(expirationDate: string) {
	const today = dayjs().format("MM/YY")
	if(dayjs(today).isAfter(dayjs(expirationDate))){
		throw errors.conflict("Card has already expired")
	}
}