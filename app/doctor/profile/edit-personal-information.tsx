import Input from "@/components/form/Input";
import TextArea from "@/components/form/TextArea";
import Button from "@/components/ui/Button";
import { useAuth } from "@/context/UserContext";
import { useDoctorProfile } from "@/queries/doctor/useDoctorProfile";
import { useUpdateDoctorProfile } from "@/queries/doctor/useUpdateDoctorProfile";
import { PersonalInformation } from "@/types/live/doctor/profile";
import { zodResolver } from "@hookform/resolvers/zod";
import * as ImagePicker from "expo-image-picker";
import { Camera } from "lucide-react-native";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
    Alert,
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    TouchableOpacity,
    View,
} from "react-native";
import { z } from "zod";

const personalInfoSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters long"),
    email: z.string().email("Please enter a valid email"),
    // specialty: z.string().min(2, "Specialty is required"),
    bio: z.string().optional(),
});

type PersonalInfoFormData = z.infer<typeof personalInfoSchema>;

const EditPersonalInformation = () => {
    const { user, updateUser } = useAuth();
    const doctorID = user?.id || "";

    const { data: doctorProfile } = useDoctorProfile<PersonalInformation>(doctorID, "personal_information");
    // console.log("Doctor data: ", doctorProfile?.data)

    const { control, handleSubmit, reset } = useForm<PersonalInfoFormData>({
        resolver: zodResolver(personalInfoSchema),
        defaultValues: {
            name: "",
            email: "",
            specialty: "",
            bio: "",
        }
    });

    useEffect(() => {
        if (doctorProfile?.data) {
            reset({
                name: `${doctorProfile.data.first_name} ${doctorProfile.data.last_name}`,
                email: doctorProfile.data.email,
                specialty: doctorProfile.data.department_id,
                bio: doctorProfile.data.bio,
            });
            if (doctorProfile.data.avatar) {
                setImage(doctorProfile.data.avatar);
            }
        }
    }, [doctorProfile, reset]);

    const { mutate: updateProfile, isPending } = useUpdateDoctorProfile(doctorID, "personal_information");

    const [image, setImage] = useState<string | null>(null);

    const pickImage = async () => {
        // Ask for permission
        const permissionResult =
            await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permissionResult.granted) {
            alert("Permission to access camera roll is required!");
            return;
        }

        // Pick image
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    const onSubmit = (data: PersonalInfoFormData) => {
        const [first_name, ...lastNames] = data.name.split(" ");
        const last_name = lastNames.join(" ");

        const payload: any = {
            first_name,
            last_name,
            // email: data.email,
            department_id: data.specialty,
            bio: data.bio,
        };

        const isNewImage = image && !image.startsWith("http") && !image.startsWith("/");

        const handleSuccess = (response: any) => {
            const updatedData = response?.data;
            if (updatedData) {
                updateUser({
                    name: `${updatedData.first_name} ${updatedData.last_name}`,
                    avatar: updatedData.avatar,
                });
            }
            Alert.alert("Success", "Profile information saved successfully!");
        };

        const handleError = (error: any) => {
            Alert.alert("Error", error?.response?.data?.message || "Something went wrong");
        };

        if (isNewImage) {
            const fd = new FormData();
            Object.keys(payload).forEach(key => {
                if (payload[key]) fd.append(key, payload[key]);
            });

            const uri = image!;
            const fileName = uri.split("/").pop() || "avatar.jpg";
            const match = /\.([0-9a-z]+)(?:\?|$)/i.exec(fileName);
            const fileType = match ? `image/${match[1]}` : "image/jpeg";

            // @ts-ignore
            fd.append("avatar", { uri, name: fileName, type: fileType });

            updateProfile(fd, {
                onSuccess: handleSuccess,
                onError: handleError
            });
        } else {
            updateProfile(payload, {
                onSuccess: handleSuccess,
                onError: handleError
            });
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            className="flex-1 bg-white"
        >
            <ScrollView className="flex-1 p-5">
                {/* upload image */}
                <View className="max-w-32 w-full mx-auto items-center justify-center relative">
                    <Image
                        source={
                            image
                                ? { uri: image }
                                : require("../../../assets/images/doctor.jpg")
                        }
                        className="w-32 h-32 rounded-full"
                        resizeMode="cover"
                    />
                    <TouchableOpacity
                        className="w-8 h-8 rounded-full bg-primary-100 absolute bottom-0 right-0 items-center justify-center"
                        activeOpacity={0.7}
                        onPress={pickImage}
                    >
                        <Camera size={16} color="#013220" />
                    </TouchableOpacity>
                </View>

                {/* form fields */}
                <View className="max-w-[350px] w-full mx-auto bg-white p-5 rounded-xl shadow-custom mt-10">
                    <View className="mb-5">
                        <Input
                            name="name"
                            label="Name"
                            placeholder="Enter Name"
                            control={control}
                        />
                        {/* <Input
                        name="email"
                        label="Email"
                        placeholder="Enter Your Email"
                        containerClassName="mt-5"
                        keyboardType="email"
                        control={control}
                    /> */}
                        <View pointerEvents="none">
                            <Input
                                name="email"
                                control={control}
                                label="Email"
                                keyboardType="email"
                                containerClassName="mt-5 opacity-40"
                            />
                        </View>
                        <Input
                            name="specialty"
                            label="Speciality"
                            autoCapitalize="none"
                            placeholder="clinical-haematology"
                            containerClassName="mt-5"
                            control={control}
                        />
                        <TextArea
                            name="bio"
                            label="Bio"
                            placeholder="Edit Your Bio"
                            containerClassName="mt-5"
                            control={control}
                        />
                    </View>

                    <Button
                        onPress={handleSubmit(onSubmit)}
                        disabled={isPending}
                    >
                        {isPending ? "Saving..." : "Save"}
                    </Button>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

export default EditPersonalInformation;
