import Checkbox from "@/components/form/checkbox";
import CountryPicker from "@/components/form/country-picker";
import PasswordInput from "@/components/form/password";
import ApiError from "@/components/ui/ApiError";
import Button from "@/components/ui/Button";
import { useNotification } from "@/context/NotificationContext";
import { useAuth } from "@/context/UserContext";
import { Country, DEFAULT_COUNTRY } from "@/json-data/common/countries";
import { useLogin } from "@/mutations/useLogin";
import { User, UserRole } from "@/types/common/user-context";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFocusEffect } from "@react-navigation/native";
import { router } from "expo-router";
import { useCallback, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { BackHandler, Image, Text, TextInput, TouchableOpacity, View } from "react-native";
import { z } from "zod";
import FormLayout from "../formLayout";

const loginSchema = z.object({
    login: z.string().min(1, "This field is required"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    remember: z.boolean().optional(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const LoginScreen = () => {
    const { login } = useAuth();
    const { mutate: signIn, isPending, isError, error } = useLogin();
    const { deviceInfo } = useNotification();
    const [method, setMethod] = useState<"whatsapp" | "email">("whatsapp");
    const [countryCode, setCountryCode] = useState<string>(DEFAULT_COUNTRY.dial_code);
    const [emailverified, setEmailverified] = useState(false);
    const [verifiedIdentifier, setVerifiedIdentifier] = useState("");

    const {
        control,
        handleSubmit,
        setError,
        clearErrors,
        formState: { errors },
    } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            login: "",
            password: "",
            remember: false,
        },
    });

    useFocusEffect(
        useCallback(() => {
            const onBackPress = () => {
                if (typeof router.canDismiss === "function" && router.canDismiss()) {
                    router.dismissAll();
                }
                router.replace("/splash");
                return true;
            };

            const subscription = BackHandler.addEventListener(
                "hardwareBackPress",
                onBackPress
            );

            return () => subscription.remove();
        }, [])
    );

    const handleMethodSwitch = (newMethod: "whatsapp" | "email") => {
        setMethod(newMethod);
        clearErrors();
    };

    const handleSignIn = (formData: LoginFormValues) => {
        const cleanLogin = formData.login.trim();

        if (method === "whatsapp") {
            const digitsOnly = cleanLogin.replace(/[^0-9]/g, "");
            if (digitsOnly.length < 7 || digitsOnly.length > 15) {
                setError("login", {
                    message: "Enter a valid phone number (7-15 digits)",
                });
                return;
            }
        } else {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(cleanLogin)) {
                setError("login", {
                    message: "Enter a valid email address",
                });
                return;
            }
        }

        const loginFormData = {
            login: method === "whatsapp" ? cleanLogin.replace(/[^0-9]/g, "") : cleanLogin,
            password: formData.password,
            remember: formData.remember,
            ...(method === "whatsapp" ? { country_code: countryCode } : {}),
            expo_push_token: deviceInfo?.expo_push_token,
            device_type: deviceInfo?.device_type,
            device_name: deviceInfo?.device_name,
            app_version: deviceInfo?.app_version,
        };

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
                        address: user.address?.address ?? null,
                        area: user.address?.area ?? null,
                        city: user.address?.city ?? null,
                        landmark: user.address?.landmark ?? null,
                        pincode: user.address?.pincode ?? null,
                        state: user.address?.state ?? null,
                    },
                    existing_patient_id: user.existing_patient_id ?? undefined,
                    is_existing_patient: user.is_existing_patient ?? undefined,
                };

                await login(userData, data.token);

                if (typeof router.canDismiss === "function" && router.canDismiss()) {
                    router.dismissAll();
                }

                if (role === "patient") {
                    router.replace("/(patient)");
                } else {
                    router.replace("/(doctor)");
                }
            },
            onError: (err: any) => {
                if (err.response?.data?.errors?.status === "verified") {
                    setEmailverified(true);
                    setVerifiedIdentifier(
                        err.response?.data?.errors?.login ||
                        err.response?.data?.errors?.email ||
                        cleanLogin
                    );
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
                <Text className="text-black-400 mt-2 text-center text-sm">
                    Welcome back! You have been missed.
                </Text>
            </View>

            {/* Mode Switcher: WhatsApp / Email */}
            <View className="flex-row bg-gray-100 p-1 rounded-xl mt-6">
                <TouchableOpacity
                    onPress={() => handleMethodSwitch("whatsapp")}
                    activeOpacity={0.7}
                    className={`flex-1 py-2.5 rounded-lg items-center ${
                        method === "whatsapp" ? "bg-white" : "bg-transparent"
                    }`}
                >
                    <Text
                        className={`text-sm font-semibold ${
                            method === "whatsapp" ? "text-primary" : "text-gray-500"
                        }`}
                    >
                        WhatsApp
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => handleMethodSwitch("email")}
                    activeOpacity={0.7}
                    className={`flex-1 py-2.5 rounded-lg items-center ${
                        method === "email" ? "bg-white" : "bg-transparent"
                    }`}
                >
                    <Text
                        className={`text-sm font-semibold ${
                            method === "email" ? "text-primary" : "text-gray-500"
                        }`}
                    >
                        Email
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Input Fields */}
            {method === "whatsapp" ? (
                <View className="flex-row gap-x-3 items-start mt-6">
                    <View className="w-28">
                        <CountryPicker
                            label="Country"
                            value={countryCode}
                            onChange={(country: Country) => setCountryCode(country.dial_code)}
                        />
                    </View>
                    <View className="flex-1">
                        <Text className="text-sm text-black mb-1.5 font-medium">
                            WhatsApp Number <Text className="text-red-500">*</Text>
                        </Text>
                        <Controller
                            control={control}
                            name="login"
                            render={({ field: { onChange, onBlur, value } }) => (
                                <View>
                                    <TextInput
                                        className={`border rounded-xl px-4 py-3.5 text-sm leading-4 text-black bg-white ${
                                            errors.login ? "border-red-500" : "border-gray"
                                        }`}
                                        value={value}
                                        onChangeText={(text) => onChange(text.replace(/[^0-9]/g, ""))}
                                        onBlur={onBlur}
                                        placeholder="98765 43210"
                                        placeholderTextColor="#9CA3AF"
                                        keyboardType="number-pad"
                                        maxLength={15}
                                        underlineColorAndroid="transparent"
                                    />
                                    {errors.login && (
                                        <Text className="text-xs text-red-600 mt-1">
                                            {errors.login.message as string}
                                        </Text>
                                    )}
                                </View>
                            )}
                        />
                    </View>
                </View>
            ) : (
                <View className="mt-6">
                    <Text className="text-sm text-black mb-1.5 font-medium">
                        Email Address <Text className="text-red-500">*</Text>
                    </Text>
                    <Controller
                        control={control}
                        name="login"
                        render={({ field: { onChange, onBlur, value } }) => (
                            <View>
                                <TextInput
                                    className={`border rounded-xl px-4 py-3.5 text-sm leading-4 text-black bg-white ${
                                        errors.login ? "border-red-500" : "border-gray"
                                    }`}
                                    value={value}
                                    onChangeText={onChange}
                                    onBlur={onBlur}
                                    placeholder="example@email.com"
                                    placeholderTextColor="#9CA3AF"
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    underlineColorAndroid="transparent"
                                />
                                {errors.login && (
                                    <Text className="text-xs text-red-600 mt-1">
                                        {errors.login.message as string}
                                    </Text>
                                )}
                            </View>
                        )}
                    />
                </View>
            )}

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
                <TouchableOpacity
                    onPress={() => router.push("/auth/forgot-password-send-otp")}
                    activeOpacity={0.7}
                >
                    <Text className="text-danger text-sm font-semibold">
                        Forgot Password?
                    </Text>
                </TouchableOpacity>
            </View>

            {/* API Error Message */}
            <ApiError
                message={
                    isError
                        ? ((error as any)?.response?.data?.errors?.message ??
                            (error as any)?.response?.data?.message ??
                            (error as any)?.message ??
                            "Login failed. Please check your credentials.")
                        : null
                }
            />

            {/* Submit */}
            <View className="mt-5">
                {emailverified ? (
                    <Button
                        onPress={() =>
                            router.replace({
                                pathname: "/auth/register-complete-profile",
                                params: {
                                    login: verifiedIdentifier,
                                    mobile_no: verifiedIdentifier,
                                    country_code: countryCode,
                                },
                            })
                        }
                        className="mt-4"
                        disabled={isPending}
                    >
                        Complete Your Profile
                    </Button>
                ) : (
                    <Button
                        variant="filled"
                        onPress={handleSubmit(handleSignIn)}
                        disabled={isPending}
                        className="mt-4"
                    >
                        {isPending ? "Signing In..." : "Sign In"}
                    </Button>
                )}
            </View>

            {/* Signup */}
            <View className="mt-5 items-center">
                <View className="flex-row items-center">
                    <Text className="text-black-400">Don't have an account? </Text>
                    <TouchableOpacity
                        onPress={() => router.push("/auth/register-send-otp")}
                        activeOpacity={0.7}
                    >
                        <Text className="text-primary font-medium">Sign Up</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </FormLayout>
    );
};

export default LoginScreen;
