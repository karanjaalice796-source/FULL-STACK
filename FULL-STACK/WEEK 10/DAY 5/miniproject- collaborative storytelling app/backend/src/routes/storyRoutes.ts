import { Router } from "express"
import { add as addComment, list as listComments } from "../controllers/commentController"
import { create, list, remove, show, update, versions } from "../controllers/storyController"
import { authenticate } from "../middleware/authenticate"
import { requireAuthor, requireWriter } from "../middleware/authorize"

const router = Router()
router.use(authenticate)
router.get("/", list)
router.post("/", create)
router.get("/:id", show)
router.patch("/:id", requireWriter, update)
router.delete("/:id", requireAuthor, remove)
router.get("/:id/versions", versions)
router.get("/:id/comments", listComments)
router.post("/:id/comments", addComment)

export default router
