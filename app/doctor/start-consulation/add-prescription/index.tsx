import MedicineAccordian from "@/components/patient/my-medicines/medicine-accordian";
import Button from "@/components/ui/Button";
import { prescriptionData } from "@/json-data/doctor/start-consulation";
import { Plus } from "lucide-react-native";
import { useState } from "react";
import { Modal, Text, View } from "react-native";
import AddNewPrescription from "./add-new-prescription";

const AddPrescription = () => {
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

            <View className="pt-5 pb-14 px-5">
                {/* patient info */}
                <View className="mb-7">
                    <Text className="text-lg font-medium text-black">Rohan Singh</Text>
                    <View className="flex-row items-center gap-x-2 mt-0.5">
                        <Text className="text-sm text-black-400">42 Years</Text>
                        <View className="w-1 h-1 rounded-full bg-gray mt-0.5"></View>
                        <Text className="text-sm text-black-400">Male</Text>
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
