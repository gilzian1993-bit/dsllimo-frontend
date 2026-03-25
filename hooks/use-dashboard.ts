import { useQuery } from "@tanstack/react-query";
import { getDashboardOverview } from "@/lib/api/dashboard";

export const useDashboardOverview = (months: number = 6) => {
  return useQuery({
    queryKey: ["dashboard-overview", months],
    queryFn: () => getDashboardOverview(months),
  });
};
