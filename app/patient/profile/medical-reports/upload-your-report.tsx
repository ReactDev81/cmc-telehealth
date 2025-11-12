import { View, Text } from "react-native";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Input from "@/components/form/Input";
import DateField from "@/components/form/date";
import FileUploadField from "@/components/form/FileUploadField";
import Button from "@/components/ui/Button";


const uploadSchema = z.object({
    name: z.string().min(1, "Name is required"),
    reportType: z.string().min(1, "Report type is required"),
    documentDate: z.date({
        required_error: "Document date is required",
    }),
    file: z.any().refine((file) => file && file.name, "File is required"),
});

type UploadFormData = z.infer<typeof uploadSchema>;

const UploadYourReport = () => {

    const methods = useForm<UploadFormData>({
        resolver: zodResolver(uploadSchema),
        defaultValues: {
            name: "",
            reportType: "",
            documentDate: undefined,
            file: null,
        },
    });

    const { handleSubmit, reset, setValue, watch, control, formState: { errors, isSubmitting } } = methods;

    const documentDate = watch('documentDate');

    const onSubmit = (data: UploadFormData) => {
        console.log("Form Submitted:", data);
        alert(`✅ Uploaded: ${data.file?.name}`);
        reset();
    };

    return (
        <View className="flex-1 bg-white p-5">
            <FormProvider {...methods}>
                
                <Input
                    name="name"
                    label="Name"
                    control={control}
                    placeholder="Enter your name"
                />

                <Input
                    name="reportType"
                    label="Report Type"
                    control={control}
                    placeholder="e.g., Blood Test, X-Ray, MRI"
                    containerClassName="mt-5"
                />

                <DateField
                    label="Document Date"
                    value={documentDate}
                    onChange={(date) => setValue('documentDate', date as Date, { shouldValidate: true })}
                    placeholder="DD/MM/YYYY"
                    maximumDate={new Date()}
                    error={errors.documentDate?.message}
                    className="mt-5"
                />

                <FileUploadField
                    name="report"
                    label="Attach a document"
                    control={control}
                    error={typeof errors.file?.message === "string" ? errors.file.message : undefined}
                    className="mt-5"
                />
                
                <Button
                    className="mt-5"
                    onPress={handleSubmit(onSubmit)}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? "Submitting..." : "Submit"}
                </Button>

                <Text className="text-sm text-gray-600 mt-4">
                    Upload your medical documents or images (up to 10 files/photos)
                </Text>

            </FormProvider>
        </View>
    );
};

export default UploadYourReport;