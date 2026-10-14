import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  isAuthenticated: false,
  user: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginUser(state) {
      state.isAuthenticated = true
    },
    logoutUser(state) {
      state.isAuthenticated = false
      state.user = null
    },
    setUser(state, action) {
      state.user = action.payload
    },
  },
})

export const { loginUser, logoutUser, setUser } = authSlice.actions
export default authSlice.reducer
