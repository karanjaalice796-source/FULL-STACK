import { Router } from "express"
import { add, list, remove } from "../controllers/contributorController"
import { authenticate } from "../middleware/authenticate"

const router = Router()
router.use(authenticate)
router.get("/:story_id", list)
router.post("/", add)
router.delete("/:id", remove)

export default router
