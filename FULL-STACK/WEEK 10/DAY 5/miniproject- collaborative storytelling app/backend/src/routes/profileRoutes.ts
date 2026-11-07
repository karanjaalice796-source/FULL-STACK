import { Router } from "express"
import { show, update } from "../controllers/profileController"
import { authenticate } from "../middleware/authenticate"

const router = Router()
router.use(authenticate)
router.get("/", show)
router.patch("/", update)

export default router
