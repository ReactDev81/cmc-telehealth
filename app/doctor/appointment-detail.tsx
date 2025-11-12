import { View, ScrollView, Linking } from "react-native"
import PatientInfoHeader from "@/components/doctor/appointment-detail/patient-info-header"
import ScheduleAppointment from "@/components/doctor/appointment-detail/schedule-appointment"
import PatientInformation from "@/components/doctor/appointment-detail/patient-information"
import PaymentDetail from "@/components/doctor/appointment-detail/payment-detail"
import Title from "@/components/ui/Title"
import { ReportCardData } from "@/json-data/common/medical-reports"
import ReportsCard from "@/components/common/medical-reports/reports-card"
import { MedicinesData } from "@/json-data/patient/my-medicines"
import MedicineAccordian from "@/components/patient/my-medicines/medicine-accordian"

const AppointmentDetail = () => {
    return(
        <ScrollView className="flex-1 bg-white p-5">
            <View className="pb-20">

                {/* patient basic info */}
                <PatientInfoHeader
                    image={require("../../assets/images/patient/mark-stonis.png")}
                    name="Rohan Singh"
                    age={42}
                    gender="Male"
                    mode= "Video Call"  
                />

                {/* schedule appointment */}
                <ScheduleAppointment
                    date="16 Feb, 25 | Monday"
                    time="11:30 AM"
                    booking_type="Online"
                    booking_for="Self" 
                />

                {/* patient information */}
                <PatientInformation
                    patient_age= "30 Years"
                    gender= "Female"
                    allergies= "Gluten"
                    problem= "I've been neglecting my teeth care lately, and l'm not sure"
                />

                {/* payment detail */}
                <PaymentDetail 
                    consultation= "60.99"
                    admin_fee= "01.00"
                    aditional_discount= "-"
                    total= "60.00"
                />

                {/* mdeical reports */}
                <View className="pt-5 mt-7 border-t border-black-300">
                    <Title 
                        text="Medical Reports"
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

                {/* perscribed medicine */}
                <View className="pt-5 mt-7 border-t border-black-300">
                    <Title 
                        text="Prescription"
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

            </View>
        </ScrollView>
    )
}

export default AppointmentDetail