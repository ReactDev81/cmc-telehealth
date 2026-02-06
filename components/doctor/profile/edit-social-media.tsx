import Input from "@/components/form/Input";
import Button from "@/components/ui/Button";
import { useAuth } from "@/context/UserContext";
import { useUpdateDoctorProfile } from "@/queries/doctor/useUpdateDoctorProfile";
import { SocialLinks } from "@/types/live/doctor/profile";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from 'lucide-react-native';
import { useForm } from 'react-hook-form';
import { Alert, Pressable, Text, View } from "react-native";
import { z } from "zod";

const SocialMediaSchema = z.object({
    facebook: z.string().url("Please enter a valid Facebook URL").optional().or(z.literal('')),
    linkedin: z.string().url("Please enter a valid LinkedIn URL").optional().or(z.literal('')),
    instagram: z.string().url("Please enter a valid Instagram URL").optional().or(z.literal('')),
    twitter: z.string().url("Please enter a valid Twitter URL").optional().or(z.literal('')),
});

type SocialMediaFormData = z.infer<typeof SocialMediaSchema>;

const EditSocialMedia = ({
    existingLinks = {},
    onClose
}: {
    existingLinks?: SocialLinks,
    onClose: () => void
}) => {
    const { user } = useAuth();
    const doctorID = user?.id || "";

    const { mutate: updateProfile, isPending } = useUpdateDoctorProfile(doctorID, "social_media");

    const { control, handleSubmit, reset } = useForm<SocialMediaFormData>({
        resolver: zodResolver(SocialMediaSchema),
        defaultValues: {
            facebook: existingLinks.facebook || '',
            linkedin: existingLinks.linkedin || '',
            instagram: existingLinks.instagram || '',
            twitter: existingLinks.twitter || '',
        }
    });

    const onSubmit = (data: SocialMediaFormData) => {
        const fd = new FormData();
        fd.append("social_links[facebook]", data.facebook || '');
        fd.append("social_links[linkedin]", data.linkedin || '');
        fd.append("social_links[instagram]", data.instagram || '');
        fd.append("social_links[twitter]", data.twitter || '');
        fd.append("group", "social_media");

        updateProfile(fd, {
            onSuccess: () => {
                Alert.alert("Success", "Social media links updated successfully!");
                reset();
                onClose();
            },
            onError: (error: any) => {
                console.log(error);
                Alert.alert("Error", error?.response?.data?.message || "Something went wrong while saving social links");
            }
        });
    }

    return (
        <View className="p-5 bg-white rounded-xl">

            {/* header */}
            <View className="flex-row items-center justify-between">
                <Text className="text-black text-lg font-semibold">Edit Social Media</Text>
                <Pressable onPress={onClose}>
                    <X size={18} color="#1F1E1E" strokeWidth={2.5} />
                </Pressable>
            </View>

            {/* form */}
            <View className="mt-5">

                <Input
                    name="facebook"
                    label="Facebook URL"
                    placeholder="https://facebook.com/yourprofile"
                    control={control}
                    autoCapitalize="none"
                    keyboardType="url"
                />

                <Input
                    name="linkedin"
                    label="LinkedIn URL"
                    placeholder="https://linkedin.com/in/yourprofile"
                    control={control}
                    containerClassName="mt-5"
                    autoCapitalize="none"
                    keyboardType="url"
                />

                <Input
                    name="instagram"
                    label="Instagram URL"
                    placeholder="https://instagram.com/yourprofile"
                    control={control}
                    containerClassName="mt-5"
                    autoCapitalize="none"
                    keyboardType="url"
                />

                <Input
                    name="twitter"
                    label="Twitter (X) URL"
                    placeholder="https://twitter.com/yourprofile"
                    control={control}
                    containerClassName="mt-5"
                    autoCapitalize="none"
                    keyboardType="url"
                />

                <Button onPress={handleSubmit(onSubmit)} className="mt-5" disabled={isPending}>
                    {isPending ? "Saving..." : "Save Changes"}
                </Button>
            </View>

        </View>
    )
}

export default EditSocialMedia
