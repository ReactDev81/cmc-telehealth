import PatientInfoHeader from "@/components/doctor/appointment-detail/patient-info-header";
import PatientInformation from "@/components/doctor/appointment-detail/patient-information";
import PaymentDetail from "@/components/doctor/appointment-detail/payment-detail";
import ScheduleAppointment from "@/components/doctor/appointment-detail/schedule-appointment";
import { useAuth } from "@/context/UserContext";
import { usePatientDetail } from "@/queries/doctor/usePatientDetail";
import { useLocalSearchParams } from "expo-router";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";

const PastAppointmentDetail = () => {
    const { id } = useLocalSearchParams();
    const { token } = useAuth();
    const appointmentId = typeof id === 'string' ? id : "";

    const { data: appointment, isLoading } = usePatientDetail(appointmentId, token || "");

    if (isLoading) return <ActivityIndicator size="large" className="flex-1" />;

    const data = appointment?.data;
    if (!data) return <Text>Appointment not found</Text>;

    return (
        <ScrollView className="flex-1 bg-white p-5">
            <View className="pb-20">
                <PatientInfoHeader
                    image={{ uri: data.avatar }}
                    name={data.name}
                    age={data.age}
                    gender={data.gender}
                    mode={data.consultation_type_label}
                />
                <ScheduleAppointment
                    date={data.appointment_date_formatted}
                    time={data.appointment_time_formatted}
                    booking_type={data.consultation_type_label}
                    booking_for="Self"
                />
                <PatientInformation
                    patient_age={`${data.age} Years`}
                    gender={data.gender}
                    allergies="None"
                    problem={data.problem}
                />
                <PaymentDetail
                    consultation={data.fee_amount}
                    admin_fee="0.00"
                    aditional_discount="-"
                    total={data.fee_amount}
                />
                {/* Add Medical Reports and Prescription sections here... */}
            </View>
        </ScrollView>
    );
};

export default PastAppointmentDetail;