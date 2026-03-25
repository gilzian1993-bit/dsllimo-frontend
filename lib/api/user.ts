import { api } from "@/config/axios.config";
import { API_ROUTES } from "@/config/routes";
import { UsersResponse } from "../types/user.types";

export const getUsers = async (
  params?: Record<string, string | number | undefined>
): Promise<UsersResponse> => {
  const response = await api.get<UsersResponse>(API_ROUTES.USERS, { params });
  return response.data;
};

export const deleteUser = async (id: string): Promise<void> => {
  await api.delete(`${API_ROUTES.USERS}/${id}`);
};
