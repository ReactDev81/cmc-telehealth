import React, { useCallback, useState } from "react";
import { View, Text, TouchableOpacity, LayoutAnimation, Platform, UIManager } from "react-native";
import { Clock, Calendar, Plus, Minus } from "lucide-react-native";
import { MedicineProps } from "@/types/common/my-medicines";

if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

type Props = {
    medicine: MedicineProps;
    defaultExpanded?: boolean;
    onToggle?: (expanded: boolean) => void;
};

const MedicineAccordian: React.FC<Props> = ({ medicine, defaultExpanded = true, onToggle }) => {

    const [expanded, setExpanded] = useState<boolean>(defaultExpanded);

    const toggle = useCallback(() => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setExpanded((v) => {
            const next = !v;
            onToggle?.(next);
            return next;
        });
    }, [onToggle]);
  
    const timesText = medicine.schedule?.times?.join(", ") ?? "";

    return (
        <View className="border border-[#EDEDED] rounded-xl overflow-hidden bg-white mb-5">

            <TouchableOpacity
                activeOpacity={0.85}
                onPress={toggle}
                className="bg-primary-100 rounded-t-xl p-4 flex-row items-center justify-between"
                accessibilityRole="button"
                accessibilityState={{ expanded }}
            >
                <Text className="text-base font-medium text-black">
                    {medicine.id}. {medicine.name}
                </Text>

                <View className="ml-3">
                    {expanded ? <Minus color="#4D4D4D" size={16} /> : <Plus color="#4D4D4D" size={16} />}
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
                                {medicine.dose}
                            </Text>
                            {timesText ? (
                                <Text className="text-sm text-[#6B6B6B] mt-1">{timesText}</Text>
                            ) : null}
                        </View>
                    </View>

                    <View className="flex-row items-center gap-x-2.5 mt-3">
                        <Calendar size={14} color="#4D4D4D" />
                        <Text className="text-sm text-[#6B6B6B]">{medicine.schedule?.frequency}</Text>
                    </View>

                    <View className="flex-row items-center gap-x-1 mt-2">
                        <Text className="text-sm text-[#6B6B6B]">From:</Text>
                        <Text className="text-sm text-[#6B6B6B] font-medium">
                            {medicine.startDate}
                        </Text>
                    </View>

                </View>
            )}
        </View>
    );
};

export default MedicineAccordian;