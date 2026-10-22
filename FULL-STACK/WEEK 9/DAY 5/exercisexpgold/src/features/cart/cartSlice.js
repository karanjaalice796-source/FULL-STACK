import { createSlice } from "@reduxjs/toolkit";

const products = [
  {
    id: "mug",
    name: "Sunday ceramic mug",
    category: "Home",
    price: 24,
    description: "A little extra room for slow mornings.",
    image:
      "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=900&q=85",
    tag: "Bestseller",
    color: "#e8dfd2",
  },
  {
    id: "candle",
    name: "Soft light candle",
    category: "Home",
    price: 18,
    description: "Cedarwood, orange peel & a deep breath.",
    image:
      "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=900&q=85",
    tag: "Made with care",
    color: "#e7dfd5",
  },
  {
    id: "journal",
    name: "The open-notes journal",
    category: "Desk",
    price: 16,
    description: "A lovely place for all the in-between thoughts.",
    image:
      "https://images.unsplash.com/photo-1531346878377-a5be20888e57?auto=format&fit=crop&w=900&q=85",
    tag: "Staff pick",
    color: "#e5e4d8",
  },
  {
    id: "lamp",
    name: "Little glow desk lamp",
    category: "Desk",
    price: 42,
    description: "Warm light for late-night good ideas.",
    image:
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=900&q=85",
    tag: "Just in",
    color: "#e7e1d5",
  },
  {
    id: "tote",
    name: "Everywhere canvas tote",
    category: "On the go",
    price: 22,
    description: "Room for the essentials and one more thing.",
    image:
      "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=900&q=85",
    tag: "Everyday favorite",
    color: "#e6e2d9",
  },
  {
    id: "bottle",
    name: "Daylight water bottle",
    category: "On the go",
    price: 28,
    description: "A gentle reminder to take a little pause.",
    image:
      "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=900&q=85",
    tag: "Good habit",
    color: "#dfe6e2",
  },
  {
    id: "throw",
    name: "Cloud-soft cotton throw",
    category: "Home",
    price: 58,
    description: "For couch naps, chilly mornings, and everything.",
    image:
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=900&q=85",
    tag: "A cozy one",
    color: "#e8dfd7",
  },
  {
    id: "headphones",
    name: "Quiet-hours headphones",
    category: "Desk",
    price: 64,
    description: "Make a little room to focus, wherever you are.",
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=85",
    tag: "Worth a listen",
    color: "#e1e2e4",
  },
];

const initialState = {
  products,
  items: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart(state, action) {
      const product = state.products.find((item) => item.id === action.payload);
      if (!product) return;

      const cartItem = state.items.find((item) => item.productId === product.id);
      if (cartItem) {
        cartItem.quantity += 1;
      } else {
        state.items.push({ productId: product.id, quantity: 1 });
      }
    },
    decreaseQuantity(state, action) {
      const cartItem = state.items.find((item) => item.productId === action.payload);
      if (!cartItem) return;

      if (cartItem.quantity === 1) {
        state.items = state.items.filter((item) => item.productId !== action.payload);
      } else {
        cartItem.quantity -= 1;
      }
    },
    removeFromCart(state, action) {
      state.items = state.items.filter((item) => item.productId !== action.payload);
    },
    clearCart(state) {
      state.items = [];
    },
  },
});

export const { addToCart, decreaseQuantity, removeFromCart, clearCart } =
  cartSlice.actions;
export default cartSlice.reducer;
