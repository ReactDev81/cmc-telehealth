import { useAuth } from "@/context/UserContext";
import { useDeleteAccount } from "@/mutations/patient/useDeleteAccount";
import { MenuItemData } from "@/types/common/profile";
import { useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import { useState } from "react";
import { Alert, Linking, ScrollView, Text, View } from "react-native";
import MenuItem from "../../components/common/profile/menu-item";
import ProfileEdit from "../../components/common/profile/profile-edit";
import Button from "../../components/ui/Button";
import ConfirmationModal from "../../components/ui/ConfirmationModal";
import { menuSections } from "../../json-data/patient/profile";

const Profile = () => {
    const { logout, user } = useAuth();
    const queryClient = useQueryClient();
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const deleteAccountMutation = useDeleteAccount();

    const handleLogout = async () => {
        await logout();
        queryClient.clear();
        if (typeof router.canDismiss === "function" && router.canDismiss()) {
            router.dismissAll();
        }
        router.replace("/auth/login");
    };

    const handleMenuItemPress = (item: MenuItemData) => {
        if (item.id === "delete-account" || item.action === "delete-account") {
            setShowDeleteModal(true);
            return;
        }

        if (item.route) {
            if (item.route.startsWith("http")) {
                Linking.openURL(item.route).catch((err) =>
                    console.log("Failed to open URL:", err)
                );
            } else {
                router.push(item.route as any);
            }
        }
    };

    const handleDeleteAccount = () => {
        deleteAccountMutation.mutate(undefined, {
            onSuccess: async (res) => {
                setShowDeleteModal(false);
                await logout();
                queryClient.clear();
                if (typeof router.canDismiss === "function" && router.canDismiss()) {
                    router.dismissAll();
                }
                Alert.alert(
                    "Account Deleted",
                    res?.message || "Your account has been deleted successfully."
                );
                router.replace("/auth/login");
            },
            onError: (error: any) => {
                const message =
                    error?.response?.data?.message ||
                    error?.response?.data?.error ||
                    error?.message ||
                    "Failed to delete account. Please try again.";
                Alert.alert("Error", message);
            },
        });
    };

    return (
        <ScrollView
            showsVerticalScrollIndicator={false}
            className="flex-1 p-5 bg-white"
        >
            {/* profile edit */}
            <ProfileEdit user={user} />

            {/* menu items */}
            <View className="mt-5">
                {menuSections.map((section, sectionIndex) => (
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
                                    onPress={() => handleMenuItemPress(item)}
                                    showBorder={itemIndex !== section.items.length - 1}
                                    iconBgColor={item.iconBgColor}
                                    danger={item.danger}
                                />
                            ))}
                        </View>
                    </View>
                ))}
            </View>

            {/* app version info and logout button */}
            <View className="mt-7 mb-16">
                <Text className='text-sm text-black-400 text-center'>CMCL Telehealth - v 1.0.0</Text>
                <Button
                    className="mt-7"
                    onPress={() => setShowLogoutModal(true)}
                >
                    Logout
                </Button>
            </View>

            {/* Logout confirmation modal */}
            <ConfirmationModal
                visible={showLogoutModal}
                title="Logout"
                message="Are you sure you want to log out of your account?"
                confirmText="Log Out"
                onConfirm={handleLogout}
                onCancel={() => setShowLogoutModal(false)}
                variant="danger"
            />

            {/* Delete Account confirmation modal */}
            <ConfirmationModal
                visible={showDeleteModal}
                title="Delete Account"
                message="Are you sure you want to delete your account? This action is permanent and cannot be undone."
                confirmText={deleteAccountMutation.isPending ? "Deleting..." : "Delete Account"}
                cancelText="Cancel"
                onConfirm={handleDeleteAccount}
                onCancel={() => {
                    if (!deleteAccountMutation.isPending) {
                        setShowDeleteModal(false);
                    }
                }}
                variant="danger"
                isLoading={deleteAccountMutation.isPending}
            />

        </ScrollView>
    );
};

export default Profile;
