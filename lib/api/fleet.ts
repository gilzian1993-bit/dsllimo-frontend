import { api } from "@/config/axios.config";
import API_ROUTES from "@/config/routes";
import { FleetListResponse } from "@/lib/types/fleet.types";

export const getFleets = async (params?: Record<string, any>): Promise<FleetListResponse> => {
    const response = await api.get<FleetListResponse>(API_ROUTES.FLEET, {
        params,
    });
    return response.data;
};
export const deleteFleet = async (id: string): Promise<void> => {
    await api.delete(`${API_ROUTES.FLEET}/${id}`);
};
export const deleteFleets = async (ids: string[]): Promise<void> => {
    await api.delete(API_ROUTES.FLEET + "/bulk", { data: { ids } });
};
export const createFleet = async (data: any): Promise<any> => {
    const response = await api.post(API_ROUTES.FLEET, data);
    return response.data;
};

export const updateFleet = async (id: string, data: any): Promise<any> => {
    const response = await api.put(`${API_ROUTES.FLEET}/${id}`, data);
    return response.data;
};

export const reorderFleets = async (ids: string[]): Promise<void> => {
    await api.put(`${API_ROUTES.FLEET}/reorder`, { ids });
};
