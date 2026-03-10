import DateField from "@/components/form/date";
import TextArea from "@/components/form/TextArea";
import Button from "@/components/ui/Button";
import { useAuth } from "@/context/UserContext";
import { useUpdateDoctorProfile } from "@/queries/doctor/useUpdateDoctorProfile";
import { WorkingExperience } from "@/types/live/doctor/profile";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { X } from "lucide-react-native";
import { useForm } from "react-hook-form";
import { Alert, Pressable, Text, View } from "react-native";
import { z } from "zod";

const WorkingExperienceSchema = z.object({
    career_start: z.date({ required_error: "Start Date is required" }),
    past_associations: z.string().min(2, "Past Associations are required"),
});

type WorkingExperienceFormData = z.infer<typeof WorkingExperienceSchema>;

const AddNewWorkingExperience = ({ existingExperiences = [], onClose }: {
    existingExperiences?: WorkingExperience[];
    onClose: () => void;
}) => {
    const { user } = useAuth();
    const doctorID = user?.id || "";
    const { mutate: updateProfile, isPending } = useUpdateDoctorProfile(
        doctorID,
        "working_experience",
    );

    const { control, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm<WorkingExperienceFormData>({
        resolver: zodResolver(WorkingExperienceSchema),
        defaultValues: {
            past_associations: "",
        },
    });

    const career_start = watch("career_start");

    const onSubmit = (data: WorkingExperienceFormData) => {

        const newWorkingExperience = {
            ...data,
            career_start: format(data.career_start, "yyyy"),
        };

        const payload = {
            professional_experience_info: [...existingExperiences, newWorkingExperience],
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
                    error?.response?.data?.message ||
                    "Something went wrong while saving experience",
                );
            },
        });
    };

    return (
        <View className="p-5 bg-white rounded-xl">

            {/* headet */}
            <View className="flex-row items-center justify-between">
                <Text className="text-black text-lg font-semibold">
                    Add New Experience
                </Text>
                <Pressable onPress={onClose}>
                    <X size={18} color="#1F1E1E" strokeWidth={2.5} />
                </Pressable>
            </View>

            {/* form */}
            <View className="mt-5">

                <DateField
                    label="Career Start Year"
                    value={career_start}
                    onChange={(date) =>
                        setValue("career_start", date as Date, { shouldValidate: true })
                    }
                    placeholder="DD/MM/YYYY"
                    maximumDate={new Date()}
                    error={errors.career_start?.message}
                    className="mt-5"
                />

                <TextArea
                    name="past_associations"
                    label="Past Associations"
                    placeholder="e.g. CMC, Metro Hospital"
                    control={control}
                    containerClassName="mt-5"
                />

                <Button
                    onPress={handleSubmit(onSubmit)}
                    className="mt-5"
                    disabled={isPending}
                >
                    {isPending ? "Adding..." : "Add Experience"}
                </Button>

            </View>
        </View>
    );
};

export default AddNewWorkingExperience;