"use client";
import dynamic from "next/dynamic";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

import { useMemo, useCallback } from "react";
import { useThemeStore } from "@/store";
import { useTheme } from "next-themes";
import { themes } from "@/config/thems";
import { getGridConfig, getYAxisConfig } from "@/lib/appex-chart-options";
import {
    formatDashboardCompactCurrency,
    formatDashboardCurrencyLocale,
} from "@/lib/utils/formatters";
import { useDashboardOverview } from "@/hooks/use-dashboard";

const RevinueChart = ({ height = 350 }) => {
    const { theme: config } = useThemeStore();
    const { theme: mode, resolvedTheme } = useTheme();
    const actualMode = resolvedTheme || mode || "light";
    const { data: overviewData } = useDashboardOverview();

    const theme = useMemo(
        () => themes.find((theme) => theme.name === config),
        [config]
    );
    const chartData = useMemo(() => ({
        labels: overviewData?.data?.chart?.labels || [],
    }), [overviewData]);

    const series = useMemo(() => [
        {
            name: "Revenue",
            data: overviewData?.data?.chart?.revenue || [],
        },
        {
            name: "Orders",
            data: overviewData?.data?.chart?.orders || [],
        },
    ], [overviewData]);

    const themeColors = useMemo(() => {
        if (!theme) return { chartLabel: "", primary: "", info: "", chartGird: "" };
        const themeMode = actualMode === "dark" ? "dark" : "light";
        return {
            chartLabel: `hsl(${theme.cssVars[themeMode].chartLabel})`,
            primary: `hsl(${theme.cssVars[themeMode].primary})`,
            info: `hsl(${theme.cssVars[themeMode].info})`,
            chartGird: `hsl(${theme.cssVars[themeMode].chartGird})`,
        };
    }, [theme, actualMode]);

    // Formatters
    const tooltipFormatter = useCallback((value: number, { seriesIndex }: any) => {
        if (seriesIndex === 0) return formatDashboardCurrencyLocale(value);
        return `${Math.round(value)}`;
    }, []);

    const yAxisFormatter = useCallback((value: number) => {
        return formatDashboardCompactCurrency(value);
    }, []);

    const gridConfig = useMemo(
        () => getGridConfig(themeColors.chartGird),
        [themeColors.chartGird]
    );

    const yaxisConfig = useMemo(
        () => getYAxisConfig(themeColors.chartLabel, yAxisFormatter),
        [themeColors.chartLabel, yAxisFormatter]
    );

    const options: any = useMemo(
        () => ({
            chart: {
                toolbar: { show: false },
            },
            plotOptions: {
                bar: {
                    borderRadius: 8,
                    columnWidth: "20%",
                },
            },
            dataLabels: { enabled: false },
            stroke: { show: false },
            colors: [themeColors.primary, themeColors.info],
            tooltip: {
                theme: actualMode === "dark" ? "dark" : "light",
                y: { formatter: tooltipFormatter },
            },
            grid: gridConfig,
            yaxis: yaxisConfig,
            xaxis: {
                categories: chartData.labels,
                labels: {
                    style: {
                        colors: themeColors.chartLabel,
                        fontSize: "12px",
                    },
                },
            },
            legend: {
                position: "bottom",
                labels: { colors: themeColors.chartLabel },
            },
        }),
        [themeColors, actualMode, chartData.labels]
    );

    return (
        <Chart
            options={options}
            series={series}
            type="bar"
            height={height}
            width="100%"
        />
    );
};

export default RevinueChart;
