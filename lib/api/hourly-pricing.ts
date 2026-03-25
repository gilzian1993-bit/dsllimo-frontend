import { api } from "@/config/axios.config";
import { API_ROUTES } from "@/config/routes";
import {
    HourlyPackage,
    HourlyPackageResponse,
    HourlyPackageQueryParams,
    HourlyPackageFormData
} from "../types/hourly-package.types";

export const getHourlyPricings = async (params?: HourlyPackageQueryParams): Promise<HourlyPackageResponse> => {
    const response = await api.get(API_ROUTES.HOURLY_PRICING, { params });
    return {
        success: true,
        packages: response.data.data,
        total: response.data.meta.total,
        page: response.data.meta.page,
        pages: response.data.meta.totalPages || response.data.meta.pages,
    };
};

export const getHourlyPricing = async (id: string): Promise<HourlyPackage> => {
    const response = await api.get(`${API_ROUTES.HOURLY_PRICING}/${id}`);
    return response.data.data;
};

export const createHourlyPricing = async (data: HourlyPackageFormData): Promise<HourlyPackage> => {
    const response = await api.post(API_ROUTES.HOURLY_PRICING, data);
    return response.data.data;
};

export const updateHourlyPricing = async (id: string, data: Partial<HourlyPackageFormData>): Promise<HourlyPackage> => {
    const response = await api.patch(`${API_ROUTES.HOURLY_PRICING}/${id}`, data);
    return response.data.data;
};

export const deleteHourlyPricing = async (id: string): Promise<void> => {
    await api.delete(`${API_ROUTES.HOURLY_PRICING}/${id}`);
};

export const deleteHourlyPricings = async (ids: string[]): Promise<void> => {
    await api.post(`${API_ROUTES.HOURLY_PRICING}/bulk-delete`, { ids });
};
