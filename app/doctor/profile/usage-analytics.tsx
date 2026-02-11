// import UsageAnalyticsBarChart from "@/components/doctor/profile/usage-analytics-bar-chart";
// import { Text, View } from "react-native";

// const UsageAnalytics = () => {
//     return (
//         <View className="flex-1 p-5 bg-white">
//             <View className="flex-row justify-between gap-x-2">
//                 <View className="flex-1">
//                     <Text className="text-lg font-medium text-black">
//                         Total Appointment this month
//                     </Text>
//                     <View className="flex-row items-center gap-x-1 mt-2">
//                         <Text className="text-lg font-medium text-primary">45</Text>
//                         <Text className="text-base text-black">this month</Text>
//                     </View>
//                 </View>

//                 <View className="flex-1">
//                     <Text className="text-lg font-medium text-black text-right">
//                         Compare to last month
//                     </Text>
//                     <View className="flex-row items-center justify-end gap-x-1 mt-2">
//                         <Text className="text-lg font-medium text-success">+14.2%</Text>
//                         <Text className="text-base text-black">last month</Text>
//                     </View>
//                 </View>
//             </View>

//             {/* bar chart */}
//             <UsageAnalyticsBarChart chartData={[]} />

//             <View className="mt-8">
//                 <Text className="text-black-400 text-sm font-medium leading-6">
//                     Note:{" "}
//                     <Text className="font-normal">
//                         It is a long established fact that a reader will be distracted by
//                         the readable content of a page when looking at its layout.
//                     </Text>
//                 </Text>
//             </View>
//         </View>
//     );
// };

// export default UsageAnalytics;

import UsageAnalyticsBarChart from "@/components/doctor/profile/usage-analytics-bar-chart";
import { useUsageAnalytics } from "@/queries/doctor/useUsageAnalytics";
import { Text, View } from "react-native";

const UsageAnalytics = () => {
    const { data, isLoading, isError } = useUsageAnalytics();

    if (isLoading) return <Text>Loading...</Text>;
    if (isError) return <Text>Error loading analytics</Text>;

    const summary = data.summary;
    const chart = data.chart_data;

    // console.log("Usage Analytics Data:", chart);

    return (
        <View className="flex-1 p-5 bg-white">
            {/* Summary */}
            <View>
                <View className="flex-row justify-between gap-x-2 items-center">
                    <Text className="text-lg font-medium text-black">
                        Total Appointment this month
                    </Text>
                    <View className="flex-row items-center gap-x-1 mt-2">
                        <Text className="text-lg font-medium text-primary">
                            {summary.total_appointments_this_month}
                        </Text>
                        <Text className="text-base text-black">this month</Text>
                    </View>
                </View>

                <View className="flex-row justify-between gap-x-2 items-center">
                    <Text className="text-lg font-medium text-black text-right">
                        Compare to last month
                    </Text>

                    <View className="flex-row items-center justify-end gap-x-1 mt-2">
                        <Text
                            className={`text-lg font-medium ${summary.compare_to_last_month.is_positive
                                ? "text-success"
                                : "text-danger"
                                }`}
                        >
                            {summary.compare_to_last_month.is_positive ? "+" : "-"}
                            {summary.compare_to_last_month.percentage_change}%
                        </Text>
                        <Text className="text-base text-black">last month</Text>
                    </View>
                </View>
            </View>

            {/* Chart */}
            <UsageAnalyticsBarChart chartData={chart} />

            <View className="mt-8">
                <Text className="text-black-400 text-sm font-medium leading-6">
                    Note:{" "}
                    <Text className="font-normal">It is a long established fact...</Text>
                </Text>
            </View>
        </View>
    );
};

export default UsageAnalytics;
