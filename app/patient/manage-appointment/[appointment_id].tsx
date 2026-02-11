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
import RescheduleAttemptModal from "@/components/patient/appointment/reschedule-attempt-modal";
import Button from "@/components/ui/Button";
import ErrorState from "@/components/ui/ErrorState";
import { useCancelAppointment } from "@/mutations/patient/useCancelAppointment";
import { useUploadReportsAndNotes } from "@/mutations/patient/useUploadReportsAndNotes";
import { useAppointmentById } from "@/queries/patient/useAppointmentById";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { router, useLocalSearchParams } from "expo-router";
import { SquarePen, Stethoscope } from "lucide-react-native";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { ActivityIndicator, Alert, Image, Linking, Pressable, ScrollView, Text, View } from "react-native";
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
    const queryClient = useQueryClient();
    const { appointment_id } = useLocalSearchParams<{
        appointment_id: string;
    }>();

    const appointmentId =
        typeof appointment_id === "string" ? appointment_id : undefined;

    const { data, isLoading, isError, refetch } = useAppointmentById(appointmentId);
    // console.log("Appointment Id :", appointmentId);
    // console.log("Data Response :", data);

    // Refetch data when screen first loads or when appointmentId changes
    useEffect(() => {
        if (appointmentId) {
            refetch();
        }
    }, [appointmentId, refetch]);

    if (isLoading) {
        return (
            <View className="flex-1 items-center justify-center bg-white">
                <ActivityIndicator size="large" color="#013220" />
                <Text className="text-black-400 mt-4 font-medium">Loading appointment details...</Text>
            </View>
        );
    }

    if (isError || !data?.data) {
        return (
            <ErrorState
                title="Appointment Not Found"
                message="We couldn't retrieve the details for this appointment. It may have been removed or there's a connection issue."
                onRetry={() => refetch()}
            />
        );
    }

    const appointment = data?.data;
    const patient = appointment?.patient;
    const schedule = appointment?.schedule;
    const doctor = appointment?.doctor;
    const notes = appointment?.notes;
    const medicalReports = appointment?.medical_reports || [];

    // Automatically show reports section if data exists
    const hasReportsAndNotes =
        (medicalReports.length > 0) && (notes?.problem || notes?.reason);

    const [modalVisible, setModalVisible] = useState(false);
    const [cancelModalVisible, setCancelModalVisible] = useState(false);
    const [rescheduleAttemptModalVisible, setRescheduleAttemptModalVisible] =
        useState(false);

    // const { mutate: manageAppointment, isPending } = useManageAppointment(
    //     appointment_id || "",
    // );

    const { mutate: uploadReports, isPending } =
        useUploadReportsAndNotes(appointment_id || "");


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

    // const onSubmit = (data: ManageAppointmentFormData) => {
    //     // Validate that we have at least something to submit
    //     // if (!data.notes && (!data.reports || data.reports.length === 0)) {
    //     //     Alert.alert("Error", "Please add notes or upload at least one report");
    //     //     return;
    //     // }

    //     // Validate reports have files
    //     const hasInvalidReports = data.reports?.some(r => !r.file?.uri || !r.type);
    //     if (data.reports && data.reports.length > 0 && hasInvalidReports) {
    //         Alert.alert("Error", "All reports must have a file and type selected");
    //         return;
    //     }

    //     const formData = new FormData();

    //     // Notes
    //     if (data.notes?.trim()) {
    //         formData.append("notes", data.notes.trim());
    //     }

    //     // Reports - only include valid reports
    //     // const validReports = data.reports?.filter(r => r.file?.uri && r.type) || [];
    //     // validReports.forEach((report, index) => {
    //     //     formData.append(`reports[${index}][type]`, report.type);

    //     //     if (report.file?.uri) {
    //     //         // React Native FormData requires correct file object structure
    //     //         const fileObject = {
    //     //             uri: report.file.uri,
    //     //             name: report.file.name || `report_${index}`,
    //     //             type: report.file.mimeType || report.file.type || "application/octet-stream",
    //     //         };

    //     //         console.log(`📎 Adding file ${index}:`, fileObject);
    //     //         formData.append(`reports[${index}][file]`, fileObject as any);
    //     //     }
    //     // });
    //     const validReports =
    //         data.reports?.filter(
    //             (r) => r?.type && r?.file && r.file.uri
    //         ) || [];

    //     // validReports.forEach((report, index) => {
    //     //     formData.append(`reports[${index}][type]`, report.type);

    //     //     formData.append(`reports[${index}][file]`, {
    //     //         uri: report.file.uri,
    //     //         name:
    //     //             report.file.name ||
    //     //             `report_${index}.${report.file.uri.split(".").pop()}`,
    //     //         type:
    //     //             report.file.mimeType ||
    //     //             report.file.type ||
    //     //             "application/octet-stream",
    //     //     } as any);
    //     // });

    //     if (!data.notes?.trim() && validReports.length === 0) {
    //         Alert.alert("Error", "Please add notes or at least one report");
    //         return;
    //     }

    //     console.log("FormData parts:", (formData as any)._parts);


    //     // console.log("📤 Submitting FormData with", validReports.length, "reports");

    //     // Diagnostic: print FormData internal parts (React Native FormData uses _parts)
    //     try {
    //         const anyFd: any = formData as any;
    //         if (anyFd && anyFd._parts) {
    //             console.log("📋 FormData parts:", anyFd._parts);
    //         }
    //     } catch (e) {
    //         console.log("Could not read FormData parts", e);
    //     }
    //     console.log("📝 Notes:", data.notes?.trim());
    //     console.log("📊 Reports:", validReports);

    //     manageAppointment(formData, {
    //         onSuccess: (res: any) => {
    //             console.log("✅ API Response:", res);

    //             // Invalidate and refetch appointment data to show updated info
    //             queryClient.invalidateQueries({
    //                 queryKey: ["appointment", appointmentId],
    //             });
    //             refetch();

    //             Alert.alert("Success", "Appointment updated successfully", [
    //                 {
    //                     text: "OK",
    //                     onPress: () => {
    //                         reset();
    //                         setReportsAndNotes(false);
    //                     },
    //                 },
    //             ]);
    //         },
    //         onError: (err: any) => {
    //             console.log("❌ API Error Status:", err?.response?.status);
    //             console.log("❌ Full Error Response:", JSON.stringify(err?.response?.data, null, 2));
    //             console.log("❌ Error Message:", err?.message);

    //             // Extract all validation errors
    //             const allErrors = err?.response?.data?.errors || {};
    //             const errorMessages = Object.entries(allErrors)
    //                 .map(([key, value]: [string, any]) => {
    //                     if (Array.isArray(value)) {
    //                         return `${key}: ${value.join(", ")}`;
    //                     }
    //                     return `${key}: ${value}`;
    //                 })
    //                 .join("\n");

    //             const errorMsg = errorMessages ||
    //                 err?.response?.data?.message ||
    //                 "Failed to update appointment";

    //             console.log("❌ All Errors:", errorMsg);
    //             Alert.alert("Error", errorMsg);
    //         },
    //     });
    // };

    const onSubmit = (data: ManageAppointmentFormData) => {
        const validReports =
            data.reports?.filter(r => r?.type && r?.file?.uri) || [];

        if (!data.notes?.trim() && validReports.length === 0) {
            Alert.alert("Error", "Please add notes or at least one report");
            return;
        }

        uploadReports(
            {
                notes: data.notes,
                reports: validReports.map(r => ({
                    type: r.type,
                    file: {
                        uri: r.file.uri,
                        name:
                            r.file.name ||
                            `report.${r.file.uri.split(".").pop()}`,
                        type:
                            r.file.mimeType ||
                            r.file.type ||
                            "application/octet-stream",
                    },
                })),
            },
            {
                onSuccess: (res) => {
                    queryClient.invalidateQueries({
                        queryKey: ["appointment", appointmentId],
                    });
                    refetch();
                    reset();
                    setModalVisible(false);
                    Alert.alert("Success", "Appointment updated successfully");
                },
                onError: (err: any) => {
                    Alert.alert(
                        "Error",
                        err?.response?.data?.message || "Upload failed"
                    );
                },
            }
        );
    };


    const handleCancelAppointment = () => {
        if (!appointmentId) return;

        cancelAppointment(appointmentId, {
            onSuccess: (res) => {
                // console.log("✅ Appointment cancelled:", res?.status);

                // Invalidate appointment query to clear cache
                queryClient.invalidateQueries({
                    queryKey: ["appointment", appointmentId],
                });

                Alert.alert(
                    res?.message || "Appointment cancelled",
                    undefined,
                    [
                        {
                            text: "OK",
                            onPress: () => {
                                setCancelModalVisible(false);
                                router.push("/(patient)/doctors");
                            },
                        },
                    ]
                );

                setCancelModalVisible(false);
            },
            onError: (err: any) => {
                // console.log("❌ Cancel error:", err);

                Alert.alert(
                    "Error",
                    err?.response?.data?.message || "Failed to cancel appointment",
                );
            },
        });
    };

    // Derive a usable doctor id for navigation. backend may provide different fields.
    const doctorId =
        data?.data?.doctor?.user_id ||
        data?.data?.doctor?.id ||
        (data?.data?.doctor as any)?.profile?.id ||
        (data?.data as any)?.doctor_id ||
        appointment?.doctor_id;
    // console.log("Doctor ID :", doctorId);

    // console.log("schedule:", schedule?.opd_type);
    // console.log("appointment:", appointment);


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
                            <Text className="text-primary text-sm">{doctor?.department}</Text>
                        </View>
                        <Text className="text-lg font-medium mt-1">{doctor?.name}</Text>
                    </View>

                    {/* Appointment Details */}
                    <View className="pb-5 mb-5 border-b border-[#EDEDED]">
                        <View>
                            <Text className="text-lg font-medium">Appointment Details</Text>
                            <Text
                                className={`text-xs capitalize font-medium w-fit p-2 rounded-md absolute right-0
                        ${appointment?.status === "confirmed" ? "text-success bg-success-400" : "text-info bg-info-400"}
                        `}
                            >
                                {appointment?.status}
                            </Text>
                        </View>

                        <Detail label="Date" value={schedule?.date_formatted || ""} />
                        <Detail label="Time" value={schedule?.time_formatted || ""} />
                        <Detail
                            label="Booking Type"
                            value={schedule?.consultation_type_label || ""}
                        />
                    </View>

                    {/* Patient Details */}
                    <View className="pb-5 mb-5 border-b border-[#EDEDED]">
                        <Text className="text-lg font-medium">Patient Details</Text>
                        <Detail label="Name" value={patient?.name || ""} />
                        <Detail label="Age" value={patient?.age_formatted || ""} />
                        <Detail label="Gender" value={patient?.gender_formatted || ""} />
                    </View>

                    <View>
                        {/* Medical Reports & Notes */}
                        {hasReportsAndNotes ? (
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

                                {/* Report Cards - Dynamic List */}
                                {medicalReports.map((report: any, index: number) => (
                                    <View
                                        key={report.id || index}
                                        className="flex-row justify-between items-center mb-5 p-3.5 bg-gray-50 rounded-xl border border-gray-200"
                                    >
                                        <View className="flex-1">
                                            <Text className="text-sm font-medium text-black mb-2">
                                                {report.name || `Report ${index + 1}`}
                                            </Text>
                                            <Text className="text-sm text-black mb-1">
                                                {report.report_date || "Date not specified"}
                                            </Text>
                                            <Text className="text-sm text-black mb-3">
                                                Type: {report.type || "Unknown"}
                                            </Text>
                                        </View>
                                        <Button
                                            className="bg-primary"
                                            onPress={() => {
                                                if (report.file_url) {
                                                    Linking.openURL(report.file_url).catch(() => {
                                                        Alert.alert(
                                                            "Error",
                                                            "Unable to open report"
                                                        );
                                                    });
                                                } else {
                                                    Alert.alert(
                                                        "Error",
                                                        "Report URL not available"
                                                    );
                                                }
                                            }}
                                        >
                                            <Text className="text-white font-medium">View</Text>
                                        </Button>
                                    </View>
                                ))}

                                {/* Note Section */}
                                <View>
                                    <Text className="text-base font-semibold text-black mb-2">
                                        Note
                                    </Text>
                                    <View className="bg-gray-50 rounded-xl border border-gray-200 p-4">
                                        <Text className="text-sm text-black-400">
                                            {typeof notes === "object" && notes?.problem
                                                ? notes.problem
                                                : notes?.reason || "No notes available."}
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
                            {appointment?.status !== "rescheduled" ? (
                                <Button
                                    className="flex-1"
                                    onPress={() => {

                                        // If doctor id is missing, show attempt modal instead of navigating
                                        if (!doctorId) {
                                            setRescheduleAttemptModalVisible(true);
                                            return;
                                        }

                                        router.push({
                                            pathname: `/patient/doctor/${doctorId}` as any,
                                            params: {
                                                consultation_type: schedule?.consultation_type,
                                                consultation_opd_type: schedule?.opd_type,
                                                booking_type: "reschedule",
                                                appointment_id: appointmentId,
                                                appointment_date: schedule?.date,
                                                appointment_time: schedule?.time,
                                                can_reschedule: String(appointment?.can_reschedule ?? false),
                                                appointment_status: String(appointment?.status ?? ""),
                                            },
                                        });
                                    }}
                                    disabled={!appointment?.can_reschedule}
                                >
                                    Reschedule
                                </Button>
                            ) : (
                                <Button
                                    className="flex-1"
                                    onPress={() => setRescheduleAttemptModalVisible(true)}
                                >
                                    Reschedule
                                </Button>
                            )}
                            <Button
                                variant="outline"
                                className="flex-1"
                                onPress={() => setCancelModalVisible(true)}
                            >
                                Cancel
                            </Button>
                        </View>

                        <RescheduleAttemptModal
                            visible={rescheduleAttemptModalVisible}
                            onClose={() => setRescheduleAttemptModalVisible(false)}
                        />

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
        </FormProvider >
    );
}

/* ---------------------- Reusable Row ---------------------- */
const Detail = ({ label, value }: { label: string; value: string }) => (
    <View className="flex-row justify-between mt-3">
        <Text className="text-sm text-black-400">{label}</Text>
        <Text className="text-sm font-medium text-black-400">{value}</Text>
    </View>
);
