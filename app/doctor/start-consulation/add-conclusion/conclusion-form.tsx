import DateField from "@/components/form/date";
import TextArea from "@/components/form/TextArea";
import Button from "@/components/ui/Button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { View } from "react-native";
import { z } from "zod";

const ConclusionSchema = z.object({
    conclusion_date: z.date(),
    notes: z.string().min(1, "Notes are required"),
});

type ConclusionFormValues = z.infer<typeof ConclusionSchema>;

interface Props {
    onClose: () => void;
}

const ConclusionForm = ({ onClose }: Props) => {
    const { control, handleSubmit, setValue, watch } = useForm<ConclusionFormValues>({
        resolver: zodResolver(ConclusionSchema),
        defaultValues: {
            conclusion_date: new Date(),
            notes: "",
        },
    });

    const onSubmit = (data: ConclusionFormValues) => {
        console.log("✅ Conclusion Form Submitted:", data);

        // API ready structure
        const payload = {
            conclusion_date: data.conclusion_date.toISOString().split("T")[0],
            notes: data.notes,
        };

        console.log("🚀 API Ready Payload:", JSON.stringify(payload, null, 2));

        // Since we are not including the actual API call yet:
        onClose();
    };

    return (
        <View className="p-5">
            <View>
                <TextArea
                    name="notes"
                    control={control}
                    label="Conclusion Notes"
                    placeholder="Enter your summary or conclusion here..."
                />
            </View>

            <DateField
                label="Conclusion Date"
                value={watch("conclusion_date")}
                onChange={(date) => setValue("conclusion_date", date)}
                className="mt-4"
            />
            <View className="mt-8">
                <Button onPress={handleSubmit(onSubmit)}>
                    Submit Conclusion
                </Button>
            </View>
        </View>
    );
};

export default ConclusionForm;
