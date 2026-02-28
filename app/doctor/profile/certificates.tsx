import FormLayout from "@/app/formLayout";
import AddNewCertificates from "@/components/doctor/profile/add-new-certificates";
import Button from "@/components/ui/Button";
import EmptyState from "@/components/ui/EmptyState";
import { useAuth } from "@/context/UserContext";
import { useDoctorProfile } from "@/queries/doctor/useDoctorProfile";
import { CertificationsGroup } from "@/types/live/doctor/profile";
import * as WebBrowser from "expo-web-browser";
import { Award, FileText } from "lucide-react-native";
import { useState } from "react";
import { ActivityIndicator, Image, Modal, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Certificates = () => {

    const { user } = useAuth();
    const doctorID = user?.id || "";
    const {
        data: profileResponse,
        isLoading,
        refetch,
    } = useDoctorProfile<CertificationsGroup>(doctorID, "certifications_info");

    const certificates = (
        profileResponse?.data?.certifications_info || []
    ).filter(
        (cert) => cert.name || cert.organization || cert.certification_image,
    );

    const [modalVisible, setModalVisible] = useState(false);

    const handleViewCertificate = async (url: string) => {
        if (!url) return;
        await WebBrowser.openBrowserAsync(url);
    };

    return (
        <SafeAreaView className="flex-1 bg-white">

            {/* Modal */}
            <Modal
                visible={modalVisible}
                animationType="fade"
                transparent
                onRequestClose={() => setModalVisible(false)}
            >
                <FormLayout transparent>
                    <View className="flex-1 bg-black/40 justify-center items-center">
                        <View className="w-11/12 bg-white rounded-2xl">
                            <AddNewCertificates
                                existingCertificates={certificates}
                                onClose={() => setModalVisible(false)}
                                onSuccess={() => {
                                    setModalVisible(false);
                                    refetch();
                                }}
                            />
                        </View>
                    </View>
                </FormLayout>
            </Modal>

            {/* Page Content */}
            <ScrollView 
                className="flex-1 p-5"
                contentContainerStyle={{ paddingBottom: 40 }}
            >

                <Button
                    className="max-w-52 ml-auto"
                    onPress={() => setModalVisible(true)}
                >
                    Add New Certificate
                </Button>

                {isLoading ? (
                    <View className="mt-10">
                        <ActivityIndicator size="large" color="#013220" />
                    </View>
                ) : certificates.length > 0 ? (
                    certificates.map((certificate, index) => {
                        return (
                            <View
                                key={index}
                                className="border border-black-200 rounded-xl p-4 gap-x-3 mt-5"
                            >
                                <View className="flex-1">
                                    <Text className="text-base text-black font-semibold">
                                        {certificate.name}
                                    </Text>
                                    <Text className="text-black-400 text-sm mt-1">
                                        {certificate.organization}
                                    </Text>
                                </View>
                                
                                <View className="w-full h-40 items-center justify-center mt-3 rounded-lg overflow-hidden">
                                    {certificate.certification_image &&
                                    !certificate.certification_image.toLowerCase().endsWith(".pdf") ? (
                                        <Image
                                            source={{ uri: certificate.certification_image }}
                                            className="w-full h-full"
                                            resizeMode="contain"
                                        />
                                    ) : certificate.certification_image?.toLowerCase().endsWith(".pdf") ? (
                                        <FileText color="#013220" size={16} />
                                    ) : (
                                        <Award color="#013220" size={16} />
                                    )}
                                </View>
                            </View>
                        );
                    })
                ) : (
                    <EmptyState
                        title="No Certificates"
                        message="You haven't added any professional certificates yet. Add your certifications to build credibility."
                        icon={<FileText size={48} color="#94A3B8" />}
                        className="mt-10"
                    />
                )}
            </ScrollView>
        </SafeAreaView>
    );
};

export default Certificates;
