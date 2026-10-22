import { asyncHandler, field, HttpError, isEmail, isUniqueViolation, parseId } from "../helpers/http"
import { addContributor, getContributor, listContributors, removeContributor } from "../models/contributorModel"
import { findUserByEmail, findUserById } from "../models/userModel"
import { getStory, getStoryAccess } from "../models/storyModel"

export const add = asyncHandler(async (req, res) => {
  const storyId = parseId(req.body?.story_id, "story id")
  const access = await getStoryAccess(storyId, req.userId!)
  if (!access) throw new HttpError(404, "Story not found.")
  if (!access.isAuthor) throw new HttpError(403, "Only the author can add contributors.")

  let userId: number
  if (req.body?.user_id !== undefined) {
    userId = parseId(req.body.user_id, "user id")
    if (!(await findUserById(userId))) throw new HttpError(404, "User not found.")
  } else if (req.body?.email !== undefined) {
    const email = field(req.body.email, "Email", 3, 100).toLowerCase()
    if (!isEmail(email)) throw new HttpError(400, "That doesn't look like a valid email address.")
    const user = await findUserByEmail(email)
    if (!user) throw new HttpError(404, "No account was found for that email.")
    userId = user.id
  } else {
    throw new HttpError(400, "Provide a user_id or email.")
  }
  if (userId === req.userId) throw new HttpError(400, "You are already the author of this story.")

  try {
    res.status(201).json(await addContributor(storyId, userId))
  } catch (err) {
    if (isUniqueViolation(err)) throw new HttpError(400, "That user is already a contributor.")
    throw err
  }
})

export const list = asyncHandler(async (req, res) => {
  const storyId = parseId(req.params.story_id, "story id")
  if (!(await getStory(storyId))) throw new HttpError(404, "Story not found.")
  res.json(await listContributors(storyId))
})

export const remove = asyncHandler(async (req, res) => {
  const contributor = await getContributor(parseId(req.params.id, "contributor id"))
  if (!contributor) throw new HttpError(404, "Contributor not found.")
  const access = await getStoryAccess(contributor.story_id, req.userId!)
  if (!access?.isAuthor) throw new HttpError(403, "Only the author can remove contributors.")
  await removeContributor(contributor.id)
  res.status(204).end()
})
