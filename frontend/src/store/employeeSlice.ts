import { createSlice, PayloadAction } from "@reduxjs/toolkit";

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
}

const initialState: EmployeeState = {
  all: [],
  filtered: [],
  viewMode: "grid",
};

const employeeSlice = createSlice({
  name: "employees",
  initialState,
  reducers: {
    setEmployees(state, action: PayloadAction<Employee[]>) {
      state.all = action.payload;
      state.filtered = action.payload;
    },

    setFilteredEmployees(state, action: PayloadAction<Employee[]>) {
      state.filtered = action.payload;
    },

    resetEmployees(state) {
      state.filtered = state.all;
    },

    setViewMode(state, action: PayloadAction<"grid" | "list">) {
      state.viewMode = action.payload;
    },
  },
});

export const {
  setEmployees,
  setFilteredEmployees,
  resetEmployees,
  setViewMode,
} = employeeSlice.actions;

export default employeeSlice.reducer;
