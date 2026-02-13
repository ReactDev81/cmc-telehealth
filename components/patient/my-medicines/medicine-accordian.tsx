import { MedicineProps } from "@/types/common/my-medicines";
import { ClipboardClock, Clock, Minus, Plus } from "lucide-react-native";
import React, { useCallback, useState } from "react";
import {
    LayoutAnimation,
    Platform,
    Text,
    TouchableOpacity,
    UIManager,
    View,
} from "react-native";

if (
    Platform.OS === "android" &&
    UIManager.setLayoutAnimationEnabledExperimental
) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

type Props = {
    medicine: MedicineProps;
    defaultExpanded?: boolean;
    onToggle?: (expanded: boolean) => void;
    index?: number;
};

const MedicineAccordian: React.FC<Props> = ({
    medicine,
    defaultExpanded = true,
    onToggle,
    index,
}) => {
    const [expanded, setExpanded] = useState<boolean>(defaultExpanded);
    // console.log("Medicine in Accordian:", medicine);

    const toggle = useCallback(() => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setExpanded((v) => {
            const next = !v;
            onToggle?.(next);
            return next;
        });
    }, [onToggle]);

    const medicineName = medicine.name || "";
    const medicineFrequency = (medicine.frequencylabel && medicine.frequencylabel !== "N/A") ? medicine.frequencylabel : (medicine.frequency || "");
    const medicineInstructions = Array.isArray(medicine.instructions)
        ? medicine.instructions.join(", ")
        : (medicine.instructions || "");
    const medicineStatus = medicine.status || "";
    const medicineTimes = medicine.times || "";
    const medicineDosage = medicine.dosage || "";
    const number = index !== undefined ? `${index + 1}. ` : "";
    const notes = medicine.notes || "";
    const startdate = medicine.start_date || "";
    const enddate = medicine.end_date || "";

    return (
        <View className="border border-black-200 rounded-xl overflow-hidden bg-white mb-5">
            <TouchableOpacity
                activeOpacity={0.85}
                onPress={toggle}
                className="bg-primary-100 rounded-t-xl p-4 flex-row items-center justify-between"
                accessibilityRole="button"
                accessibilityState={{ expanded }}
            >
                <View className="flex-row items-center gap-x-2">
                    <Text className="text-base font-medium text-black">
                        {number}
                    </Text>
                    <Text className="text-base font-medium text-black">
                        <Text className="capitalize">{medicineName} </Text> 
                        ({medicineDosage})
                    </Text>
                </View>

                <View className="ml-3">
                    {expanded ? (
                        <Minus color="#4D4D4D" size={16} />
                    ) : (
                        <Plus color="#4D4D4D" size={16} />
                    )}
                </View>
            </TouchableOpacity>

            {expanded && (
                <View className="p-4">
                    <View className="flex-row gap-x-2.5">
                        <View className="mt-1">
                            <Clock size={14} color="#1F1E1E" />
                        </View>
                        <View className="flex-1">
                            <Text className="text-sm font-medium text-black">
                                {medicine.dosage}, {medicineFrequency}
                            </Text>
                            <Text className="text-xs text-[#6B6B6B] mt-1">
                                {medicineTimes} ({medicineInstructions})
                            </Text>
                        </View>
                    </View>

                    <View className="flex-row items-center gap-x-2.5 mt-1">
                        <ClipboardClock size={14} color="#1F1E1E" />
                        <Text className="text-sm text-[#6B6B6B]">{medicineStatus}</Text>
                    </View>

                    <View className="flex-row items-center gap-x-1 mt-1">
                        <Text className="text-sm font-medium text-black">From:</Text>
                        <Text className="text-sm text-[#6B6B6B] font-medium">
                            {startdate}
                        </Text>
                        <Text className="text-sm font-medium text-black">To</Text>
                        <Text className="text-sm text-[#6B6B6B] font-medium">
                            {enddate}
                        </Text>
                    </View>

                    {notes ? (
                        <View className="mt-1 flex-row gap-1">
                            <Text className="text-sm font-medium text-black">
                                Notes: <Text className="text-sm text-[#6B6B6B]">{notes}</Text>
                            </Text>
                        </View>
                    ) : null}
                </View>
            )}
        </View>
    );
};

export default MedicineAccordian;
