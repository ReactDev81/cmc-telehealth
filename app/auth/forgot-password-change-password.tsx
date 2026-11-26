import ApiError from "@/components/ui/ApiError";
import PasswordInput from "@/components/form/password";
import Button from "@/components/ui/Button";
import { useResetForgotPassword } from "@/queries/useResetForgotPassword";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { Alert, Image, Text, View } from "react-native";
import { z } from "zod";
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

type PasswordForm = z.infer<typeof passwordSchema>;

const ForgotPasswordChangePassword = () => {
    const router = useRouter();
    const { mutate, isPending, isError, error } = useResetForgotPassword();

    const { control, handleSubmit } = useForm<PasswordForm>({
        resolver: zodResolver(passwordSchema),
        defaultValues: {
            password: "",
            password_confirmation: "",
        },
    });

    const { login, country_code, reset_token } = useLocalSearchParams<{
        login?: string;
        country_code?: string;
        reset_token?: string;
    }>();

    const onSubmit = async (formData: PasswordForm) => {
        if (!login || !reset_token) {
            Alert.alert("Error", "Required reset information is missing. Please restart the reset process.");
            return;
        }

        const payload = {
            login: typeof login === "string" ? login : "",
            ...(country_code && typeof country_code === "string" ? { country_code } : {}),
            reset_token: typeof reset_token === "string" ? reset_token : "",
            password: formData.password,
            password_confirmation: formData.password_confirmation,
        };

        mutate(payload, {
            onSuccess: (res) => {
                Alert.alert(
                    "Success",
                    res.message || "Your password has been reset successfully. Please sign in with your new password.",
                    [
                        {
                            text: "Sign In",
                            onPress: () => router.replace("/auth/login"),
                        },
                    ],
                );
            },
            onError: (err: any) => {
                const message =
                    err?.response?.data?.errors?.message ??
                    err?.response?.data?.message ??
                    err?.message ??
                    "Failed to reset password. Please try again.";
                console.log("Error resetting password:", message);
            },
        });
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
                <Text className="text-gray-500 text-sm text-center mt-2 px-4">
                    Please choose a strong password with at least 8 characters.
                </Text>
            </View>

            {/* Form */}
            <View className="mt-6">
                {/* New Password */}
                <Controller
                    control={control}
                    name="password"
                    render={() => (
                        <View className="mt-4">
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
                        <View className="mt-4">
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

            {/* API Error message */}
            <ApiError
                message={
                    isError
                        ? ((error as any)?.response?.data?.errors?.message ??
                          (error as any)?.response?.data?.message ??
                          (error as any)?.message ??
                          "Failed to change password. Please try again.")
                        : null
                }
            />

            {/* Submit Button */}
            <View className="mt-6">
                <Button
                    onPress={handleSubmit(onSubmit)}
                    className="mt-4"
                    disabled={isPending}
                >
                    {isPending ? "Resetting Password..." : "Reset Password"}
                </Button>
            </View>
        </FormLayout>
    );
};

export default ForgotPasswordChangePassword;
