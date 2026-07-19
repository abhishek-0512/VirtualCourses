import express from "express"
import { searchWithAi } from "../controller/aiController.js"

let aiRouter = express.Router()

aiRouter.post("/search",searchWithAi)

export default aiRouter