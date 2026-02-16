import ReportsCard from "@/components/common/medical-reports/reports-card";
import MedicineCard from "@/components/patient/my-medicines/medicine-card";
import { useAppointmentById } from "@/queries/patient/useAppointmentById";
import { useIsFocused } from "@react-navigation/native";
import { useLocalSearchParams } from "expo-router";
import { BriefcaseBusiness, Star, Stethoscope } from "lucide-react-native";
import { useEffect } from "react";
import { Image, Linking, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const AppointementDetails = () => {

    const { id } = useLocalSearchParams();
    const isFocused = useIsFocused();
    const appointmentId = typeof id === "string" ? id : undefined;

    const { data, isLoading, isError, refetch } = useAppointmentById(appointmentId);

    // Refetch data when screen first loads
    useEffect(() => {
        if (isFocused) {
          refetch();
        }
    }, [isFocused, refetch]);

    if (isLoading) {
        return (
            <View className="flex-1 items-center justify-center bg-white">
                <Text>Loading...</Text>
            </View>
        );
    }

    if (isError) return (
        <SafeAreaView className="flex-1 items-center justify-center">
            <Text className="text-black">Something went wrong</Text>
        </SafeAreaView>
    );

    const medicalReports = data?.data?.medical_reports ?? [];
    const appointment = data?.data;
    const patient = appointment?.patient;
    const schedule = appointment?.schedule;
    const doctor = appointment?.doctor;
    const payment = appointment?.payment;
    const notes = appointment?.notes;
    const prescriptions = appointment?.prescriptions;

    const discountedValue = 0;

    const calculateAppointmentFee = () => {
        const consultationFee = parseFloat(
            payment?.consultation_fee_formatted?.replace(/[₹,\s]/g, "") || "0",
        );
        const discount = discountedValue;
        const total = Math.max(0, consultationFee - discount);
        return `${total}`;
    };

    const total = calculateAppointmentFee();

    return (
        <ScrollView className="flex-1 bg-white">

            <View className="items-center">
                <Image
                    source={{ uri: doctor?.avatar || "" }}
                    className="w-full h-60"
                    resizeMode="cover"
                />
            </View>

            <View className="p-5 pb-12">

                {/* name & speciality */}
                <View>
                    <View className="flex-row gap-x-1">
                        <Stethoscope size={15} color="#013220" />
                        <Text className="text-primary text-sm">{doctor?.department}</Text>
                    </View>
                    <Text className="text-lg font-medium text-black mt-1">
                        {doctor?.name}
                    </Text>
                </View>

                {/* work experience & review */}
                <View className="flex-row items-center justify-between gap-x-4 mt-5 mb-7">
                    <View className="flex-1 flex-row items-center gap-x-2.5 border border-gray rounded-lg p-3">
                        <View className="w-10 h-10 items-center justify-center rounded-full bg-primary-200">
                            <BriefcaseBusiness size={18} color="#013220" />
                        </View>
                        <View className="flex-1">
                            <Text className="text-base font-medium text-black">
                                {typeof doctor?.years_experience === 'string' ? doctor?.years_experience : ''}
                            </Text>
                            <Text className="text-xs text-black-400 mt-1">
                                Work Experience
                            </Text>
                        </View>
                    </View>
                    <View className="flex-1 flex-row items-center gap-x-2.5 border border-gray rounded-lg p-3">
                        <View className="w-10 h-10 items-center justify-center rounded-full bg-primary-200">
                            <Star size={18} color="#013220" />
                        </View>
                        <View className="flex-1 ">
                            <Text className="text-base font-medium text-black">{4.8}</Text>
                            <Text className="text-xs text-black-400 mt-1">
                                Reviews (3.213)
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Schedule Appointment */}
                <View className="mb-7">
                    <Text className="text-lg text-black font-medium">
                        Schedule Appointment
                    </Text>
                    <View className="mt-4">
                        <View className="flex-row items-center justify-between">
                            <Text className="text-sm text-black-400">Date</Text>
                            <Text className="text-sm font-medium text-black-400">
                                {schedule?.date_formatted}
                            </Text>
                        </View>
                        <View className="flex-row items-center justify-between mt-3">
                            <Text className="text-sm text-black-400">Time</Text>
                            <Text className="text-sm font-medium text-black-400">
                                {schedule?.time_formatted}
                            </Text>
                        </View>
                        <View className="flex-row items-center justify-between mt-3">
                            <Text className="text-sm text-black-400">Booking Type</Text>
                            <Text className="text-sm font-medium text-black-400">
                                {schedule?.booking_type}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Patient Details */}
                <View className="mb-7">
                    <Text className="text-lg text-black font-medium">Patient Age</Text>
                    <View className="mt-4">
                        <View className="flex-row items-center justify-between">
                            <Text className="text-sm text-black-400">Patient Age</Text>
                            <Text className="text-sm font-medium text-black-400">
                                {patient?.age_formatted}
                            </Text>
                        </View>
                        <View className="flex-row items-center justify-between mt-3">
                            <Text className="text-sm text-black-400">Gender</Text>
                            <Text className="text-sm font-medium text-black-400">
                                {patient?.gender_formatted}
                            </Text>
                        </View>
                        {notes?.problem && (
                            <View className="flex-row items-center justify-between mt-3">
                                <Text className="text-sm text-black-400">Problem</Text>
                                <Text className="text-sm font-medium text-black-400">
                                    {notes.problem}
                                </Text>
                            </View>
                        )}
                    </View>
                </View>

                {/* Payment Detail */}
                <View className="pb-5 mb-5">
                    <Text className="text-lg text-black font-medium">Payment Detail</Text>
                    <View className="mt-4">
                        <View className="flex-row items-center justify-between">
                            <Text className="text-sm text-black-400">Consultation Fee</Text>
                            <Text className="text-sm font-medium text-black-400">
                                {payment?.consultation_fee_formatted}
                            </Text>
                        </View>
                        <View className="flex-row items-center justify-between mt-3">
                            <Text className="text-sm text-black-400">Aditional Discount</Text>
                            <Text className="text-sm font-medium text-black-400">
                                ₹{discountedValue}
                            </Text>
                        </View>
                        <View className="flex-row items-center justify-between mt-3">
                            <Text className="text-sm text-black-400">Total</Text>
                            <Text className="text-sm font-medium text-black-400">
                                ₹{total}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Medical Reports */}
                <View className="mb-7">
                    <Text className="text-lg text-black font-medium mb-3">
                        Medical Reports
                    </Text>
                    <View className="gap-y-5">
                        {
                            medicalReports.map((report: any) => (
                                <ReportsCard
                                    key={report.id}
                                    report_name={report.title}
                                    report_date_formatted={report.report_date_formatted}
                                    type_label={report.type_label}
                                    handleReport={() => Linking.openURL(report.file_url)}
                                />
                            ))
                        }
                    </View>
                    
                </View>

                {/* Prescription */}
                {prescriptions && (
                    <View className="mb-7">
                        <Text className="text-lg text-black font-medium mb-3">
                            Prescription
                        </Text>
                        <MedicineCard
                            patient_symptoms={prescriptions.notes || ""}
                            doctor_name={prescriptions.doctor_name || ""}
                            consulated_date={prescriptions.date || ""}
                            appointment_id={appointmentId}
                        />
                    </View>
                )}
                
            </View>
        </ScrollView>
    );
};

export default AppointementDetails;