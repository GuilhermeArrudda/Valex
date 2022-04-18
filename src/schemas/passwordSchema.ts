import joi from "joi";

const passwordSchema = joi.object({
	password: joi.string().pattern(/^[0-9]{4}$/).required()
})

export default passwordSchema