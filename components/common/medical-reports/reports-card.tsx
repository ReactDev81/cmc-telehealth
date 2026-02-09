import Button from "@/components/ui/Button";
import { MedicalReport } from "@/types/live/patient/medical-reports";
import { Calendar } from "lucide-react-native";
import { Text, View } from "react-native";

type Props = Pick<MedicalReport, "report_name" | "report_date_formatted" | "type_label"> & {
    handleReport: () => void;
};

const ReportsCard = ({ report_name, report_date_formatted, type_label, handleReport }: Props) => {
    return (
        <View className="border border-black-300 rounded-xl p-4">

            <View className="flex-row item-center justify-between">
                <Text className="text-base font-medium text-black">{report_name}</Text>
                {/* <View className="flex-row items-center gap-x-2">
                    <Calendar size={14} strokeWidth={1.5} />
                    <Text className="text-sm text-black-400">{report_date_formatted}</Text>
                </View> */}
            </View>

            <View className="flex-row items-center justify-between">
                <View className="gap-1">
                    <Text className="text-sm text-black pb-0.5">Type: {type_label}</Text>
                    <View className="flex-row items-center gap-x-2">
                        <Calendar size={14} strokeWidth={1.5} />
                        <Text className="text-sm text-black-400">{report_date_formatted}</Text>
                    </View>
                </View>
                <View>
                    <Button className="[&]:py-3 mt-1" onPress={handleReport}>View Report</Button>
                </View>
            </View>

        </View>
    )
}

export default ReportsCard