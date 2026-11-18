import { useCallback } from 'react';
import { useSelector } from 'react-redux';

import { useUIStore, selectUIActions } from '@/shared/model/uiStore';

import { useFetchMeQuery } from '@/entities/user';

import { selectHasToken } from '../model';

export type CheckAuth = () => boolean;

export const useRequireAuth = (): CheckAuth => {
    const hasToken = useSelector(selectHasToken);

    const { openAuthModal } = useUIStore(selectUIActions);

    const {
        currentData: { me } = {},
        isLoading
    } = useFetchMeQuery(undefined, { skip: !hasToken });

   return useCallback(() => {
        if (isLoading) {
            return false;
        }

        if(!me) {
            openAuthModal()
            return false;
        }

        return true;
   }, [isLoading, me, openAuthModal])
}