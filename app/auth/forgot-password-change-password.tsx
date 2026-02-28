import ApiError from "@/components/ui/ApiError";
import { useResetForgotPassword } from "@/queries/useResetForgotPassword";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { Image, Text, View } from "react-native";
import { z } from "zod";
import PasswordInput from "../../components/form/password";
import Button from "../../components/ui/Button";
import FormLayout from "../formLayout";

const passwordSchema = z
    .object({
        password: z.string().min(8, "Password must be at least 8 characters"),
        password_confirmation: z
            .string()
            .min(1, "Please confirm your new password"),
    })
    .refine((data) => data.password === data.password_confirmation, {
        message: "Passwords do not match",
        path: ["password_confirmation"],
    });

const ForgotPasswordChangePassword = () => {

    const router = useRouter();
    const { mutate, isPending, isError, error } = useResetForgotPassword();

    const { control, handleSubmit } = useForm({
        resolver: zodResolver(passwordSchema),
        defaultValues: {
            password: "",
            password_confirmation: "",
        },
    });

    const { email, reset_token } = useLocalSearchParams<{
        email?: string;
        reset_token?: string;
    }>();

    const onSubmit = async (formData: z.infer<typeof passwordSchema>) => {

        // Ensure we have valid string values for email and reset_token
        if (typeof email !== "string" || typeof reset_token !== "string") {
            return;
        }

        mutate(
            {
                email,
                reset_token,
                password: formData.password,
                password_confirmation: formData.password_confirmation,
            },
            {
                onSuccess: () => {
                    router.replace("/auth/login");
                },
                onError: (error) => {
                    const err = error as any;
                    console.log(err?.response?.data);
                },
            },
        );
    };

    return (
        <FormLayout>

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

                {/* New Password */}
                <Controller
                    control={control}
                    name="password"
                    render={() => (
                        <View className="mt-5">
                            <PasswordInput
                                name="password"
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
                    name="password_confirmation"
                    render={() => (
                        <View className="mt-5">
                            <PasswordInput
                                name="password_confirmation"
                                control={control}
                                label="Confirm Password"
                                placeholder="Confirm New Password"
                            />
                        </View>
                    )}
                />
            </View>

            {/* api error message */}
            <ApiError
                message={
                    isError
                    ? ((error as any)?.response?.data?.message ??
                        (error as any)?.message ??
                        "Failed to change password. Please try again.")
                    : null
                }
            />

            {/* Submit Button */}
            <View className="mt-6">
                <Button onPress={handleSubmit(onSubmit)} className="mt-4" disabled={isPending}>
                    {isPending ? "loading..." : "Change Password"}
                </Button>
            </View>

        </FormLayout>
    );
};

export default ForgotPasswordChangePassword;