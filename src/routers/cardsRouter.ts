import { Router } from "express";
import { validateApiKeyMiddleware } from "../middlewares/apiKeyMiddleware.js";
import * as cardsController from "../controllers/cardsController.js"

const cardsRouter = Router()

cardsRouter.post("/cards", validateApiKeyMiddleware, cardsController.create)
cardsRouter.put("/cards/:cardId/activation", cardsController.activate)
cardsRouter.put("/cards/:id/block", cardsController.blockCard)
cardsRouter.put("/cards/:id/unblock", cardsController.unblockCard)

export default cardsRouter