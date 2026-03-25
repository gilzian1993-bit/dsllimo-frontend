import { api } from "@/config/axios.config";
import { API_ROUTES } from "@/config/routes";
export interface ChildSeat {
    _id?: string;
    name: string;
    description?: string;
    price: number;
    isActive: boolean;
}

export interface BookingSettings {
    _id?: string;
    taxRate: number;
    gratuityRate: number;
    discounts: {
        signup: number;
        guest: number;
        returnTrip: {
            signup: number;
            guest: number;
        };
    };
    stopFee: { price: number; isActive: boolean };
    airportPickup: { price: number; isActive: boolean };
    outbound: {
        meetAndGreet: { price: number; isActive: boolean };
    };
    return: {
        meetAndGreet: { price: number; isActive: boolean };
    };
    childSeats: ChildSeat[];
}

export const getBookingSettings = async (): Promise<BookingSettings> => {
    const response = await api.get(API_ROUTES.BOOKING_SETTINGS);
    return response.data.data;
};

export const updateBookingSettings = async (data: Partial<BookingSettings>): Promise<BookingSettings> => {
    const response = await api.patch(API_ROUTES.BOOKING_SETTINGS, data);
    return response.data.data;
};
