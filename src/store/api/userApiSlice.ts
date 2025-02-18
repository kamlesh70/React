import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const userAPI = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: "http" }),
  reducerPath: "users",
  tagTypes: ["User"],
  endpoints: (builder) => ({
    getUser: builder.query({
      query: () => "users",
      providesTags: [{ type: "User", id: "USER" }],
    }),
  }),
});

export const { useGetUserQuery } = userAPI;