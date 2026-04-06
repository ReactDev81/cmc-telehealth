import Badge, { BadgeVariant } from "@/components/ui/Badge";
import Title from "@/components/ui/Title";
import { Text, View } from "react-native";

interface MyLeavesCardProps {
    leave: {
        id: string;
        type: string;
        startDate: string;
        endDate: string;
        days: number;
        reason: string;
        status: string;
    };
}

const MyLeavesCard = ({ leave }: MyLeavesCardProps) => {

    const getStatusVariant = (status: string): BadgeVariant => {
        switch (status.toLowerCase()) {
            case "pending":
                return "warning";
            case "approved":
                return "success";
            case "rejected":
                return "danger";
            default:
                return "gray";
        }
    };

    return (
        <View className="border border-black-200 rounded-xl p-4 mt-5">
            <View className="flex-row justify-between">
                <Title text={leave.type} className="text-black font-bold" />
                <Badge text={leave.status} variant={getStatusVariant(leave.status)} />
            </View>
            <View className="flex-row items-center mt-1">
                <Text className="text-xs text-black-400 font-medium">Duration: </Text>
                <Text className="text-xs text-black-400">{leave.startDate} - {leave.endDate} ({leave.days} days)</Text>
            </View>
            <View className="flex-row items-center mt-1">
                <Text className="text-xs text-black-400 font-medium">Reason: </Text>
                <Text className="text-xs text-black-400">{leave.reason}</Text>
            </View>
        </View>
    );
};

export default MyLeavesCard;