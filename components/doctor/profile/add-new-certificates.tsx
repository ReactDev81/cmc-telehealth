import { View, Text, Pressable, Alert } from "react-native";
import { X } from 'lucide-react-native';
import Input from "@/components/form/Input";
import DateField from "@/components/form/date";
import FileUploadField from "@/components/form/FileUploadField";
import { useForm } from 'react-hook-form';
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "@/components/ui/Button";

const CertificatesSchema = z.object({
    degree: z.string().min(2, "Degree must be at least 2 characters long"),
    institution: z.string().min(2, "Institutionn Name must be at least 2 characters long"),
    collage_address: z.string().min(2, "Collage Address is required"),
    compliance_year: z.date({ required_error: "Compliance Year is required" }).nullable(),
    upload_file: z.any().refine((file) => !!file, "Upload File is required"),
});
  
type EducationHistoryFormData = z.infer<typeof CertificatesSchema>;

const AddNewCertificates = ({ onClose }: { onClose: () => void }) => {

    const { control, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm<EducationHistoryFormData>({
        resolver: zodResolver(CertificatesSchema),
        defaultValues: {
            degree: '',
            institution: '',
            collage_address: '',
            compliance_year: null,
            upload_file: null,
        }
    });

    const compliance_year = watch('compliance_year');

    const onSubmit = (data: any) => {
        console.log(data);
        Alert.alert("Success", "New education history saved successfully!");
        reset();
        onClose();
    }

    return(
        <View className="p-5 bg-white rounded-xl">

            {/* headet */}
            <View className="flex-row items-center justify-between">
                <Text className="text-black text-lg font-semibold">Add Education History</Text>
                <Pressable onPress={onClose}>
                    <X size={18} color="#1F1E1E" strokeWidth={2.5} />
                </Pressable>
            </View>

            {/* form */}
            <View className="mt-5">

                <Input
                    name="degree"
                    label="Degree"
                    control={control}
                />

                <Input
                    name="institution"
                    label="Institution"
                    control={control}
                    containerClassName="mt-5" 
                />

                <Input
                    name="collage_address"  
                    label="Address of Collage"
                    control={control}
                    containerClassName="mt-5" 
                />

                <DateField
                    label="Compliance Year"
                    value={compliance_year}
                    onChange={(date) => setValue('compliance_year', date ? new Date(date) : null, { shouldValidate: true })}
                    placeholder="DD/MM/YYYY"
                    maximumDate={new Date()}
                    error={errors.compliance_year?.message}
                    className="mt-5"
                />

                <FileUploadField
                    name="upload_file"
                    control={control}
                    label="Upload File"
                    className="mt-5"
                />

                <Button onPress={handleSubmit(onSubmit)} className="mt-5">
                    Add Education 
                </Button>
            </View>

        </View>
    )
}

export default AddNewCertificates