// // import DateField from "@/components/form/date";
// // import FileUploadField from "@/components/form/FileUploadField";
// // import Input from "@/components/form/Input";
// // import Button from "@/components/ui/Button";
// // import { useAuth } from "@/context/UserContext";
// // import { useUploadMedicalReport } from "@/mutations/patient/useUploadMedicalReport";
// // import { zodResolver } from "@hookform/resolvers/zod";
// // import { useLocalSearchParams } from 'expo-router';
// // import { useForm } from "react-hook-form";
// // import { Text, View } from "react-native";
// // import { z } from "zod";

// // const uploadSchema = z.object({
// //     name: z.string().min(1, "Name is required"),
// //     report_date: z.date({
// //         required_error: "Document date is required",
// //     }),
// //     file: z.any().refine((file) => file && file.name, "File is required"),
// // });

// // type UploadFormData = z.infer<typeof uploadSchema>;

// // const UploadYourReport = () => {

// //     const { user } = useAuth();
// //     const { mutate, isPending } = useUploadMedicalReport();

// //     const methods = useForm<UploadFormData>({
// //         resolver: zodResolver(uploadSchema),
// //         defaultValues: {
// //             name: "",
// //             report_date: undefined,
// //             file: null,
// //         },
// //     });

// //     const { reportType } = useLocalSearchParams<{
// //         reportType?: string;
// //     }>();


// //     const { handleSubmit, reset, setValue, watch, control, formState: { errors, isSubmitting } } = methods;

// //     const documentDate = watch('report_date');

// //     // const onSubmit = (data: UploadFormData) => {


// //     //     if (!user?.id) return;

// //     //     console.log('data', data);

// //     //     mutate(
// //     //         {
// //     //             patientId: user.id,
// //     //             name: data.name,
// //     //             report_date: data.report_date,
// //     //             type: reportType,
// //     //             is_public: 0,
// //     //             file: {
// //     //                 uri: data.file.uri,
// //     //                 name: data.file.name,
// //     //                 mimeType: data.file.mimeType,
// //     //                 size: data.file.size
// //     //             }
// //     //         },
// //     //         {
// //     //             onSuccess: (res) => {
// //     //                 console.log('data submitted sucesffully', res)
// //     //                 reset();
// //     //                 router.back();
// //     //             },
// //     //             onError: (error: any) => {
// //     //                 console.log("Upload error:", error.response?.data || error.message);
// //     //             },
// //     //         }
// //     //     );
// //     // };

// //     const onSubmit = async (data: UploadFormData) => {

// //         const formdata = {
// //             ...data,
// //             is_public: 0,
// //             type: reportType
// //         }

// //         console.log('data', formdata)

// //         // axios.post(
// //         //     "https://stagetelehealth.cmcludhiana.in/api/v2/patient/fc46d4c2-ca17-4c6b-a857-63aeaa81ae9a/medical-reports",
// //         //     formdata,
// //         //     {
// //         //         headers: {
// //         //             'Authorization': `Bearer 8|EfgzSd6ST65xEndvRDwjgqZ6mxYVU9yJnuE7Q4Fe79ee1ccb`,
// //         //             // 'Content-Type': 'application/json'
// //         //         }
// //         //     }
// //         // )
// //         // .then(function (response) {
// //         //     console.log(response);
// //         // })
// //         // .catch(function (error) {
// //         //     console.log(error.response?.data);
// //         // });
// //     };

// //     return (
// //         <View className="flex-1 bg-white p-5">

// //             <Input
// //                 name="name"
// //                 label="Name"
// //                 control={control}
// //                 placeholder="Enter your name"
// //             />

// //             <DateField
// //                 label="Document Date"
// //                 value={documentDate}
// //                 onChange={(date) => setValue('report_date', date as Date, { shouldValidate: true })}
// //                 placeholder="DD/MM/YYYY"
// //                 maximumDate={new Date()}
// //                 error={errors.report_date?.message}
// //                 className="mt-5"
// //             />

// //             <FileUploadField
// //                 name="file"
// //                 label="Attach a document"
// //                 control={control}
// //                 className="mt-5"
// //             />

// //             <Button
// //                 className="mt-5"
// //                 onPress={handleSubmit(onSubmit)}
// //                 disabled={isSubmitting}
// //             >
// //                 {isPending ? "Submitting..." : "Submit"}
// //             </Button>

// //             <Text className="text-sm text-gray-600 mt-4">
// //                 Upload your medical documents or images (up to 10 files/photos)
// //             </Text>

// //         </View>
// //     );
// // };

// // export default UploadYourReport;


import DateField from "@/components/form/date";
import FileUploadField from "@/components/form/FileUploadField";
import Input from "@/components/form/Input";
import Button from "@/components/ui/Button";
import { useAuth } from "@/context/UserContext";
import { useUploadMedicalReport } from "@/mutations/patient/useUploadMedicalReport";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { router, useLocalSearchParams } from 'expo-router';
import { CircleCheck } from "lucide-react-native";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Modal, Text, View } from "react-native";
import { z } from "zod";

const uploadSchema = z.object({
    name: z.string().min(1, "Name is required"),
    report_date: z.date({
        required_error: "Document date is required",
    }),
    // file: z.any().refine((file) => file && file.name, "File is required"),
    file: z.object({
        uri: z.string(),
        name: z.string(),
        mimeType: z.string().optional(),
        size: z.number().optional(),
    }).nullable().refine(Boolean, "File is required"),

});

