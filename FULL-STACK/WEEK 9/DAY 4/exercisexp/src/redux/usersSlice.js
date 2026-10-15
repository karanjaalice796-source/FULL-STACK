import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

export const fetchUser = createAsyncThunk(
  'users/fetchUser',
  async (userId, { rejectWithValue, signal }) => {
    const response = await fetch(
      `https://jsonplaceholder.typicode.com/users/${userId}`,
      { signal },
    )

    if (!response.ok) {
      return rejectWithValue(
        `The user could not be found (HTTP ${response.status}). Try another ID.`,
      )
    }

    return response.json()
  },
)

const usersSlice = createSlice({
  name: 'users',
  initialState: {
    user: null,
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.user = action.payload
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.status = 'failed'
        state.error =
          action.payload ??
          action.error.message ??
          'Something went wrong while fetching the user.'
      })
  },
})

export default usersSlice.reducer
