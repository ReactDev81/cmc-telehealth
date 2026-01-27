// import FileUploadField from "@/components/form/FileUploadField";
// import TextArea from "@/components/form/TextArea";
// import Button from "@/components/ui/Button";
// import { useManageAppointment } from "@/mutations/patient/useManageAppointment";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useLocalSearchParams } from "expo-router";
// import { Stethoscope } from "lucide-react-native";
// import { useState } from "react";
// import { useForm } from "react-hook-form";
// import { Alert, Image, ScrollView, Text, View } from "react-native";
// import * as z from "zod";
// import UploadReportsNotes from "./upload-reports-notes";

// // Validation schema
// const manageAppointmentSchema = z.object({
//     notes: z
//         .string()
//         .min(1, "Notes are required")
//         .min(10, "Notes must be at least 10 characters")
//         .max(1000, "Notes must not exceed 1000 characters"),
//     upload_file: z
//         .any()
//         .optional()
//         .refine(
//             (file) => {
//                 if (!file) return true;
//                 // Validate file size (e.g., max 10MB)
//                 const maxSize = 10 * 1024 * 1024; // 10MB in bytes
//                 return file.size <= maxSize;
//             },
//             {
//                 message: "File size must be less than 10MB",
//             }
//         ),
// });

// type ManageAppointmentFormData = z.infer<typeof manageAppointmentSchema>;

// export default function ManageAppointments() {
//     const { appointment_id } = useLocalSearchParams<{
//         appointment_id: string;
//     }>();

//     const [modalVisible, setModalVisible] = useState(false);

//     const { mutate: manageAppointment, isPending } = useManageAppointment(
//         appointment_id || ""
//     );

//     const methods = useForm<ManageAppointmentFormData>({
//         resolver: zodResolver(manageAppointmentSchema),
//         defaultValues: {
//             notes: "",
//             upload_file: undefined,
//         },
//         mode: "onBlur",
//     });

//     const { control, handleSubmit, reset } = methods;

//     const onSubmit = (formData: ManageAppointmentFormData) => {
//         const payload = new FormData();

//         payload.append("notes", formData.notes);

//         if (formData.upload_file) {
//             // @ts-ignore - expo-document-picker file type
//             payload.append("file", {
//                 uri: formData.upload_file.uri,
//                 type: formData.upload_file.mimeType || "application/octet-stream",
//                 name: formData.upload_file.name,
//             } as any);
//         }

//         manageAppointment(payload, {
//             onSuccess: (data: any) => {
//                 Alert.alert(
//                     "Success",
//                     data?.message || "Appointment updated successfully",
//                     [
//                         {
//                             text: "OK",
//                             onPress: () => {
//                                 reset();
//                                 setModalVisible(false);
//                             },
//                         },
//                     ]
//                 );
//             },
//             onError: (error: any) => {
//                 Alert.alert(
//                     "Error",
//                     error?.response?.data?.message ||
//                     "Failed to update appointment. Please try again."
//                 );
//             },
//         });
//     };

//     return (
//         <ScrollView className="flex-1 bg-white">
//             {/* <View className="mb-5">
//                 <Text className="text-lg font-semibold text-black mb-2">Manage Appointment</Text>
//                 <Text className="text-sm text-gray-600">Appointment ID: {appointment_id}</Text>
//             </View> */}

//             <View className="items-center mb-6">
//                 <Image
//                     source={{
//                         uri:
//                             "https://cdn-icons-png.flaticon.com/512/387/387561.png",
//                     }}
//                     className="w-full h-60"
//                     resizeMode="cover"
//                 />
//             </View>

//             <View className="p-5 pb-12">
//                 {/* name & speciality */}
//                 <View className="pb-5 mb-5 border-b border-[#EDEDED]">
//                     <View className="flex-row gap-x-1">
//                         <Stethoscope size={15} color="#013220" />
//                         <Text className="text-primary text-sm">Cardiology</Text>
//                     </View>
//                     <Text className="text-lg font-medium text-black mt-1">
//                         Dr. John Smith
//                     </Text>
//                 </View>

