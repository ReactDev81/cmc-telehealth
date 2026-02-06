import AddNewAward from "@/components/doctor/profile/add-new-award";
import Button from "@/components/ui/Button";
import { useAuth } from "@/context/UserContext";
import { useDoctorProfile } from "@/queries/doctor/useDoctorProfile";
import { AwardsGroup } from "@/types/live/doctor/profile";
import * as WebBrowser from 'expo-web-browser';
import { Award, FileText } from 'lucide-react-native';
import { useState } from "react";
import { ActivityIndicator, Image, Modal, ScrollView, Text, View } from "react-native";


const AwardsScreen = () => {
    const { user } = useAuth();
    const doctorID = user?.id || "";

    const { data: profileResponse, isLoading } = useDoctorProfile<AwardsGroup>(
        doctorID,
        "awards_info"
    );

    const awards = profileResponse?.data?.awards_info || [];

    const [modalVisible, setModalVisible] = useState(false);

    const handleViewAward = async (url: string) => {
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
                        <AddNewAward
                            existingAwards={awards}
                            onClose={() => setModalVisible(false)}
                        />
                    </View>
                </View>
            </Modal>

            {/* Page Content */}
            <ScrollView className="flex-1 p-5">

                <View className="flex-row justify-end items-center mb-6">
                    <Button className="px-4 py-2" onPress={() => setModalVisible(true)}>Add New</Button>
                </View>

                {isLoading ? (
                    <View className="mt-10">
                        <ActivityIndicator size="large" color="#013220" />
                    </View>
                ) : awards.length > 0 ? (
                    <View className="gap-y-4">
                        {awards.map((award, index) => (
                            <View key={index} className="border border-black-200 rounded-xl p-4 flex-row gap-x-3 mt-5">
                                <View className="w-9 h-9 rounded-full bg-primary-200 items-center justify-center mt-0.5">
                                    {award.award_image && !award.award_image.toLowerCase().endsWith('.pdf') ? (
                                        <Image
                                            source={{ uri: award.award_image }}
                                            className="w-full h-full rounded-full"
                                            resizeMode="cover"
                                        />
                                    ) : award.award_image?.toLowerCase().endsWith('.pdf') ? (
                                        <FileText color="#013220" size={16} />
                                    ) : (
                                        <Award color="#013220" size={16} />
                                    )}
                                </View>
                                <View className="flex-1">
                                    <View className="flex-row justify-between items-start">
                                        <View className="flex-1">
                                            <Text className="text-base font-semibold text-black" numberOfLines={2}>
                                                {award.title}
                                            </Text>
                                        </View>
                                    </View>
                                    <Button
                                        className="max-w-32 [&]:py-3 mt-2.5"
                                        onPress={() => handleViewAward(award.award_image)}
                                    >
                                        View Award
                                    </Button>
                                </View>
                            </View>
                        ))}
                    </View>
                ) : (
                    <View className="items-center justify-center mt-20 opacity-40">
                        <Award size={64} color="#000" />
                        <Text className="text-black text-base mt-4">No awards added yet.</Text>
                    </View>
                )}

            </ScrollView>

        </View>
    )
}

export default AwardsScreen
