import { View, Text } from "react-native"
import UsageAnalyticsBarChart from "@/components/doctor/profile/usage-analytics-bar-chart"

const UsageAnalytics = () => {
    return(
        <View className="flex-1 p-5 bg-white">

            <View className="flex-row justify-between gap-x-2">

                <View className="flex-1">
                    <Text className="text-lg font-medium text-black">Total Appointment this month</Text>
                    <View className="flex-row items-center gap-x-1 mt-2">
                        <Text className="text-lg font-medium text-primary">45</Text>
                        <Text className="text-base text-black">this month</Text>
                    </View>
                </View>

                <View className="flex-1">
                    <Text className="text-lg font-medium text-black text-right">Compare to last month</Text>
                    <View className="flex-row items-center justify-end gap-x-1 mt-2">
                        <Text className="text-lg font-medium text-success">+14.2%</Text>
                        <Text className="text-base text-black">last month</Text>
                    </View>
                </View>
                
            </View>

            {/* bar chart */}
            <UsageAnalyticsBarChart />

            <View className="mt-8">
                <Text className="text-black-400 text-sm font-medium leading-6">Note: {' '}
                    <Text className="font-normal">
                        It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.
                    </Text>
                </Text>
            </View>

        </View>
    )
}

export default UsageAnalytics