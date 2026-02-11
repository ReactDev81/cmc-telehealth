import ReportsCard from "@/components/common/medical-reports/reports-card";
import PatientInfoHeader from "@/components/doctor/appointment-detail/patient-info-header";
import PatientInformation from "@/components/doctor/appointment-detail/patient-information";
import PaymentDetail from "@/components/doctor/appointment-detail/payment-detail";
import ScheduleAppointment from "@/components/doctor/appointment-detail/schedule-appointment";
import MedicineAccordian from "@/components/patient/my-medicines/medicine-accordian";
import ErrorState from "@/components/ui/ErrorState";
import Skeleton from "@/components/ui/Skeleton";
import Title from "@/components/ui/Title";
import { useAuth } from "@/context/UserContext";
import { usePatientDetail } from "@/queries/doctor/usePatientDetail";
import { router, useLocalSearchParams } from "expo-router";
import { Linking, ScrollView, View } from "react-native";

const PastAppointmentDetail = () => {
    const params = useLocalSearchParams();
    const appointmentId = typeof params.id === 'string' ? params.id : (Array.isArray(params.id) ? params.id[0] : undefined);
    const { token } = useAuth();

    const { data: patient, isLoading, isError, error, refetch } = usePatientDetail(appointmentId || "", token || "");

    if (!appointmentId) {
        return (
            <ErrorState
                title="Invalid Appointment"
                message="No appointment ID was provided."
                onRetry={() => router.back()}
            />
        );
    }

    if (isLoading) {
        return (
            <ScrollView className="flex-1 bg-white p-5">
                <View className="flex-row gap-x-4 mb-8">
                    <Skeleton width={80} height={80} variant="circle" />
                    <View className="flex-1 justify-center gap-y-2">
                        <Skeleton width="60%" height={20} />
                        <Skeleton width="40%" height={16} />
                    </View>
                </View>
                <View className="gap-y-6">
                    <Skeleton width="100%" height={100} />
                    <Skeleton width="100%" height={120} />
                    <Skeleton width="100%" height={80} />
                </View>
            </ScrollView>
        );
    }

    if (isError || !patient?.data) {
        return (
            <ErrorState
                title="Failed to load details"
                message={error instanceof Error ? error.message : "We couldn't retrieve the appointment information."}
                onRetry={refetch}
            />
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
