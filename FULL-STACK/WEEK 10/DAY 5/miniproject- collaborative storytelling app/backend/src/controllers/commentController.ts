import { asyncHandler, field, HttpError, parseId } from "../helpers/http"
import { addComment, deleteComment, getComment, listComments } from "../models/commentModel"
import { getStory } from "../models/storyModel"

export const list = asyncHandler(async (req, res) => {
  const storyId = parseId(req.params.id, "story id")
  if (!(await getStory(storyId))) throw new HttpError(404, "Story not found.")
  res.json(await listComments(storyId))
})

export const add = asyncHandler(async (req, res) => {
  const storyId = parseId(req.params.id, "story id")
  if (!(await getStory(storyId))) throw new HttpError(404, "Story not found.")
  const body = field(req.body?.body, "Comment", 1, 2000)
  res.status(201).json(await addComment(storyId, req.userId!, body))
})

export const remove = asyncHandler(async (req, res) => {
  const comment = await getComment(parseId(req.params.id, "comment id"))
  if (!comment) throw new HttpError(404, "Comment not found.")
  if (comment.user_id !== req.userId && comment.story_author_id !== req.userId) {
    throw new HttpError(403, "Only the commenter or story author can delete this comment.")
  }
  await deleteComment(comment.id)
  res.status(204).end()
})
