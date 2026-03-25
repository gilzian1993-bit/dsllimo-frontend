import { api } from "@/config/axios.config";
import { API_ROUTES } from "@/config/routes";

export interface DashboardOverviewResponse {
  success: boolean;
  data: {
    stats: {
      totalSales: number;
      totalOrders: number;
      confirmedOrders: number;
      issues: number;
    };
    chart: {
      labels: string[];
      revenue: number[];
      orders: number[];
    };
  };
}

export const getDashboardOverview = async (months: number = 6): Promise<DashboardOverviewResponse> => {
  const response = await api.get<DashboardOverviewResponse>(API_ROUTES.DASHBOARD_OVERVIEW, {
    params: { months },
  });
  return response.data;
};
