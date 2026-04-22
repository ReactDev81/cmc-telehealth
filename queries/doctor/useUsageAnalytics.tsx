import api from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

export type UsageAnalyticsRange = "week" | "month" | "year";

export interface UsageAnalyticsChartItem {
    label: string;
    date: string;
    value: number;
}

export type UsageAnalyticsChartData =
    | UsageAnalyticsChartItem[]
    | Partial<Record<UsageAnalyticsRange, UsageAnalyticsChartItem[]>>;

export interface UsageAnalyticsResponse {
    summary: {
        total_appointments_this_month: number;
        compare_to_last_month: {
            percentage_change: number;
            is_positive: boolean;
            last_month_count: number;
        };
    };
    period: UsageAnalyticsRange;
    chart_data: UsageAnalyticsChartData;
}

export const useUsageAnalytics = (period: UsageAnalyticsRange = "month") => {
    return useQuery<UsageAnalyticsResponse>({
        queryKey: ["usage-analytics", period],
        queryFn: async () => {
            const res = await api.get("/doctor/usage-analytics", {
                params: { period },
            });
            return res.data.data;
        },
    });
};
