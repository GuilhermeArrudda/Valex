import joi from "joi";

const purchaseSchema = joi.object({
	amount: joi.number().min(1).integer().required(),
	businessId: joi.number().integer().required(),
	password: joi.string().pattern(/^[0-9]{4}$/).required()
})

export default purchaseSchema