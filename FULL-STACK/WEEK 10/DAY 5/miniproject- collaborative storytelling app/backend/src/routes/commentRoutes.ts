import { Router } from "express"
import { remove } from "../controllers/commentController"
import { authenticate } from "../middleware/authenticate"

const router = Router()
router.delete("/:id", authenticate, remove)

export default router
