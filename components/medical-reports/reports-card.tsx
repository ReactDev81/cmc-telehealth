import { View, Text } from "react-native"
import { Calendar } from 'lucide-react-native';
import Button from "../ui/Button";
import { ReportCardProps } from "@/types/medical-reports";

type Props = ReportCardProps & {
    handleReport: () => void;
};

const ReportsCard = ({ report_name, report_date, doctor_name, report_type, handleReport}: Props) => {
    return(
        <View className="border border-[#EDEDED] rounded-xl p-4">

            <View className="flex-row item-center justify-between">
                <Text className="text-base font-medium text-black">{report_name}</Text>
                <View className="flex-row items-center gap-x-2">
                    <Calendar size={14} strokeWidth={1.5} />
                    <Text className="text-sm text-black-400">{report_date}</Text>
                </View>
            </View>

            <View className="flex-row items-center justify-between mt-3">
                <View>
                    <Text className="text-sm text-black">{doctor_name}</Text>
                    <Text className="text-sm text-black mt-1">Type: {report_type}</Text>
                </View>
                <View>
                    <Button className="[&]:py-3" onPress={handleReport}>View Report</Button>
                </View>
            </View>

        </View>
    )
}

export default ReportsCard