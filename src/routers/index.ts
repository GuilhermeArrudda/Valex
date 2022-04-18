import { Router } from "express";
import cardsRouter from "./cardsRouter.js";
import transactionsRouter from "./transactionsRouter.js";

const router = Router()

router.use(cardsRouter)
router.use(transactionsRouter)

export default router