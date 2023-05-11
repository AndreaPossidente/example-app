import { createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
import { decodeToken } from "react-jwt";
export interface AuthState {
  user: Session | null;
}

const getUser = () => {
  const token = Cookies.get("jwt");
  if (token) {
    const user: Session | null = decodeToken(token);
    return user;
  }
};

const initialState: AuthState = {
  user: getUser() || null,
};

export const authSlice = createSlice({
  name: "counter",
  initialState,
  reducers: {
    refresh: (state) => {
      state.user = getUser() || null;
    },
    reset: (state) => {
      state.user = null;
    },
  },
});

// Action creators are generated for each case reducer function
export const { refresh, reset } = authSlice.actions;

export default authSlice.reducer;