//                 {/* Appointment Details */}
//                 <View className="pb-5 mb-5 border-b border-[#EDEDED]">
//                     <Text className="text-lg text-black font-medium">
//                         Appointment Details
//                     </Text>
//                     <View className="mt-4">
//                         <View className="flex-row items-center justify-between">
//                             <Text className="text-sm text-black-400">Date</Text>
//                             <Text className="text-sm font-medium text-black-400">
//                                 Monday, 15 January 2024
//                             </Text>
//                         </View>
//                         <View className="flex-row items-center justify-between mt-3">
//                             <Text className="text-sm text-black-400">Time</Text>
//                             <Text className="text-sm font-medium text-black-400">
//                                 10:00 AM - 10:30 AM
//                             </Text>
//                         </View>
//                         <View className="flex-row items-center justify-between mt-3">
//                             <Text className="text-sm text-black-400">Booking Type</Text>
//                             <Text className="text-sm font-medium text-black-400">
//                                 Video Consultation
//                             </Text>
//                         </View>
//                     </View>
//                 </View>

//                 {/* Patient Details */}
//                 <View className="pb-5 mb-5 border-b border-[#EDEDED]">
//                     <Text className="text-lg text-black font-medium">Patient Details</Text>
//                     <View className="mt-4">
//                         <View className="flex-row items-center justify-between">
//                             <Text className="text-sm text-black-400">Patient Age</Text>
//                             <Text className="text-sm font-medium text-black-400">
//                                 35 years
//                             </Text>
//                         </View>
//                         <View className="flex-row items-center justify-between mt-3">
//                             <Text className="text-sm text-black-400">Gender</Text>
//                             <Text className="text-sm font-medium text-black-400">
//                                 Male
//                             </Text>
//                         </View>
//                         <View className="flex-row items-center justify-between mt-3">
//                             <Text className="text-sm text-black-400">Allergies</Text>
//                             <Text className="text-sm font-medium text-black-400">
//                                 Peanuts, Dust
//                             </Text>
//                         </View>
//                         <View className="flex-row items-center justify-between mt-3">
//                             <Text className="text-sm text-black-400">Problem</Text>
//                             <Text className="text-sm font-medium text-black-400">
//                                 Chest pain and shortness of breath
//                             </Text>
//                         </View>
//                         <View className="flex-row justify-between mt-3">
//                             <View className="basis-2/5">
//                                 <Text className="text-sm text-black-400">Subject</Text>
//                             </View>
//                             <View className="basis-3/5">
//                                 <Text className="text-sm text-right text-nowrap font-medium text-black-400">
//                                     I've been neglecting my teeth care lately, and l'm not sure
//                                 </Text>
//                             </View>
//                         </View>
//                     </View>
//                 </View>

//                 {/* Payment Detail */}
//                 <View className="pb-5 mb-5">
//                     <Text className="text-lg text-black font-medium">Payment Detail</Text>
//                     <View className="mt-4">
//                         <View className="flex-row items-center justify-between">
//                             <Text className="text-sm text-black-400">Consultation Fee</Text>
//                             <Text className="text-sm font-medium text-black-400">
//                                 ₹500.00
//                             </Text>
//                         </View>
//                         <View className="flex-row items-center justify-between mt-3">
//                             <Text className="text-sm text-black-400">Additional Discount</Text>
//                             <Text className="text-sm font-medium text-black-400">
//                                 -₹50.00
//                             </Text>
//                         </View>
//                         <View className="flex-row items-center justify-between mt-3">
//                             <Button onPress={() => setModalVisible(true)}>
//                                 Upload Reports & Notes
//                             </Button>

//                             <UploadReportsNotes
//                                 visible={modalVisible}
//                                 onClose={() => setModalVisible(false)}
//                                 control={control}
//                                 onSubmit={handleSubmit(onSubmit)}
//                                 isPending={isPending}
//                             /className="mt-5"
//                     />
//                         </View> */}

//                         <UploadReportsNotes />

//                         <Button onPress={handleSubmit(onSubmit)} disabled={isPending}>
//                             {isPending ? "Submitting..." : "Submit"}
//                         </Button>
//                     </View>
//                 </ScrollView>
//                 );
// }

