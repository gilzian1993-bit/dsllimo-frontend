/**
 * Authentication Types
 * Centralized TypeScript types and interfaces for authentication
 */

// ----------------- API Response Types -----------------

/**
 * Standard API response wrapper
 * Matches backend response format: { success: boolean, data: T, message?: string }
 */
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

// ----------------- User/Admin Types -----------------

/**
 * Admin user data structure
 * Matches backend IAdmin interface structure
 */
export interface AdminData {
  _id: string;
  email: string;
  fullName: string;
  role: "super_admin" | "admin" | "manager";
  permissions: string[];
  profile?: {
    phone?: string;
    avatar?: string;
  };
  status: "active" | "inactive" | "suspended";
  lastLogin?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * User roles
 */
export type UserRole = "admin" | "user" | "moderator";

// ----------------- Authentication Token Types -----------------

/**
 * Authentication tokens structure
 */
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

// ----------------- Login Response Types -----------------

/**
 * Login response data structure
 * Matches backend response: { admin: IAdmin, token: string, refreshToken: string }
 */
export interface LoginResponseData {
  user: AdminData;
  role: string;
  token?: string;
  refreshToken?: string;
}

/**
 * Login API response
 */
export type LoginResponse = ApiResponse<LoginResponseData>;

// ----------------- Logout Response Types -----------------

/**
 * Logout API response
 */
export type LogoutResponse = ApiResponse<{}>;

// ----------------- Current User Response Types -----------------

/**
 * Current user API response
 * Backend returns { success: true, data: { user: AdminData, role: string } }
 */
export type CurrentUserResponse = ApiResponse<{ user: AdminData; role: string }>;

// ----------------- Refresh Token Response Types -----------------

/**
 * Refresh token response data
 * Matches backend response: { token: string, refreshToken: string }
 */
export interface RefreshTokenResponseData {
  user?: AdminData;
  role?: string;
}

/**
 * Refresh token API response
 */
export type RefreshTokenResponse = ApiResponse<RefreshTokenResponseData>;

// ----------------- Error Types -----------------

/**
 * API error response structure
 */
export interface ApiError {
  success?: boolean;
  message: string;
  errors?: Record<string, string[]>;
  status?: number;
}

// ----------------- Auth State Types -----------------

/**
 * Authentication state
 */
export interface AuthState {
  user: AdminData | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

