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
    getTaskLists: build.query({
      query: () => '/me/task_lists',
    }),
    authenticateUser: build.mutation({
       async queryFn({ login, password, remember, ttl = 30 }, queryApi, extraOptions, baseQuery) {
        const authResult = await baseQuery({
          url: `/auth?ttl=${ttl}`,
          method: 'POST',
          body: { login, password, remember },
          headers: {
            'Content-Type': 'application/json',
          },
        })

        if (authResult.error) {
          return { error: authResult.error }
        }

        queryApi.dispatch(api.endpoints.getAuthenticatedUser.initiate())

        return { data: authResult.data }
      }
    })
  })
});

export const { useGetAuthenticatedUserQuery, useGetTaskListsQuery, useAuthenticateUserMutation } = api;
