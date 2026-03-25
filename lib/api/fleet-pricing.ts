import { api } from "@/config/axios.config";
import { API_ROUTES } from "@/config/routes";

export interface FleetPricing {
    _id: string;
    fleetId: string;
    minDistance: number;
    maxDistance: number | null;
    price: number;
    increasePercentage?: number;
    type: "fixed" | "per_km";
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface FleetPricingListResponse {
    data: FleetPricing[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
        pages: number;
    };
}

export const getFleetPricings = async (params?: Record<string, any>): Promise<FleetPricingListResponse> => {
    const response = await api.get<FleetPricingListResponse>(API_ROUTES.FLEET_PRICING, {
        params,
    });
    return response.data;
};

export const deleteFleetPricing = async (id: string): Promise<void> => {
    await api.delete(`${API_ROUTES.FLEET_PRICING}/${id}`);
};

export const createFleetPricing = async (data: any): Promise<any> => {
    const response = await api.post(API_ROUTES.FLEET_PRICING, data);
    return response.data;
};

export const updateFleetPricing = async (id: string, data: any): Promise<any> => {
    const response = await api.patch(`${API_ROUTES.FLEET_PRICING}/${id}`, data);
    return response.data;
};

export const deleteFleetPricings = async (ids: string[]): Promise<void> => {
    await api.post(`${API_ROUTES.FLEET_PRICING}/bulk-delete`, { ids });
};
