import FileUploadField from "@/components/form/FileUploadField";
import Input from "@/components/form/Input";
import Button from "@/components/ui/Button";
import { useAuth } from "@/context/UserContext";
import { useUpdateDoctorProfile } from "@/queries/doctor/useUpdateDoctorProfile";
import { AwardInfo } from "@/types/live/doctor/profile";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react-native";
import { useForm } from "react-hook-form";
import { Alert, Pressable, Text, View } from "react-native";
import { z } from "zod";

const getAwardSchema = (isEditing: boolean) => z.object({
    title: z.string().min(2, "Award title must be at least 2 characters long"),
    award_image: z.any().refine((file) => {
        if (isEditing) return true;
        return file?.uri;
    }, "Award image is required"),
});

const AddNewAward = ({
    existingAwards = [],
    onClose,
    onSuccess,
    editIndex,
    editData,
}: {
    existingAwards?: AwardInfo[];
    onClose: () => void;
    onSuccess?: () => void;
    editIndex?: number;
    editData?: AwardInfo;
}) => {
    const isEditing = editIndex !== undefined;
    type AwardFormData = z.infer<ReturnType<typeof getAwardSchema>>;
    const { user } = useAuth();
    const doctorID = user?.id || "";

    const { mutate: updateProfile, isPending } = useUpdateDoctorProfile(
        doctorID,
        "awards_info",
    );

    const { control, handleSubmit, reset } = useForm<AwardFormData>({
        resolver: zodResolver(getAwardSchema(isEditing)),
        defaultValues: {
            title: editData?.title || "",
        },
    });

    const onSubmit = (data: AwardFormData) => {
        const fd = new FormData();
        fd.append("group", "awards_info");

        const appendFile = (index: number, fileData: any) => {
            const uri = fileData.uri;
            const fileName = fileData.name || uri.split("/").pop() || "award.jpg";
            const match = /\.([0-9a-z]+)(?:\?|$)/i.exec(fileName);
            const fileType = match ? `image/${match[1]}` : "image/jpeg";
            // @ts-ignore
            fd.append(`awards_info[${index}][award_image]`, { uri, name: fileName, type: fileType });
        };

        let finalAwards = [...existingAwards];

        if (isEditing && editIndex !== undefined) {
            finalAwards[editIndex] = { ...finalAwards[editIndex], title: data.title };
        } else {
            finalAwards.push({ title: data.title, award_image: "" });
        }

        finalAwards.forEach((award, index) => {
            fd.append(`awards_info[${index}][title]`, award.title);

            if (isEditing && editIndex === index && data.award_image?.uri) {
                appendFile(index, data.award_image);
            } else if (!isEditing && index === finalAwards.length - 1 && data.award_image?.uri) {
                appendFile(index, data.award_image);
            } else if (award.award_image) {
                fd.append(`awards_info[${index}][award_image]`, award.award_image);
            }
        });

        updateProfile(fd, {
            onSuccess: () => {
                Alert.alert("Success", "Award added successfully!");
                reset();
                onSuccess?.(); // Trigger refetch in parent component
                onClose();
            },
            onError: (error: any) => {
                console.log(error);
                Alert.alert(
                    "Error",
                    error?.response?.data?.errors?.message ||
                    "Something went wrong while saving award",
                );
            },
        });
    };

    return (
        <View className="p-5 bg-white rounded-xl">

            {/* header */}
            <View className="flex-row items-center justify-between">
                <Text className="text-black text-lg font-semibold">{isEditing ? "Edit Award" : "Add New Award"}</Text>
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

                <Button
                    onPress={handleSubmit(onSubmit)}
                    className="mt-7"
                    disabled={isPending}
                >
                    {isPending ? "Saving..." : isEditing ? "Save Changes" : "Add Award"}
                </Button>
            </View>
        </View>
    );
};

export default AddNewAward;
