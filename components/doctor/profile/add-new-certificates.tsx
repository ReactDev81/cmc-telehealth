import FileUploadField from "@/components/form/FileUploadField";
import Input from "@/components/form/Input";
import Button from "@/components/ui/Button";
import { useAuth } from "@/context/UserContext";
import { useUpdateDoctorProfile } from "@/queries/doctor/useUpdateDoctorProfile";
import { CertificationInfo } from "@/types/live/doctor/profile";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from 'lucide-react-native';
import { useForm } from 'react-hook-form';
import { Alert, Pressable, Text, View } from "react-native";
import { z } from "zod";

const CertificatesSchema = z.object({
    name: z.string().min(2, "Certificate Name must be at least 2 characters long"),
    organization: z.string().min(2, "Organization Name must be at least 2 characters long"),
    certification_image: z.any().refine((file) => !!file, "Certificate image is required"),
});

type CertificatesFormData = z.infer<typeof CertificatesSchema>;

const AddNewCertificates = ({
    existingCertificates = [],
    onClose
}: {
    existingCertificates?: CertificationInfo[],
    onClose: () => void
}) => {
    const { user } = useAuth();
    const doctorID = user?.id || "";

    const { mutate: updateProfile, isPending } = useUpdateDoctorProfile(doctorID, "certifications_info");

    const { control, handleSubmit, reset, formState: { errors } } = useForm<CertificatesFormData>({
        resolver: zodResolver(CertificatesSchema),
        defaultValues: {
            name: '',
            organization: '',
            certification_image: null,
        }
    });

    const onSubmit = (data: CertificatesFormData) => {
        const fd = new FormData();

        // Append existing certificates
        existingCertificates.forEach((cert, index) => {
            fd.append(`certifications_info[${index}][name]`, cert.name);
            fd.append(`certifications_info[${index}][organization]`, cert.organization);
            fd.append(`certifications_info[${index}][certification_image]`, cert.certification_image);
        });

        // Append new certificate
        const nextIndex = existingCertificates.length;
        fd.append(`certifications_info[${nextIndex}][name]`, data.name);
        fd.append(`certifications_info[${nextIndex}][organization]`, data.organization);

        if (data.certification_image) {
            const uri = data.certification_image.uri;
            const fileName = data.certification_image.name || uri.split("/").pop() || "certificate.jpg";
            const match = /\.([0-9a-z]+)(?:\?|$)/i.exec(fileName);
            const fileType = match ? `image/${match[1]}` : "image/jpeg";

            // @ts-ignore
            fd.append(`certifications_info[${nextIndex}][certification_image]`, {
                uri,
                name: fileName,
                type: fileType
            });
        }

        fd.append("group", "certifications_info");

        updateProfile(fd, {
            onSuccess: () => {
                Alert.alert("Success", "Certificate added successfully!");
                reset();
                onClose();
            },
            onError: (error: any) => {
                console.log(error);
                Alert.alert("Error", error?.response?.data?.message || "Something went wrong while saving certificate");
            }
        });
    }

    return (
        <View className="p-5 bg-white rounded-xl">

            {/* header */}
            <View className="flex-row items-center justify-between">
                <Text className="text-black text-lg font-semibold">Add New Certificates</Text>
                <Pressable onPress={onClose}>
                    <X size={18} color="#1F1E1E" strokeWidth={2.5} />
                </Pressable>
            </View>

            {/* form */}
            <View className="mt-5">

                <Input
                    name="name"
                    label="Certificate Name"
                    placeholder="e.g. Advanced Surgery"
                    control={control}
                />

                <Input
                    name="organization"
                    label="Organization"
                    placeholder="e.g. Medical Council"
                    control={control}
                    containerClassName="mt-5"
                />

                <FileUploadField
                    name="certification_image"
                    control={control}
                    label="Upload Certificate Image"
                    className="mt-5"
                    error={errors.certification_image?.message as string}
                />

                <Button onPress={handleSubmit(onSubmit)} className="mt-5" disabled={isPending}>
                    {isPending ? "Adding..." : "Add Certificate"}
                </Button>
            </View>

        </View>
    )
}

export default AddNewCertificates
