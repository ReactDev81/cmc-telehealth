import Input from "@/components/form/Input";
import TextArea from "@/components/form/TextArea";
import Button from "@/components/ui/Button";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronRight, X } from 'lucide-react-native';
import { useForm } from 'react-hook-form';
import { Alert, Pressable, Text, View } from "react-native";
import { z } from "zod";

const CertificatesSchema = z.object({
    medication: z.string().min(2, "Medication must be at least 2 characters long"),
    dosage: z.string().min(2, "Dosage Name must be at least 2 characters long"),
    frequency: z.string().min(2, "Frequency Address is required"),
    duration: z.string().min(2, "Duration Address is required"),
    notes: z.string().min(2, "Notes is required"),
});

type EducationHistoryFormData = z.infer<typeof CertificatesSchema>;

const AddNewPrescription = ({ onClose }: { onClose: () => void }) => {

    const { control, handleSubmit, reset } = useForm<EducationHistoryFormData>({
        resolver: zodResolver(CertificatesSchema),
        defaultValues: {
            medication: '',
            dosage: '',
            frequency: '',
            duration: '',
            notes: ''
        }
    });

    const onSubmit = (data: any) => {
        // console.log(data);
        Alert.alert("Success", "New education history saved successfully!");
        reset();
        onClose();
    }

    return (
        <View className="p-5 bg-white rounded-xl">

            {/* headet */}
            <View className="flex-row items-center justify-between">
                <Text className="text-black text-lg font-semibold">Add New Prescriptions</Text>
                <Pressable onPress={onClose}>
                    <X size={18} color="#1F1E1E" strokeWidth={2.5} />
                </Pressable>
            </View>

            {/* form */}
            <View className="mt-5">

                <Input
                    name="medication"
                    label="Medication"
                    control={control}
                />

                <Input
                    name="dosage"
                    label="Dosage"
                    control={control}
                    containerClassName="mt-5"
                />

                <Input
                    name="frequency"
                    label="Frequency"
                    control={control}
                    containerClassName="mt-5"
                />

                <Input
                    name="duration"
                    label="Duration"
                    control={control}
                    containerClassName="mt-5"
                />

                <TextArea
                    name="notes"
                    label="Notes"
                    control={control}
                    containerClassName="mt-5"
                />

                <Button
                    onPress={handleSubmit(onSubmit)}
                    className="mt-5 flex-row-reverse"
                    icon={<ChevronRight size={16} color="#fff" strokeWidth={3} />}
                >
                    Add Prescriptions
                </Button>
            </View>

        </View>
    )
}

export default AddNewPrescription