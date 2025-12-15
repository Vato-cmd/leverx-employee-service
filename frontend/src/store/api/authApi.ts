import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface SignInRequest {
  email: string;
  password: string;
}

export interface SignUpRequest {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
}

export interface AuthUser {
  id: string;
  first_name: string;
  last_name: string;
  role: "Admin" | "HR" | "Employee";
  user_avatar: string;
}

export interface SignInResponse {
  user: AuthUser;
}

export interface SignUpResponse {
  message: string;
}

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:3000",
  }),
  endpoints: (builder) => ({
    signIn: builder.mutation<SignInResponse, SignInRequest>({
      query: (body) => ({
        url: "/sign-in",
        method: "POST",
        body,
      }),
    }),

    signUp: builder.mutation<SignUpResponse, SignUpRequest>({
      query: (body) => ({
        url: "/sign-up",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const { useSignInMutation, useSignUpMutation } = authApi;
