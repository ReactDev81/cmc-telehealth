import { View, Text, Image, ScrollView, Linking } from "react-native"
import MedicineCard from "@/components/my-medicines/medicine-card";
import { Stethoscope, BriefcaseBusiness, Star } from 'lucide-react-native';
import ReportsCard from "@/components/medical-reports/reports-card";

const AppointementDetails = () => {

    const handleViewReport = () => {
        const pdfUrl = "https://images.drlogy.com/assets/uploads/lab/pdf/CBC-test-report-format-example-sample-template-Drlogy-lab-report.pdf";
        if (pdfUrl) {
            Linking.openURL(pdfUrl);
        }
    };

    return(
        <ScrollView className="flex-1 bg-white">

            <View className="items-center mb-6">
                <Image
                    source={require('../../assets/images/doctors/jubbin-j-jacob.png')}
                    className="w-full h-60"
                    resizeMode="cover"
                />
            </View>

            <View className="p-5 pb-12">

                {/* name & speciality */}
                <View>
                    <View className="flex-row gap-x-1">
                        <Stethoscope size={15} color="#2D4095" />
                        <Text className="text-primary text-sm">Endocrinology</Text>
                    </View>
                    <Text className="text-lg font-medium text-black mt-1">Dr. Jubbin J Jacob</Text> 
                </View>

                {/* work experience & review */}
                <View className="flex-row items-center justify-between gap-x-4 mt-5 mb-7">
                    <View className="flex-1 flex-row items-center gap-x-2.5 border border-gray rounded-lg p-3">
                        <View className="w-10 h-10 items-center justify-center rounded-full bg-primary-200">
                            <BriefcaseBusiness size={18} color="#013220" />
                        </View>
                        <View className="flex-1">
                            <Text className="text-base font-medium text-black">2 years</Text>
                            <Text className="text-xs text-black-400 mt-1">Work Experience</Text>
                        </View>
                    </View>
                    <View className="flex-1 flex-row items-center gap-x-2.5 border border-gray rounded-lg p-3">
                        <View className="w-10 h-10 items-center justify-center rounded-full bg-primary-200">
                            <Star size={18} color="#013220" />
                        </View>
                        <View className="flex-1 ">
                            <Text className="text-base font-medium text-black">4.8</Text>
                            <Text className="text-xs text-black-400 mt-1">Reviews (3.213)</Text>
                        </View>
                    </View>
                </View>

                {/* Schedule Appointment */}
                <View className="mb-7">
                    <Text className="text-lg text-black font-medium">Schedule Appointment</Text>
                    <View className="mt-4">
                        <View className="flex-row items-center justify-between">
                            <Text className="text-sm text-black-400">Date</Text>
                            <Text className="text-sm font-medium text-black-400">September 11, 2025 | Monday</Text>
                        </View>
                        <View className="flex-row items-center justify-between mt-3">
                            <Text className="text-sm text-black-400">Time</Text>
                            <Text className="text-sm font-medium text-black-400">11:30 AM</Text>
                        </View>
                        <View className="flex-row items-center justify-between mt-3">
                            <Text className="text-sm text-black-400">Booking Type</Text>
                            <Text className="text-sm font-medium text-black-400">Online</Text>
                        </View>
                        <View className="flex-row items-center justify-between mt-3">
                            <Text className="text-sm text-black-400">Booking For</Text>
                            <Text className="text-sm font-medium text-black-400">Self</Text>
                        </View>
                    </View>
                </View>

                {/* Patient Details */}
                <View className="mb-7">
                    <Text className="text-lg text-black font-medium">Patient Age</Text>
                    <View className="mt-4">
                        <View className="flex-row items-center justify-between">
                            <Text className="text-sm text-black-400">Patient Age</Text>
                            <Text className="text-sm font-medium text-black-400">30 Years</Text>
                        </View>
                        <View className="flex-row items-center justify-between mt-3">
                            <Text className="text-sm text-black-400">Gender</Text>
                            <Text className="text-sm font-medium text-black-400">Female</Text>
                        </View>
                        <View className="flex-row items-center justify-between mt-3">
                            <Text className="text-sm text-black-400">Allergies</Text>
                            <Text className="text-sm font-medium text-black-400">Online</Text>
                        </View>
                        <View className="flex-row items-center justify-between mt-3">
                            <Text className="text-sm text-black-400">Problem</Text>
                            <Text className="text-sm font-medium text-black-400">Gluten</Text>
                        </View>
                        <View className="flex-row justify-between mt-3">
                            <View className="basis-2/5">
                                <Text className="text-sm text-black-400">Subject</Text>
                            </View>
                            <View className="basis-3/5">
                                <Text className="text-sm text-right text-nowrap font-medium text-black-400">I've been neglecting my teeth care lately, and l'm not sure</Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Payment Detail */}
                <View className="mb-7">
                    <Text className="text-lg text-black font-medium">Payment Detail</Text>
                    <View className="mt-4">
                        <View className="flex-row items-center justify-between">
                            <Text className="text-sm text-black-400">Consultation</Text>
                            <Text className="text-sm font-medium text-black-400">60.99</Text>
                        </View>
                        <View className="flex-row items-center justify-between mt-3">
                            <Text className="text-sm text-black-400">Admin Fee</Text>
                            <Text className="text-sm font-medium text-black-400">01.00</Text>
                        </View>
                        <View className="flex-row items-center justify-between mt-3">
                            <Text className="text-sm text-black-400">Aditional Discount</Text>
                            <Text className="text-sm font-medium text-black-400">Online</Text>
                        </View>
                        <View className="flex-row items-center justify-between mt-3">
                            <Text className="text-sm text-black-400">Total</Text>
                            <Text className="text-sm font-medium text-black-400">₹ 60.00</Text>
                        </View>
                    </View>
                </View>

                {/* Medical Reports */}
                <View className="mb-7">
                    <Text className="text-lg text-black font-medium mb-3">Medical Reports</Text>
                    <ReportsCard 
                        report_name="Blood Test Results"
                        report_date="Sat, Jun 18"
                        doctor_name="Dr. John Smith"
                        report_type="Lab Report"
                        handleReport={handleViewReport}
                    />
                </View>

                {/* Prescription */}
                <View className="mb-7">
                    <Text className="text-lg text-black font-medium mb-3">Prescription</Text>
                    <MedicineCard 
                        patient_symptoms="Depression and Anxiety"
                        doctor_name="Dr Rajeshwar"
                        consulated_date="Sat, Feb 18"
                    />
                </View>

            </View>

        </ScrollView>
    )
}

export default AppointementDetails