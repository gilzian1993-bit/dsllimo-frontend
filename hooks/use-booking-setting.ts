import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getBookingSettings, updateBookingSettings, BookingSettings } from "@/lib/api/booking-setting";
import { toast } from "sonner";

export const useBookingSettings = () => {
    return useQuery({
        queryKey: ["booking-settings"],
        queryFn: getBookingSettings,
    });
};

export const useUpdateBookingSettings = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateBookingSettings,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["booking-settings"] });
            toast.success("Booking settings updated successfully");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to update booking settings");
        },
    });
};
