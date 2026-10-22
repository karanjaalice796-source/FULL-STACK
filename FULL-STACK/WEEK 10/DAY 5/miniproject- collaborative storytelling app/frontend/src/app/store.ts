import { configureStore, type ThunkAction, type UnknownAction } from "@reduxjs/toolkit"
import authReducer, { clearSession, setSession } from "../features/auth/authSlice"
import storiesReducer from "../features/stories/storiesSlice"
import themeReducer from "../features/theme/themeSlice"
import { bindApi } from "./api"

export const store = configureStore({
  reducer: {
    auth: authReducer,
    stories: storiesReducer,
    theme: themeReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export type AppThunk = ThunkAction<void, RootState, unknown, UnknownAction>

bindApi({
  getToken: () => store.getState().auth.accessToken,
  setSession: (session) => store.dispatch(setSession(session)),
  onAuthFail: () => store.dispatch(clearSession()),
})
