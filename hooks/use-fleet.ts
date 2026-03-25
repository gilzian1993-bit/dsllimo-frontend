import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getFleets, deleteFleet, createFleet, deleteFleets, updateFleet, reorderFleets } from "@/lib/api/fleet";
import { toast } from "sonner";

export const useFleets = (params?: Record<string, any>) => {
    return useQuery({
        queryKey: ["fleets", params],
        queryFn: () => getFleets(params),
    });
};

export const useDeleteFleet = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteFleet,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["fleets"] });
            toast.success("Fleet deleted successfully");
        },
        onError: (error: any) => {
            toast.error(error.message || "Failed to delete fleet");
        },
    });
};

export const useBulkDeleteFleets = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteFleets,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["fleets"] });
            toast.success("Fleets deleted successfully");
        },
        onError: (error: any) => {
            toast.error(error.message || "Failed to delete fleets");
        },
    });
};

export const useCreateFleet = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createFleet,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["fleets"] });
            toast.success("Fleet created successfully");
        },
        onError: (error: any) => {
            toast.error(error.message || "Failed to create fleet");
        },
    });
};

export const useUpdateFleet = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: any }) => updateFleet(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["fleets"] });
            toast.success("Fleet updated successfully");
        },
        onError: (error: any) => {
            toast.error(error.message || "Failed to update fleet");
        },
    });
};

export const useReorderFleets = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: reorderFleets,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["fleets"] });
            toast.success("Fleets reordered successfully");
        },
        onError: (error: any) => {
            toast.error(error.message || "Failed to reorder fleets");
        },
    });
};
