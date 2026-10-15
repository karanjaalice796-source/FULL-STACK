import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (_, { rejectWithValue, signal }) => {
    const response = await fetch('https://fakestoreapi.com/products', { signal })
    if (!response.ok) {
      return rejectWithValue(
        `Products could not be loaded (HTTP ${response.status}). Please try again.`,
      )
    }

    return response.json()
  },
)

const productSlice = createSlice({
  name: 'products',
  initialState: {
    items: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.items = action.payload
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'failed'
        state.error =
          action.payload ??
          action.error.message ??
          'Something went wrong while loading products.'
      })
  },
})

export default productSlice.reducer
