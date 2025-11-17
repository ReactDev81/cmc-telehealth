import { Linking, ScrollView, View } from "react-native"
import { ChevronRight } from 'lucide-react-native';
import { router } from "expo-router";
import Button from "@/components/ui/Button";
import TitleWithLink from "@/components/ui/title-with-link";
import PatientInfoHeader from "@/components/doctor/patient-detail/patient-info-header"
import ContactInformation from "@/components/doctor/patient-detail/contact-information"
import UpcomingAppointment from "@/components/doctor/patient-detail/upcoming-appointments"
import { ReportCardData } from "@/json-data/common/medical-reports";
import ReportsCard from "@/components/common/medical-reports/reports-card";
import { MedicinesData } from "@/json-data/patient/my-medicines";
import MedicineAccordian from "@/components/patient/my-medicines/medicine-accordian";
import { PreviousAppointmentData } from "@/json-data/doctor/previous-appointment";
import PreviousAppointment from "@/components/doctor/patient-detail/previous-appointment";

const PatientDetails = () => {
    return(
        <ScrollView className="flex-1 bg-white p-5">
            <View className="pb-20">

                {/* headet */}
                <PatientInfoHeader
                    image={require("../../assets/images/patient/mark-stonis.png")}
                    name="Rohan Singh"
                    age={42}
                    gender="Male"
                    problem = "I've been neglecting my teeth care lately, and l'm not sure"
                />

                {/* contact information of this patient */}
                <ContactInformation
                    number="(555) 123-4567"
                    email="rohansignh@gmail.com"
                />

                {/* upcoming appointement details of this patient */}
                <UpcomingAppointment
                    date="Sat, Jul 30" 
                    time="10:00 AM"
                    mode="video"
                />

                {/* click here to start consulation */}
                <Button 
                    icon={<ChevronRight color="#fff" size={16} strokeWidth={3} />}
                    className="flex-row-reverse mt-5"
                    onPress={() => router.push('/doctor/start-consulation')}
                >
                    Start Consultation
                </Button>


                {/* mdeical reports */}
                <View className="mt-8">
                    <TitleWithLink 
                        title_text="Medical Reports"
                        link="/"
                        link_text="See All"
                    />
                    {ReportCardData.slice(0, 2).map((report) => {
                        
                        const handleViewReport = () => {
                            const pdfUrl = report.report_view;
                            if (pdfUrl) {
                                Linking.openURL(pdfUrl);
                            }
                        };
                        
                        return(
                            <View className="mt-5" key={report.id}>
                                <ReportsCard
                                    report_name={report.report_name}
                                    report_date={report.report_date}
                                    doctor_name={report.doctor_name}
                                    report_type={report.report_type}
                                    handleReport={handleViewReport}
                                />
                            </View>
                        )
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
                        {MedicinesData.slice(0, 2).map((med) => (
                            <MedicineAccordian
                                key={med.id}
                                medicine={med}
                                defaultExpanded={true}
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
        </ScrollView>
    )
}

export default PatientDetails