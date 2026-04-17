import DateField from "@/components/form/date";
import FileUploadField from "@/components/form/FileUploadField";
import SelectField from "@/components/form/selectField";
import TextArea from "@/components/form/TextArea";
import Button from "@/components/ui/Button";
import { useAuth } from "@/context/UserContext";
import { useUpdateInstructions } from "@/queries/doctor/useUpdateInstructions";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocalSearchParams } from "expo-router";
import { useForm } from "react-hook-form";
import { Alert, View } from "react-native";
import { z } from "zod";

const ConclusionSchema = z.object({
    next_visit_date: z.date(),
    instructions_by_doctor: z.string().min(1, "Instructions are required"),
    report_type: z.string().optional(),
    other_details: z.string().optional(),
    medical_record_details: z.string().optional(),
    files: z.array(z.any()).optional(),
});

type ConclusionFormValues = z.infer<typeof ConclusionSchema>;

interface Props {
    onClose: () => void;
    initialData?: {
        instructions_by_doctor: string;
        next_visit_date: string;
    };
}

const ConclusionForm = ({ onClose, initialData }: Props) => {

    const { token } = useAuth();
    const { appointment_id } = useLocalSearchParams<{ appointment_id: string }>();
    const { mutate: updateInstructions, isPending } = useUpdateInstructions();

    const { control, handleSubmit, setValue, watch } = useForm<ConclusionFormValues>({
        resolver: zodResolver(ConclusionSchema),
        defaultValues: {
            next_visit_date: initialData?.next_visit_date ? new Date(initialData.next_visit_date) : new Date(),
            instructions_by_doctor: initialData?.instructions_by_doctor || "",
            report_type: "",
            other_details: "",
            medical_record_details: "",
            files: [],
        },
    });

    const onSubmit = (data: ConclusionFormValues) => {
        if (!appointment_id || !token) {
            Alert.alert("Error", "Missing appointment information or user token");
            return;
        }

        const payload = {
            next_visit_date: data.next_visit_date.toISOString().split("T")[0],
            instructions_by_doctor: data.instructions_by_doctor,
            report_type: data.report_type,
            files: data.files,
        };
        // console.log("payload", payload);
        updateInstructions(
            {
                appointmentId: appointment_id,
                data: payload,
                token: token,
            },
            {
                onSuccess: () => {
                    Alert.alert("Success", "Consultation conclusion submitted successfully");
                    onClose();
                },
                onError: (error: any) => {
                    const errorMessage = error.response?.data?.errors?.message || error.message || "Failed to submit conclusion";
                    Alert.alert("Error", errorMessage);
                },
            }
        );
    };

    return (
        <View className="p-5">
            <View>
                <TextArea
                    name="instructions_by_doctor"
                    control={control}
                    label="Conclusion Notes"
                    placeholder="Enter your summary or conclusion here..."
                />
            </View>

            <DateField
                label="Next Visit Date"
                value={watch("next_visit_date") || new Date()}
                onChange={(date) => {
                    if (date) setValue("next_visit_date", date);
                }}
                className="mt-4"
            />

            <SelectField
                name="report_type"
                control={control}
                label="Report Type"
                className="mt-4"
                options={[
                    { label: "Other", value: "other" },
                    { label: "Medical Report", value: "medical-report" }
                ]}
                placeholder="Select report type"
            />

            {watch("report_type") && (
                <FileUploadField
                    name="files"
                    control={control}
                    label="Add Reports (optional)"
                    className="mt-4"
                    multiple={true}
                />
            )}

            <View className="mt-8">
                <Button
                    onPress={handleSubmit(onSubmit)}
                    disabled={isPending}
                >
                    {isPending ? "Submitting..." : "Submit Conclusion"}
                </Button>
            </View>
        </View>
    );
};

export default ConclusionForm;
