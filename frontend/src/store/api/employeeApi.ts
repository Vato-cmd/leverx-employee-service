import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

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

export const employeeApi = createApi({
  reducerPath: "employeeApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL,
  }),
  tagTypes: ["Employee"],
  endpoints: (builder) => ({
    getEmployees: builder.query<Employee[], void>({
      query: () => "/user",
      providesTags: ["Employee"],
    }),
  }),
});

export const { useGetEmployeesQuery } = employeeApi;
