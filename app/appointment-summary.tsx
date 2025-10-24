import { useState } from "react";
import { router } from "expo-router";
import { View, Text, Image, ScrollView, Modal } from "react-native"
import { Stethoscope } from 'lucide-react-native';
import Button from "../components/ui/Button";
import AppointmentConfirmation from "../components/appointment-summary/appointment-confirmation";

const AppointmentSummary = () => {

    const [modalVisible, setModalVisible] = useState(false);

    const handleDone = () => {
        setModalVisible(false);
        router.push('/(tabs)');
    };

    return(
        <ScrollView className="flex-1 bg-white">
            
            <View className="items-center mb-6">
                <Image
                    source={require('../assets/images/doctors/jubbin-j-jacob.png')}
                    className="w-full h-60"
                    resizeMode="cover"
                />
            </View>

            <View className="p-5 pb-12">

                {/* name & speciality */}
                <View className="pb-5 mb-5 border-b border-[#EDEDED]">
                    <View className="flex-row gap-x-1">
                        <Stethoscope size={15} color="#2D4095" />
                        <Text className="text-primary text-sm">Endocrinology</Text>
                    </View>
                    <Text className="text-lg font-medium text-black mt-1">Dr. Jubbin J Jacob</Text> 
                </View>

                {/* Appointment Details */}
                <View className="pb-5 mb-5 border-b border-[#EDEDED]">
                    <Text className="text-lg text-black font-medium">Appointment Details</Text>
                    <View className="mt-4">
                        <View className="flex-row items-center justify-between">
                            <Text className="text-sm text-black-400">Date</Text>
                            <Text className="text-sm font-medium text-black-400">September 11, 2025 | Monday</Text>
                        </View>
                        <View className="flex-row items-center justify-between mt-3">
                            <Text className="text-sm text-black-400">Time</Text>
                            <Text className="text-sm font-medium text-black-400">11:30 AM</Text>
                        </View>
                        <View className="flex-row items-center justify-between mt-3">
                            <Text className="text-sm text-black-400">Booking Type</Text>
                            <Text className="text-sm font-medium text-black-400">Online</Text>
                        </View>
                        <View className="flex-row items-center justify-between mt-3">
                            <Text className="text-sm text-black-400">Booking For</Text>
                            <Text className="text-sm font-medium text-black-400">Self</Text>
                        </View>
                    </View>
                </View>

                {/* Patient Details */}
                <View className="pb-5 mb-5 border-b border-[#EDEDED]">
                    <Text className="text-lg text-black font-medium">Patient Age</Text>
                    <View className="mt-4">
                        <View className="flex-row items-center justify-between">
                            <Text className="text-sm text-black-400">Patient Age</Text>
                            <Text className="text-sm font-medium text-black-400">30 Years</Text>
                        </View>
                        <View className="flex-row items-center justify-between mt-3">
                            <Text className="text-sm text-black-400">Gender</Text>
                            <Text className="text-sm font-medium text-black-400">Female</Text>
                        </View>
                        <View className="flex-row items-center justify-between mt-3">
                            <Text className="text-sm text-black-400">Allergies</Text>
                            <Text className="text-sm font-medium text-black-400">Online</Text>
                        </View>
                        <View className="flex-row items-center justify-between mt-3">
                            <Text className="text-sm text-black-400">Problem</Text>
                            <Text className="text-sm font-medium text-black-400">Gluten</Text>
                        </View>
                        <View className="flex-row justify-between mt-3">
                            <View className="basis-2/5">
                                <Text className="text-sm text-black-400">Subject</Text>
                            </View>
                            <View className="basis-3/5">
                                <Text className="text-sm text-right text-nowrap font-medium text-black-400">I've been neglecting my teeth care lately, and l'm not sure</Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Payment Detail */}
                <View className="pb-5 mb-5">
                    <Text className="text-lg text-black font-medium">Payment Detail</Text>
                    <View className="mt-4">
                        <View className="flex-row items-center justify-between">
                            <Text className="text-sm text-black-400">Consultation</Text>
                            <Text className="text-sm font-medium text-black-400">60.99</Text>
                        </View>
                        <View className="flex-row items-center justify-between mt-3">
                            <Text className="text-sm text-black-400">Admin Fee</Text>
                            <Text className="text-sm font-medium text-black-400">01.00</Text>
                        </View>
                        <View className="flex-row items-center justify-between mt-3">
                            <Text className="text-sm text-black-400">Aditional Discount</Text>
                            <Text className="text-sm font-medium text-black-400">Online</Text>
                        </View>
                        <View className="flex-row items-center justify-between mt-3">
                            <Text className="text-sm text-black-400">Total</Text>
                            <Text className="text-sm font-medium text-black-400">₹ 60.00</Text>
                        </View>
                    </View>
                </View>

                {/* book appointement with razorpay */}
                <Button onPress={() => setModalVisible(true)}>Book Appointment (₹60.00)</Button>
                <Button 
                  onPress={() => router.push('/razorpay')}
                  variant="outline"
                  className="mt-4"
                >
                  Pay with Razorpay
                </Button>

            </View>

            {/* Appointement Confirmation Message */}
            <AppointmentConfirmation visible={modalVisible} onClose={handleDone} />

        </ScrollView>
    )
}

export default AppointmentSummary