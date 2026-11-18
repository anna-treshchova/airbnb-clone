import { baseApi, API_ENDPOINTS } from '@/shared/api';
import { saveToStorage, removeFromStorage } from '@/shared/lib/local-storage';

interface SendCodeResponse {
    verification: {
        email: string;
        expiresInMs: number;
    }
    retryAfterMs: number;
}

interface VerifyCodeRequest {
    email: string;
    code: string;
}

interface VerifyCodeResponse {
    accessToken: string;
}

export const authApi = baseApi.injectEndpoints({
   endpoints: (builder) => ({
       sendCode: builder.mutation<SendCodeResponse, string>({
           query: (email) => {
               const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
               const is12Hour = !!new Date().toLocaleString().match(/am|pm/i);

               return {
                   url: API_ENDPOINTS.auth.sendCode,
                   method: 'POST',
                   body: {
                       email,
                       timezone,
                       is12Hour,
                   }
               }
           },
       }),
       verifyCode: builder.mutation<VerifyCodeResponse, VerifyCodeRequest>({
           query: (body) => ({
               url: API_ENDPOINTS.auth.verifyCode,
               method: 'POST',
               body,
           }),

           invalidatesTags: (_result, error) =>
               error ? [] : ['Hotels', 'HotelDetails'],

           async onQueryStarted (_arg, { queryFulfilled }) {
               try {
                   const { data } = await queryFulfilled;
                   saveToStorage('access_token', data.accessToken);
               } catch {
                   // Handled globally / via Redux slice
               }
           }
       }),
       logout: builder.mutation<void, void>({
           query: () => ({
               url: API_ENDPOINTS.auth.logout,
               method: 'POST',
           }),
           async onQueryStarted (_arg, { queryFulfilled, dispatch }) {
               try {
                   await queryFulfilled;
               } catch {
                   // Ignore server error, log out locally regardless
               }

               removeFromStorage(['access_token', 'recent_search']);
               dispatch(baseApi.util.resetApiState())
           }
       })
   })
})

export const {
    useSendCodeMutation,
    useVerifyCodeMutation,
    useLogoutMutation
} = authApi;