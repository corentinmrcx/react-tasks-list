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
  }),
});

export const { useGetAuthenticatedUserQuery } = api;
