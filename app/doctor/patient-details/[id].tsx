import ReportsCard from "@/components/common/medical-reports/reports-card";
import ContactInformation from "@/components/doctor/patient-detail/contact-information";
import PatientInfoHeader from "@/components/doctor/patient-detail/patient-info-header";
import PreviousAppointment from "@/components/doctor/patient-detail/previous-appointment";
import UpcomingAppointment from "@/components/doctor/patient-detail/upcoming-appointments";
import MedicineAccordian from "@/components/patient/my-medicines/medicine-accordian";
import Button from "@/components/ui/Button";
import TitleWithLink from "@/components/ui/title-with-link";
import { useAuth } from "@/context/UserContext";
import { usePatientDetail } from "@/queries/doctor/usePatientDetail";
import { router, useLocalSearchParams } from "expo-router";
import { ChevronRight } from "lucide-react-native";
import { ActivityIndicator, Linking, ScrollView, Text, View } from "react-native";

const PatientDetails = () => {
    const params = useLocalSearchParams();
    const appointmentId = typeof params.id === 'string' ? params.id : (Array.isArray(params.id) ? params.id[0] : undefined);
    const { token } = useAuth();

    const { data: patient, isLoading, isError, error } = usePatientDetail(appointmentId || "", token || "");

    const joinUrl = patient?.upcoming_appointments?.video_join_link;
    // console.log("Join URL:", joinUrl);

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
                <Text className="mt-3 text-black-400">Loading patient details...</Text>
            </View>
        );
    }

    if (isError || !patient) {
        return (
            <View className="flex-1 items-center justify-center p-5">
                <Text className="text-base text-red-500">Failed to load patient details</Text>
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

    // console.log("Patient Details:", patient);

    // Get the first upcoming appointment if available
    const upcomingAppointment = patient.upcoming_appointments;
    // console.log("Upcoming Appointment sssss:", upcomingAppointment);

    return (
        <ScrollView className="flex-1 bg-white p-5">
            <View className="pb-20">
                {/* headet */}
                <PatientInfoHeader
                    image={{ uri: patient.avatar }}
                    name={patient.name}
                    age={patient.age}
                    gender={patient.gender}
                    problem={patient.problem}
                />
                {/* contact information of this patient */}
                <ContactInformation
                    number={patient?.contact?.phone_formatted}
                    email={patient?.contact?.email}
                />
                {/* upcoming appointement details of this patient */}
                <UpcomingAppointment
                    call_now={upcomingAppointment?.call_now}
                    date={upcomingAppointment?.date}
                    time={upcomingAppointment?.time}
                    mode={upcomingAppointment?.consultation_type_label}
                />
                {/* click here to start consulation */}
                {joinUrl && <Button
                    icon={<ChevronRight color="#fff" size={16} strokeWidth={3} />}
                    className="flex-row-reverse mt-5"
                    onPress={() => router.push({
                        pathname: '/doctor/start-consulation',
                        params: { docotor_call_link: joinUrl }
                    })}
                >
                    Start Consultation
                </Button>}
                {/* mdeical reports */}
                <View className="mt-8">
                    <TitleWithLink
                        title_text="Medical Reports"
                        link="/"
                        link_text="See All"
                    />
                    {patient?.medical_reports.slice(0, 2).map((report) => {
                        const handleViewReport = () => {
                            const pdfUrl = report.report_view;
                            if (pdfUrl) {
                                Linking.openURL(pdfUrl);
                            }
                        };
                        return (
                            <View className="mt-5" key={report.id}>
                                <ReportsCard
                                    report_name={report.report_name}
                                    report_date={report.report_date}
                                    doctor_name={report.doctor_name}
                                    report_type={report.report_type}
                                    handleReport={handleViewReport}
                                />
                            </View>
                        );
                    })}
                </View>
                {/* currently running medicine */}
                <View className="mt-8">
                    <TitleWithLink
                        title_text="Current Medication"
                        link="/"
                        link_text="See All"
                    />
                    <View className="mt-5">
                        {patient?.medical_reports.slice(0, 2).map((med, index) => (
                            <MedicineAccordian
                                key={med.id}
                                medicine={med}
                                defaultExpanded={true}
                                index={index}
                            />
                        ))}
                    </View>
                </View>
                {/* previous appointement with this client */}
                <View className="mt-2">
                    <TitleWithLink
                        title_text="Previous appointment with this patients"
                        link="/"
                        link_text="See All"
                    />
                    {patient?.previous_appointments.slice(0, 2).map((appointment) => (
                        <PreviousAppointment
                            key={appointment.appointment_id}
                            subject={appointment.notes?.problem || "No problem specified"}
                            status={appointment.status}
                            time={appointment.appointment_time_formatted}
                            date={appointment.appointment_date_formatted}
                            mode={appointment.consultation_type_label}
                        />
                    ))}
                </View>
            </View>
        </ScrollView>
    );
};

export default PatientDetails;
