import FormLayout from "@/app/formLayout";
import AddNewEducationHistory from "@/components/doctor/profile/add-education-history";
import Button from "@/components/ui/Button";
import EmptyState from "@/components/ui/EmptyState";
import { useAuth } from "@/context/UserContext";
import { useDoctorProfile } from "@/queries/doctor/useDoctorProfile";
import { useUpdateDoctorProfile } from "@/queries/doctor/useUpdateDoctorProfile";
import { EducationHistoryGroup, EducationInfo } from "@/types/live/doctor/profile";
import { GraduationCap, Pencil, Trash2 } from "lucide-react-native";
import { useState } from "react";
import { ActivityIndicator, Alert, Modal, ScrollView, Text, TouchableOpacity, View } from "react-native";

const EducationHistory = () => {

    const { user } = useAuth();
    const doctorID = user?.id || "";
    const { data: profileResponse, isLoading, error } = useDoctorProfile<EducationHistoryGroup>(doctorID, "education_info");
    const educationHistory = profileResponse?.data?.education_info || [];
    const [modalVisible, setModalVisible] = useState(false);
    const [editIndex, setEditIndex] = useState<number | undefined>();
    const [editData, setEditData] = useState<EducationInfo | undefined>();

    const { mutate: updateProfile } = useUpdateDoctorProfile(doctorID, "education_info");

    const handleDelete = (index: number) => {
        Alert.alert(
            "Delete Education History",
            "Are you sure you want to delete this education history?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: () => {
                        const updatedEducation = educationHistory.filter((_, i) => i !== index);
                        updateProfile({ education_info: updatedEducation }, {
                            onSuccess: () => {
                                Alert.alert("Success", "Education history deleted successfully!");
                            },
                            onError: (error: any) => {
                                Alert.alert(
                                    "Error",
                                    error?.response?.data?.errors?.message || "Something went wrong while deleting the education history"
                                );
                            }
                        });
                    }
                }
            ]
        );
    };

    const openEditModal = (index: number, data: EducationInfo) => {
        setEditIndex(index);
        setEditData(data);
        setModalVisible(true);
    };

    const openAddModal = () => {
        setEditIndex(undefined);
        setEditData(undefined);
        setModalVisible(true);
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
                <FormLayout transparent>
                    <View className="flex-1 bg-black/40 justify-center items-center">
                        <View className="w-11/12 bg-white rounded-2xl">
                            <AddNewEducationHistory
                                existingEducation={educationHistory}
                                onClose={() => setModalVisible(false)}
                                editIndex={editIndex}
                                editData={editData}
                            />
                        </View>
                    </View>
                </FormLayout>
            </Modal>

            {/* Page Content */}
            <ScrollView className="flex-1 p-5">

                <Button
                    className="max-w-52 ml-auto"
                    onPress={openAddModal}
                >
                    Add Education History
                </Button>

                {isLoading ? (
                    <View className="mt-10">
                        <ActivityIndicator size="large" color="#013220" />
                    </View>
                ) : educationHistory.length > 0 ? (
                    educationHistory.map((education, index) => {
                        return (
                            <View
                                key={index}
                                className="border border-black-200 rounded-xl p-4 flex-row gap-x-3 mt-5 items-start"
                            >
                                <View className="w-9 h-9 rounded-full bg-primary-200 items-center justify-center mt-0.5">
                                    <GraduationCap color="#013220" size={16} />
                                </View>

                                <View className="flex-1">
                                    <Text className="text-base text-black font-semibold pr-6">
                                        {education.degree}
                                    </Text>
                                    <Text className="text-black-400 text-sm mt-0.5">
                                        {education.institution}
                                    </Text>
                                    <View className="flex-row mt-1">
                                        <Text className="text-primary text-sm">
                                            {education.start_date} -{" "}
                                        </Text>
                                        <Text className="text-primary text-sm">
                                            {education.end_date}
                                        </Text>
                                    </View>
                                </View>

                                <View className="flex-row items-center gap-x-1">
                                    <TouchableOpacity
                                        onPress={() => openEditModal(index, education)}
                                        className="p-2"
                                    >
                                        <Pencil size={16} color="#013220" />
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={() => handleDelete(index)}
                                        className="p-2"
                                    >
                                        <Trash2 size={16} color="#ef4444" />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        );
                    })
                ) : (
                    <EmptyState
                        title="No Education History"
                        message={((error as any)?.response?.data?.errors?.message ??
                            (error as any)?.message ??
                            "You haven't added your educational background yet. Add your degrees and qualifications.")}
                        icon={<GraduationCap size={48} color="#94A3B8" />}
                        className="mt-10"
                    />
                )}
            </ScrollView>

        </View>
    );
};

export default EducationHistory;