import axios from "axios";

// Browser: use same-origin `/api` so Next.js rewrites proxy to the backend and auth cookies
// are first-party on the dashboard host. Server (if ever used): call backend directly.
const baseURL =
  typeof window !== "undefined" ? "" : process.env.NEXT_PUBLIC_BACKEND_URL || "";

export const api = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to normalize multipart headers
api.interceptors.request.use(
  (config) => {
    // If data is FormData, remove Content-Type header to let axios set it automatically with boundary
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle 401 errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // If error is 401 (Unauthorized), clear auth data and redirect to login
    // BUT only if we're not already on the login page
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        const currentPath = window.location.pathname;
        // Don't redirect if we're already on the login page (prevents refresh loop)
        if (!currentPath.includes("/auth/login")) {
          window.location.href = "/auth/login";
        }
      }
    }

    // Transform error response to include message from backend
    // Backend returns { success: false, error: "message" } or { success: false, message: "message" }
    if (error.response?.data) {
      const backendError = error.response.data;
      error.message = backendError.error || backendError.message || error.message || "An error occurred";
    }

    return Promise.reject(error);
  }
);
