import FormLayout from "@/app/formLayout";
import AddNewCertificates from "@/components/doctor/profile/add-new-certificates";
import Button from "@/components/ui/Button";
import EmptyState from "@/components/ui/EmptyState";
import { useAuth } from "@/context/UserContext";
import { useDoctorProfile } from "@/queries/doctor/useDoctorProfile";
import { useUpdateDoctorProfile } from "@/queries/doctor/useUpdateDoctorProfile";
import { CertificationsGroup } from "@/types/live/doctor/profile";
import * as WebBrowser from "expo-web-browser";
import { Award, FileText, Pencil, Trash2 } from "lucide-react-native";
import { useState } from "react";
import { ActivityIndicator, Alert, Image, Modal, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Certificates = () => {

    const { user } = useAuth();
    const doctorID = user?.id || "";
    const { data: profileResponse, isLoading, refetch, error } = useDoctorProfile<CertificationsGroup>(doctorID, "certifications_info");

    const certificates = (
        profileResponse?.data?.certifications_info || []
    ).filter(
        (cert) => cert.name || cert.organization || cert.certification_image,
    );

    const [modalVisible, setModalVisible] = useState(false);
    const [editIndex, setEditIndex] = useState<number | undefined>();
    const [editData, setEditData] = useState<any | undefined>();

    const { mutate: updateProfile } = useUpdateDoctorProfile(doctorID, "certifications_info");

    const handleDelete = (index: number) => {
        Alert.alert(
            "Delete Certificate",
            "Are you sure you want to delete this certificate?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: () => {
                        const updatedCertificates = certificates.filter((_, i) => i !== index);
                        updateProfile({ certifications_info: updatedCertificates }, {
                            onSuccess: () => {
                                Alert.alert("Success", "Certificate deleted successfully!");
                                refetch();
                            },
                            onError: (error: any) => {
                                Alert.alert(
                                    "Error",
                                    error?.response?.data?.errors?.message || "Something went wrong while deleting the certificate"
                                );
                            }
                        });
                    }
                }
            ]
        );
    };

    const openEditModal = (index: number, data: any) => {
        setEditIndex(index);
        setEditData(data);
        setModalVisible(true);
    };

    const openAddModal = () => {
        setEditIndex(undefined);
        setEditData(undefined);
        setModalVisible(true);
    };

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
                                editIndex={editIndex}
                                editData={editData}
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
                    onPress={openAddModal}
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
                                className="border border-black-200 rounded-xl p-4 gap-x-3 mt-5 relative"
                            >
                                <View className="flex-1 pr-8">
                                    <Text className="text-base text-black font-semibold">
                                        {certificate.name}
                                    </Text>
                                    <Text className="text-black-400 text-sm mt-1">
                                        {certificate.organization}
                                    </Text>
                                </View>

                                <View className="absolute top-4 right-4 z-10 flex-row items-center gap-x-1 bg-white rounded-md">
                                    <TouchableOpacity
                                        onPress={() => openEditModal(index, certificate)}
                                        className="p-1"
                                    >
                                        <Pencil size={16} color="#013220" />
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={() => handleDelete(index)}
                                        className="p-1"
                                    >
                                        <Trash2 size={16} color="#ef4444" />
                                    </TouchableOpacity>
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
                        message={((error as any)?.response?.data?.errors?.message ??
                            (error as any)?.message ??
                            "You haven't added any professional certificates yet. Add your certifications to build credibility.")}
                        icon={<FileText size={48} color="#94A3B8" />}
                        className="mt-10"
                    />
                )}
            </ScrollView>
        </SafeAreaView>
    );
};

export default Certificates;
