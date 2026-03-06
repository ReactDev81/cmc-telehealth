import ReportsCard from "@/components/common/medical-reports/reports-card";
import PatientInfoHeader from "@/components/doctor/appointment-detail/patient-info-header";
import PatientInformation from "@/components/doctor/appointment-detail/patient-information";
import PaymentDetail from "@/components/doctor/appointment-detail/payment-detail";
import ScheduleAppointment from "@/components/doctor/appointment-detail/schedule-appointment";
import MedicineAccordian from "@/components/patient/my-medicines/medicine-accordian";
import ErrorState from "@/components/ui/ErrorState";
import Skeleton from "@/components/ui/Skeleton";
import Title from "@/components/ui/Title";
import { useAppointmentById } from "@/queries/patient/useAppointmentById";
import { router, useLocalSearchParams } from "expo-router";
import { Linking, ScrollView, View } from "react-native";

const AppointmentDetail = () => {

    const params = useLocalSearchParams();
    const appointmentId =
    typeof params.id === "string"
        ? params.id
        : Array.isArray(params.id)
        ? params.id[0]
        : undefined;

    const { data, isLoading, isError, error, refetch } = useAppointmentById(appointmentId);

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

    if (isError || !data?.data) {
        return (
            <ErrorState
                title="Failed to load details"
                message={
                    error instanceof Error
                    ? error.message
                    : "We couldn't retrieve the appointment information."
                }
                onRetry={refetch}
            />
        );
    }

    const appointment = data?.data;
    const patient = appointment?.patient;
    const schedule = appointment?.schedule;
    const payment = appointment?.payment;

    return (
        <ScrollView className="flex-1 bg-white p-5">
            <View className="pb-20">

                {/* Patient basic info */}
                <PatientInfoHeader
                    image={{
                        uri:
                        patient?.avatar ||
                        "https://cdn-icons-png.flaticon.com/512/387/387561.png",
                    }}
                    name={patient?.name}
                    age={patient?.age_formatted}
                    gender={patient?.gender_formatted}
                    mode={appointment?.schedule?.consultation_type_label || "—"}
                />

                {/* Schedule details */}
                <ScheduleAppointment
                    date={schedule?.date || "N/A"}
                    time={schedule?.time || "N/A"}
                    booking_type={schedule?.consultation_type_label || "N/A"}
                    booking_for="Self"
                />

                {/* Patient information */}
                <PatientInformation
                    patient_age={`${patient?.age} Years`}
                    gender={patient?.gender_formatted}
                    allergies="None"
                    problem={
                        (typeof data.notes === "string"
                        ? data.notes
                        : null) ||
                        (typeof data.notes === "string" ? data.notes : null) ||
                        "No problem specified"
                    }
                    // problem={data.notes ? data.notes : "No problem specified"}
                />

                {/* Payment detail */}
                <PaymentDetail
                    consultation={payment?.consultation_fee || "0.00"}
                    admin_fee={payment.consultation_fee || "0.00"}
                    aditional_discount={payment?.discount}
                    total={payment?.total || "0.00"}
                />

                {/* Medical reports */}
                {data.medical_reports?.length > 0 && (
                    <View className="mt-7">
                        <Title text="Medical Reports" />
                        {data.medical_reports.map((report: any, index: number) => {
                            const handleViewReport = () => {
                                if (report.file_url) Linking.openURL(report.file_url);
                            };
                            return (
                                <View className="mt-5" key={report.id ?? index}>
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

                {/* Prescription */}
                {data.current_medications?.length > 0 && (
                    <View className="mt-7">
                        <Title text="Prescription" />
                        <View className="mt-5">
                            {data.current_medications.map((med: any, index: number) => (
                                <MedicineAccordian
                                    key={med.id ?? index}
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

export default AppointmentDetail;