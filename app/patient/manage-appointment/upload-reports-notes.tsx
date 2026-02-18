import FileUploadField from "@/components/form/FileUploadField";
import Input from "@/components/form/Input";
import SelectField from "@/components/form/selectField";
import TextArea from "@/components/form/TextArea";
import Button from "@/components/ui/Button";
import { Trash2, X } from "lucide-react-native";
import { useFieldArray, useFormContext, useWatch } from "react-hook-form";
import { Alert, KeyboardAvoidingView, Modal, Platform, Pressable, Text, View } from "react-native";
import { GestureHandlerRootView, ScrollView } from "react-native-gesture-handler";

import MultiSelectField from "@/components/form/multi-select-field";
import { useAuth } from "@/context/UserContext";
import { useMedicalReports } from "@/queries/patient/useGetMedicalReports";

interface UploadReportsNotesProps {
    visible: boolean;
    onClose: () => void;
    onSubmit: () => void;
    isPending?: boolean;
    insets?: { bottom?: number };
    showNotes?: boolean;
    // onDeleteExisting?: (reportId: string) => void;
}

export default function UploadReportsNotes({
    visible,
    onClose,
    onSubmit,
    isPending = false,
    insets,
    showNotes = true,
    // onDeleteExisting,
}: UploadReportsNotesProps) {

    const { control, setValue } = useFormContext();
    const { user } = useAuth();
    const { data } = useMedicalReports(user?.id);
    const reportsList = data?.data || [];
    const existingReportOptions =
        data?.data?.map((r: any) => ({
            label: r.report_name,
            value: r.id,
        })) || [];

    const { fields, append, remove } = useFieldArray({
        control,
        name: "reports",
    });

    const reportType = useWatch({ control, name: "reportType" });
    const reportFile = useWatch({ control, name: "reportFile" });
    const reportName = useWatch({ control, name: "reportName" });

    const handleAddReport = () => {

        if (!reportType || !reportFile || !reportName?.trim()) {
            Alert.alert("Error", "Please enter report title, type and file");
            return;
        }
        
        if (reportType && reportFile && reportName?.trim()) {

            append({
              type: reportType,
              file: reportFile,
              name: reportName.trim(),
            });
          
            setValue("reportType", "");
            setValue("reportName", "");
            setValue("reportFile", null);
        }
    };

    return (
        <Modal visible={visible} animationType="slide" transparent>
            <GestureHandlerRootView style={{ flex: 1 }}>
                <ScrollView
                    className="flex-1 bg-black/50 pt-10"
                    style={{
                        marginTop: insets?.top + 50,
                    }}
                    contentContainerStyle={{ flexGrow: 1, justifyContent: "flex-end" }}
                >
                    <KeyboardAvoidingView
                        behavior={Platform.OS === "ios" ? "padding" : "height"}
                    >
                        <View
                            className="bg-white rounded-t-3xl p-5"
                            style={{ paddingBottom: (insets?.bottom ?? 0) + 16 }}
                        >
                            {/* Header */}
                            <View className="flex-row justify-between items-center mb-5">
                                <Text className="text-xl font-semibold">
                                    Upload Reports & Notes
                                </Text>
                                <Pressable onPress={onClose}>
                                    <X size={24} />
                                </Pressable>
                            </View>

                            {/* Notes */}
                            {showNotes && (
                                <TextArea
                                    name="notes"
                                    label="Write your health problem to Doctor"
                                    control={control}
                                    placeholder="Describe symptoms or notes..."
                                />
                            )}

                            <MultiSelectField
                                name="existingReports"
                                control={control}
                                label="Select from My Reports"
                                options={existingReportOptions}
                            />

                            <View className="flex-row justify-center items-center mt-5">
                                <Text className="text-xl font-medium">Or</Text>
                            </View>
                            
                            {/* title */}
                            <Input
                                name="reportName"
                                control={control}
                                label="Report Title"
                                placeholder="Report Title"
                                containerClassName="mt-5"
                            />

                            {/* Type */}
                            <SelectField
                                name="reportType"
                                label="Report Type"
                                control={control}
                                options={[
                                    { label: "Blood Test", value: "blood_test" },
                                    { label: "X-Ray", value: "x_ray" },
                                    { label: "MRI", value: "mri" },
                                    { label: "Prescription", value: "prescription" },
                                ]}
                                className="mt-4"
                            />

                            {/* File */}
                            <FileUploadField
                                name="reportFile"
                                control={control}
                                label="Upload File"
                                className="mt-4"
                            />

                            <Button
                                className="mt-4"
                                onPress={handleAddReport}
                                disabled={!reportType || !reportFile || !reportName?.trim()}
                            >
                                Add Report
                            </Button>


                            {/* List */}
                            {fields.map((item, index) => (
                                <View
                                    key={item.id}
                                    className="flex-row justify-between items-center mt-3 p-3 border rounded-lg"
                                >
                                    <View>
                                        <Text className="text-sm font-medium">{item.name}</Text>
                                        <Text className="text-xs text-gray-500">{item.type}</Text>
                                    </View>

                                    <Pressable onPress={() => remove(index)}>
                                        <Trash2 size={18} color="red" />
                                    </Pressable>

                                </View>
                            ))}


                            {/* Footer */}
                            <View className="flex-row gap-3 mt-6 pb-10">
                                <Button variant="outline" className="flex-1" onPress={onClose}>
                                    Cancel
                                </Button>
                                <Button
                                    className="flex-1"
                                    onPress={() => {

                                        const existingSelected =
                                            control._formValues.existingReports?.length > 0;

                                        if (
                                            !reportType &&
                                            !reportFile &&
                                            !reportName &&
                                            fields.length === 0 &&
                                            !existingSelected &&
                                            !(showNotes && control._formValues.notes?.trim())
                                          ) {
                                            Alert.alert("Nothing to submit");
                                            return;
                                          }
                                      
                                        // auto append if user forgot Add Report
                                        if (reportType && reportFile && reportName?.trim()) {
                                          append({
                                            type: reportType,
                                            file: reportFile,
                                            name: reportName.trim(),
                                          });
                                      
                                          setValue("reportType", "");
                                          setValue("reportName", "");
                                          setValue("reportFile", null);
                                        }
                                      
                                        const selectedIds = control._formValues.existingReports || [];

                                        const selectedReports = reportsList
                                        .filter(r => selectedIds.includes(r.id))
                                        .map(r => ({
                                            id: r.id,              // ⭐ IMPORTANT
                                            name: r.report_name,
                                            type: r.report_type,
                                            file: null,            // ⭐ no file upload
                                            isExisting: true,      // ⭐ flag
                                        }));

                                      

                                        // append them into reports array
                                        selectedReports.forEach(r => append(r));

                                        onSubmit();

                                      }}                                      
                                    disabled={isPending}
                                >
                                    {isPending ? "Submitting..." : "Submit"}
                                </Button>
                            </View>
                        </View>
                    </KeyboardAvoidingView>
                </ScrollView>
            </GestureHandlerRootView>
        </Modal>
    );
}
