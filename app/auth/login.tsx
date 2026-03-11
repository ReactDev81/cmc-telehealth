import Checkbox from "@/components/form/checkbox";
import Input from "@/components/form/Input";
import PasswordInput from "@/components/form/password";
import ApiError from "@/components/ui/ApiError";
import Button from "@/components/ui/Button";
import { useNotification } from "@/context/NotificationContext";
import { useAuth } from "@/context/UserContext";
import { useLogin } from "@/mutations/useLogin";
import { User, UserRole } from "@/types/common/user-context";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, router } from "expo-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Image, Text, View } from "react-native";
import { z } from "zod";
import FormLayout from "../formLayout";

const loginSchema = z.object({
    email: z.string().email("Enter a valid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    remember: z.boolean().optional(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const LoginScreen = () => {

    const { login } = useAuth();
    const { mutate: signIn, isPending, isError, error } = useLogin();
    const { deviceInfo } = useNotification();
    const [emailverified, setEmailverified] = useState(false);

    const { control, handleSubmit } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
            remember: false,
        },
    });

    const handleSignIn = (formData: LoginFormValues) => {

        const loginFormData = {
            ...formData,
            expo_push_token: deviceInfo?.expo_push_token,
            device_type: deviceInfo?.device_type,
            device_name: deviceInfo?.device_name,
            app_version: deviceInfo?.app_version
        }

        signIn(loginFormData, {
            onSuccess: async (data) => {

                const user = data.data;
                const role: UserRole = user.role as UserRole;

                const userData: User = {
                    id: user.id,
                    first_name: user.first_name,
                    last_name: user.last_name,
                    email: user.email,
                    role,
                    gender: user.gender,
                    date_of_birth: user.date_of_birth,
                    phone: user.phone,
                    patient_id: user.patient_id,
                    doctor_id: user.doctor_id,
                    status: user.status ?? "",
                    avatar: user.avatar,
                    address: {
                        address: user.address.address,
                        area: user.address.area,
                        city: user.address.city,
                        landmark: user.address.landmark,
                        pincode: user.address.pincode,
                        state: user.address.state,
                    },
                };

                // console.log("Render Login Screen", data);

                await login(userData, data.token);

                if (role === "patient") {
                    router.replace("/(patient)");
                } else {
                    router.replace("/(doctor)");
                }
            },
            onError: (error: any) => {
                console.log("ERROR:", error?.response?.data);
                if(error.response?.data?.errors?.status === "verified") {
                    setEmailverified(true);
                }
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
            <View>
                <Text className="text-black text-2xl font-bold text-center">
                    Sign in to your account
                </Text>
                <Text className="text-black-400 mt-2 text-center">
                    Welcome back! You have been missed.
                </Text>
            </View>

            {/* Email */}
            <Input
                name="email"
                label="Email"
                control={control}
                keyboardType="email"
                autoCapitalize="none"
                placeholder="example@email.com"
                containerClassName="mt-8"
            />

            {/* Password */}
            <PasswordInput
                name="password"
                control={control}
                containerClassName="mt-5"
            />

            {/* Remember & Forgot */}
            <View className="mt-5 flex-row items-center justify-between">
                <Checkbox
                    name="remember"
                    control={control}
                    label="Remember for 30 days"
                />
                <Link
                    href="/auth/forgot-password-send-otp"
                    className="text-danger text-sm font-semibold"
                >
                    Forgot Password?
                </Link>
            </View>

            {/* api error message */}
            <ApiError
                message={
                    isError
                    ? ((error as any)?.response?.data?.message ??
                        (error as any)?.message ??
                        "Login failed. Please check your credentials.")
                    : null
                }
            />

            {/* Submit */}
            <View className="mt-5">
                {
                    emailverified ? (
                        <Button
                            onPress={() => router.replace("/auth/register-complete-profile")}
                            className="mt-4"
                            disabled={isPending}
                        >
                            Complete Your Profile
                        </Button>
                    ) :(
                        <Button
                            variant="filled"
                            onPress={handleSubmit(handleSignIn)}
                            disabled={isPending}
                            className="mt-4"
                        >
                            {isPending ? "Signing In..." : "Sign In"}
                        </Button>
                    )
                }
            </View>

            {/* Signup */}
            <View className="mt-5 items-center">
                <Text className="text-black-400">
                    Don't have an account?
                    <Link href="/auth/register-send-otp">
                        <Text className="text-primary font-medium"> Sign Up</Text>
                    </Link>
                </Text>
            </View>

        </FormLayout>
    );
}

export default LoginScreen