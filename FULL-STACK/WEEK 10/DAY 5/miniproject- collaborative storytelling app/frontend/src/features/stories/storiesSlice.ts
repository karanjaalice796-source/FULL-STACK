import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { Contributor, Story, StoryComment, StoryVersion } from "@shared"
import { request } from "../../app/api"

export interface StoryInput {
  title: string
  content: string
}

export interface Draft extends StoryInput {
  id: number
}

interface StoriesState {
  items: Story[]
  listStatus: "idle" | "loading" | "ready" | "failed"
  comments: StoryComment[]
  versions: StoryVersion[]
  draft: Draft | null
  saving: boolean
  error: string | null
}

const initialState: StoriesState = {
  items: [],
  listStatus: "idle",
  comments: [],
  versions: [],
  draft: null,
  saving: false,
  error: null,
}

function thunk<Arg, Ret>(type: string, run: (arg: Arg) => Promise<Ret>) {
  return createAsyncThunk<Ret, Arg, { rejectValue: string }>(type, async (arg, { rejectWithValue }) => {
    try {
      return await run(arg)
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Something went wrong.")
    }
  })
}

export const fetchStories = thunk<void, Story[]>("stories/fetchAll", () => request<Story[]>("/stories"))

export const fetchStory = thunk<number, { story: Story; comments: StoryComment[]; versions: StoryVersion[] }>(
  "stories/fetchOne",
  async (id) => {
    const [story, comments, versions] = await Promise.all([
      request<Story>(`/stories/${id}`),
      request<StoryComment[]>(`/stories/${id}/comments`),
      request<StoryVersion[]>(`/stories/${id}/versions`),
    ])
    return { story, comments, versions }
  },
)

export const createStory = thunk<StoryInput, Story>("stories/create", (input) =>
  request<Story>("/stories", { method: "POST", body: input }),
)

export const saveStory = thunk<Draft, { story: Story; versions: StoryVersion[] }>("stories/save", async (draft) => {
  const story = await request<Story>(`/stories/${draft.id}`, {
    method: "PATCH",
    body: { title: draft.title, content: draft.content },
  })
  const versions = await request<StoryVersion[]>(`/stories/${draft.id}/versions`)
  return { story, versions }
})

export const deleteStory = thunk<number, number>("stories/delete", async (id) => {
  await request<void>(`/stories/${id}`, { method: "DELETE" })
  return id
})

export const addContributor = thunk<{ storyId: number; email: string }, Contributor>(
  "stories/addContributor",
  ({ storyId, email }) => request<Contributor>("/contributors", { method: "POST", body: { story_id: storyId, email } }),
)

export const removeContributor = thunk<{ storyId: number; id: number }, number>(
  "stories/removeContributor",
  async ({ id }) => {
    await request<void>(`/contributors/${id}`, { method: "DELETE" })
    return id
  },
)

export const postComment = thunk<{ storyId: number; body: string }, StoryComment>(
  "stories/postComment",
  ({ storyId, body }) => request<StoryComment>(`/stories/${storyId}/comments`, { method: "POST", body: { body } }),
)

export const removeComment = thunk<number, number>("stories/removeComment", async (id) => {
  await request<void>(`/comments/${id}`, { method: "DELETE" })
  return id
})

function upsert(items: Story[], story: Story) {
  const index = items.findIndex((item) => item.id === story.id)
  if (index >= 0) items[index] = story
  else items.unshift(story)
}

const storiesSlice = createSlice({
  name: "stories",
  initialState,
  reducers: {
    startEditing(state, action: PayloadAction<Story>) {
      const { id, title, content } = action.payload
      state.draft = { id, title, content }
      state.error = null
    },
    setDraftField(state, action: PayloadAction<{ field: keyof StoryInput; value: string }>) {
      if (state.draft) state.draft[action.payload.field] = action.payload.value
    },
    discardDraft(state) {
      state.draft = null
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStories.pending, (state) => {
        state.listStatus = "loading"
        state.error = null
      })
      .addCase(fetchStories.fulfilled, (state, { payload }) => {
        state.items = payload
        state.listStatus = "ready"
      })
      .addCase(fetchStories.rejected, (state, { payload }) => {
        state.listStatus = "failed"
        state.error = payload ?? "Couldn't load stories."
      })
      .addCase(fetchStory.pending, (state, { meta }) => {
        if (state.comments[0] && state.comments[0].story_id !== meta.arg) state.comments = []
        state.versions = []
        state.error = null
      })
      .addCase(fetchStory.fulfilled, (state, { payload }) => {
        upsert(state.items, payload.story)
        state.comments = payload.comments
        state.versions = payload.versions
      })
      .addCase(fetchStory.rejected, (state, { payload }) => {
        state.error = payload ?? "Couldn't load this story."
      })
      .addCase(createStory.fulfilled, (state, { payload }) => {
        upsert(state.items, payload)
      })
      .addCase(saveStory.pending, (state) => {
        state.saving = true
        state.error = null
      })
      .addCase(saveStory.fulfilled, (state, { payload }) => {
        state.saving = false
        state.draft = null
        upsert(state.items, payload.story)
        state.versions = payload.versions
      })
      .addCase(saveStory.rejected, (state, { payload }) => {
        state.saving = false
        state.error = payload ?? "Couldn't save your changes."
      })
      .addCase(deleteStory.fulfilled, (state, { payload }) => {
        state.items = state.items.filter((story) => story.id !== payload)
        state.draft = null
      })
      .addCase(addContributor.fulfilled, (state, { payload, meta }) => {
        const story = state.items.find((item) => item.id === meta.arg.storyId)
        if (story && !story.contributors.some((person) => person.id === payload.id)) story.contributors.push(payload)
      })
      .addCase(removeContributor.fulfilled, (state, { meta }) => {
        const story = state.items.find((item) => item.id === meta.arg.storyId)
        if (story) story.contributors = story.contributors.filter((person) => person.id !== meta.arg.id)
      })
      .addCase(postComment.fulfilled, (state, { payload, meta }) => {
        state.comments.push(payload)
        const story = state.items.find((item) => item.id === meta.arg.storyId)
        if (story) story.comment_count += 1
      })
      .addCase(removeComment.fulfilled, (state, { payload }) => {
        const removed = state.comments.find((comment) => comment.id === payload)
        state.comments = state.comments.filter((comment) => comment.id !== payload)
        const story = removed && state.items.find((item) => item.id === removed.story_id)
        if (story) story.comment_count = Math.max(0, story.comment_count - 1)
      })
  },
})

export const { startEditing, setDraftField, discardDraft } = storiesSlice.actions
export default storiesSlice.reducer
