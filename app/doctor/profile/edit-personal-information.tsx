import Input from "@/components/form/Input";
import TextArea from "@/components/form/TextArea";
import Button from "@/components/ui/Button";
import { zodResolver } from "@hookform/resolvers/zod";
import * as ImagePicker from "expo-image-picker";
import { Camera } from "lucide-react-native";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Alert, Image, ScrollView, TouchableOpacity, View } from "react-native";
import { z } from "zod";

const personalInfoSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters long"),
    email: z.string().email("Please enter a valid email"),
    specialty: z.string().min(2, "Specialty is required"),
});

type PersonalInfoFormData = z.infer<typeof personalInfoSchema>;

const EditPersonalInformation = () => {
    const { control, handleSubmit, reset } = useForm<PersonalInfoFormData>({
        resolver: zodResolver(personalInfoSchema),
    });

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

    const onSubmit = (data: any) => {
        // Check if image is selected
        if (!image) {
            Alert.alert("Missing Image", "Please upload a profile image.");
            return;
        }

        const formData = {
            ...data,
            profileImage: image,
        };

        console.log(formData);
        Alert.alert("Success", "Profile information saved successfully!");
        reset();
        setImage(null);
    };

    return (
        <ScrollView className="flex-1 bg-white p-5">
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
                    <Input
                        name="email"
                        label="Email"
                        placeholder="Enter Your Email"
                        containerClassName="mt-5"
                        keyboardType="email"
                        control={control}
                    />
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

                <Button onPress={handleSubmit(onSubmit)}>Save</Button>
            </View>
        </ScrollView>
    );
};

export default EditPersonalInformation;
