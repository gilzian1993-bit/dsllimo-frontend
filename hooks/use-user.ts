import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteUser, getUsers } from "@/lib/api/user";
import { toast } from "sonner";

export const useUsers = (params?: Record<string, string | number | undefined>) => {
  return useQuery({
    queryKey: ["users", params],
    queryFn: () => getUsers(params),
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to delete user");
    },
  });
};
