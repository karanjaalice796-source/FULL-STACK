import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { AuthResponse, User } from "@shared"
import { request } from "../../app/api"

interface AuthState {
  user: User | null
  accessToken: string | null
  bootstrapped: boolean
  busy: boolean
  error: string | null
}

const initialState: AuthState = { user: null, accessToken: null, bootstrapped: false, busy: false, error: null }
const messageOf = (error: unknown) => (error instanceof Error ? error.message : "Something went wrong.")

export const restoreSession = createAsyncThunk("auth/restore", () =>
  request<AuthResponse>("/refresh", { method: "POST", auth: false }),
)

export const login = createAsyncThunk<AuthResponse, { email: string; password: string }, { rejectValue: string }>(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      return await request<AuthResponse>("/login", { method: "POST", body: credentials, auth: false })
    } catch (error) {
      return rejectWithValue(messageOf(error))
    }
  },
)

export const register = createAsyncThunk<
  AuthResponse,
  { username: string; email: string; password: string },
  { rejectValue: string }
>("auth/register", async (details, { rejectWithValue }) => {
  try {
    return await request<AuthResponse>("/register", { method: "POST", body: details, auth: false })
  } catch (error) {
    return rejectWithValue(messageOf(error))
  }
})

export const logout = createAsyncThunk("auth/logout", async () => {
  await request<void>("/logout", { method: "POST", auth: false })
})

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setSession(state, action: PayloadAction<AuthResponse>) {
      state.user = action.payload.user
      state.accessToken = action.payload.accessToken
    },
    clearSession(state) {
      state.user = null
      state.accessToken = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(restoreSession.fulfilled, (state, { payload }) => {
        state.user = payload.user
        state.accessToken = payload.accessToken
        state.bootstrapped = true
      })
      .addCase(restoreSession.rejected, (state) => {
        state.bootstrapped = true
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null
        state.accessToken = null
      })
      .addCase(logout.rejected, (state) => {
        state.user = null
        state.accessToken = null
      })

    for (const thunk of [login, register]) {
      builder
        .addCase(thunk.pending, (state) => {
          state.busy = true
          state.error = null
        })
        .addCase(thunk.fulfilled, (state, { payload }) => {
          state.busy = false
          state.user = payload.user
          state.accessToken = payload.accessToken
        })
        .addCase(thunk.rejected, (state, { payload }) => {
          state.busy = false
          state.error = payload ?? "Something went wrong."
        })
    }
  },
})

export const { setSession, clearSession } = authSlice.actions
export default authSlice.reducer
