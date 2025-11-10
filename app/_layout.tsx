import 'react-native-reanimated';
import "../global.css";
import { ThemeProvider, DefaultTheme } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { TouchableOpacity } from 'react-native';
import { ChevronLeft } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { UserProvider } from '@/context/UserContext';


export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {

    const router = useRouter();

    return (
        <ThemeProvider value={DefaultTheme}>
            <UserProvider>
                <StatusBar style="auto" />
                <Stack
                    initialRouteName="splash"
                    screenOptions={{
                        headerStyle: {
                            backgroundColor: '#FFFFFF',
                        },
                        headerTitleAlign: 'left',
                        headerTitleStyle: {
                            fontSize: 18,
                            fontWeight: '500',
                            color: '#1F1E1E',
                        },
                        headerLeft: () => (
                            <TouchableOpacity 
                                onPress={() => router.back()}
                                className='-ml-2 pr-3'
                            >
                                <ChevronLeft size={24} color="#1F1E1E" />
                            </TouchableOpacity>
                        ),
                        headerShadowVisible: true,
                    }}
                >
                    {/* Auth & Splash - No Headers */}
                    <Stack.Screen name="splash" options={{ headerShown: false }} />
                    <Stack.Screen name="auth/login" options={{ headerShown: false }} />
                    <Stack.Screen name="auth/signup" options={{ headerShown: false }} />
                    <Stack.Screen name="auth/reset-password" options={{ headerShown: false }} />
                    <Stack.Screen name="auth/verify-otp" options={{ headerShown: false }} />
                    <Stack.Screen name="auth/change-password" options={{ headerShown: false }} />
                    <Stack.Screen name="(patient)" options={{ headerShown: false }} />
                    <Stack.Screen name="(doctor)" options={{ headerShown: false }} />

                    <Stack.Screen 
                        name="patient/testimonial" 
                        options={{ headerTitle: 'Testimonial' }}  
                    />

                    <Stack.Screen 
                        name="notifications/index" 
                        options={{ headerTitle: 'Notifications' }}  
                    />

                    <Stack.Screen 
                        name="notifications/notification-details" 
                        options={{ headerTitle: 'Notifications' }}  
                    />

                    <Stack.Screen 
                        name="patient/find-doctor" 
                        options={{ headerTitle: 'Find Doctor' }}  
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
                        name="patient/appointment-details" 
                        options={{
                            headerShown: true,
                            title: "Appointment Details",
                        }}
                    />

                    <Stack.Screen 
                        name="patient/whereby" 
                        options={{
                            headerShown: true,
                            title: "WhereBy",
                        }}
                    />
                    
                    {/* doctor screens */}
                    <Stack.Screen 
                        name="doctor/patient-details" 
                        options={{ 
                            headerTitle: 'Patient Details',
                        }} 
                    />

                    {/* Profile Pages - WITH Headers */}
                    <Stack.Screen 
                        name="profile/edit-personal-information" 
                        options={{ 
                            headerTitle: 'Edit Personal Information',
                        }} 
                    />
        
                    <Stack.Screen 
                        name="profile/medical-reports/index" 
                        options={{ 
                            headerTitle: 'Medical Reports',
                        }} 
                    />

                    <Stack.Screen 
                        name="profile/medical-reports/upload-your-report" 
                        options={{ 
                            headerTitle: 'Upload Your Report',
                        }} 
                    />
        
                    <Stack.Screen 
                        name="patient/write-a-review" 
                        options={{ 
                            headerTitle: 'Write A Review',
                        }} 
                    />

                    <Stack.Screen 
                        name="profile/manage-address/index" 
                        options={{ 
                            headerTitle: 'Manage Address',
                        }} 
                    />

                    <Stack.Screen 
                        name="profile/manage-address/add-current-location" 
                        options={{ 
                            headerTitle: 'Add Current Location',
                        }} 
                    />

                    <Stack.Screen 
                        name="profile/manage-address/choose-different-location" 
                        options={{ 
                            headerTitle: 'Choose Different Location',
                        }} 
                    />

                    <Stack.Screen 
                        name="profile/payment-method" 
                        options={{ 
                            headerTitle: 'Payment Method',
                        }} 
                    />

                    <Stack.Screen 
                        name="profile/transactions/index" 
                        options={{ 
                            headerTitle: 'Transactions',
                        }} 
                    />

                    <Stack.Screen 
                        name="profile/transactions/[id]" 
                        options={{ 
                            headerTitle: 'Transaction Detail',
                        }} 
                    />

                    <Stack.Screen 
                        name="profile/faq" 
                        options={{ 
                            headerTitle: 'Frequently Asked Questions',
                        }} 
                    />

                    <Stack.Screen 
                        name="profile/need-help" 
                        options={{ 
                            headerTitle: 'Contact Us',
                        }} 
                    />

                    <Stack.Screen 
                        name="profile/rate-us" 
                        options={{ 
                            headerTitle: 'Rate Us',
                        }} 
                    />      

                    <Stack.Screen 
                        name="profile/about-us" 
                        options={{ 
                            headerTitle: 'About Us',
                        }} 
                    />

                    <Stack.Screen 
                        name="profile/term-condition" 
                        options={{ 
                            headerTitle: 'Term and Condition',
                        }} 
                    />

                    <Stack.Screen 
                        name="profile/privacy-policy" 
                        options={{ 
                            headerTitle: 'Privacy Policy',
                        }} 
                    />

                    {/* Doctor - Profile Pages */}
                    <Stack.Screen 
                        name="doctor/profile/edit-personal-information" 
                        options={{ 
                            headerTitle: 'Edit Personal Information',
                        }} 
                    />

                    <Stack.Screen 
                        name="doctor/profile/working-experience" 
                        options={{ 
                            headerTitle: 'Working Experience',
                        }} 
                    />

                    <Stack.Screen 
                        name="doctor/profile/education-history" 
                        options={{ 
                            headerTitle: 'Education History',
                        }} 
                    />

                    <Stack.Screen 
                        name="doctor/profile/certificates" 
                        options={{ 
                            headerTitle: 'Certificates',
                        }} 
                    />

                    <Stack.Screen 
                        name="doctor/profile/usage-analytics" 
                        options={{ 
                            headerTitle: 'Usage Analytics',
                        }} 
                    />

                </Stack>
            </UserProvider>
        </ThemeProvider>
    );
}