import CancelAppointmentModal from "@/components/patient/appointment/cancel-appointment-modal";
import Button from "@/components/ui/Button";
import { useCancelAppointment } from "@/mutations/patient/useCancelAppointment";
import { useManageAppointment } from "@/mutations/patient/useManageAppointment";
import { useAppointmentById } from "@/queries/patient/useAppointmentById";
import { zodResolver } from "@hookform/resolvers/zod";
import { router, useLocalSearchParams } from "expo-router";
import { SquarePen, Stethoscope } from "lucide-react-native";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { Alert, Image, Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as z from "zod";
import UploadReportsNotes from "./upload-reports-notes";

/* ---------------------- Validation Schema ---------------------- */
const manageAppointmentSchema = z.object({
    notes: z.string().optional(),

    reportType: z.string().optional(),
    reportFile: z.any().nullable(),

    reports: z
        .array(
            z.object({
                type: z.string(),
                file: z.any(),
            }),
        )
        .optional(),
});

type ManageAppointmentFormData = z.infer<typeof manageAppointmentSchema>;

export default function ManageAppointments() {
    const insets = useSafeAreaInsets();
    const { appointment_id } = useLocalSearchParams<{
        appointment_id: string;
    }>();

    const appointmentId =
        typeof appointment_id === "string" ? appointment_id : undefined;

    const { data, isLoading, isError } = useAppointmentById(appointmentId);
    // console.log("Appointment Id :", appointmentId);
    // console.log("Data Response :", data);

    const appointment = data?.data;
    const patient = appointment?.patient;
    const schedule = appointment?.schedule;
    const doctor = appointment?.doctor;
    const notes = appointment?.notes;

    const [modalVisible, setModalVisible] = useState(false);
    const [cancelModalVisible, setCancelModalVisible] = useState(false);
    const [reportsAndNotes, setReportsAndNotes] = useState(false);

    const { mutate: manageAppointment, isPending } = useManageAppointment(
        appointment_id || "",
    );

    const { mutate: cancelAppointment, isPending: isCancelling } =
        useCancelAppointment();

    const methods = useForm<ManageAppointmentFormData>({
        resolver: zodResolver(manageAppointmentSchema),
        defaultValues: {
            notes: "",
            reportType: "",
            reportFile: null,
            reports: [],
        },
    });

    const { handleSubmit, reset } = methods;

    const onSubmit = (data: ManageAppointmentFormData) => {
        const formData = new FormData();

        // Notes
        if (data.notes) {
            formData.append("notes", data.notes);
        }

        // Reports
        data.reports?.forEach((report, index) => {
            formData.append(`reports[${index}][type]`, report.type);

            if (report.file?.uri) {
                formData.append(`reports[${index}][file]`, {
                    uri: report.file.uri,
                    name: report.file.name,
                    type: report.file.mimeType,
                } as any);
            }
        });

        console.log("📤 Submitting FormData:", data);
        console.log("Form Data Submitted:", data.reports);

        manageAppointment(formData, {
            onSuccess: (res: any) => {
                console.log("✅ API Response:", res);
                reset();
                setModalVisible(false);
            },
            onError: (err: any) => {
                console.log("❌ API Error:", err);
            },
        });
    };

    // const handleCancel = () => {
    //     Alert.alert(
    //         "Cancel Appointment",
    //         "Are you sure you want to cancel this appointment?",
    //         [
    //             {
    //                 text: "No",
    //                 style: "cancel",
    //             },
    //             {
    //                 text: "Yes",
    //                 onPress: () => {
    //                     // Implement cancellation logic here
    //                     Alert.alert("Appointment cancelled successfully.");
    //                 },
    //             },
    //         ],
    //     );
    // }

    const handleCancelAppointment = () => {
        if (!appointmentId) return;

        cancelAppointment(appointmentId, {
            onSuccess: (res) => {
                console.log("✅ Appointment cancelled:", res?.success);

                if (res?.success === true) {
                    router.push("/(patient)/appointments");
                }

                Alert.alert(
                    "Appointment Cancelled",
                    "Your appointment has been successfully cancelled.",
                );

                setCancelModalVisible(false);
            },
            onError: (err: any) => {
                console.log("❌ Cancel error:", err);

                Alert.alert(
                    "Error",
                    err?.response?.data?.message || "Failed to cancel appointment",
                );
            },
        });
    };

    const doctorId = data?.data?.doctor?.user_id;
    // console.log("Doctor ID :", doctorId);

    return (
        <FormProvider {...methods}>
            <ScrollView className="flex-1 bg-white">
                {/* Banner */}
                <Image
                    source={{
                        uri:
                            doctor?.avatar ||
                            "https://cdn-icons-png.flaticon.com/512/387/387561.png",
                    }}
                    className="w-full h-60"
                    resizeMode="cover"
                />

                <View className="p-5 pb-12">
                    {/* Doctor Info */}
                    <View className="pb-5 mb-5 border-b border-[#EDEDED]">
                        <View className="flex-row items-center gap-x-1">
                            <Stethoscope size={14} color="#013220" />
                            <Text className="text-primary text-sm">Cardiology</Text>
                        </View>
                        <Text className="text-lg font-medium mt-1">{doctor?.name}</Text>
                    </View>

                    {/* Appointment Details */}
                    <View className="pb-5 mb-5 border-b border-[#EDEDED]">
                        <Text className="text-lg font-medium">Appointment Details</Text>

                        <Detail label="Date" value={schedule?.date_formatted} />
                        <Detail label="Time" value={schedule?.time_formatted} />
                        <Detail
                            label="Booking Type"
                            value={schedule?.consultation_type_label}
                        />
                    </View>

                    {/* Patient Details */}
                    <View className="pb-5 mb-5 border-b border-[#EDEDED]">
                        <Text className="text-lg font-medium">Patient Details</Text>
                        <Detail label="Name" value={patient?.name} />
                        <Detail label="Age" value={patient?.age_formatted} />
                        <Detail label="Gender" value={patient?.gender_formatted} />
                    </View>

                    <View>
                        {/* Medical Reports & Notes */}
                        {reportsAndNotes ? (
                            <View className="bg-white rounded-2xl border border-gray-200 p-5 mb-5">
                                {/* Header */}
                                <View className="flex-row justify-between items-center mb-4">
                                    <Text className="text-lg font-medium text-black">
                                        Manage Reports & Notes
                                    </Text>
                                    <Pressable
                                        onPress={() => setModalVisible(true)}
                                        className="p-2"
                                    >
                                        <SquarePen size={18} color="#000" />
                                    </Pressable>
                                </View>

                                {/* Report Card */}
                                <View className="flex-row justify-between items-center mb-5 p-3.5 bg-gray-50 rounded-xl border border-gray-200">
                                    <View>
                                        <Text className="text-sm font-medium text-black mb-2">
                                            Blood Test Results
                                        </Text>
                                        <Text className="text-sm text-black mb-1">
                                            Dr. John Smith
                                        </Text>
                                        <Text className="text-sm text-black mb-3">
                                            Type: Lab Report
                                        </Text>
                                    </View>
                                    <Button
                                        className="bg-primary"
                                        onPress={() => {
                                            Alert.alert("View Report", "Opening report...");
                                        }}
                                    >
                                        <Text className="text-white font-medium">View Report</Text>
                                    </Button>
                                </View>

                                {/* Note Section */}
                                <View>
                                    <Text className="text-base font-semibold text-black mb-2">
                                        Note
                                    </Text>
                                    <View className="bg-gray-50 rounded-xl border border-gray-200 p-4">
                                        <Text className="text-sm text-black-400">
                                            {notes?.reason || "No notes available."}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        ) : (
                            <View className="items-center py-6 px-4">
                                <Text className="text-sm text-black-400 text-center">
                                    You have not added any medical reports or notes. If you'd like
                                    to share them with your doctor,
                                    <Pressable onPress={() => setModalVisible(true)}>
                                        <Text className="text-primary font-medium underline">
                                            click here to upload.
                                        </Text>
                                    </Pressable>
                                </Text>
                            </View>
                        )}

                        <View className="flex-row gap-3 mt-6">
                            <Button
                                className="flex-1"
                                onPress={() => router.push(`/patient/doctor/${doctorId}`)}
                            >
                                Reschedule
                            </Button>
                            <Button
                                variant="outline"
                                className="flex-1"
                                onPress={() => setCancelModalVisible(true)}
                            >
                                Cancel
                            </Button>
                        </View>

                        <CancelAppointmentModal
                            visible={cancelModalVisible}
                            onClose={() => setCancelModalVisible(false)}
                            onConfirm={handleCancelAppointment}
                        />

                        <UploadReportsNotes
                            visible={modalVisible}
                            onClose={() => setModalVisible(false)}
                            onSubmit={handleSubmit(onSubmit)}
                            isPending={isPending}
                            insets={insets}
                        />
                    </View>
                </View>
            </ScrollView>
        </FormProvider>
    );
}

/* ---------------------- Reusable Row ---------------------- */
const Detail = ({ label, value }: { label: string; value: string }) => (
    <View className="flex-row justify-between mt-3">
        <Text className="text-sm text-black-400">{label}</Text>
        <Text className="text-sm font-medium text-black-400">{value}</Text>
    </View>
);
