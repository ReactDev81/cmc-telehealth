import MedicineAccordian from "@/components/patient/my-medicines/medicine-accordian";
import Button from "@/components/ui/Button";
import { useAuth } from "@/context/UserContext";
import { usePatientDetail } from "@/queries/doctor/usePatientDetail";
import { useLocalSearchParams } from "expo-router";
import { Plus } from "lucide-react-native";
import { useState } from "react";
import { ActivityIndicator, Modal, Text, View } from "react-native";
import AddNewPrescription from "./add-new-prescription";

const AddPrescription = () => {
    const { token } = useAuth();
    const { appointment_id } = useLocalSearchParams<{ appointment_id: string }>();
    const { data: patient, isLoading, isError } = usePatientDetail(appointment_id || "", token || "");

    const [modalVisible, setModalVisible] = useState(false);

    if (isLoading) {
        return (
            <View className="py-20 items-center justify-center">
                <ActivityIndicator size="large" color="#013220" />
                <Text className="text-black-400 mt-4 font-medium">Loading medications...</Text>
            </View>
        );
    }

    if (isError || !patient) {
        return (
            <View className="py-20 items-center justify-center px-5">
                <Text className="text-red-500 text-center font-medium">Failed to load medications</Text>
            </View>
        );
    }

    const patientData = patient.data;
    const currentMedications = patientData?.current_medications || [];

    return (
        <View>
            {/* Modal */}
            <Modal
                visible={modalVisible}
                animationType="fade"
                transparent
                onRequestClose={() => setModalVisible(false)}
            >
                <View className="flex-1 bg-black/40 justify-center items-center">
                    <View className="w-11/12 bg-white rounded-2xl">
                        <AddNewPrescription onClose={() => setModalVisible(false)} />
                    </View>
                </View>
            </Modal>

            <View className="pt-5 pb-14 px-5">
                {/* patient info */}
                <View className="mb-7">
                    <Text className="text-lg font-medium text-black">{patientData?.name}</Text>
                    <View className="flex-row items-center gap-x-2 mt-0.5">
                        <Text className="text-sm text-black-400">{patientData?.age_display || `${patientData?.age} Years`}</Text>
                        <View className="w-1 h-1 rounded-full bg-gray mt-0.5"></View>
                        <Text className="text-sm text-black-400">{patientData?.gender_label || patientData?.gender}</Text>
                    </View>
                </View>

                {/* add prescription button */}
                <Button
                    icon={<Plus color="#fff" size={16} strokeWidth={3} />}
                    onPress={() => setModalVisible(true)}
                >
                    Add New Prescriptions
                </Button>

                <View className="mt-5">
                    {currentMedications.length > 0 ? (
                        currentMedications.map((prescription: any, index: number) => (
                            <MedicineAccordian
                                key={prescription.id}
                                medicine={prescription}
                                defaultExpanded={true}
                                index={index}
                            />
                        ))
                    ) : (
                        <Text className="text-black-400 text-sm italic mt-4 text-center">No prescriptions added yet</Text>
                    )}
                </View>
            </View>
        </View>
    );
};

export default AddPrescription;
