import { Router } from "express";
import { validateApiKeyMiddleware } from "../middlewares/apiKeyMiddleware.js";
import * as transactionsController from "../controllers/transactionsController.js"

const transactionsRouter = Router()

transactionsRouter.get("/transactions/:cardId/balance", transactionsController.transactions)
transactionsRouter.post("/transactions/:cardId/recharge", validateApiKeyMiddleware, transactionsController.recharge)
transactionsRouter.post("/transactions/:cardId/purchase", )

export default transactionsRouter