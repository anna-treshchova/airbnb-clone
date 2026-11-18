import { baseApi, API_ENDPOINTS } from '@/shared/api';
import type { Destination, DestinationsResponse } from './types';

export const destinationsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getDestinations: builder.query<Destination[], void>({
            query: () => API_ENDPOINTS.destinations,
            keepUnusedDataFor: Infinity,
            transformResponse: (response: DestinationsResponse) => response.destinations ?? [],
        })
    })
})

export const { useGetDestinationsQuery } = destinationsApi;
