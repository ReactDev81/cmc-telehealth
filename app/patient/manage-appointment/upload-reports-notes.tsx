import FileUploadField from "@/components/form/FileUploadField";
import Input from "@/components/form/Input";
import SelectField from "@/components/form/selectField";
import TextArea from "@/components/form/TextArea";
import Button from "@/components/ui/Button";
import { Trash2, X } from "lucide-react-native";
import { useFieldArray, useFormContext, useWatch } from "react-hook-form";
import { Alert, KeyboardAvoidingView, Modal, Platform, Pressable, Text, View } from "react-native";

interface UploadReportsNotesProps {
    visible: boolean;
    onClose: () => void;
    onSubmit: () => void;
    isPending?: boolean;
    insets?: { bottom?: number };
}

export default function UploadReportsNotes({
    visible,
    onClose,
    onSubmit,
    isPending = false,
    insets,
}: UploadReportsNotesProps) {

    const { control, setValue } = useFormContext();

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
        
        append({
            type: reportType,
            file: reportFile,
            name: reportName.trim(),
        });

        setValue("reportType", "");
        setValue("reportName", "");
        setValue("reportFile", null);
    };

    return (
        <Modal visible={visible} animationType="slide" transparent>
            <View className="flex-1 bg-black/50 justify-end">
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
                        <TextArea
                            name="notes"
                            label="Write your health problem to Doctor"
                            control={control}
                            placeholder="Describe symptoms or notes..."
                        />

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

                        <Button className="mt-4" onPress={handleAddReport}>
                            Add Report
                        </Button>

                        {/* List */}
                        {fields.map((item, index) => (
                            <View
                                key={item.id}
                                className="flex-row justify-between items-center mt-3 p-3 border rounded-lg"
                            >
                                <Text className="text-sm">{item.type}</Text>
                                <Pressable onPress={() => remove(index)}>
                                    <Trash2 size={18} color="red" />
                                </Pressable>
                            </View>
                        ))}

                        {/* Footer */}
                        <View className="flex-row gap-3 mt-6">
                            <Button variant="outline" className="flex-1" onPress={onClose}>
                                Cancel
                            </Button>
                            <Button
                                className="flex-1"
                                onPress={onSubmit}
                                disabled={isPending}
                            >
                                {isPending ? "Submitting..." : "Submit"}
                            </Button>
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </View>
        </Modal>
    );
}
