import MenuItem from "@/components/common/profile/menu-item";
import DoctorProfileEdit from "@/components/doctor/profile/doctor-profile-edit";
import Button from "@/components/ui/Button";
import ConfirmationModal from "@/components/ui/ConfirmationModal";
import { useAuth } from "@/context/UserContext";
import { DoctorMenuSections } from "@/json-data/doctor/profile";
import { router } from "expo-router";
import { useState } from "react";
import { ScrollView, Text, View } from "react-native";


const Profile = () => {
    const { logout, user } = useAuth();
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    const handleLogout = async () => {
        await logout();
        router.replace("/auth/login");
    };

    return (
        <ScrollView
            showsVerticalScrollIndicator={false}
            className='flex-1 p-5 bg-white'
        >
            <DoctorProfileEdit user={user} />

            {/* menu items */}
            <View className='mt-5'>
                {DoctorMenuSections.map((section, sectionIndex) => (
                    <View key={sectionIndex} className="mb-6">
                        {section.title && (
                            <Text className="text-lg font-medium text-black px-4 py-3">
                                {section.title}
                            </Text>
                        )}
                        <View className="bg-white">
                            {section.items.map((item, itemIndex) => (
                                <MenuItem
                                    key={item.id}
                                    icon={item.icon}
                                    title={item.title}
                                    description={item.description}
                                    onPress={() => router.push(item.route as any)}
                                    showBorder={itemIndex !== section.items.length - 1}
                                />
                            ))}
                        </View>
                    </View>
                ))}
            </View>

            {/* app version info and logout button */}
            <View className='mt-7 mb-16'>
                <Text className='text-sm text-black-400 text-center'>CMC - v 1.1 (518)</Text>
                <Button
                    className='mt-7'
                    onPress={() => setShowLogoutModal(true)}
                >
                    Logout
                </Button>
            </View>

            <ConfirmationModal
                visible={showLogoutModal}
                title="Logout"
                message="Are you sure you want to log out of your account?"
                confirmText="Log Out"
                onConfirm={handleLogout}
                onCancel={() => setShowLogoutModal(false)}
                variant="danger"
            />
        </ScrollView>
    )
}

export default Profile;