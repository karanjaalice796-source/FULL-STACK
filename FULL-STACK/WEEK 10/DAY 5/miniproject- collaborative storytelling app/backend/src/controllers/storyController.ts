import { asyncHandler, field, HttpError, parseId } from "../helpers/http"
import { createStory, deleteStory, getStory, listStories, listVersions, updateStory } from "../models/storyModel"

const MAX_TITLE = 255
const MAX_TEXT = 20000

export const list = asyncHandler(async (_req, res) => {
  res.json(await listStories())
})

export const show = asyncHandler(async (req, res) => {
  const story = await getStory(parseId(req.params.id, "story id"))
  if (!story) throw new HttpError(404, "Story not found.")
  res.json(story)
})

export const create = asyncHandler(async (req, res) => {
  const title = field(req.body?.title, "Title", 1, MAX_TITLE)
  const content = field(req.body?.content, "Story text", 1, MAX_TEXT)
  res.status(201).json(await createStory(req.userId!, title, content))
})

export const update = asyncHandler(async (req, res) => {
  const id = parseId(req.params.id, "story id")
  const body = req.body ?? {}
  if (body.title === undefined && body.content === undefined) throw new HttpError(400, "Nothing to update.")

  const existing = await getStory(id)
  if (!existing) throw new HttpError(404, "Story not found.")
  const title = body.title !== undefined ? field(body.title, "Title", 1, MAX_TITLE) : existing.title
  const content = body.content !== undefined ? field(body.content, "Story text", 1, MAX_TEXT) : existing.content
  res.json(await updateStory(id, req.userId!, title, content))
})

export const remove = asyncHandler(async (req, res) => {
  await deleteStory(parseId(req.params.id, "story id"))
  res.status(204).end()
})

export const versions = asyncHandler(async (req, res) => {
  const id = parseId(req.params.id, "story id")
  if (!(await getStory(id))) throw new HttpError(404, "Story not found.")
  res.json(await listVersions(id))
})
