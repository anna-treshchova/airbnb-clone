import { setupListeners } from '@reduxjs/toolkit/query';
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { baseApi } from '@/shared/api';
import { authReducer } from '@/features/auth';

const appReducer = combineReducers({
    auth: authReducer,
    [baseApi.reducerPath]: baseApi.reducer,
})

export const store = configureStore({
   reducer: appReducer,
   middleware: (getDefaultMiddleware) =>
       getDefaultMiddleware().concat(baseApi.middleware)
})

export type AppDispatch = typeof store.dispatch;

setupListeners(store.dispatch);