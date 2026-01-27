// import { useState } from "react";
// import { Text, TouchableOpacity, View } from "react-native";
// import { BarChart } from "react-native-gifted-charts";

// type RangeType = "Week" | "Month" | "Year";

// interface UsageAnalyticsBarChartProps {
//     chartData: { label: string; value: number }[];
//     period?: "week" | "month" | "year";
// }

// const UsageAnalyticsBarChart = ({
//     chartData,
//     period = "month",
// }: UsageAnalyticsBarChartProps) => {
//     const [selectedRange, setSelectedRange] = useState<RangeType>("Month");

//     const datasets: Record<RangeType, { label: string; value: number }[]> = {
//         Week: [
//             { label: "Mon", value: 5 },
//             { label: "Tue", value: 10 },
//             { label: "Wed", value: 7 },
//             { label: "Thu", value: 12 },
//             { label: "Fri", value: 9 },
//             { label: "Sat", value: 4 },
//             { label: "Sun", value: 6 },
//         ],
//         Month: [
//             { label: "Jan", value: 25 },
//             { label: "Feb", value: 45 },
//             { label: "Mar", value: 30 },
//             { label: "Apr", value: 40 },
//             { label: "May", value: 20 },
//             { label: "Jun", value: 50 },
//             { label: "Jul", value: 38 },
//             { label: "Aug", value: 35 },
//         ],
//         Year: [
//             { label: "2021", value: 380 },
//             { label: "2022", value: 420 },
//             { label: "2023", value: 460 },
//             { label: "2024", value: 510 },
//         ],
//     };

//     const formattedData = chartData.map((d) => ({
//         label: d.label,
//         value: d.value,
//     }));

//     return (
//         <View className="mt-10">
//             {/* Toggle Tabs */}
//             <View
//                 style={{
//                     flexDirection: "row",
//                     justifyContent: "center",
//                     marginBottom: 12,
//                 }}
//             >
//                 {["Week", "Month", "Year"].map((range) => {
//                     const isActive = selectedRange === range;
//                     return (
//                         <TouchableOpacity
//                             key={range}
//                             onPress={() => setSelectedRange(range as RangeType)}
//                             className={`py-1.5 px-4 mx-1 rounded-md ${isActive ? "bg-primary-200" : "transparent"}`}
//                         >
//                             <Text
//                                 className={`text-lg text-black ${isActive ? "font-medium" : "font-normal"}`}
//                             >
//                                 {range}
//                             </Text>
//                         </TouchableOpacity>
//                     );
//                 })}
//             </View>

//             {/* Bar Chart */}
//             <BarChart
//                 data={datasets[selectedRange]}
//                 barWidth={25}
//                 yAxisThickness={1}
//                 xAxisThickness={1}
//                 yAxisColor="#E5EAE8"
//                 xAxisColor="#E5EAE8"
//                 initialSpacing={20}
//                 spacing={16}
//                 frontColor="#013220"
//                 yAxisTextStyle={{ fontSize: 14, fontWeight: 500, color: "#4D4D4D" }}
//                 xAxisLabelTextStyle={{
//                     fontSize: 14,
//                     fontWeight: 500,
//                     color: "#4D4D4D",
//                 }}
//                 dashWidth={0}
//                 hideRules={false}
//                 rulesType="solid"
//                 rulesColor="#E5EAE8"
//                 noOfSections={5}
//                 stepHeight={50}
//                 isAnimated
//             />
//         </View>
//     );
// };

// export default UsageAnalyticsBarChart;

import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { BarChart } from "react-native-gifted-charts";

type RangeType = "week" | "month" | "year";

interface UsageAnalyticsBarChartProps {
    chartData: {
        week: { label: string; value: number }[];
        month: { label: string; value: number }[];
        year: { label: string; value: number }[];
    };
}

const UsageAnalyticsBarChart = ({ chartData }: UsageAnalyticsBarChartProps) => {
    // console.log("Received chartData:", chartData);

    const [selectedRange, setSelectedRange] = useState<RangeType>("week");

    const datasets: Record<RangeType, { label: string; value: number }[]> = {
        week: chartData?.week ?? [],
        month: chartData?.month ?? [],
        year: chartData?.year ?? [],
    };

    // console.log("Datasets for selected range:", datasets[selectedRange]);

    return (
        <View className="mt-10">
            {/* Toggle Tabs */}
            <View
                style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    marginBottom: 12,
                }}
            >
                {["week", "month", "year"].map((range) => {
                    const isActive = selectedRange === range;
                    return (
                        <TouchableOpacity
                            key={range}
                            onPress={() => setSelectedRange(range as RangeType)}
                            className={`py-1.5 px-4 mx-1 rounded-md ${isActive ? "bg-primary-200" : "transparent"
                                }`}
                        >
                            <Text
                                className={`text-lg text-black ${isActive ? "font-medium" : "font-normal"
                                    }`}
                            >
                                {range}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>

            {/* Bar Chart */}
            <BarChart
                data={datasets[selectedRange]}
                barWidth={25}
                yAxisThickness={1}
                xAxisThickness={1}
                yAxisColor="#E5EAE8"
                xAxisColor="#E5EAE8"
                initialSpacing={20}
                spacing={16}
                frontColor="#013220"
                yAxisTextStyle={{ fontSize: 14, fontWeight: 500, color: "#4D4D4D" }}
                xAxisLabelTextStyle={{
                    fontSize: 14,
                    fontWeight: 500,
                    color: "#4D4D4D",
                }}
                dashWidth={0}
                hideRules={false}
                rulesType="solid"
                rulesColor="#E5EAE8"
                noOfSections={5}
                stepHeight={50}
                isAnimated
            />
        </View>
    );
};

export default UsageAnalyticsBarChart;
