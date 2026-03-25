import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getPayments, getPaymentDetails, deletePayment, deletePayments } from "@/lib/api/payment";

export const usePayments = (params?: Record<string, any>) => {
    return useQuery({
        queryKey: ["payments", params],
        queryFn: () => getPayments(params),
    });
};

export const usePaymentDetails = (id: string) => {
    return useQuery({
        queryKey: ["payments", id],
        queryFn: () => getPaymentDetails(id),
        enabled: !!id,
    });
};

export const useDeletePayment = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deletePayment,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["payments"] });
        },
    });
};

export const useDeletePayments = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deletePayments,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["payments"] });
        },
    });
};
