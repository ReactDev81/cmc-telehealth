import ReportsCard from "@/components/common/medical-reports/reports-card";
import PatientInfoHeader from "@/components/doctor/appointment-detail/patient-info-header";
import PatientInformation from "@/components/doctor/appointment-detail/patient-information";
import PaymentDetail from "@/components/doctor/appointment-detail/payment-detail";
import ScheduleAppointment from "@/components/doctor/appointment-detail/schedule-appointment";
import MedicineAccordian from "@/components/patient/my-medicines/medicine-accordian";
import Button from "@/components/ui/Button";
import Title from "@/components/ui/Title";
import { useAuth } from "@/context/UserContext";
import { usePatientDetail } from "@/queries/doctor/usePatientDetail";
import { router, useLocalSearchParams } from "expo-router";
import { ActivityIndicator, Linking, ScrollView, Text, View } from "react-native";

const PastAppointmentDetail = () => {
    const params = useLocalSearchParams();
    const appointmentId = typeof params.id === 'string' ? params.id : (Array.isArray(params.id) ? params.id[0] : undefined);
    const { token } = useAuth();

    const { data: patient, isLoading, isError, error } = usePatientDetail(appointmentId || "", token || "");

    if (!appointmentId) {
        return (
            <View className="flex-1 items-center justify-center p-5">
                <Text className="text-base text-red-500">No appointment ID provided</Text>
            </View>
        );
    }

    if (isLoading) {
        return (
            <View className="flex-1 items-center justify-center">
                <ActivityIndicator size="large" />
                <Text className="mt-3 text-black-400">Loading appointment details...</Text>
            </View>
        );
    }

    if (isError || !patient?.data) {
        return (
            <View className="flex-1 items-center justify-center p-5">
                <Text className="text-base text-red-500">Failed to load appointment details</Text>
                {error && (
                    <Text className="text-sm text-black-400 mt-2">
                        {error instanceof Error ? error.message : "Unknown error occurred"}
                    </Text>
                )}
                <Button className="mt-4" onPress={() => router.back()}>
                    Go Back
                </Button>
            </View>
        );
    }

    const { data } = patient;
    const appointment = data.previous_appointments?.find((app: any) => app.appointment_id === appointmentId) || data.upcoming_appointments;

    // Use current appointment data if found in previous or upcoming, or fallback to general patient data
    const displayAppointment = appointment || {};

    return (
        <ScrollView className="flex-1 bg-white p-5">
            <View className="pb-20">
                {/* patient basic info */}
                <PatientInfoHeader
                    image={{ uri: data.avatar || "https://cdn-icons-png.flaticon.com/512/387/387561.png" }}
                    name={data.name}
                    age={data.age}
                    gender={data.gender_label}
                    mode={displayAppointment.consultation_type_label || "Video Call"}
                />

                {/* schedule appointment */}
                <ScheduleAppointment
                    date={displayAppointment.appointment_date_formatted || "N/A"}
                    time={displayAppointment.appointment_time_formatted || "N/A"}
                    booking_type={displayAppointment.consultation_type_label || "Online"}
                    booking_for="Self" // Currently static in current implementation
                />

                {/* patient information */}
                <PatientInformation
                    patient_age={`${data.age} Years`}
                    gender={data.gender_label}
                    allergies="None" // Field not explicitly in types yet
                    problem={displayAppointment.notes?.problem || data.problem || "No problem specified"}
                />

                {/* payment detail */}
                <PaymentDetail
                    consultation={displayAppointment.fee_amount || "0.00"}
                    admin_fee="0.00"
                    aditional_discount="-"
                    total={displayAppointment.fee_amount || "0.00"}
                />

                {/* medical reports */}
                {data.medical_reports?.length > 0 && (
                    <View className="mt-7">
                        <Title text="Medical Reports" />
                        {data.medical_reports.map((report: any) => {
                            const handleViewReport = () => {
                                const pdfUrl = report.file_url;
                                if (pdfUrl) {
                                    Linking.openURL(pdfUrl);
                                }
                            };

                            return (
                                <View className="mt-5" key={report.id}>
                                    <ReportsCard
                                        report_name={report.report_name}
                                        report_date_formatted={report.report_date_formatted}
                                        type_label={report.type_label}
                                        handleReport={handleViewReport}
                                    />
                                </View>
                            );
                        })}
                    </View>
                )}

                {/* prescribed medicine */}
                {data.current_medications?.length > 0 && (
                    <View className="mt-7">
                        <Title text="Prescription" />
                        <View className="mt-5">
                            {data.current_medications.map((med: any, index: number) => (
                                <MedicineAccordian
                                    key={med.id}
                                    medicine={med}
                                    defaultExpanded={true}
                                    index={index}
                                />
                            ))}
                        </View>
                    </View>
                )}
            </View>
        </ScrollView>
    );
};

export default PastAppointmentDetail;
