// import MedicineAccordian from "@/components/patient/my-medicines/medicine-accordian";
// import { usePrescriptionDetail } from "@/queries/patient/usePrescriptionDetail";
// import { MedicineDetail } from "@/types/live/patient/prescription";
// import { Link, useLocalSearchParams } from "expo-router";
// import { ScrollView, Text, View } from "react-native";

// const MedicinesDetail = () => {
//     const { id } = useLocalSearchParams();
//     const appointmentId = Array.isArray(id) ? id[0] : id;

//     const { data, isLoading, error } = usePrescriptionDetail(appointmentId);

//     console.log("Medicine Detail Data:", data);

//     if (isLoading)
//         return (
//             <View className="flex-1 items-center justify-center bg-white">
//                 <Text>Loading...</Text>
//             </View>
//         );

//     if (error) {
//         console.log("error :", error);
//         return (
//             <View className="flex-1 items-center justify-center bg-white">
//                 <Text>Something went wrong</Text>
//             </View>
//         );
//     }

//     return (
//         <ScrollView className="flex-1 bg-white p-5 pb-14">
//             {data?.data?.map((med: MedicineDetail) => (
//                 <MedicineAccordian
//                     key={med.prescription_id}
//                     medicine={{
//                         id: med.number,
//                         name: med.name,
//                         dose: med.frequency,
//                         schedule: {
//                             times: med.times.split(", "),
//                             frequency: med.date,
//                         },
//                         startDate: med.date,
//                         instructions: med.instructions,
//                     }}
//                     defaultExpanded={true}
//                 />
//             ))}

//             <View>
//                 <Text className="text-base font-medium text-black">
//                     Conclusion Report:
//                 </Text>
//                 <Text className="text-base text-black-400 mt-1.5">
//                     This prescription for Lisinopril 10 mg is actively managing your
//                     hypertension to maintain healthy blood pressure levels
//                 </Text>
//             </View>

//             <View className="flex-row item-center mt-2.5">
//                 <Text className="text-base font-medium text-black">Next Visit: </Text>
//                 <Text className="text-base text-black-400">2025-02-10 Tusday</Text>
//             </View>

//             <View className="mt-3 pb-14">
//                 <Text className="text-base font-medium text-black mb-3">
//                     Uploaded Report's:
//                 </Text>
//                 <View className="flex-row items-center gap-x-2">
//                     <Text className="text-base text-black-400 font-medium">
//                         Blood Test:
//                     </Text>
//                     <Link href="/" className="text-base text-primary">
//                         View/Download Document
//                     </Link>
//                 </View>
//                 <View className="flex-row items-center gap-x-2 mt-1.5">
//                     <Text className="text-base text-black-400 font-medium">
//                         X-Ray Test:
//                     </Text>
//                     <Link href="/" className="text-base text-primary">
//                         View/Download Document
//                     </Link>
//                 </View>
//                 <View className="flex-row items-center gap-x-2 mt-1.5">
//                     <Text className="text-base text-black-400 font-medium">
//                         Depression and Anxiety:
//                     </Text>
//                     <Link href="/" className="text-base text-primary">
//                         View/Download Document
//                     </Link>
//                 </View>
//             </View>
//         </ScrollView>
//     );
// };

// export default MedicinesDetail;

import MedicineAccordian from "@/components/patient/my-medicines/medicine-accordian";
import { useAuth } from "@/context/UserContext";
// import { MedicinesData } from "@/json-data/patient/my-medicines";
import { usePrescriptionDetail } from "@/queries/patient/usePrescriptionDetail";
import { useLocalSearchParams } from "expo-router";
import { Linking, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const MedicinesDetail = () => {
    const { token } = useAuth();
    // console.log("token :", token);
    const { id } = useLocalSearchParams();
    const appointmentId = Array.isArray(id) ? id[0] : id;
    // console.log("appointmentId :", appointmentId);

    const { data, isLoading, error } = usePrescriptionDetail(appointmentId);

    const list = data?.data as any;
    // console.log("list :", list);
    const MedicinesData = list?.medicines || (Array.isArray(list) ? list : []);
    const pdfUrl = list?.pdf_url;

    // console.log("MedicinesData :", MedicinesData);

    // console.log("Medicine Detail Data:", data);

    if (isLoading) {
        return (
            <View className="flex-1 items-center justify-center bg-white">
                <Text>Loading...</Text>
            </View>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-white">
            <ScrollView className="flex-1 bg-white px-5">
                {MedicinesData.map((med, index) => (
                    <MedicineAccordian
                        key={med.prescription_id || index}
                        medicine={med}
                        defaultExpanded={true}
                        index={index}
                    />
                ))}

                <View>
                    <Text className="text-base font-medium text-black">
                        Conclusion Report:
                    </Text>
                    <Text className="text-base text-black-400 mt-1.5">
                        This prescription for Lisinopril 10 mg is actively managing your
                        hypertension to maintain healthy blood pressure levels
                    </Text>
                </View>

                <View className="flex-row items-center mt-2.5 mb-5">
                    <Text className="text-base font-medium text-black">Next Visit: </Text>
                    <Text className="text-base text-black-400">2025-02-10 Tusday</Text>
                </View>

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

                {/* <View className="mt-3 pb-14">
                <Text className="text-base font-medium text-black mb-3">
                    Uploaded Report's:
                </Text>
                <View className="flex-row items-center gap-x-2">
                    <Text className="text-base text-black-400 font-medium">
                        Blood Test:
                    </Text>
                    <Link href="/" className="text-base text-primary">
                        View/Download Document
                    </Link>
                </View>
                <View className="flex-row items-center gap-x-2 mt-1.5">
                    <Text className="text-base text-black-400 font-medium">
                        X-Ray Test:
                    </Text>
                    <Link href="/" className="text-base text-primary">
                        View/Download Document
                    </Link>
                </View>
                <View className="flex-row items-center gap-x-2 mt-1.5">
                    <Text className="text-base text-black-400 font-medium">
                        Depression and Anxiety:
                    </Text>
                    <Link href="/" className="text-base text-primary">
                        View/Download Document
                    </Link>
                </View>
            </View> */}
            </ScrollView>
        </SafeAreaView>
    );
};

export default MedicinesDetail;