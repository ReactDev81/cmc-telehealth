import FormLayout from "@/app/formLayout";
import EditSocialMedia from "@/components/doctor/profile/edit-social-media";
import Button from "@/components/ui/Button";
import { useAuth } from "@/context/UserContext";
import { useDoctorProfile } from "@/queries/doctor/useDoctorProfile";
import { useUpdateDoctorProfile } from "@/queries/doctor/useUpdateDoctorProfile";
import { SocialMediaGroup } from "@/types/live/doctor/profile";
import { Link } from "expo-router";
import { Facebook, Instagram, Linkedin, Trash2, Twitter } from "lucide-react-native";
import { useState } from "react";
import { ActivityIndicator, Alert, Modal, ScrollView, Text, TouchableOpacity, View } from "react-native";

const SocialMedia = () => {

    const { user } = useAuth();
    const doctorID = user?.id || "";
    const { data: profileResponse, isLoading, isError, error, refetch } = useDoctorProfile<SocialMediaGroup>(doctorID, "social_media");
    const socialLinks = profileResponse?.data?.social_links || {};
    const [modalVisible, setModalVisible] = useState(false);

    const { mutate: updateProfile } = useUpdateDoctorProfile(doctorID, "social_media");

    const handleDelete = (platform: keyof typeof socialLinks) => {
        Alert.alert(
            "Delete Link",
            `Are you sure you want to delete your ${platform} link?`,
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: () => {
                        const fd = new FormData();
                        fd.append("social_links[facebook]", platform === 'facebook' ? '' : (socialLinks.facebook || ''));
                        fd.append("social_links[linkedin]", platform === 'linkedin' ? '' : (socialLinks.linkedin || ''));
                        fd.append("social_links[instagram]", platform === 'instagram' ? '' : (socialLinks.instagram || ''));
                        fd.append("social_links[twitter]", platform === 'twitter' ? '' : (socialLinks.twitter || ''));
                        fd.append("group", "social_media");

                        updateProfile(fd, {
                            onSuccess: () => {
                                Alert.alert("Success", "Link deleted successfully!");
                                refetch();
                            },
                            onError: (error: any) => {
                                Alert.alert("Error", error?.response?.data?.errors?.message || "Something went wrong while deleting the link");
                            }
                        });
                    }
                }
            ]
        );
    };

    if (isError) {
        return (
            <View className="flex-1 items-center justify-center p-5">
                <Text className="text-base text-red-500">
                    {((error as any)?.response?.data?.errors?.message ??
                        (error as any)?.message ??
                        "Something went wrong")}
                </Text>
            </View>
        );
    }

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
                            <EditSocialMedia
                                existingLinks={socialLinks}
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
            <ScrollView className="flex-1 p-5">
                <Button
                    className="max-w-52 ml-auto"
                    onPress={() => setModalVisible(true)}
                >
                    Add / Edit Social Media
                </Button>

                {isLoading ? (
                    <View className="mt-10">
                        <ActivityIndicator size="large" color="#013220" />
                    </View>
                ) : (
                    <View className="mt-5 gap-y-5">

                        <View className="border border-black-200 rounded-xl p-4 flex-row gap-x-3 relative">
                            <View className="w-9 h-9 rounded-full bg-primary-200 items-center justify-center mt-0.5">
                                <Facebook color="#013220" size={16} />
                            </View>
                            <View className="flex-1 pr-12">
                                <Text className="text-base text-black font-semibold">
                                    Facebook
                                </Text>

                                {socialLinks.facebook ?
                                    <Link href={socialLinks.facebook as any}>
                                        <Text className="text-primary text-sm mt-0.5">
                                            {socialLinks.facebook}
                                        </Text>
                                    </Link>
                                    :
                                    <Text className="text-black-400 text-sm mt-0.5">
                                        Not added yet
                                    </Text>
                                }
                            </View>
                            <View className="absolute top-4 right-4 z-10 flex-row items-center gap-x-1 bg-white rounded-md">
                                {socialLinks.facebook ? (
                                    <TouchableOpacity onPress={() => handleDelete('facebook')} className="p-1">
                                        <Trash2 size={16} color="#ef4444" />
                                    </TouchableOpacity>
                                ) : null}
                            </View>
                        </View>

                        <View className="border border-black-200 rounded-xl p-4 flex-row gap-x-3 relative">
                            <View className="w-9 h-9 rounded-full bg-primary-200 items-center justify-center mt-0.5">
                                <Linkedin color="#013220" size={16} />
                            </View>
                            <View className="flex-1 pr-12">

                                <Text className="text-base text-black font-semibold">
                                    LinkedIn
                                </Text>

                                {socialLinks.linkedin ?
                                    <Link href={socialLinks.linkedin as any}>
                                        <Text className="text-primary text-sm mt-0.5">
                                            {socialLinks.linkedin}
                                        </Text>
                                    </Link>
                                    :
                                    <Text className="text-black-400 text-sm mt-0.5">
                                        Not added yet
                                    </Text>
                                }
                            </View>
                            <View className="absolute top-4 right-4 z-10 flex-row items-center gap-x-1 bg-white rounded-md">
                                {socialLinks.linkedin ? (
                                    <TouchableOpacity onPress={() => handleDelete('linkedin')} className="p-1">
                                        <Trash2 size={16} color="#ef4444" />
                                    </TouchableOpacity>
                                ) : null}
                            </View>
                        </View>

                        <View className="border border-black-200 rounded-xl p-4 flex-row gap-x-3 relative">
                            <View className="w-9 h-9 rounded-full bg-primary-200 items-center justify-center mt-0.5">
                                <Instagram color="#013220" size={16} />
                            </View>
                            <View className="flex-1 pr-12">
                                <Text className="text-base text-black font-semibold">
                                    Instagram
                                </Text>
                                {socialLinks.instagram ?
                                    <Link href={socialLinks.instagram as any}>
                                        <Text className="text-primary text-sm mt-0.5">
                                            {socialLinks.instagram}
                                        </Text>
                                    </Link>
                                    :
                                    <Text className="text-black-400 text-sm mt-0.5">
                                        Not added yet
                                    </Text>
                                }
                            </View>
                            <View className="absolute top-4 right-4 z-10 flex-row items-center gap-x-1 bg-white rounded-md">
                                {socialLinks.instagram ? (
                                    <TouchableOpacity onPress={() => handleDelete('instagram')} className="p-1">
                                        <Trash2 size={16} color="#ef4444" />
                                    </TouchableOpacity>
                                ) : null}
                            </View>
                        </View>

                        <View className="border border-black-200 rounded-xl p-4 flex-row gap-x-3 relative">
                            <View className="w-9 h-9 rounded-full bg-primary-200 items-center justify-center mt-0.5">
                                <Twitter color="#013220" size={16} />
                            </View>
                            <View className="flex-1 pr-12">
                                <Text className="text-base text-black font-semibold">
                                    Twitter (X)
                                </Text>
                                {socialLinks.twitter ?
                                    <Link href={socialLinks.twitter as any}>
                                        <Text className="text-primary text-sm mt-0.5">
                                            {socialLinks.twitter}
                                        </Text>
                                    </Link>
                                    :
                                    <Text className="text-black-400 text-sm mt-0.5">
                                        Not added yet
                                    </Text>
                                }
                            </View>
                            <View className="absolute top-4 right-4 z-10 flex-row items-center gap-x-1 bg-white rounded-md">
                                {socialLinks.twitter ? (
                                    <TouchableOpacity onPress={() => handleDelete('twitter')} className="p-1">
                                        <Trash2 size={16} color="#ef4444" />
                                    </TouchableOpacity>
                                ) : null}
                            </View>
                        </View>

                    </View>
                )}
            </ScrollView>
        </View>
    );
};

export default SocialMedia;