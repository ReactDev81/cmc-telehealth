import MedicineAccordian from "@/components/patient/my-medicines/medicine-accordian";
import { prescriptionData } from "@/json-data/doctor/start-consulation";
import { X } from "lucide-react-native";
import { useState } from "react";
import { Modal, Text, TouchableOpacity, View } from "react-native";
import AddNewPrescription from "./add-new-prescription";

const AddPrescription = ({ onClose }: { onClose: () => void }) => {
    const [modalVisible, setModalVisible] = useState(false);

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

            {/* Header */}
            <View
                className="flex-row items-center justify-between p-5 pt-0"
                style={{
                    boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.25)",
                }}
            >
                <Text className="text-lg font-medium text-black">Prescription</Text>
                <TouchableOpacity onPress={onClose}>
                    <X color="#1F1E1E" size={18} strokeWidth={2.5} />
                </TouchableOpacity>
            </View>

            <View className="pb-14 px-5">
                <View className="mt-5">
                    {prescriptionData.map((prescription, index) => (
                        <MedicineAccordian
                            key={prescription.id}
                            medicine={prescription}
                            defaultExpanded={true}
                            index={index}
                        />
                    ))}
                </View>
            </View>
        </View>
    );
};

export default AddPrescription;
