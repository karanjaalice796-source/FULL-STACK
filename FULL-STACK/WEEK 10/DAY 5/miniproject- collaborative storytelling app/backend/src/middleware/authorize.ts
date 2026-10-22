import { asyncHandler, HttpError, parseId } from "../helpers/http"
import { getStoryAccess } from "../models/storyModel"

function guard(needs: "author" | "writer") {
  return asyncHandler(async (req, _res, next) => {
    const access = await getStoryAccess(parseId(req.params.id, "story id"), req.userId!)
    if (!access) throw new HttpError(404, "Story not found.")
    const allowed = needs === "author" ? access.isAuthor : access.isAuthor || access.isContributor
    if (!allowed) {
      throw new HttpError(
        403,
        needs === "author" ? "Only the author can do that." : "Only the author and contributors can edit this story.",
      )
    }
    next()
  })
}

export const requireAuthor = guard("author")
export const requireWriter = guard("writer")
