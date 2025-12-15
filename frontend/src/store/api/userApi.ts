import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface DateBirth {
  day: string;
  month: string;
  year: string;
}

export interface Manager {
  id: string;
  first_name: string;
  last_name: string;
}

export interface Visa {
  type: string;
}

export interface User {
  id: string;
  role: "Admin" | "HR" | "Employee";
  first_name: string;
  middle_name?: string;
  last_name: string;
  email: string;
  phone: string;
  viber: string;
  cnumber: string;
  citizenship: string;
  department: string;
  building: string;
  room: string;
  desk_number: number;
  isRemoteWork: boolean;
  user_avatar: string;
  date_birth: DateBirth;
  manager: Manager;
  visa: Visa[];
}

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:3000",
  }),
  tagTypes: ["User"],
  endpoints: (builder) => ({
    getUserById: builder.query<User, string>({
      query: (id) => `/user/${id}`,
      providesTags: (result, error, id) => [{ type: "User", id }],
    }),

    updateUser: builder.mutation<User, { id: string; payload: Partial<User> }>({
      query: ({ id, payload }) => ({
        url: `/user/${id}`,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "User", id }],
    }),
  }),
});

export const { useGetUserByIdQuery, useUpdateUserMutation } = userApi;
