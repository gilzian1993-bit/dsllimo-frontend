// API Routes
export const API_ROUTES = {
    AUTH_LOGIN: `/api/auth/admin/login`,
    AUTH_LOGOUT: `/api/auth/logout`,
    AUTH_ME: `/api/auth/me`,
    AUTH_REFRESH: `/api/auth/refresh`,
    UPLOAD_IMAGE: `/api/upload`,
    FLEET: `/api/fleets`,
    FLEET_PRICING: `/api/fleet-pricings`,
    HOURLY_PRICING: `/api/hourly-pricings`,
    BOOKINGS: `/api/bookings`,
    BOOKING_SETTINGS: `/api/settings/booking`,
    USERS: `/api/admin/users`,
    DASHBOARD_OVERVIEW: `/api/dashboard/overview`,
} as const;

// Dashboard Frontend Routes
export const DASHBOARD_ROUTES = {
    DASHBOARD: `/dashboard`,
    FLEETS: `/fleets`,
    FLEET_PRICING: `/fleet-pricing`,
    FLEET_PRICING_DETAILS: (id: string) => `/fleet-pricing/${id}`,
    BOOKINGS: `/bookings`,
    USERS: `/users`,
    SETTINGS_BOOKING: `/settings/booking`,
} as const;

export default API_ROUTES;

