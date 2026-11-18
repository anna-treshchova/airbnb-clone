import type { LoaderFunctionArgs } from 'react-router';

import { PAGE_SIZE } from '@/shared/config/pagination';
import { fetchCriticalData } from '@/shared/lib/critical-data';
import { removeEmptyFilters } from '@/shared/lib/query-args';

import { calcGuests, mapSearchParamsToFormState } from '@/entities/search';
import { hotelsApi, type HotelsQueryFilters, type GetHotelsQueryParams } from '@/entities/hotels';

import { store } from '../providers/StoreProvider';

export const hotelsLoader = async (
    { request }: LoaderFunctionArgs
): Promise<GetHotelsQueryParams> => {
    const url = new URL(request.url);

    const {
        destination,
        guestCategories,
        page
    } = mapSearchParamsToFormState(url.searchParams);

    const guests = calcGuests(guestCategories);

    const rawQueryArgs: HotelsQueryFilters = {
        page,
        limit: PAGE_SIZE,
        destinationId: destination.id,
        guests,
        pets: guestCategories.pets
    }

    const queryArgs = removeEmptyFilters(rawQueryArgs);

    await fetchCriticalData(
        store.dispatch,
        hotelsApi.endpoints.getHotels.initiate,
        queryArgs,
    )

    return queryArgs;
}