type UploadFormData = z.infer<typeof uploadSchema>;

const UploadYourReport = () => {

    const { user } = useAuth();
    const queryClient = useQueryClient();
    const { mutate, isPending } = useUploadMedicalReport();
    const [viewerVisible, setViewerVisible] = useState(false);
    const [viewerFile, setViewerFile] = useState({ uri: '', name: '', mimeType: '' });
    const [showSuccessModal, setShowSuccessModal] = useState(false);

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


    const { handleSubmit, reset, setValue, watch, control, setError, formState: { errors, isSubmitting } } = methods;

    const documentDate = watch('report_date');

    // const onSubmit = (data: UploadFormData) => {


    //     if (!user?.id) return;

    //     console.log('data', data);

    //     mutate(
    //         {
    //             patientId: user.id,
    //             name: data.name,
    //             report_date: data.report_date,
    //             type: reportType,
    //             is_public: 0,
    //             file: {
    //                 uri: data.file.uri,
    //                 name: data.file.name,
    //                 mimeType: data.file.mimeType,
    //                 size: data.file.size
    //             }
    //         },
    //         {
    //             onSuccess: (res) => {
    //                 console.log('data submitted sucesffully', res)
    //                 reset();
    //                 router.back();
    //             },
    //             onError: (error: any) => {
    //                 console.log("Upload error:", error.response?.data || error.message);
    //             },
    //         }
    //     );
    // };

    const onSubmit = async (data: UploadFormData) => {
        if (!user?.id) return;

        // Client-side validation for file mime types and size
        const allowedMimes = [
            "application/pdf",
            "image/jpeg",
            "image/jpg",
            "image/png",
            "image/webp",
        ];
        const maxSizeKB = 5120; // 5MB

        const file = data.file as any;
        if (!file) {
            setError('file', { type: 'manual', message: 'File is required' });
            return;
        }

        const mime = file.mimeType || file.type || '';
        const sizeKB = file.size ? Math.round(file.size / 1024) : undefined;

        if (mime && !allowedMimes.includes(mime)) {
            setError('file', { type: 'manual', message: `Invalid file type (${mime}). Allowed: pdf, jpg, jpeg, png, webp` });
            // console.log('Upload blocked: invalid mime', mime);
            return;
        }

        if (sizeKB !== undefined && sizeKB > maxSizeKB) {
            setError('file', { type: 'manual', message: `File too large (${sizeKB} KB). Max ${maxSizeKB} KB` });
            // console.log('Upload blocked: file too large', sizeKB);
            return;
        }

        const formData = new FormData();

        // normal fields
        formData.append("name", data.name);
        formData.append(
            "report_date",
            data.report_date.toISOString().split("T")[0]
        );
        // send selected report type (single value). If you need to send multiple types,
        // change this to append an array field like `types[]`.
        formData.append("type", reportType ?? "");
        formData.append("is_public", "0");

        // file - React Native FormData requires specific structure
        const mimeType = file.mimeType || file.type || "application/octet-stream";
        // console.log(`[upload] file details:`, {
        //     uri: file.uri,
        //     name: file.name,
        //     mimeType,
        //     size: file.size,
        //     "file.mimeType": file.mimeType,
        //     "file.type": file.type,
        // });

        // React Native FormData file structure
        formData.append("file", {
            uri: file.uri,
            name: file.name,
            type: mimeType,
        } as any);

        // console.log(`[upload] formData ready, calling mutate for patient ${user.id}`);

        mutate(
            {
                patientId: user.id,
                formData,
            },
            {
                onSuccess: (res) => {
                    queryClient.invalidateQueries({ queryKey: ["medical-reports"] });
                    console.log('data submitted successfully', res);
                    setShowSuccessModal(true);
                    reset();
                },
                onError: (error: any) => {
                    console.log("Upload error:", error.response?.data || error.message);
                    // console.log("Upload error:", error.response?.data || error.message);
                    // console.log("Upload error message:", error.message);
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

            {/* <FileViewer
                visible={viewerVisible}
                fileUri={viewerFile.uri}
                fileName={viewerFile.name}
                mimeType={viewerFile.mimeType}
                onClose={() => {
                    setViewerVisible(false);
                    router.back();
                }}
            /> */}

            {/* Success Modal */}
            <Modal
                visible={showSuccessModal}
                transparent
                animationType="fade"
                onRequestClose={() => setShowSuccessModal(false)}
            >
                <View className="flex-1 bg-black/60 justify-center items-center px-5">
                    <View className="bg-white rounded-xl p-8 w-full max-w-sm items-center">
                        <View className="w-14 h-14 items-center justify-center rounded-full bg-green-100">
                            <CircleCheck size={32} color="#16a34a" />
                        </View>
                        <Text className="text-lg font-semibold text-black mt-5">
                            Upload Successful!
                        </Text>
                        <Text className="text-base text-gray-500 text-center mt-2">
                            Your medical report has been successfully uploaded.
                        </Text>
                        <Button
                            className="mt-6 w-full"
                            onPress={() => {
                                setShowSuccessModal(false);
                                router.replace("/patient/profile/medical-reports");
                            }}
                        >
                            OK
                        </Button>
                    </View>
                </View>
            </Modal>

        </View>
    );
};

export default UploadYourReport;