import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getFleetPricings, deleteFleetPricing, createFleetPricing, updateFleetPricing, deleteFleetPricings } from "@/lib/api/fleet-pricing";
import { toast } from "sonner";

export const useFleetPricings = (params?: Record<string, any>) => {
    return useQuery({
        queryKey: ["fleet-pricings", params],
        queryFn: () => getFleetPricings(params),
    });
};

export const useDeleteFleetPricing = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteFleetPricing,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["fleet-pricings"] });
            toast.success("Pricing deleted successfully");
        },
        onError: (error: any) => {
            toast.error(error.message || "Failed to delete pricing");
        },
    });
};

export const useCreateFleetPricing = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createFleetPricing,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["fleet-pricings"] });
            toast.success("Pricing created successfully");
        },
        onError: (error: any) => {
            toast.error(error.message || "Failed to create pricing");
        },
    });
};

export const useUpdateFleetPricing = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: any }) => updateFleetPricing(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["fleet-pricings"] });
            toast.success("Pricing updated successfully");
        },
        onError: (error: any) => {
            toast.error(error.message || "Failed to update pricing");
        },
    });
};
export const useDeleteFleetPricings = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteFleetPricings,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["fleet-pricings"] });
            toast.success("Pricings deleted successfully");
        },
        onError: (error: any) => {
            toast.error(error.message || "Failed to delete pricings");
        },
    });
};
