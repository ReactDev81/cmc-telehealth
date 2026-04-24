import { useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import UsageAnalyticsBarChart from "../../../components/doctor/profile/usage-analytics-bar-chart";
import { UsageAnalyticsChartItem, UsageAnalyticsRange, useUsageAnalytics } from "../../../queries/doctor/useUsageAnalytics";

const UsageAnalytics = () => {

    const [selectedRange, setSelectedRange] = useState<UsageAnalyticsRange>("month");
    const { data, isLoading, isError, error, isFetching } = useUsageAnalytics(selectedRange);

    if (isLoading) {
        return (
            <View className="flex-1 items-center justify-center bg-white p-5">
                <ActivityIndicator size="large" color="#013220" />
                <Text className="mt-3 text-base text-black">Loading analytics...</Text>
            </View>
        );
    }

    if (isError) {
        return (
            <View className="flex-1 items-center justify-center bg-white p-5">
                <Text className="text-base text-red-500">
                    {((error as any)?.response?.data?.errors?.message ??
                        (error as any)?.message ??
                        "Error loading analytics")}
                </Text>
            </View>
        );
    }

    const summary = data?.summary;
    const rawChartData = data?.chart_data;
    const chartData: UsageAnalyticsChartItem[] = Array.isArray(rawChartData)
        ? rawChartData
        : rawChartData?.[selectedRange] ?? [];

    return (
        <View className="flex-1 bg-white p-5">
            <View className="pt-3">
                <View className="flex-row items-center justify-between gap-x-3">
                    <Text className="flex-1 text-lg font-medium text-black">
                        Total Appointment this month
                    </Text>
                    <View className="mt-2 flex-row items-center gap-x-1">
                        <Text className="text-lg font-medium text-primary">
                            {summary?.total_appointments_this_month ?? 0}
                        </Text>
                        <Text className="text-base text-black">this month</Text>
                    </View>
                </View>

                <View className="mt-3 flex-row items-center justify-between gap-x-3">
                    <Text className="flex-1 text-lg font-medium text-black">
                        Compare to last month
                    </Text>

                    <View className="mt-2 flex-row items-center justify-end gap-x-1">
                        <Text
                            className={`text-lg font-medium ${summary?.compare_to_last_month?.is_positive
                                ? "text-success"
                                : "text-danger"
                                }`}
                        >
                            {summary?.compare_to_last_month?.is_positive ? "+" : "-"}
                            {summary?.compare_to_last_month?.percentage_change ?? 0}%
                        </Text>
                        <Text className="text-base text-black">last month</Text>
                    </View>
                </View>
            </View>

            {isFetching ? (
                <View className="mt-10 items-center">
                    <Text className="text-sm text-black-400">
                        Updating {selectedRange} analytics...
                    </Text>
                </View>
            ) : null}

            <UsageAnalyticsBarChart
                chartData={chartData}
                selectedRange={selectedRange}
                onRangeChange={setSelectedRange}
            />

            <View className="mt-8">
                <Text className="text-sm font-medium leading-6 text-black-400">
                    Note:{" "}
                    <Text className="font-normal">
                        Analytics are shown based on the selected range and your
                        appointment activity.
                    </Text>
                </Text>
            </View>
        </View>
    );
};

export default UsageAnalytics;