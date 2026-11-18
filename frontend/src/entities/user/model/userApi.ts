import { baseApi, API_ENDPOINTS } from '@/shared/api';

export interface User {
    id: string;
    email: string;
    name: null | string;
    role: 'user' | 'admin';
    createdAt: string;
}

interface FetchMeResponse {
    me: User
}

export const userApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        fetchMe: builder.query<FetchMeResponse, void>({
            query: () => API_ENDPOINTS.users.me
        })
    })
})

export const { useFetchMeQuery } = userApi;
