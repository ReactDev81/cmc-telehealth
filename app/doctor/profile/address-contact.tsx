import EditAddressContact from "@/components/doctor/profile/edit-address-contact";
import Button from "@/components/ui/Button";
import { useAuth } from "@/context/UserContext";
import { useDoctorProfile } from "@/queries/doctor/useDoctorProfile";
import { AddressContact } from "@/types/live/doctor/profile";
import { MapPin } from 'lucide-react-native';
import { useState } from "react";
import { ActivityIndicator, Modal, ScrollView, Text, View } from "react-native";


const AddressContactScreen = () => {
    const { user } = useAuth();
    const doctorID = user?.id || "";

    const { data: profileResponse, isLoading } = useDoctorProfile<AddressContact>(
        doctorID,
        "address_contact"
    );

    const addressData = profileResponse?.data;

    const [modalVisible, setModalVisible] = useState(false);

    return (
        <View className="flex-1 bg-white">

            {/* Modal */}
            <Modal
                visible={modalVisible}
                animationType="fade"
                transparent
                onRequestClose={() => setModalVisible(false)}
            >
                <View className="flex-1 bg-black/40 justify-center items-center">
                    <View className="w-11/12 bg-white rounded-2xl">
                        <EditAddressContact
                            initialData={addressData}
                            onClose={() => setModalVisible(false)}
                        />
                    </View>
                </View>
            </Modal>

            {/* Page Content */}
            <ScrollView className="flex-1 p-5">

                <Button className="max-w-52 ml-auto" onPress={() => setModalVisible(true)}>Edit Address & Contact</Button>

                {isLoading ? (
                    <View className="mt-10">
                        <ActivityIndicator size="large" color="#013220" />
                    </View>
                ) : addressData ? (
                    <View className="mt-5 border border-black-200 rounded-xl p-5">
                        <View className="flex-row items-center gap-x-3 mb-4">
                            <View className="w-9 h-9 rounded-full bg-primary-200 items-center justify-center">
                                <MapPin color="#013220" size={16} />
                            </View>
                            <Text className="text-lg font-semibold text-black">Address Information</Text>
                        </View>

                        <View className="gap-y-4">
                            <View>
                                <Text className="text-black-400 text-sm">Address Line 1</Text>
                                <Text className="text-base text-black mt-0.5">{addressData.address_line1 || "Not specified"}</Text>
                            </View>

                            <View>
                                <Text className="text-black-400 text-sm">Address Line 2</Text>
                                <Text className="text-base text-black mt-0.5">{addressData.address_line2 || "Not specified"}</Text>
                            </View>

                            <View className="flex-row">
                                <View className="flex-1">
                                    <Text className="text-black-400 text-sm">City</Text>
                                    <Text className="text-base text-black mt-0.5">{addressData.city || "Not specified"}</Text>
                                </View>
                                <View className="flex-1">
                                    <Text className="text-black-400 text-sm">State</Text>
                                    <Text className="text-base text-black mt-0.5">{addressData.state || "Not specified"}</Text>
                                </View>
                            </View>

                            <View className="flex-row">
                                <View className="flex-1">
                                    <Text className="text-black-400 text-sm">Country</Text>
                                    <Text className="text-base text-black mt-0.5">{addressData.country || "Not specified"}</Text>
                                </View>
                                <View className="flex-1">
                                    <Text className="text-black-400 text-sm">Postal Code</Text>
                                    <Text className="text-base text-black mt-0.5">{addressData.postal_code || "Not specified"}</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                ) : (
                    <View className="items-center justify-center mt-10">
                        <Text className="text-black-400">No address information added yet.</Text>
                    </View>
                )}

            </ScrollView>

        </View>
    )
}

export default AddressContactScreen
