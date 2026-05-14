import FormLayout from "@/app/formLayout";
import AddNewWorkingExperience from "@/components/doctor/profile/add-working-experience";
import Button from "@/components/ui/Button";
import EmptyState from "@/components/ui/EmptyState";
import { useAuth } from "@/context/UserContext";
import { useDoctorProfile } from "@/queries/doctor/useDoctorProfile";
import { useUpdateDoctorProfile } from "@/queries/doctor/useUpdateDoctorProfile";
import { WorkingExperience, WorkingExperienceGroup } from "@/types/live/doctor/profile";
import { BriefcaseBusiness, Pencil, Trash2 } from "lucide-react-native";
import { useState } from "react";
import { ActivityIndicator, Alert, Modal, ScrollView, Text, TouchableOpacity, View } from "react-native";

const WorkingExperienceScreen = () => {

    const { user } = useAuth();
    const doctorID = user?.id || "";
    const { data: profileResponse, isLoading, error } = useDoctorProfile<WorkingExperienceGroup>(doctorID, "working_experience");
    const workingExperience = profileResponse?.data?.professional_experience_info || [];
    const [modalVisible, setModalVisible] = useState(false);
    const [editingIndex, setEditingIndex] = useState<number | undefined>(undefined);
    const [editingExperience, setEditingExperience] = useState<WorkingExperience | undefined>(undefined);

    const { mutate: updateProfile } = useUpdateDoctorProfile(doctorID, "working_experience");

    const handleAddNew = () => {
        setEditingIndex(undefined);
        setEditingExperience(undefined);
        setModalVisible(true);
    };

    const handleEdit = (index: number, experience: WorkingExperience) => {
        setEditingIndex(index);
        setEditingExperience(experience);
        setModalVisible(true);
    };

    const handleDelete = (index: number) => {
        Alert.alert(
            "Delete Experience",
            "Are you sure you want to delete this working experience?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: () => {
                        const updatedExperiences = workingExperience.filter((_, i) => i !== index);
                        updateProfile({ professional_experience_info: updatedExperiences }, {
                            onSuccess: () => {
                                Alert.alert("Success", "Working experience deleted successfully!");
                            },
                            onError: (error: any) => {
                                Alert.alert(
                                    "Error",
                                    error?.response?.data?.errors?.message || "Something went wrong while deleting experience"
                                );
                            }
                        });
                    }
                }
            ]
        );
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
                            <AddNewWorkingExperience
                                existingExperiences={workingExperience}
                                editingIndex={editingIndex}
                                editingExperience={editingExperience}
                                onClose={() => setModalVisible(false)}
                            />
                        </View>
                    </View>
                </FormLayout>
            </Modal>

            {/* Page Content */}
            <ScrollView className="flex-1 p-5">

                <Button
                    className="max-w-52 ml-auto"
                    onPress={handleAddNew}
                >
                    Add New Experience
                </Button>

                {isLoading ? (
                    <View className="mt-10">
                        <ActivityIndicator size="large" color="#013220" />
                    </View>
                ) : workingExperience.length > 0 ? (workingExperience.map((experience, index) => {
                    return (
                        <View
                            key={index}
                            className="border border-black-200 rounded-xl p-4 flex-row items-center gap-x-3 mt-5"
                        >
                            <View className="w-9 h-9 rounded-full bg-primary-200 items-center justify-center">
                                <BriefcaseBusiness color="#013220" size={16} />
                            </View>

                            <View className="flex-1">
                                <Text className="text-base text-black font-semibold">
                                    {experience.association}
                                </Text>
                                <Text className="text-primary text-sm font-medium mt-0.5">
                                    {experience.start_date + " - " + experience.end_date}
                                </Text>
                            </View>

                            <View className="flex-row items-center gap-x-1">
                                <TouchableOpacity onPress={() => handleEdit(index, experience)} className="p-2">
                                    <Pencil size={16} color="#013220" />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => handleDelete(index)} className="p-2">
                                    <Trash2 size={16} color="#ef4444" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    );
                })
                ) : (
                    <EmptyState
                        title="No Work Experience"
                        message={((error as any)?.response?.data?.errors?.message ??
                            (error as any)?.message ??
                            "You haven't added any work experience yet. Add your experience.")}
                        icon={<BriefcaseBusiness size={48} color="#94A3B8" />}
                        className="mt-10"
                    />
                )}
            </ScrollView>
        </View>
    );
};

export default WorkingExperienceScreen;