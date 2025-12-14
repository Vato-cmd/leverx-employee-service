import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

export interface Employee {
  id: string;
  first_name: string;
  last_name: string;
  department: string;
  building: string;
  room: string;
  phone: string;
  email: string;
  viber: string;
  user_avatar: string;
  isRemoteWork: boolean;
}

interface EmployeeState {
  all: Employee[];
  filtered: Employee[];
  viewMode: "grid" | "list";
  loading: boolean;
  error: string | null;
}

const initialState: EmployeeState = {
  all: [],
  filtered: [],
  viewMode: "grid",
  loading: false,
  error: null,
};

export const fetchEmployees = createAsyncThunk(
  "employees/fetchEmployees",
  async () => {
    const res = await fetch("http://localhost:3000/user");
    if (!res.ok) throw new Error("Failed to fetch employees");
    return (await res.json()) as Employee[];
  }
);

const employeeSlice = createSlice({
  name: "employees",
  initialState,
  reducers: {
    setFilteredEmployees(state, action: PayloadAction<Employee[]>) {
      state.filtered = action.payload;
    },
    setViewMode(state, action: PayloadAction<"grid" | "list">) {
      state.viewMode = action.payload;
    },
    resetEmployees(state) {
      state.filtered = state.all;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEmployees.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmployees.fulfilled, (state, action) => {
        state.loading = false;
        state.all = action.payload;
        state.filtered = action.payload;
      })
      .addCase(fetchEmployees.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Error";
      });
  },
});

export const { setFilteredEmployees, setViewMode, resetEmployees } =
  employeeSlice.actions;

export default employeeSlice.reducer;
