import ReportsCard from "@/components/common/medical-reports/reports-card";
import MedicineCard from "@/components/patient/my-medicines/medicine-card";
import DoctorReviewModal from "@/components/patient/review";
import EmptyState from "@/components/ui/EmptyState";
import { useAppointmentById } from "@/queries/patient/useAppointmentById";
import { useIsFocused } from "@react-navigation/native";
import { useLocalSearchParams } from "expo-router";
import { BriefcaseBusiness, ClipboardPlus, Star, Stethoscope, UserStar } from "lucide-react-native";
import { useEffect, useState } from "react";
import { Image, Linking, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const AppointementDetails = () => {

    const { id } = useLocalSearchParams();
    const isFocused = useIsFocused();
    const [reviewModal, setReviewModal] = useState(false);
    const appointmentId = typeof id === "string" ? id : undefined;

    console.log('appointmentId', appointmentId)

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

    
    const appointment = data?.data;
    // const medicalReports = data?.data?.medical_reports ?? [];
    const medicalReports = appointment?.medical_reports?.length ? appointment.medical_reports : null;
    const patient = appointment?.patient;
    const schedule = appointment?.schedule;
    const doctor = appointment?.doctor;
    const doctorReview = doctor?.review && !Array.isArray(doctor.review) ? doctor.review: null;
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
                        {medicalReports ? (
                            medicalReports.map((report: any) => (
                                <ReportsCard
                                    key={report.id}
                                    report_name={report.title}
                                    report_date_formatted={report.report_date_formatted}
                                    type_label={report.type_label}
                                    handleReport={() => Linking.openURL(report.file_url)}
                                />
                            ))
                        ) : (
                            <EmptyState
                                title="Medical Reports"
                                message="No medical reports available"
                                icon={<ClipboardPlus size={40} color="#344054" />}
                            />
                        )}
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

                {/* Docotr Review */}
                <View className="mb-7">
                    <Text className="text-lg text-black font-medium mb-3">
                        Review to Doctor
                    </Text>
                    {doctorReview ?
                            <View className="bg-white rounded-xl border border-black-300 w-full justify-between p-5">
                                <View className="flex-row justify-between items-start mb-2">
                                    <View className="flex-row gap-x-2">
                                        <View>
                                            <Image source={{ uri: doctor?.avatar }} className="w-10 h-10 rounded-full" />
                                        </View>
                                        <View>
                                            <Text className="text-sm text-black font-medium">{doctor?.name}</Text>
                                            <Text className="text-xs text-black mt-1">
                                                {doctor?.department} ({doctor?.years_experience} Exp)
                                            </Text>
                                        </View>
                                    </View>
                                    <View className="py-1 px-2 bg-primary-100 rounded-lg flex-row items-center gap-x-1">
                                        <Star size={12} fill="#013220" />
                                        <Text className="text-primary text-sm font-medium">{doctorReview?.rating}</Text>
                                    </View>
                                </View>
                                <View>
                                    <Text className="text-xs leading-5 text-black">{doctorReview?.content}</Text>
                                </View>
                            </View>
                    :
                        <EmptyState
                            title="Docotor Review"
                            message="You have not provide any review to doctor"
                            icon={<UserStar size={40} color="#344054" />}
                            actionLabel="Add Review"
                            onAction={() => setReviewModal(true)}
                        />
                    }
                </View>
                
            </View>

            <DoctorReviewModal 
                visible={reviewModal} 
                onClose={() => setReviewModal(false)}
                doctorId={doctor?.user_id}
                doctorName={doctor?.name} 
                appointmentID={appointmentId}
            />

        </ScrollView>
    );
};

export default AppointementDetails;