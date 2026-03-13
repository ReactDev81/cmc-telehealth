import ReportsCard from "@/components/common/medical-reports/reports-card";
import ContactInformation from "@/components/doctor/patient-detail/contact-information";
import PatientInfoHeader from "@/components/doctor/patient-detail/patient-info-header";
import PreviousAppointment from "@/components/doctor/patient-detail/previous-appointment";
import UpcomingAppointment from "@/components/doctor/patient-detail/upcoming-appointments";
import MedicineAccordian from "@/components/patient/my-medicines/medicine-accordian";
import Button from "@/components/ui/Button";
import EmptyState from "@/components/ui/EmptyState";
import Title from "@/components/ui/Title";
import TitleWithLink from "@/components/ui/title-with-link";
import { useAuth } from "@/context/UserContext";
import { usePatientDetail } from "@/queries/doctor/usePatientDetail";
import { useIsFocused } from "@react-navigation/native";
import { Link, router, useLocalSearchParams } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { ChevronRight } from "lucide-react-native";
import { useEffect } from "react";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";

const PatientDetails = () => {

    const params = useLocalSearchParams();
    const appointmentId =
        typeof params.id === "string"
        ? params.id
        : Array.isArray(params.id)
        ? params.id[0]
        : undefined;
    const { token } = useAuth();
    const isFocused = useIsFocused();
    const { data: patient, isLoading, isError, error, refetch } = usePatientDetail(appointmentId || "", token || "");

    // Refetch data when screen comes into focus
    useEffect(() => {
        if (isFocused && appointmentId && token) {
            refetch();
        }
    }, [isFocused]);

    const upcomingAppointment = patient?.data?.upcoming_appointments;

    const openReport = async (url: string) => {
        await WebBrowser.openBrowserAsync(url);
    };

    if (!appointmentId) {
        return (
            <View className="flex-1 items-center justify-center p-5">
                <Text className="text-base text-red-500">
                    No appointment ID provided
                </Text>
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

    if (isError || !patient?.data) {
        return (
            <View className="flex-1 items-center justify-center p-5">
                <Text className="text-base text-red-500">
                    Failed to load patient details
                </Text>
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

    // console.log('current_medications', patient?.data?.current_medications)

    return (
        <ScrollView className="flex-1 bg-white p-5">
            <View className="pb-20">

                {/* headet */}
                <PatientInfoHeader
                    image={{ uri: patient.data.avatar }}
                    name={patient.data.name}
                    age={patient.data.age}
                    gender={patient.data.gender}
                    problem={patient.data.notes}
                />

                {/* contact information of this patient */}
                <ContactInformation
                    number={patient?.data?.contact?.phone_formatted}
                    email={patient?.data?.contact?.email}
                />

                {/* upcoming appointment details of this patient */}
                {upcomingAppointment && (
                    <UpcomingAppointment
                        call_now={upcomingAppointment?.call_now}
                        date={upcomingAppointment?.date || ""}
                        time={upcomingAppointment?.time || ""}
                        mode={upcomingAppointment?.consultation_type || ""}
                    />
                )}

                {/* click here to start consulation */}
                {upcomingAppointment.call_now && (
                    <Button
                        icon={<ChevronRight color="#fff" size={16} strokeWidth={3} />}
                        className="flex-row-reverse mt-5"
                        onPress={() =>
                            router.push({
                                pathname: "/doctor/start-consulation",
                                params: {
                                    doctor_call_link: upcomingAppointment?.video_join_link,
                                    appointment_id: appointmentId,
                                },
                            })
                        }
                    >
                        Start Consultation
                    </Button>
                )}

                {/* mdeical reports */}
                <View className="mt-5">
                    <Title className="max-w-72" text="Medical Reports" />
                    {patient?.data?.medical_reports &&
                        patient.data.medical_reports.length > 0 ? (
                            patient.data.medical_reports.map((report: any, index: number) => {
                                
                                var margin_top = index === 0 ? 8 : 20

                                return (
                                    <View 
                                        style={{marginTop : margin_top}}
                                        key={report.id ?? index}
                                    >
                                        <ReportsCard
                                            report_name={report.report_name}
                                            report_date_formatted={report.report_date_formatted}
                                            type_label={report.type_label}
                                            handleReport={() => openReport(report.file_url)}
                                        />
                                    </View>
                                );
                            })
                        ) : (
                        <EmptyState
                            title="No Medical Reports"
                            message="This patient has not uploaded any medical reports yet."
                            className="mt-5 rounded-2xl border border-gray-100"
                        />
                    )}
                </View>

                {/* currently running medicine */}
                <View className="mt-5">
                    <Title className="max-w-72 mb-2" text="Current Medication" />
                    {patient?.data?.current_medications &&
                        patient.data.current_medications.length > 0 ? (
                        patient.data.current_medications
                            // .slice(0, 2)
                            .map((med: any, index: number) => (
                                <MedicineAccordian
                                    key={med.id ?? index}
                                    medicine={med}
                                    defaultExpanded={true}
                                    index={index}
                                />
                            ))
                        ) : (
                        <EmptyState
                            title="No Current Medication"
                            message="This patient is not taking any medication."
                            className="mt-3 rounded-2xl border border-gray-100"
                        />
                    )}
                </View>

                <View className="mt-5">
                    <TitleWithLink
                        title_text="Previous appointment with this patient"
                        link={
                            patient.data.previous_appointments.length > 2
                            ? `/doctor/patient-details/all-previous-appointments/${appointmentId}`
                            : undefined
                        }
                        link_text={
                            patient.data.previous_appointments.length > 2 ? "See All" : ""
                        }
                    />
                    {patient?.data?.previous_appointments &&
                        patient.data.previous_appointments.length > 0 ? (
                            patient.data.previous_appointments
                            .slice(0, 2)
                            .map((appointment: any, index: number) => (
                                <Link
                                    key={appointment?.id ?? index}
                                    href={`/doctor/appointment-detail/${appointment?.id}`}
                                    className="mb-5"
                                >
                                    <PreviousAppointment
                                        subject={appointment?.notes || "No problem specified"}
                                        status={appointment.status}
                                        time={appointment.time}
                                        date={appointment.date}
                                        mode={appointment.consultation_type_label}
                                    />
                                </Link>
                            ))
                        ) : (
                        <EmptyState
                            title="No Past Appointments"
                            message="This patient has no previous appointments."
                            className="rounded-2xl border border-gray-100"
                        />
                    )}
                </View>
            </View>
        </ScrollView>
    );
};

export default PatientDetails;