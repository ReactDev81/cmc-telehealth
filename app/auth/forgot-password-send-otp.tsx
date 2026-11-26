import CountryPicker from "@/components/form/country-picker";
import ApiError from "@/components/ui/ApiError";
import Button from "@/components/ui/Button";
import { Country, DEFAULT_COUNTRY } from "@/json-data/common/countries";
import { useSendForgotPasswordOtp } from "@/queries/useSendForgotPasswordOtp";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Image, Text, TextInput, TouchableOpacity, View } from "react-native";
import { z } from "zod";
import FormLayout from "../formLayout";

const schema = z.object({
    login: z.string().min(1, "This field is required"),
});

type FormValues = z.infer<typeof schema>;

const ForgotPasswordSendOtp = () => {
    const [method, setMethod] = useState<"whatsapp" | "email">("whatsapp");
    const [countryCode, setCountryCode] = useState<string>(DEFAULT_COUNTRY.dial_code);
    const { mutate, isPending, isError, error } = useSendForgotPasswordOtp();

    const {
        control,
        handleSubmit,
        setError,
        clearErrors,
        formState: { errors },
    } = useForm<FormValues>({
        resolver: zodResolver(schema),
        defaultValues: {
            login: "",
        },
    });

    const handleMethodSwitch = (newMethod: "whatsapp" | "email") => {
        setMethod(newMethod);
        clearErrors();
    };

    const onSubmit = async (formData: FormValues) => {
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

        const payload = {
            login: cleanLogin,
            ...(method === "whatsapp" ? { country_code: countryCode } : {}),
        };

        mutate(payload, {
            onSuccess: () => {
                router.push({
                    pathname: "/auth/forgot-password-verify-otp",
                    params: {
                        login: cleanLogin,
                        country_code: method === "whatsapp" ? countryCode : "",
                        method,
                    },
                });
            },
            onError: (err) => {
                console.log("Error sending forgot password OTP:", err);
            },
        });
    };

    return (
        <FormLayout>
            <View className="mb-6">
                <Image
                    source={require("../../assets/images/cmc-telehealth-logo.png")}
                    className="w-24 h-24 mx-auto object-contain"
                />
                <Text className="text-base text-black text-center font-bold mt-1">
                    CMC Telehealth
                </Text>
            </View>

            <View className="mt-4">
                <Text className="text-black text-2xl font-bold text-center">
                    Reset Password
                </Text>
                <Text className="text-gray-500 mt-2 text-center text-sm px-4">
                    {method === "whatsapp"
                        ? "Enter your WhatsApp number. We will send you a verification code on WhatsApp."
                        : "Enter your registered email to receive a password reset code."}
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

            {/* API Error Message */}
            <ApiError
                message={
                    isError
                        ? ((error as any)?.response?.data?.errors?.message ??
                          (error as any)?.response?.data?.message ??
                          (error as any)?.message ??
                          "Failed to send reset code. Please try again.")
                        : null
                }
            />

            {/* Continue Button */}
            <Button
                onPress={handleSubmit(onSubmit)}
                className="mt-6"
                disabled={isPending}
            >
                {isPending ? "Sending OTP..." : "Get OTP"}
            </Button>

            <TouchableOpacity
                onPress={() => router.push("/auth/login")}
                className="mt-6 items-center"
                activeOpacity={0.7}
            >
                <Text className="text-primary font-medium">Back to login</Text>
            </TouchableOpacity>
        </FormLayout>
    );
};

export default ForgotPasswordSendOtp;
