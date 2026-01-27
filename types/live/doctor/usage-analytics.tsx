export interface CompareData {
    percentage_change: number;
    is_positive: boolean;
    last_month_count: number;
}

export interface UsageSummary {
    total_appointments_this_month: number;
    compare_to_last_month: CompareData;
}

export interface UsageChartData {
    label: string;
    date: string;
    value: number;
}

export interface UsageAnalyticsResponse {
    summary: UsageSummary;
    period: string;
    chart_data: UsageChartData[];
}
