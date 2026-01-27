import { UserProvider } from "@/context/UserContext";
import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ChevronLeft } from "lucide-react-native";
import { useState } from "react";
import { TouchableOpacity } from "react-native";
import "react-native-reanimated";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "../global.css";

export const unstable_settings = {
    anchor: "(tabs)",
};

export default function RootLayout() {
    const router = useRouter();

    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        retry: 1,
                        staleTime: 60 * 1000,
                        refetchOnWindowFocus: false,
                    },
                },
            }),
    );

    return (
        <SafeAreaProvider>
            <ThemeProvider value={DefaultTheme}>
                <QueryClientProvider client={queryClient}>
                    <UserProvider>
                        <StatusBar style="dark" />
                        <Stack
                            initialRouteName="splash"
                            screenOptions={{
                                headerStyle: {
                                    backgroundColor: "#FFFFFF",
                                },
                                headerTitleAlign: "left",
                                headerTitleStyle: {
                                    fontSize: 18,
                                    fontWeight: "500",
                                    color: "#1F1E1E",
                                },
                                headerLeft: () => (
                                    <TouchableOpacity
                                        onPress={() => router.back()}
                                        className="-ml-2 pr-3"
                                    >
                                        <ChevronLeft size={24} color="#1F1E1E" />
                                    </TouchableOpacity>
                                ),
                                headerShadowVisible: true,
                            }}
                        >
                            {/* Auth & Splash - No Headers */}
                            <Stack.Screen name="splash" options={{ headerShown: false }} />
                            <Stack.Screen
                                name="auth/login"
                                options={{ headerShown: false }}
                            />
                            <Stack.Screen
                                name="auth/reset-password"
                                options={{ headerShown: false }}
                            />

                            <Stack.Screen
                                name="auth/register-send-otp"
                                options={{ headerShown: false }}
                            />
                            <Stack.Screen
                                name="auth/register-verify-otp"
                                options={{ headerShown: false }}
                            />
                            <Stack.Screen
                                name="auth/register-complete-profile"
                                options={{ headerShown: false }}
                            />

                            <Stack.Screen
                                name="auth/forgot-password-send-otp"
                                options={{ headerShown: false }}
                            />
                            <Stack.Screen
                                name="auth/forgot-password-verify-otp"
                                options={{ headerShown: false }}
                            />
                            <Stack.Screen
                                name="auth/forgot-password-change-password"
                                options={{ headerShown: false }}
                            />

                            <Stack.Screen name="(patient)" options={{ headerShown: false }} />
                            <Stack.Screen name="(doctor)" options={{ headerShown: false }} />
                            <Stack.Screen name="index" options={{ headerShown: false }} />

                            <Stack.Screen
                                name="patient/testimonial"
                                options={{ headerTitle: "Testimonial" }}
                            />

                            <Stack.Screen
                                name="patient/find-doctor"
                                options={{ headerTitle: "Find Doctor" }}
                            />

                            <Stack.Screen
                                name="patient/doctor/[id]"
                                options={{
                                    headerShown: true,
                                    title: "Doctor Profile",
                                }}
                            />

                            <Stack.Screen
                                name="patient/my-medicines/[id]"
                                options={{
                                    headerShown: true,
                                    title: "Medicines Detail",
                                }}
                            />

                            <Stack.Screen
                                name="patient/appointment-summary"
                                options={{
                                    headerShown: true,
                                    title: "Appointment Summary",
                                }}
                            />

                            <Stack.Screen
                                name="patient/past-appointment-details/[id]"
                                options={{
                                    headerShown: true,
                                    title: "Appointment Details",
                                }}
                            />

                            <Stack.Screen
                                name="patient/manage-appointment/[appointment_id]"
                                options={{
                                    headerShown: true,
                                    title: "Manage Appointment",
                                }}
                            />

                            <Stack.Screen
                                name="patient/start-consulation/index"
                                options={{ headerShown: false }}
                            />

                            {/* common screens for patient and doctor */}
                            <Stack.Screen
                                name="common-screens/notifications/index"
                                options={{ headerTitle: "Notifications" }}
                            />

                            <Stack.Screen
                                name="common-screens/notifications/notification-details"
                                options={{ headerTitle: "Notifications" }}
                            />

                            {/* doctor screens */}
                            <Stack.Screen
                                name="doctor/patient-details/[id]"
                                options={{
                                    headerTitle: "Patient Details",
                                }}
                            />

                            <Stack.Screen
                                name="doctor/appointment-detail"
                                options={{
                                    headerTitle: "Appointment Detail",
                                }}
                            />

                            <Stack.Screen
                                name="doctor/start-consulation/index"
                                options={{ headerShown: false }}
                            />

                            {/* Patient Pages - Profile Pages */}
                            <Stack.Screen
                                name="patient/profile/edit-personal-information"
                                options={{
                                    headerTitle: "Edit Personal Information",
                                }}
                            />

                            <Stack.Screen
                                name="patient/profile/medical-reports/index"
                                options={{
                                    headerTitle: "Medical Reports",
                                }}
                            />

                            <Stack.Screen
                                name="patient/profile/medical-reports/upload-your-report"
                                options={{
                                    headerTitle: "Upload Your Report",
                                }}
                            />

                            <Stack.Screen
                                name="patient/profile/write-a-review"
                                options={{
                                    headerTitle: "Write A Review",
                                }}
                            />

                            <Stack.Screen
                                name="patient/profile/manage-address/index"
                                options={{
                                    headerTitle: "Manage Address",
                                }}
                            />

                            <Stack.Screen
                                name="patient/profile/manage-address/add-current-location"
                                options={{
                                    headerTitle: "Add Current Location",
                                }}
                            />

                            <Stack.Screen
                                name="patient/profile/manage-address/choose-different-location"
                                options={{
                                    headerTitle: "Choose Different Location",
                                }}
                            />

                            <Stack.Screen
                                name="patient/profile/transactions/index"
                                options={{
                                    headerTitle: "Transactions",
                                }}
                            />

                            <Stack.Screen
                                name="patient/profile/transactions/[id]"
                                options={{
                                    headerTitle: "Transaction Detail",
                                }}
                            />

                            {/* common profile screens for patient and doctor */}

                            <Stack.Screen
                                name="common-screens/profile/about-us"
                                options={{
                                    headerTitle: "About Us",
                                }}
                            />

                            <Stack.Screen
                                name="common-screens/profile/faq"
                                options={{
                                    headerTitle: "Frequently Asked Questions",
                                }}
                            />

                            <Stack.Screen
                                name="common-screens/profile/need-help"
                                options={{
                                    headerTitle: "Contact Us",
                                }}
                            />

                            <Stack.Screen
                                name="common-screens/profile/rate-us"
                                options={{
                                    headerTitle: "Rate Us",
                                }}
                            />

                            <Stack.Screen
                                name="common-screens/profile/term-condition"
                                options={{
                                    headerTitle: "Term and Condition",
                                }}
                            />

                            <Stack.Screen
                                name="common-screens/profile/privacy-policy"
                                options={{
                                    headerTitle: "Privacy Policy",
                                }}
                            />

                            {/* Doctor - Profile Pages */}
                            <Stack.Screen
                                name="doctor/profile/edit-personal-information"
                                options={{
                                    headerTitle: "Edit Personal Information",
                                }}
                            />

                            <Stack.Screen
                                name="doctor/profile/working-experience"
                                options={{
                                    headerTitle: "Working Experience",
                                }}
                            />

                            <Stack.Screen
                                name="doctor/profile/education-history"
                                options={{
                                    headerTitle: "Education History",
                                }}
                            />

                            <Stack.Screen
                                name="doctor/profile/certificates"
                                options={{
                                    headerTitle: "Certificates",
                                }}
                            />

                            <Stack.Screen
                                name="doctor/profile/usage-analytics"
                                options={{
                                    headerTitle: "Usage Analytics",
                                }}
                            />
                        </Stack>
                    </UserProvider>
                </QueryClientProvider>
            </ThemeProvider>
        </SafeAreaProvider>
    );
}
