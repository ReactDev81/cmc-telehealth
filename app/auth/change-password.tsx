import { router } from "expo-router";
import { View, Text, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import PasswordInput from "../../components/form/password";
import Button from "../../components/ui/Button";


const passwordSchema = z
    .object({
        oldPassword: z.string().min(1, "Old password is required"),
        newPassword: z.string().min(8, "Password must be at least 8 characters"),
        confirmPassword: z.string().min(1, "Please confirm your new password"),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });

export default function SetNewPasswordScreen() {

    const { control, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(passwordSchema),
        defaultValues: {
            oldPassword: "",
            newPassword: "",
            confirmPassword: "",
        },
    });

    const onSubmit = (data: z.infer<typeof passwordSchema>) => {
        console.log("Password changed successfully!", data);
        alert("Password changed successfully!");
        router.replace("/auth/login");
    };

    return (
        <SafeAreaView className="flex-1 justify-center bg-white px-6">

            {/* Logo */}
            <View className="mb-6">
                <Image
                    source={require("../../assets/images/cmc-telehealth-logo.png")}
                    className="w-24 h-24 mx-auto object-contain"
                />
                <Text className="text-base text-black text-center font-bold mt-1">
                    CMC Telehealth
                </Text>
            </View>

            {/* Header */}
            <View className="mt-4">
                <Text className="text-black text-2xl font-bold text-center">
                    Set New Password
                </Text> 
                <Text className="text-black-400 text-base text-center mt-2">
                    Enter your old and new password below to update it
                </Text>
            </View>

            {/* Form */}
            <View className="mt-8">

                {/* Old Password */}
                <Controller
                    control={control}
                    name="oldPassword"
                    render={() => (
                        <View>
                            <PasswordInput
                                name="oldPassword"
                                control={control}
                                label="Old Password"
                                placeholder="Enter Old Password"
                            />
                        </View>
                    )}
                />

                {/* New Password */}
                <Controller
                    control={control}
                    name="newPassword"
                    render={() => (
                        <View className="mt-5">
                            <PasswordInput
                                name="newPassword"
                                control={control}
                                label="New Password"
                                placeholder="Enter New Password"
                            />
                        </View>
                    )}
                />

                {/* Confirm Password */}
                <Controller
                    control={control}
                    name="confirmPassword"
                    render={() => (
                        <View className="mt-5">
                            <PasswordInput
                                name="confirmPassword"
                                control={control}
                                label="Confirm Password"
                                placeholder="Confirm New Password"
                            />
                        </View>
                    )}
                />
            </View>

            {/* Submit Button */}
            <View className="mt-6">
                <Button onPress={handleSubmit(onSubmit)}>Change Password</Button>
            </View>

        </SafeAreaView>
    );
}