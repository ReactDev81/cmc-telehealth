import Input from "@/components/form/Input";
import Button from "@/components/ui/Button";
import { useAuth } from "@/context/UserContext";
import { useUpdateDoctorProfile } from "@/queries/doctor/useUpdateDoctorProfile";
import { WorkingExperience } from "@/types/live/doctor/profile";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react-native";
import { useForm } from "react-hook-form";
import { Alert, Pressable, Text, View } from "react-native";
import { z } from "zod";

const WorkingExperienceSchema = z.object({
    association: z.string().min(2, "Association is required"),
    description: z.string().min(5, "Description is required"),
});

type WorkingExperienceFormData = z.infer<typeof WorkingExperienceSchema>;

const AddNewWorkingExperience = ({ existingExperiences = [], editingIndex, editingExperience, onClose }: {
    existingExperiences?: WorkingExperience[];
    editingIndex?: number;
    editingExperience?: WorkingExperience;
    onClose: () => void;
}) => {

    const { user } = useAuth();
    const doctorID = user?.id || "";
    const { mutate: updateProfile, isPending } = useUpdateDoctorProfile(
        doctorID,
        "working_experience",
    );

    const { control, handleSubmit, reset } = useForm<WorkingExperienceFormData>({
        resolver: zodResolver(WorkingExperienceSchema),
        defaultValues: {
            association: editingExperience?.association || "",
            description: editingExperience?.description || "",
        },
    });

    const onSubmit = (data: WorkingExperienceFormData) => {
        const newWorkingExperience = data;

        let updatedExperiences = [...existingExperiences];
        if (editingIndex !== undefined && editingIndex >= 0) {
            updatedExperiences[editingIndex] = newWorkingExperience;
        } else {
            updatedExperiences.push(newWorkingExperience);
        }

        const payload = {
            professional_experience_info: updatedExperiences,
        };

        updateProfile(payload, {
            onSuccess: () => {
                Alert.alert("Success", "Working experience updated successfully!");
                reset();
                onClose();
            },
            onError: (error: any) => {
                console.log(error);
                Alert.alert(
                    "Error",
                    error?.response?.data?.errors?.message ||
                    "Something went wrong while saving experience",
                );
            },
        });
    };

    const isEditing = editingIndex !== undefined;

    return (
        <View className="p-5 bg-white rounded-xl">

            {/* headet */}
            <View className="flex-row items-center justify-between">
                <Text className="text-black text-lg font-semibold">
                    {isEditing ? "Edit Experience" : "Add New Experience"}
                </Text>
                <Pressable onPress={onClose}>
                    <X size={18} color="#1F1E1E" strokeWidth={2.5} />
                </Pressable>
            </View>

            {/* form */}
            <View className="mt-5">

                <Input
                    name="association"
                    label="Association Name"
                    placeholder="e.g. CMC, Metro Hospital"
                    control={control}
                    containerClassName="mt-5"
                />

                <Input
                    name="description"
                    label="Description"
                    placeholder="Describe your role and experience"
                    control={control}
                    containerClassName="mt-5"
                    multiline
                />

                <Button
                    onPress={handleSubmit(onSubmit)}
                    className="mt-5"
                    disabled={isPending}
                >
                    {isPending ? (isEditing ? "Saving..." : "Adding...") : (isEditing ? "Save Changes" : "Add Experience")}
                </Button>

            </View>
        </View>
    );
};

export default AddNewWorkingExperience;
