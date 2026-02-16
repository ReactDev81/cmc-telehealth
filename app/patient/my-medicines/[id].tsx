import MedicineAccordian from "@/components/patient/my-medicines/medicine-accordian";
import { usePrescriptionDetail } from "@/queries/patient/usePrescriptionDetail";
import type { MedicineProps } from "@/types/common/my-medicines";
import type { MedicineDetail } from "@/types/live/patient/prescription";
import { useIsFocused } from "@react-navigation/native";
import { useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import { Linking, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const MedicinesDetail = () => {

    const { id } = useLocalSearchParams();
    const isFocused = useIsFocused();
    const appointmentId = Array.isArray(id) ? id[0] : id;

    const { data, isLoading, error, refetch } = usePrescriptionDetail(appointmentId);

    const list = data?.data as any;
    const MedicinesData: MedicineDetail[] =
        list?.medicines || (Array.isArray(list) ? list : []);
    const formattedMedicines: MedicineProps[] = MedicinesData.map(
        (med: MedicineDetail, idx: number) => ({
            ...(med as any),
            id: med.number ?? idx + 1,
        }),
    );
    const pdfUrl = list?.pdf_url;

    useEffect(() => {
        if (isFocused) {
            refetch();
        }
    }, [isFocused, refetch]);

    if (isLoading) {
        return (
            <View className="flex-1 items-center justify-center bg-white">
                <Text>Loading...</Text>
            </View>
        );
    }

    if (error) return (
        <SafeAreaView className="flex-1 items-center justify-center">
            <Text className="text-black">Something went wrong</Text>
        </SafeAreaView>
    );

    return (
        <SafeAreaView className="flex-1 bg-white">
            <ScrollView className="flex-1 bg-white px-5">

                {formattedMedicines.map((med: MedicineProps, index: number) => (
                    <MedicineAccordian
                        key={String(med.id)}
                        medicine={med}
                        defaultExpanded={true}
                        index={index}
                    />
                ))}

                {list?.instructions_by_doctor && (
                    <View className="mt-4">
                        <Text className="text-base font-medium text-black">
                            Conclusion Report:
                        </Text>
                        <Text className="text-base text-black-400 mt-1.5">
                            {list?.instructions_by_doctor}
                        </Text>
                    </View>
                )}

                {list?.next_visit_date && (
                    <View className="flex-row items-center mt-2.5 mb-5">
                        <Text className="text-base font-medium text-black">Next Visit: </Text>
                        <Text className="text-base text-black-400">{list?.next_visit_date}</Text>
                    </View>
                )}

                {pdfUrl && (
                    <TouchableOpacity
                        onPress={() => Linking.openURL(pdfUrl)}
                        className="flex-row items-center gap-x-2 mb-5"
                    >
                        <Text className="text-base font-medium text-black">Prescription:</Text>
                        <Text className="text-base text-blue-600 underline">
                            View/Download PDF
                        </Text>
                    </TouchableOpacity>
                )}

            </ScrollView>
        </SafeAreaView>
    );
};

export default MedicinesDetail;