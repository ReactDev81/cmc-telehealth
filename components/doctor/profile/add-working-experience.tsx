import Input from "@/components/form/Input";
import TextArea from "@/components/form/TextArea";
import Button from "@/components/ui/Button";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from 'lucide-react-native';
import { useForm } from 'react-hook-form';
import { Alert, Pressable, Text, View } from "react-native";
import { z } from "zod";

import { useAuth } from "@/context/UserContext";
import { useUpdateDoctorProfile } from "@/queries/doctor/useUpdateDoctorProfile";

import { WorkingExperience } from "@/types/live/doctor/profile";

const WorkingExperienceSchema = z.object({
    career_start: z.string().min(4, "Career Start year is required"),
    past_associations: z.string().min(2, "Past Associations are required"),
});

type WorkingExperienceFormData = z.infer<typeof WorkingExperienceSchema>;

const AddNewWorkingExperience = ({
    existingExperiences = [],
    onClose
}: {
    existingExperiences?: WorkingExperience[],
    onClose: () => void
}) => {
    const { user } = useAuth();
    const doctorID = user?.id || "";

    const { mutate: updateProfile, isPending } = useUpdateDoctorProfile(doctorID, "working_experience");

    const { control, handleSubmit, reset, formState: { errors } } = useForm<WorkingExperienceFormData>({
        resolver: zodResolver(WorkingExperienceSchema),
        defaultValues: {
            career_start: '',
            past_associations: '',
        }
    });

    // const start_date = watch('start_date');
    // const end_date = watch('end_date');

    const onSubmit = (data: WorkingExperienceFormData) => {
        const payload = {
            professional_experience_info: [...existingExperiences, data]
        };

        updateProfile(payload, {
            onSuccess: () => {
                Alert.alert("Success", "Working experience updated successfully!");
                reset();
                onClose();
            },
            onError: (error: any) => {
                console.log(error);
                Alert.alert("Error", error?.response?.data?.message || "Something went wrong while saving experience");
            }
        });
    }

    return (
        <View className="p-5 bg-white rounded-xl">

            {/* headet */}
            <View className="flex-row items-center justify-between">
                <Text className="text-black text-lg font-semibold">Add New Experience</Text>
                <Pressable onPress={onClose}>
                    <X size={18} color="#1F1E1E" strokeWidth={2.5} />
                </Pressable>
            </View>

            {/* form */}
            <View className="mt-5">

                <Input
                    name="career_start"
                    label="Career Start Year"
                    placeholder="e.g. 2015"
                    control={control}
                    keyboardType="numeric"
                />

                <TextArea
                    name="past_associations"
                    label="Past Associations"
                    placeholder="e.g. CMC, Metro Hospital"
                    control={control}
                    containerClassName="mt-5"
                />

                <Button onPress={handleSubmit(onSubmit)} className="mt-5" disabled={isPending}>
                    {isPending ? "Adding..." : "Add Experience"}
                </Button>
            </View>

        </View>
    )
}

export default AddNewWorkingExperience