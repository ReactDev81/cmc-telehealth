import FileUploadField from "@/components/form/FileUploadField";
import Input from "@/components/form/Input";
import Button from "@/components/ui/Button";
import { useAuth } from "@/context/UserContext";
import { useUpdateDoctorProfile } from "@/queries/doctor/useUpdateDoctorProfile";
import { AwardInfo } from "@/types/live/doctor/profile";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from 'lucide-react-native';
import { useForm } from 'react-hook-form';
import { Alert, Pressable, Text, View } from "react-native";
import { z } from "zod";

const AwardSchema = z.object({
    title: z.string().min(2, "Award title must be at least 2 characters long"),
    award_image: z.any().refine((file) => file?.uri, "Award image is required"),
});

type AwardFormData = z.infer<typeof AwardSchema>;

const AddNewAward = ({
    existingAwards = [],
    onClose
}: {
    existingAwards?: AwardInfo[],
    onClose: () => void
}) => {
    const { user } = useAuth();
    const doctorID = user?.id || "";

    const { mutate: updateProfile, isPending } = useUpdateDoctorProfile(doctorID, "awards_info");

    const { control, handleSubmit, reset } = useForm<AwardFormData>({
        resolver: zodResolver(AwardSchema),
        defaultValues: {
            title: '',
        }
    });

    const onSubmit = (data: AwardFormData) => {
        const fd = new FormData();
        const nextIndex = existingAwards.length;

        // Add group
        fd.append("group", "awards_info");

        // Add existing awards
        existingAwards.forEach((award, index) => {
            fd.append(`awards_info[${index}][title]`, award.title);
            // We usually don't send back existing images as files, but the server handles URLs
            if (award.award_image) {
                fd.append(`awards_info[${index}][award_image]`, award.award_image);
            }
        });

        // Add new award
        fd.append(`awards_info[${nextIndex}][title]`, data.title);

        if (data.award_image) {
            const uri = data.award_image.uri;
            const fileName = data.award_image.name || uri.split("/").pop() || "award.jpg";
            const match = /\.([0-9a-z]+)(?:\?|$)/i.exec(fileName);
            const fileType = match ? `image/${match[1]}` : "image/jpeg";

            // @ts-ignore
            fd.append(`awards_info[${nextIndex}][award_image]`, {
                uri,
                name: fileName,
                type: fileType
            });
        }

        updateProfile(fd, {
            onSuccess: () => {
                Alert.alert("Success", "Award added successfully!");
                reset();
                onClose();
            },
            onError: (error: any) => {
                console.log(error);
                Alert.alert("Error", error?.response?.data?.message || "Something went wrong while saving award");
            }
        });
    }

    return (
        <View className="p-5 bg-white rounded-xl">

            {/* header */}
            <View className="flex-row items-center justify-between">
                <Text className="text-black text-lg font-semibold">Add New Award</Text>
                <Pressable onPress={onClose}>
                    <X size={18} color="#1F1E1E" strokeWidth={2.5} />
                </Pressable>
            </View>

            {/* form */}
            <View className="mt-5">
                <Input
                    name="title"
                    label="Award Title"
                    placeholder="e.g. Best Doctor 2023"
                    control={control}
                />

                <FileUploadField
                    name="award_image"
                    label="Award Certificate / Image"
                    control={control}
                    className="mt-5"
                />

                <Button onPress={handleSubmit(onSubmit)} className="mt-7" disabled={isPending}>
                    {isPending ? "Adding..." : "Add Award"}
                </Button>
            </View>

        </View>
    )
}

export default AddNewAward
