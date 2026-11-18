import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
const BASE_URL = import.meta.env.VITE_BASE_URL;
import { removeFromStorage } from '../lib/local-storage';

interface StateWithAuth {
    auth: {
        accessToken: string | null;
    }
}

const baseQuery = fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers, { getState }) => {
        const state = getState() as StateWithAuth;
        const token = state.auth.accessToken;

        if (token) {
            headers.set('Authorization', `Bearer ${token}`);
        }
        return headers;
    }
})

const baseQueryWishAuth: typeof baseQuery = async (arg, api, extraOptions) => {
    const result = await baseQuery(arg, api, extraOptions);

    if (result.error?.status === 401) {
        removeFromStorage(['access_token', 'recent_search']);
        api.dispatch(baseApi.util.resetApiState())
    }
    return result;
}

export const baseApi = createApi({
    reducerPath: 'api',
    baseQuery: baseQueryWishAuth,
    tagTypes: ['Hotels', 'HotelDetails'],
    endpoints: () => ({}),
})