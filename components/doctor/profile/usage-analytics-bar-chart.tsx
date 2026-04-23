import { matchFont } from "@shopify/react-native-skia";
import { useMemo } from "react";
import { Dimensions, Platform, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { Bar, CartesianChart } from "victory-native";
import type {
    UsageAnalyticsChartItem,
    UsageAnalyticsRange,
} from "../../../queries/doctor/useUsageAnalytics";

interface UsageAnalyticsBarChartProps {
    chartData?: UsageAnalyticsChartItem[];
    selectedRange: UsageAnalyticsRange;
    onRangeChange: (range: UsageAnalyticsRange) => void;
}

const RANGE_OPTIONS: UsageAnalyticsRange[] = ["week", "month", "year"];
const SCREEN_WIDTH = Dimensions.get("window").width;
const CHART_HEIGHT = 380;

const formatXAxisLabel = (
    item: UsageAnalyticsChartItem,
    selectedRange: UsageAnalyticsRange,
) => {
    const parsedDate = item.date ? new Date(item.date) : null;

    if (!parsedDate || Number.isNaN(parsedDate.getTime())) {
        return item.label;
    }

    if (selectedRange === "week") {
        return parsedDate.toLocaleDateString("en-US", { weekday: "short" });
    }

    if (selectedRange === "month") {
        return parsedDate.toLocaleDateString("en-US", { month: "short" });
    }

    return parsedDate.toLocaleDateString("en-US", { year: "numeric" });
};

const UsageAnalyticsBarChart = ({
    chartData = [],
    selectedRange,
    onRangeChange,
}: UsageAnalyticsBarChartProps) => {
    const font = useMemo(() => {
        const familyName = Platform.select({
            ios: "Helvetica",
            android: "Roboto",
            default: "sans-serif",
        });
        return matchFont({ familyName, fontSize: 12, fontWeight: "400" });
    }, []);

    const chartDataPoints = Array.isArray(chartData)
        ? chartData
            .map((item) => ({
                x: formatXAxisLabel(item, selectedRange),
                y: Number(item.value) || 0,
            }))
            .filter((item) => item.x)
        : [];

    const maxValue = chartDataPoints.reduce(
        (max, item) => Math.max(max, item.y),
        0,
    );

    const chartWidth = Math.max(
        SCREEN_WIDTH - 40,
        chartDataPoints.length * (selectedRange === "year" ? 48 : 56),
    );

    return (
        <View className="mt-10">
            <View className="mb-6 flex-row justify-center">
                {RANGE_OPTIONS.map((range) => {
                    const isActive = selectedRange === range;

                    return (
                        <TouchableOpacity
                            key={range}
                            activeOpacity={0.85}
                            onPress={() => onRangeChange(range)}
                            className={`mx-2 rounded-2xl px-7 py-3 ${isActive ? "bg-[#E8EDE9]" : "bg-transparent"}`}
                        >
                            <Text
                                className={`text-[18px] capitalize text-black ${isActive ? "font-semibold" : "font-normal"}`}
                            >
                                {range}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>

            {!Array.isArray(chartData) || chartData.length === 0 ? (
                <View className="items-center justify-center rounded-2xl border border-[#E8ECE9] bg-[#FAFBFA] px-5 py-12">
                    <Text className="text-base text-[#4D4D4D]">
                        No analytics data available for this range.
                    </Text>
                </View>
            ) : (
                <ScrollView
                    horizontal
                    bounces={false}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ paddingRight: 12 }}
                >
                    <View style={{ width: chartWidth, height: CHART_HEIGHT }}>
                        <CartesianChart
                            data={chartDataPoints}
                            xKey="x"
                            yKeys={["y"]}
                            padding={{ left: 0, top: 20, right: 0, bottom: 60 }}
                            domainPadding={{ left: 30, right: 30, top: 30 }}
                            domain={{ y: [0, Math.max(1, Math.ceil(maxValue * 1.2))] }}
                            axisOptions={{
                                font: font,
                                labelColor: "#4D4D4D",
                                lineColor: "#E8ECE9",
                                tickCount: {
                                    x: selectedRange === "year" ? 6 : chartDataPoints.length,
                                    y: 5,
                                },
                                formatYLabel: (value) => `${value}`,
                                formatXLabel: (value) => `${value}`,
                            }}
                        >
                            {({ points, chartBounds }) => (
                                <Bar
                                    points={points.y}
                                    chartBounds={chartBounds}
                                    color="#013220"
                                    barWidth={selectedRange === "year" ? 18 : 24}
                                    roundedCorners={{
                                        topLeft: 4,
                                        topRight: 4,
                                        bottomLeft: 0,
                                        bottomRight: 0,
                                    }}
                                />
                            )}
                        </CartesianChart>
                    </View>
                </ScrollView>
            )}
        </View>
    );
};

export default UsageAnalyticsBarChart;
