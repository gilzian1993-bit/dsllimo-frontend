import { api } from "@/config/axios.config";
import { API_ROUTES } from "@/config/routes";
import { FleetTableRow } from "../types/fleet.types";

export interface ExpressBooking {
    _id: string;
    bookingNumber: string;
    category: "one-way" | "hourly";
    customer?: string;
    vehicle: string | FleetTableRow;
    passengerDetails: {
        fullName: string;
        phone: string;
        email: string;
        state: string;
    };
    tripDetails: {
        pickupAddress: string;
        deliveryAddress: string;
        stops?: { address: string }[];
        distanceMiles?: number;
        pickupDate: string;
        pickupTime: string;
        passengers?: number;
        bags?: number;
        isReturn?: boolean;
        isAirportPickup?: boolean;
        isMeetGreet?: boolean;
        isReturnMeetGreet?: boolean;
        instructions?: string;
    };
    amount: number;
    pricingBreakdown?: Record<string, any>;
    paymentId?: string;
    status: "pending" | "confirmed" | "cancelled" | "completed";
    paymentStatus: "pending" | "paid" | "failed" | "refunded";
    createdAt: string;
    updatedAt: string;
}

export interface BookingListResponse {
    success: boolean;
    data: ExpressBooking[];
    meta?: {
        total: number;
        page: number;
        pages: number;
        limit: number;
    };
}

export const getBookings = async (params?: Record<string, any>): Promise<BookingListResponse> => {
    const response = await api.get<BookingListResponse>(API_ROUTES.BOOKINGS, {
        params,
    });
    return response.data;
};

export const deleteBooking = async (id: string): Promise<{ success: boolean; message: string }> => {
    const response = await api.delete(`${API_ROUTES.BOOKINGS}/${id}`);
    return response.data;
};

export const deleteBookings = async (ids: string[]): Promise<{ success: boolean; message: string }> => {
    const response = await api.post(`${API_ROUTES.BOOKINGS}/bulk-delete`, { ids });
    return response.data;
};

export const getBooking = async (id: string): Promise<{ success: boolean; data: ExpressBooking }> => {
    const response = await api.get<{ success: boolean; data: ExpressBooking }>(`${API_ROUTES.BOOKINGS}/${id}`);
    return response.data;
};
