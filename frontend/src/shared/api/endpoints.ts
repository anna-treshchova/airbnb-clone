export const API_ENDPOINTS = {
    destinations: '/destinations',
    hotels: '/hotels',
    auth: {
        sendCode: '/auth/send-code',
        verifyCode: '/auth/verify-code',
        logout: '/auth/logout',
    },
    users: {
        me: '/users/me',
    },
    wishlist: '/wishlist',
} as const;