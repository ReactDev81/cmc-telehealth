import ReportsCard from "@/components/common/medical-reports/reports-card";
import ContactInformation from "@/components/doctor/patient-detail/contact-information";
import PatientInfoHeader from "@/components/doctor/patient-detail/patient-info-header";
import PreviousAppointment from "@/components/doctor/patient-detail/previous-appointment";
import MedicineAccordian from "@/components/patient/my-medicines/medicine-accordian";
import Title from "@/components/ui/Title";
import { useAuth } from "@/context/UserContext";
import { usePatientDetail } from "@/queries/doctor/usePatientDetail";
import { ActivityIndicator, Linking, Text, TouchableOpacity, View } from "react-native";

interface PatientDetailsProps {
    appointmentId?: string;
}

const PatientDetails = ({ appointmentId }: PatientDetailsProps) => {
    const { token } = useAuth();
    const { data: patient, isLoading, isError, refetch } = usePatientDetail(appointmentId || "", token || "");

    if (isLoading) {
        return (
            <View className="py-20 items-center justify-center">
                <ActivityIndicator size="large" color="#013220" />
                <Text className="text-black-400 mt-4 font-medium">Loading patient details...</Text>
            </View>
        );
    }

    if (isError || !patient) {
        return (
            <View className="py-20 items-center justify-center px-5">
                <Text className="text-red-500 text-center font-medium">Failed to load patient details</Text>
                <TouchableOpacity onPress={() => refetch()} className="mt-4 bg-primary px-6 py-2 rounded-lg">
                    <Text className="text-white font-medium">Try Again</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const patientData = patient.data;
    const medicalReports = patientData?.medical_reports || [];
    const currentMedications = patientData?.current_medications || [];
    const previousAppointments = patientData?.previous_appointments || [];

    return (
        <View className="pt-5 px-5 pb-16">
            {/* patient info headet */}
            <PatientInfoHeader
                image={{ uri: patientData.avatar || "https://cdn-icons-png.flaticon.com/512/387/387561.png" }}
                name={patientData.name}
                age={patientData.age}
                gender={patientData.gender}
                problem={patientData.problem}
            />

            {/* contact information of this patient */}
            <ContactInformation
                number={patientData.contact?.phone_formatted}
                email={patientData.contact?.email}
            />

            {/* mdeical reports */}
            <View className="mt-8">
                <Title text="Medical Reports" />
                {medicalReports.length > 0 ? (
                    medicalReports.slice(0, 2).map((report: any) => {
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
                    })
                ) : (
                    <Text className="text-black-400 text-sm italic mt-4">No medical reports available</Text>
                )}
            </View>

            {/* currently running medicine */}
            <View className="mt-8">
                <Title text="Current Medication" />
                <View className="mt-5">
                    {currentMedications.length > 0 ? (
                        currentMedications.slice(0, 2).map((med: any, index: number) => (
                            <MedicineAccordian
                                key={med.id}
                                medicine={med}
                                defaultExpanded={true}
                                index={index}
                            />
                        ))
                    ) : (
                        <Text className="text-black-400 text-sm italic">No current medication</Text>
                    )}
                </View>
            </View>

            {/* previous appointment with this client */}
            <View className="mt-2">
                <Title text="Previous appointment with this patient" />
                {previousAppointments.length > 0 ? (
                    previousAppointments.slice(0, 2).map((appointment: any) => (
                        <PreviousAppointment
                            key={appointment.appointment_id}
                            subject={appointment.notes?.problem || "No problem specified"}
                            status={appointment.status}
                            time={appointment.appointment_time_formatted}
                            date={appointment.appointment_date_formatted}
                            mode={appointment.consultation_type_label}
                        />
                    ))
                ) : (
                    <Text className="text-black-400 text-sm italic mt-4">No past appointments</Text>
                )}
            </View>
        </View>
    );
};

export default PatientDetails;
