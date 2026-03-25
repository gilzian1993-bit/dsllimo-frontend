"use client";

import { BarChart3, FileText, CheckCircle2, Users, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDashboardCurrencyLocale } from "@/lib/utils/formatters";
import { useDashboardOverview } from "@/hooks/use-dashboard";

const Stats = () => {
  const { data: overviewData } = useDashboardOverview();
  const stats = overviewData?.data?.stats;

  const cards = [
    {
      text: "total sales",
      total: formatDashboardCurrencyLocale(stats?.totalSales ?? 0),
      icon: <BarChart3 className="w-4 h-4" />,
      color: "primary",
    },
    {
      text: "total orders",
      total: stats?.totalOrders ?? 0,
      icon: <FileText className="w-4 h-4" />,
      color: "warning",
    },
    {
      text: "confirmed bookings",
      total: stats?.confirmedOrders ?? 0,
      icon: <CheckCircle2 className="w-4 h-4" />,
      color: "success",
    },
    {
      text: "users",
      total: stats?.issues ?? 0,
      icon: <Users className="w-4 h-4" />,
      color: "destructive",
    },
  ];

  return (
    <>
      {cards.map((item, index) => (
        <div
          key={`reports-state-${index}`}
          className={cn(
            "flex flex-col gap-1.5 p-4 rounded-sm overflow-hidden bg-primary/10 items-start relative",
            {
              "bg-primary/40 dark:bg-primary/70": item.color === "primary",
              "bg-orange-50 dark:bg-orange-500": item.color === "warning",
              "bg-green-50 dark:bg-green-500": item.color === "success",
              "bg-red-50 dark:bg-red-500": item.color === "destructive",
            }
          )}
        >
          <span
            className={cn(
              "h-[95px] w-[95px] rounded-full bg-primary/40 absolute -top-8 -right-8 ring-[20px] ring-primary/30",
              {
                "bg-primary/50 ring-primary/20 dark:bg-primary dark:ring-primary/40": item.color === "primary",
                "bg-orange-200 ring-orange-100 dark:bg-orange-300 dark:ring-orange-400": item.color === "warning",
                "bg-green-200 ring-green-100 dark:bg-green-300 dark:ring-green-400": item.color === "success",
                "bg-red-200 ring-red-100 dark:bg-red-300 dark:ring-red-400": item.color === "destructive",
              }
            )}
          ></span>

          <div
            className={cn(
              "w-8 h-8 grid place-content-center rounded-full border border-dashed dark:border-primary-foreground/60",
              {
                "border-primary": item.color === "primary",
                "border-warning": item.color === "warning",
                "border-success": item.color === "success",
                "border-destructive": item.color === "destructive",
              }
            )}
          >
            <span
              className={cn(
                "h-6 w-6 rounded-full grid place-content-center",
                {
                  "bg-primary dark:bg-[#EFF3FF]/30": item.color === "primary",
                  "bg-warning dark:bg-[#FFF7ED]/30": item.color === "warning",
                  "bg-success dark:bg-[#ECFDF4]/30": item.color === "success",
                  "bg-destructive dark:bg-[#FEF2F2]/30": item.color === "destructive",
                }
              )}
            >
              {item.icon}
            </span>
          </div>

          <span className="mt-3 text-sm text-default-800 dark:text-primary-foreground font-medium capitalize relative z-10">
            {item.text}
          </span>

          <div className="flex items-center gap-1">
            <span className="text-lg font-semibold text-default-900 dark:text-primary-foreground">
              {item.total}
            </span>
            <TrendingUp
              className={cn("w-5 h-5 dark:text-primary-foreground", {
                "text-primary": item.color === "primary",
                "text-warning": item.color === "warning",
                "text-success": item.color === "success",
                "text-destructive": item.color === "destructive",
              })}
            />
          </div>
        </div>
      ))}
    </>
  );
};

export default Stats;
