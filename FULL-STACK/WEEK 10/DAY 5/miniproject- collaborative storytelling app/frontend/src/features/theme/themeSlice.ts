import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { AppThunk } from "../../app/store"

export type ThemeMode = "dark" | "light"
const KEY = "inkwell-theme"

function readStored(): ThemeMode {
  try {
    return localStorage.getItem(KEY) === "light" ? "light" : "dark"
  } catch {
    return "dark"
  }
}

const themeSlice = createSlice({
  name: "theme",
  initialState: { mode: readStored() } as { mode: ThemeMode },
  reducers: {
    setMode(state, action: PayloadAction<ThemeMode>) {
      state.mode = action.payload
    },
  },
})

export const toggleTheme = (): AppThunk => (dispatch, getState) => {
  const next: ThemeMode = getState().theme.mode === "dark" ? "light" : "dark"
  dispatch(themeSlice.actions.setMode(next))
  document.documentElement.dataset.theme = next
  try {
    localStorage.setItem(KEY, next)
  } catch {
    // The current session still updates even if browser storage is unavailable.
  }
}

export default themeSlice.reducer
