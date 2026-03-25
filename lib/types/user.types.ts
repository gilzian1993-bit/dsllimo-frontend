export interface DashboardUser {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  state: string;
  status: "active" | "inactive" | "suspended";
  createdAt: string;
  updatedAt: string;
  lastLogin?: string;
}

export interface UsersResponse {
  success: boolean;
  data: DashboardUser[];
  meta: {
    total: number;
    page: number;
    pages: number;
    limit: number;
    totalPages?: number;
  };
}
