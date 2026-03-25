import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    getHourlyPricings,
    deleteHourlyPricing,
    createHourlyPricing,
    updateHourlyPricing,
    deleteHourlyPricings
} from "@/lib/api/hourly-pricing";
import { toast } from "sonner";
import { HourlyPackageQueryParams, HourlyPackageFormData } from "@/lib/types/hourly-package.types";

export const useHourlyPricings = (params?: HourlyPackageQueryParams) => {
    return useQuery({
        queryKey: ["hourly-pricings", params],
        queryFn: () => getHourlyPricings(params),
    });
};

export const useDeleteHourlyPricing = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteHourlyPricing,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["hourly-pricings"] });
            toast.success("Hourly pricing deleted successfully");
        },
        onError: (error: any) => {
            toast.error(error.message || "Failed to delete hourly pricing");
        },
    });
};

export const useCreateHourlyPricing = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createHourlyPricing,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["hourly-pricings"] });
            toast.success("Hourly pricing created successfully");
        },
        onError: (error: any) => {
            toast.error(error.message || "Failed to create hourly pricing");
        },
    });
};

export const useUpdateHourlyPricing = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<HourlyPackageFormData> }) =>
            updateHourlyPricing(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["hourly-pricings"] });
            toast.success("Hourly pricing updated successfully");
        },
        onError: (error: any) => {
            toast.error(error.message || "Failed to update hourly pricing");
        },
    });
};

export const useDeleteHourlyPricings = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteHourlyPricings,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["hourly-pricings"] });
            toast.success("Hourly pricings deleted successfully");
        },
        onError: (error: any) => {
            toast.error(error.message || "Failed to delete hourly pricings");
        },
    });
};
