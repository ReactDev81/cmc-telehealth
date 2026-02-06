import AddNewCertificates from "@/components/doctor/profile/add-new-certificates";
import Button from "@/components/ui/Button";
import { useAuth } from "@/context/UserContext";
import { useDoctorProfile } from "@/queries/doctor/useDoctorProfile";
import { CertificationsGroup } from "@/types/live/doctor/profile";
import * as WebBrowser from 'expo-web-browser';
import { FileText } from 'lucide-react-native';
import { useState } from "react";
import { ActivityIndicator, Modal, ScrollView, Text, View } from "react-native";


const Certificates = () => {
    const { user } = useAuth();
    const doctorID = user?.id || "";

    const { data: profileResponse, isLoading } = useDoctorProfile<CertificationsGroup>(
        doctorID,
        "certifications_info"
    );

    const certificates = profileResponse?.data?.certifications_info || [];

    const [modalVisible, setModalVisible] = useState(false);

    const handleViewCertificate = async (url: string) => {
        if (!url) return;
        await WebBrowser.openBrowserAsync(url);
    };

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
                        <AddNewCertificates
                            existingCertificates={certificates}
                            onClose={() => setModalVisible(false)}
                        />
                    </View>
                </View>
            </Modal>

            {/* Page Content */}
            <ScrollView className="flex-1 p-5">

                <Button className="max-w-52 ml-auto" onPress={() => setModalVisible(true)}>Add New Certificate</Button>

                {isLoading ? (
                    <View className="mt-10">
                        <ActivityIndicator size="large" color="#013220" />
                    </View>
                ) : certificates.length > 0 ? (
                    certificates.map((certificate, index) => {
                        return (
                            <View
                                key={index}
                                className="border border-black-200 rounded-xl p-4 flex-row gap-x-3 mt-5"
                            >

                                <View className="w-9 h-9 rounded-full bg-primary-200 items-center justify-center mt-0.5">
                                    <FileText color="#013220" size={16} strokeWidth={1.5} />
                                </View>

                                <View className="flex-1">
                                    <View className="flex-row justify-between items-start">
                                        <View className="flex-1 pr-2">
                                            <Text className="text-base text-black font-semibold">{certificate.name}</Text>
                                            <Text className="text-black-400 text-sm mt-1">{certificate.organization}</Text>
                                        </View>
                                    </View>
                                    <Button
                                        className="max-w-36 [&]:py-3 mt-2.5"
                                        onPress={() => handleViewCertificate(certificate.certification_image)}
                                    >
                                        View Certificate
                                    </Button>

                                </View>

                            </View>
                        )
                    })
                ) : (
                    <View className="items-center justify-center mt-10">
                        <Text className="text-black-400">No certificates added yet.</Text>
                    </View>
                )}

            </ScrollView>

        </View>
    )
}

export default Certificates
