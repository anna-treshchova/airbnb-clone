 import { transformToErrorResponse } from './error-response';

import type {
    ThunkDispatch,
    ThunkAction,
    UnknownAction
} from '@reduxjs/toolkit';

import type { QueryActionCreatorResult } from '@reduxjs/toolkit/query';

type QueryThunk = ThunkAction<
    QueryActionCreatorResult<any>,
    any,
    unknown,
    UnknownAction
>;

export const fetchCriticalData = async <TArgs>(
    dispatch: ThunkDispatch<any, unknown, UnknownAction>,
    thunkActionCreator: (args: TArgs) => QueryThunk,
    args: TArgs,
): Promise<void> => {
    const promise = dispatch(thunkActionCreator(args));

    try {
        await promise.unwrap();
    } catch (err) {
        throw transformToErrorResponse(err);
    } finally {
        promise.unsubscribe();
    }
}