import CancelAppointmentModal from "@/components/patient/appointment/cancel-appointment-modal";
import RescheduleAttemptModal from "@/components/patient/appointment/reschedule-attempt-modal";
import Button from "@/components/ui/Button";
import ErrorState from "@/components/ui/ErrorState";
import { useCancelAppointment } from "@/mutations/patient/useCancelAppointment";
import { useDeleteMedicalReport } from "@/mutations/patient/useDeleteMedicalReport";
import { useUploadReportsAndNotes } from "@/mutations/patient/useUploadReportsAndNotes";
import { useAppointmentById } from "@/queries/patient/useAppointmentById";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { router, useLocalSearchParams } from "expo-router";
import { Eye, MoreVertical, Pencil, SquarePen, Stethoscope, Trash2 } from "lucide-react-native";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { ActivityIndicator, Alert, Image, Linking, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import * as z from "zod";
import EditNotesModal from "./edit-notes-modal";
import EditReportModal from "./edit-report-modal";
import UploadReportsNotes from "./upload-reports-notes";


/* ---------------------- Validation Schema ---------------------- */
const manageAppointmentSchema = z.object({
    notes: z.string().optional(),
    reportType: z.string().optional(),
    reportFile: z.any().nullable(),
    reportName: z.string().optional(),
    reports: z.array(
        z.object({
          id: z.any().optional(),   // ⭐ IMPORTANT
          type: z.string().min(1),
          name: z.string().min(1, "Report title required"),
          file: z.any(),
          isExisting: z.boolean().optional(),
        })
    ).optional(),
    existingReports: z.array(z.string()).optional(),
});

type ManageAppointmentFormData = z.infer<typeof manageAppointmentSchema>;

export default function ManageAppointments() {

    const insets = useSafeAreaInsets();
    const queryClient = useQueryClient();
    const { appointment_id } = useLocalSearchParams<{appointment_id: string;}>();
    const appointmentId = typeof appointment_id === "string" ? appointment_id : undefined;
    const { data, isLoading, isError, refetch } = useAppointmentById(appointmentId);
    const [modalVisible, setModalVisible] = useState(false);
    const [cancelModalVisible, setCancelModalVisible] = useState(false);
    const [rescheduleAttemptModalVisible, setRescheduleAttemptModalVisible] = useState(false);
    const { mutate: uploadReports, isPending } = useUploadReportsAndNotes(appointment_id || "");
    const { mutate: cancelAppointment, isPending: isCancelling } = useCancelAppointment();
    const { mutate: deleteReport } = useDeleteMedicalReport();
    const [editingReport, setEditingReport] = useState<any>(null);
    const [editingNotes, setEditingNotes] = useState(false);

    const [menuVisible, setMenuVisible] = useState<string | null>(null);



    const methods = useForm<ManageAppointmentFormData>({
        resolver: zodResolver(manageAppointmentSchema),
        defaultValues: {
            notes: "",
            reportType: "",
            reportName: "",
            reportFile: null,
            reports: [],
            existingReports: [],
        },
    });

    const { handleSubmit, reset } = methods;

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
    const hasReportsAndNotes = (medicalReports.length > 0) && notes;

    const handleUpdateReport = (updatedReport) => {
        uploadReports(
          {
            reports: [updatedReport],   // ⭐ only one report
          },
          {
            onSuccess: () => {
              setEditingReport(null);
              refetch();
            },
          }
        );
      };
      
      const handleUpdateNotes = (updatedNotes: string) => {
        uploadReports(
          { notes: updatedNotes },
          {
            onSuccess: () => {
              setEditingNotes(false);
              refetch();
            },
          }
        );
      };
      

    const onSubmit = (data: ManageAppointmentFormData) => {

        console.log("data", data);
        console.log("reports", data?.reports);
      
        const payload: any = {};
      
        // ✅ Add notes if present
        if (data.notes?.trim()) {
          payload.notes = data.notes.trim();
        }
      
        const validReports = data.reports || [];
      
        // ✅ Build reports array properly
        const payloadReports = validReports.map((r: any) => {
          // ⭐ EXISTING REPORT (selected from My Reports)
          if (r.isExisting && r.id) {
            return {
              id: r.id,
              type: r.type,
              name: r.name,
            };
          }
      
          // ⭐ NEWLY UPLOADED REPORT
          return {
            type: r.type,
            name: r.name,
            file: {
              uri: r.file?.uri,
              name:
                r.file?.name ||
                `report.${r.file?.uri?.split(".").pop()}`,
              type:
                r.file?.mimeType ||
                r.file?.type ||
                "application/octet-stream",
            },
          };
        });
      
        if (payloadReports.length > 0) {
          payload.reports = payloadReports;
        }
      
        // ✅ Nothing to update
        if (!payload.notes && !payload.reports) {
          Alert.alert("Nothing to update");
          return;
        }
      
        uploadReports(payload, {
          onSuccess: (res) => {
            console.log("✅ Upload success:", res);
      
            queryClient.invalidateQueries({
              queryKey: ["appointment", appointmentId],
            });
      
            refetch();
            reset();
            setModalVisible(false);
      
            Alert.alert("Success", "Appointment updated successfully");
          },
          onError: (err: any) => {
            console.log("UPLOAD ERROR:", err?.response?.data);
      
            Alert.alert(
              "Error",
              err?.response?.data?.message || "Upload failed"
            );
          },
        });
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
            <SafeAreaView className="flex-1 bg-white" edges={['left', 'right', 'bottom']}>
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

                    <View className="p-5">

                        {/* Doctor Info */}
                        <View className="pb-5 mb-5 border-b border-black-200">
                            <View className="flex-row items-center gap-x-1">
                                <Stethoscope size={14} color="#013220" />
                                <Text className="text-primary text-sm">{doctor?.department}</Text>
                            </View>
                            <Text className="text-lg font-medium mt-1">{doctor?.name}</Text>
                        </View>

                        {/* Appointment Details */}
                        <View className="pb-5 mb-5 border-b border-black-200">
                            <View>
                                <Text className="text-lg font-medium">Appointment Details</Text>
                                <Text
                                    className={`text-xs capitalize font-medium w-fit p-2 rounded-md absolute right-0
                                        ${appointment?.status === "confirmed" ? "text-success bg-success-400" : 
                                            appointment?.status === "cancelled" ? "text-danger bg-danger-400" :
                                            "text-info bg-info-400"}
                                    `}
                                >
                                    {appointment?.status}
                                </Text>
                            </View>

                            <Detail label="Date" value={schedule?.date_formatted || ""} />
                            <Detail label="Time" value={schedule?.time_formatted || ""} />
                            <Detail label="Booking Type" value={schedule?.consultation_type_label || ""} />
                        </View>

                        {/* Patient Details */}
                        <View className="pb-5 mb-5 border-b border-black-200">
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
                                    </View>

                                    {/* Report Cards - Dynamic List */}
                                    {medicalReports.map((report: any, index: number) => (
                                        <View
                                            key={report.id || index}
                                            className="flex-row justify-between items-center mb-5 p-3.5 bg-gray-50 rounded-xl border border-gray-200"
                                        >
                                            <View className="flex-1">
                                                <Text className="text-sm font-medium text-black mb-2">
                                                    {report.title || `Report ${index + 1}`}
                                                </Text>
                                                <Text className="text-sm text-black mb-1">
                                                    {report.report_date || "Date not specified"}
                                                </Text>
                                                <Text className="text-sm text-black mb-3">
                                                    Type: {report.type || "Unknown"}
                                                </Text>
                                            </View>
                                            
                                            <View className="items-end">

                                                {/* menu trigger */}
                                                <Pressable
                                                    onPress={() =>
                                                        setMenuVisible(menuVisible === report.id ? null : report.id)
                                                    }
                                                    className="p-2 border border-primary-400 rounded-md"
                                                >
                                                    <MoreVertical size={20} color="#344054" />
                                                </Pressable>

                                                {/* popup menu */}
                                                {menuVisible === report.id && (

                                                    <View className="absolute top-8 right-0 bg-white border border-gray-200 rounded-xl shadow-lg w-36 z-50">

                                                        {/* VIEW */}
                                                        <Pressable
                                                            onPress={() => {
                                                                setMenuVisible(null);
                                                                if (report.file_url) {
                                                                    Linking.openURL(report.file_url);
                                                                }
                                                            }}
                                                            className="flex-row items-center gap-2 px-4 py-3"
                                                        >
                                                            <Eye size={16} color="#333" />
                                                            <Text className="text-black">View</Text>
                                                        </Pressable>

                                                        {/* EDIT */}
                                                        <Pressable
                                                            onPress={() => {
                                                                setMenuVisible(null);
                                                                setEditingReport(report);
                                                            }}
                                                            className="flex-row items-center gap-2 px-4 py-3 border-t border-gray-100"
                                                        >
                                                            <Pencil size={16} color="#333" />
                                                            <Text>Edit</Text>
                                                        </Pressable>

                                                        {/* DELETE */}
                                                        <Pressable
                                                            onPress={() => {
                                                                setMenuVisible(null);
                                                                Alert.alert("Delete Report", "Confirm delete?", [
                                                                    { text: "Cancel" },
                                                                    {
                                                                        text: "Delete",
                                                                        style: "destructive",
                                                                        onPress: () => {
                                                                            deleteReport(report.id, {
                                                                                onSuccess: () => refetch(),
                                                                            });
                                                                        },
                                                                    },
                                                                ]);

                                                            }}
                                                            className="flex-row items-center gap-2 px-4 py-3 border-t border-gray-100"
                                                        >
                                                            <Trash2 size={16} color="red" />
                                                            <Text className="text-red-500">Delete</Text>
                                                        </Pressable>

                                                    </View>
                                                )}

                                            </View>

                                        </View>
                                    ))}

                                    {/* Note Section */}
                                    <View>
                                        <Text className="text-base font-semibold text-black mb-2">
                                            Note
                                        </Text>
                                        <View className="flex-row items-center justify-between bg-gray-50 rounded-xl border border-gray-200 p-4">
                                            <Text className="text-sm text-black-400">
                                                {typeof notes === "string" ? notes : "No notes available."}
                                            </Text>
                                            <Pressable
                                                onPress={() => setEditingNotes(true)}
                                                className="p-2"
                                            >
                                                <SquarePen size={18} color="#000" />
                                            </Pressable>
                                        </View>
                                    </View>


                                    <Button
                                        onPress={() => {
                                            methods.reset({
                                                notes: notes || "",
                                                reports: [],
                                                existingReports: [], // reset selection
                                            });
                                              
                                        
                                            setModalVisible(true);
                                        }}
                                        className="mt-5"
                                    >
                                        <Text>Upload New Report</Text>
                                    </Button>
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

                            <EditReportModal
                                visible={!!editingReport}
                                report={editingReport}
                                onClose={() => setEditingReport(null)}
                                onSave={handleUpdateReport}
                            />

                            <EditNotesModal
                                visible={editingNotes}
                                notes={notes}
                                onClose={() => setEditingNotes(false)}
                                onSave={handleUpdateNotes}
                            />


                            <UploadReportsNotes
                                visible={modalVisible}
                                showNotes={!hasReportsAndNotes}
                                // onClose={() => setModalVisible(false)}
                                onClose={() => {
                                    methods.reset();
                                    setModalVisible(false);
                                  }}
                                onSubmit={handleSubmit(onSubmit)}
                                isPending={isPending}
                                insets={insets}
                                onDeleteExisting={(reportId) => {
                                    Alert.alert(
                                      "Delete Report",
                                      "Delete this report permanently?",
                                      [
                                        { text: "Cancel" },
                                        {
                                          text: "Delete",
                                          style: "destructive",
                                          onPress: () => {
                                            deleteReport(reportId, {
                                              onSuccess: () => {
                                                queryClient.invalidateQueries({
                                                  queryKey: ["appointment", appointmentId],
                                                });
                                                refetch();
                                              },
                                            });
                                          },
                                        },
                                      ]
                                    );
                                }}
                            />
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
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
