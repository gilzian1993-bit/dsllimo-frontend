import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getBookings, deleteBooking, deleteBookings, getBooking, getBookingReceipt } from "@/lib/api/booking";
import { toast } from "sonner";

export const useGetBooking = (id: string) => {
    return useQuery({
        queryKey: ["booking", id],
        queryFn: () => getBooking(id),
        enabled: !!id,
    });
};

export const useBookings = (params?: Record<string, any>) => {
    return useQuery({
        queryKey: ["bookings", params],
        queryFn: () => getBookings(params),
    });
};

export const useDeleteBooking = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteBooking,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["bookings"] });
            toast.success("Booking deleted successfully");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to delete booking");
        },
    });
};

export const useDeleteBookings = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteBookings,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["bookings"] });
            toast.success("Bookings deleted successfully");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to delete bookings");
        },
    });
};

export const useDownloadBookingReceipt = () => {
    return useMutation({
        mutationFn: async (id: string) => {
            const blob = await getBookingReceipt(id);
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `Receipt-${id.slice(-8)}.pdf`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to download receipt");
        },
    });
};
