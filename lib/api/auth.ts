import { api } from "@/config/axios.config";
import { LoginFormData } from "@/lib/validations/auth.schema";
import type {
  ApiResponse,
  AdminData,
  LoginResponse,
  LogoutResponse,
  CurrentUserResponse,
} from "@/lib/types/auth.types";
import API_ROUTES from "@/config/routes";

export type {
  ApiResponse,
  AdminData,
  LoginResponse,
  LogoutResponse,
};

export const loginAdmin = async (credentials: LoginFormData): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>(API_ROUTES.AUTH_LOGIN, credentials);
  return response.data;
};

export const getCurrentUser = async (): Promise<AdminData> => {
  const response = await api.get<CurrentUserResponse>(API_ROUTES.AUTH_ME);
  return response.data.data.user;
};

export const logoutAdmin = async (): Promise<LogoutResponse> => {
  const response = await api.post<LogoutResponse>(API_ROUTES.AUTH_LOGOUT);
  return response.data;
};

