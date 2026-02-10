import ReportsCard from "@/components/common/medical-reports/reports-card";
import ContactInformation from "@/components/doctor/patient-detail/contact-information";
import PatientInfoHeader from "@/components/doctor/patient-detail/patient-info-header";
import PreviousAppointment from "@/components/doctor/patient-detail/previous-appointment";
import MedicineAccordian from "@/components/patient/my-medicines/medicine-accordian";
import Title from "@/components/ui/Title";
import { ReportCardData } from "@/json-data/common/medical-reports";
import { PreviousAppointmentData } from "@/json-data/doctor/previous-appointment";
import { MedicinesData } from "@/json-data/patient/my-medicines";
import { Linking, View } from "react-native";

const PatientDetails = () => {
    return (
        <View className="pt-5 px-5 pb-16">
            {/* patient info headet */}
            <PatientInfoHeader
                image={require("../../../../assets/images/patient/mark-stonis.png")}
                name="Rohan Singh"
                age={42}
                gender="Male"
                problem="I've been neglecting my teeth care lately, and l'm not sure"
            />

            {/* contact information of this patient */}
            <ContactInformation
                number="(555) 123-4567"
                email="rohansignh@gmail.com"
            />

            {/* mdeical reports */}
            <View className="mt-8">
                <Title text="Medical Reports" />
                {ReportCardData.slice(0, 2).map((report) => {
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
                                report_date_formatted={report.report_date}
                                type_label={report.report_type}
                                handleReport={handleViewReport}
                            />
                        </View>
                    );
                })}
            </View>

            {/* currently running medicine */}
            <View className="mt-8">
                <Title text="Current Medication" />
                <View className="mt-5">
                    {MedicinesData.slice(0, 2).map((med, index) => (
                        <MedicineAccordian
                            key={med.id}
                            medicine={med}
                            defaultExpanded={true}
                            index={index}
                        />
                    ))}
                </View>
            </View>

            {/* previous appointment with this client */}
            <View className="mt-2">
                <Title text="Previous appointment with this patients" />
                {PreviousAppointmentData.slice(0, 2).map((appointment) => (
                    <PreviousAppointment
                        key={appointment.id}
                        subject={appointment.subject}
                        status={appointment.status}
                        time={appointment.time}
                        date={appointment.date}
                        mode={appointment.mode}
                    />
                ))}
            </View>
        </View>
    );
};

export default PatientDetails;
