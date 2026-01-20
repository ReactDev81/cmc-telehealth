import DateField from "@/components/form/date";
import FileUploadField from "@/components/form/FileUploadField";
import Input from "@/components/form/Input";
import Button from "@/components/ui/Button";
import { useAuth } from "@/context/UserContext";
import { useUploadMedicalReport } from "@/mutations/patient/useUploadMedicalReport";
import { zodResolver } from "@hookform/resolvers/zod";
import { router, useLocalSearchParams } from 'expo-router';
import { useForm } from "react-hook-form";
import { Text, View } from "react-native";
import { z } from "zod";

const uploadSchema = z.object({
    name: z.string().min(1, "Name is required"),
    report_date: z.date({
        required_error: "Document date is required",
    }),
    file: z.any().refine((file) => file && file.name, "File is required"),
});

type UploadFormData = z.infer<typeof uploadSchema>;

const UploadYourReport = () => {

    const { user } = useAuth();
    const { mutate, isPending } = useUploadMedicalReport();

    const methods = useForm<UploadFormData>({
        resolver: zodResolver(uploadSchema),
        defaultValues: {
            name: "",
            report_date: undefined,
            file: null,
        },
    });

    const { reportType } = useLocalSearchParams<{
        reportType?: string;
    }>();
    

    const { handleSubmit, reset, setValue, watch, control, formState: { errors, isSubmitting } } = methods;

    const documentDate = watch('report_date');

    const onSubmit = (data: UploadFormData) => {
        if (!user?.id) return;
        
        console.log('data', data);

        mutate(
            {
                patientId: user.id,
                name: data.name,
                report_date: data.report_date,
                type: reportType,
                is_public: 0,
                file: {
                    uri: data.file.uri,
                    name: data.file.name,
                    mimeType: data.file.mimeType,
                    size: data.file.size
                }                  
            },
            {
                onSuccess: (res) => {
                    console.log('data submitted sucesffully', res)
                    reset();
                    router.back();
                },
                onError: (error: any) => {
                    console.log("Upload error:", error.response?.data || error.message);
                },
            }
        );
    };
      

    return (
        <View className="flex-1 bg-white p-5">
                
            <Input
                name="name"
                label="Name"
                control={control}
                placeholder="Enter your name"
            />

            <DateField
                label="Document Date"
                value={documentDate}
                onChange={(date) => setValue('report_date', date as Date, { shouldValidate: true })}
                placeholder="DD/MM/YYYY"
                maximumDate={new Date()}
                error={errors.report_date?.message}
                className="mt-5"
            />

            <FileUploadField
                name="file"
                label="Attach a document"
                control={control}
                className="mt-5"
            />
            
            <Button
                className="mt-5"
                onPress={handleSubmit(onSubmit)}
                disabled={isSubmitting}
            >
                {isPending ? "Submitting..." : "Submit"}
            </Button>

            <Text className="text-sm text-gray-600 mt-4">
                Upload your medical documents or images (up to 10 files/photos)
            </Text>

        </View>
    );
};

export default UploadYourReport;