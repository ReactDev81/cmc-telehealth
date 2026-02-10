import PreviousAppointment from "@/components/doctor/patient-detail/previous-appointment";
import Button from "@/components/ui/Button";
import Title from "@/components/ui/Title";
import { useAuth } from "@/context/UserContext";
import { usePatientDetail } from "@/queries/doctor/usePatientDetail";
import { Link, router, useLocalSearchParams } from "expo-router";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";

const AllPreviousAppointments = () => {
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
                <Text className="mt-3 text-black-400">Loading appointments...</Text>
            </View>
        );
    }

    if (isError || !patient?.data) {
        return (
            <View className="flex-1 items-center justify-center p-5">
                <Text className="text-base text-red-500">Failed to load appointments</Text>
                <Button className="mt-4" onPress={() => router.back()}>
                    Go Back
                </Button>
            </View>
        );
    }

    const previousAppointments = patient.data.previous_appointments || [];

    return (
        <ScrollView className="flex-1 bg-white p-5">
            <View className="pb-20">
                <Title
                    className="mb-5"
                    text={`All Previous Appointments (${previousAppointments.length})`}
                />

                {previousAppointments.length > 0 ? (
                    previousAppointments.map((appointment: any) => (
                        // <Link
                        //     key={appointment.appointment_id}
                        //     href={`/doctor/patient-details/${appointment.appointment_id}`}
                        // >
                        <Link
                            key={appointment.appointment_id}
                            href={`/doctor/past-appointment-detail/${appointment.appointment_id}`}
                            className="mb-5"
                        >
                            <PreviousAppointment
                                subject={appointment.notes?.problem || "No problem specified"}
                                status={appointment.status}
                                time={appointment.appointment_time_formatted}
                                date={appointment.appointment_date_formatted}
                                mode={appointment.consultation_type_label}
                            />
                        </Link>
                    ))
                ) : (
                    <Text className="text-black-400 text-sm italic">No past appointments</Text>
                )}
            </View>
        </ScrollView>
    );
};

export default AllPreviousAppointments;
