import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { loginAdmin, getCurrentUser, logoutAdmin } from "@/lib/api/auth";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-hot-toast";

export const useLogin = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirect = searchParams.get("redirect") || "/dashboard";

    return useMutation({
        mutationFn: loginAdmin,
        onSuccess: (response) => {
            if (response.success) {
                toast.success(response.message || "Logged in successfully!");
                router.push(redirect);
            } else {
                toast.error(response.message || "Login failed");
            }
        },
        onError: (error: any) => {
            const errorMessage = error.response?.data?.message || error.message || "Something went wrong";
            toast.error(errorMessage);
        },
    });
};

export const useUser = () => {
    return useQuery({
        queryKey: ["current-user"],
        queryFn: getCurrentUser,
        retry: false,
    });
};

export const useLogout = () => {
    const router = useRouter();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: logoutAdmin,
        onSuccess: () => {
            queryClient.clear();
            toast.success("Logged out successfully");
            router.push("/auth/login");
        },
        onError: (error: any) => {
            const errorMessage = error.response?.data?.message || error.message || "Logout failed";
            toast.error(errorMessage);
            queryClient.clear();
            router.push("/auth/login");
        },
    });
};
