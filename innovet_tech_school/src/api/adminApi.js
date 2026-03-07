import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const adminApi = createApi({
  reducerPath: 'adminApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: '/api/admin/',
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;
      if (token) headers.set('authorization', `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ['Stats', 'Users', 'Logs'],
  endpoints: (builder) => ({
    getDashboardStats: builder.query({
      query: () => 'stats/',
      providesTags: ['Stats'],
    }),
    getUsers: builder.query({
      query: (role) => `users/?role=${role}`,
      providesTags: ['Users'],
    }),
    getSystemLogs: builder.query({
      query: () => 'logs/',
      providesTags: ['Logs'],
      pollingInterval: 30000, 
    }),
  }),
});

export const { useGetDashboardStatsQuery, useGetUsersQuery, useGetSystemLogsQuery } = adminApi;