import AddNewAward from "@/components/doctor/profile/add-new-award";
import Button from "@/components/ui/Button";
import EmptyState from "@/components/ui/EmptyState";
import { useAuth } from "@/context/UserContext";
import { useDoctorProfile } from "@/queries/doctor/useDoctorProfile";
import { useUpdateDoctorProfile } from "@/queries/doctor/useUpdateDoctorProfile";
import { AwardsGroup } from "@/types/live/doctor/profile";
import { useIsFocused } from "@react-navigation/native";
import * as WebBrowser from "expo-web-browser";
import { Award, FileText, Pencil, Trash2 } from "lucide-react-native";
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Image, Modal, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const AwardsScreen = () => {

    const { user } = useAuth();
    const doctorID = user?.id || "";
    const isFocused = useIsFocused();
    const { data: profileResponse, isLoading, error, refetch } = useDoctorProfile<AwardsGroup>(doctorID, "awards_info");
    const awards = profileResponse?.data?.awards_info || [];
    const [modalVisible, setModalVisible] = useState(false);
    const [editIndex, setEditIndex] = useState<number | undefined>();
    const [editData, setEditData] = useState<any | undefined>();

    const { mutate: updateProfile } = useUpdateDoctorProfile(doctorID, "awards_info");

    const handleDelete = (index: number) => {
        Alert.alert(
            "Delete Award",
            "Are you sure you want to delete this award?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: () => {
                        const updatedAwards = awards.filter((_, i) => i !== index);
                        updateProfile({ awards_info: updatedAwards }, {
                            onSuccess: () => {
                                Alert.alert("Success", "Award deleted successfully!");
                                refetch();
                            },
                            onError: (error: any) => {
                                Alert.alert(
                                    "Error",
                                    error?.response?.data?.errors?.message || "Something went wrong while deleting the award"
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

    // Refetch when screen comes into focus
    useEffect(() => {
        if (isFocused && doctorID) {
            refetch();
        }
    }, [isFocused]);

    const handleViewAward = async (url: string) => {
        if (!url) return;
        await WebBrowser.openBrowserAsync(url);
    };

    const handleAwardAdded = () => {
        // Refetch the awards list after successful addition
        refetch();
        setModalVisible(false);
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
                <View className="flex-1 bg-black/40 justify-center items-center">
                    <View className="w-11/12 bg-white rounded-2xl">
                        <AddNewAward
                            existingAwards={awards}
                            onClose={() => setModalVisible(false)}
                            onSuccess={handleAwardAdded}
                            editIndex={editIndex}
                            editData={editData}
                        />
                    </View>
                </View>
            </Modal>

            {/* Page Content */}
            <ScrollView
                className="flex-1 p-5"
                contentContainerStyle={{ paddingBottom: 40 }}
            >

                <View className="flex-row justify-end items-center">
                    <Button className="px-4 py-2" onPress={openAddModal}>
                        Add New
                    </Button>
                </View>

                {isLoading ? (
                    <View className="mt-10">
                        <ActivityIndicator size="large" color="#013220" />
                    </View>
                ) : awards.length > 0 ? (
                    <View className="gap-y-4">
                        {awards.map((award, index) => (
                            <View
                                key={index}
                                className="border border-black-200 p-4 gap-x-3 mt-5 relative"
                            >
                                <View className="flex-row items-start justify-between pr-8">
                                    <Text
                                        className="text-base font-semibold text-black"
                                        numberOfLines={2}
                                    >
                                        {award.title}
                                    </Text>
                                </View>

                                <View className="absolute top-4 right-4 z-10 flex-row items-center gap-x-1 bg-white rounded-md">
                                    <TouchableOpacity
                                        onPress={() => openEditModal(index, award)}
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
                                    {award.award_image &&
                                        !award.award_image.toLowerCase().endsWith(".pdf") ? (
                                        <Image
                                            source={{ uri: award.award_image }}
                                            className="w-full h-full"
                                            resizeMode="contain"
                                        />
                                    ) : award.award_image?.toLowerCase().endsWith(".pdf") ? (
                                        <FileText color="#013220" size={16} />
                                    ) : (
                                        <Award color="#013220" size={16} />
                                    )}
                                </View>
                            </View>
                        ))}
                    </View>
                ) : (
                    <EmptyState
                        title="No Awards"
                        message={((error as any)?.response?.data?.errors?.message ??
                            (error as any)?.message ??
                            "You haven't added any awards yet.")}
                        icon={<Award size={48} color="#94A3B8" />}
                    />
                )}
            </ScrollView>
        </SafeAreaView>
    );
};

export default AwardsScreen;
