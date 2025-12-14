import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { Employee } from "../types/employee";

interface UserState {
  data: Employee | null;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  data: null,
  loading: false,
  error: null,
};

export const fetchUserById = createAsyncThunk<Employee, string>(
  "user/fetchById",
  async (id) => {
    const res = await fetch(`http://localhost:3000/user/${id}`);
    if (!res.ok) throw new Error("User not found");
    return await res.json();
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    clearUser(state) {
      state.data = null;
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Error";
      });
  },
});

export const { clearUser } = userSlice.actions;
export default userSlice.reducer;
