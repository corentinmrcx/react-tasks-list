import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://iut-rcc-infoapi.univ-reims.fr/tasks/api',
  }),
  endpoints: (build) => ({
    getAuthenticatedUser: build.query({
      query: () => '/me',
    }),
    authenticateUser: build.mutation({
      query: ({ login, password, remember }) => ({
        url: '/auth',
        method: 'POST',
        body: { login, password, remember },
        headers: {
          'Content-Type': 'application/json',
        },
      }),
    }),
  }),
});

export const { useGetAuthenticatedUserQuery, useAuthenticateUserMutation } = api;
