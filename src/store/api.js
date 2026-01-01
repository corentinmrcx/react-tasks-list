import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://iut-rcc-infoapi.univ-reims.fr/tasks/api',
  }),
  tagTypes: ['TaskLists', 'TaskListCollaborators'],
  endpoints: (build) => ({
    getAuthenticatedUser: build.query({
      query: () => '/me',
    }),
    getTaskLists: build.query({
      query: () => '/me/task_lists',
      providesTags: ['TaskLists'],
    }),
    getTaskList: build.query({
      query: (id) => `/task_lists/${id}`,
      providesTags: (result, error, id) => [{ type: 'TaskLists', id }],
    }),
    createTaskList: build.mutation({
      query: (taskList) => ({
        url: '/me/task_lists',
        method: 'POST',
        body: JSON.stringify(taskList),
        headers: {
          'Content-Type': 'application/ld+json',
        },
      }),
      invalidatesTags: ['TaskLists'],
    }),
    updateTaskList: build.mutation({
      query: ({ id, title }) => ({
          url: `/task_lists/${id}`,
          method: 'PATCH',
          body: JSON.stringify({ title }),
          headers: {
              'Content-Type': 'application/merge-patch+json'
          }
      }),
      invalidatesTags: ['TaskLists']
    }),
    deleteTaskList: build.mutation({
      query: (id) => ({
        url: `/task_lists/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['TaskLists'],
    }),
    getTaskListCollaborators: build.query({
      query: (id) => `/task_list/${id}/collaborators`,
      providesTags: (result, error, id) => [{ type: 'TaskListCollaborators', id }],
    }),
    getUsers: build.query({
      query: (page = 1) => `/users?page=${page}`,
    }),
    addCollaborator: build.mutation({
      query: ({ taskListId, userId }) => ({
        url: `/task_lists/${taskListId}/collaborators/${userId}`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, { taskListId }) => [{ type: 'TaskListCollaborators', id: taskListId }],
    }),
    removeCollaborator: build.mutation({
      query: ({ taskListId, userId }) => ({
        url: `/task_lists/${taskListId}/collaborators/${userId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, { taskListId }) => [{ type: 'TaskListCollaborators', id: taskListId }],
    }),
    authenticateUser: build.mutation({
       async queryFn({ login, password, remember = false, ttl = 30 }, queryApi, extraOptions, baseQuery) {
        const authResult = await baseQuery({
          url: `/auth?ttl=${ttl}&remember=${remember}`,
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
    }),
    logoutUser: build.mutation({
      async queryFn(arg, queryApi, extraOptions, baseQuery) {
        const logoutResult = await baseQuery({
          url: '/logout',
          method: 'POST',
        })

        if (logoutResult.error) return { error: logoutResult.error }
        queryApi.dispatch(api.util.resetApiState())

        return { data: logoutResult.data }
      }
    })
  })
});

export const { useGetAuthenticatedUserQuery, useGetTaskListsQuery, useGetTaskListQuery, useCreateTaskListMutation, useUpdateTaskListMutation, useDeleteTaskListMutation, useAuthenticateUserMutation, useLogoutUserMutation, useGetTaskListCollaboratorsQuery, useGetUsersQuery, useAddCollaboratorMutation, useRemoveCollaboratorMutation } = api;
