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
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:3000" }),
  tagTypes: ["Users"],
  endpoints: (builder) => ({
    getUsers: builder.query<User[], void>({
      query: () => "/user",
      providesTags: ["Users"],
    }),

    getUserById: builder.query<User, string>({
      query: (id) => `/user/${id}`,
    }),

    updateUser: builder.mutation<User, { id: string; payload: Partial<User> }>({
      query: ({ id, payload }) => ({
        url: `/user/${id}`,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: ["Users"],
    }),
  }),
});

export const { useGetUserByIdQuery, useUpdateUserMutation, useGetUsersQuery } =
  userApi;
