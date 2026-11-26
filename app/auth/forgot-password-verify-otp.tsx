import ApiError from "@/components/ui/ApiError";
import Button from "@/components/ui/Button";
import { useResendOtp } from "@/mutations/useResendOtp";
import { useVerifyForgotPasswordOtp } from "@/queries/useVerifyForgotPasswordOtp";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Image, Pressable, Text, TextInput, View } from "react-native";
import FormLayout from "../formLayout";

const ForgotPasswordVerifyOtp = () => {
    const { mutate, isPending } = useVerifyForgotPasswordOtp();
    const { mutate: resendOtp, isPending: resendIsPending } = useResendOtp();

    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [error, setError] = useState("");
    const [resendTimer, setResendTimer] = useState(60);
    const inputRefs = useRef<TextInput[]>([]);

    const { login, country_code, method } = useLocalSearchParams<{
        login?: string;
        country_code?: string;
        method?: string;
    }>();

    const loginStr = typeof login === "string" ? login : "";
    const countryCodeStr = typeof country_code === "string" ? country_code : "";
    const isWhatsApp = method !== "email" && Boolean(countryCodeStr);

    // Countdown timer
    useEffect(() => {
        if (resendTimer > 0) {
            const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [resendTimer]);

    const handleOtpChange = (value: string, index: number) => {
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);
        setError("");

        // Auto-focus next input
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyPress = (key: string, index: number) => {
        if (key === "Backspace" && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleVerify = async () => {
        const otpString = otp.join("");

        if (otpString.length < 6) {
            setError("Please enter the complete 6-digit OTP.");
            return;
        }

        if (!loginStr) {
            setError("Login identifier is missing. Please go back.");
            return;
        }

        setError("");

        mutate(
            {
                login: loginStr,
                ...(countryCodeStr ? { country_code: countryCodeStr } : {}),
                otp: otpString,
            },
            {
                onSuccess: (res) => {
                    const resetToken = res.data?.reset_token;
                    if (!resetToken) {
                        setError("Reset token missing from response.");
                        return;
                    }
                    router.push({
                        pathname: "/auth/forgot-password-change-password",
                        params: {
                            login: loginStr,
                            country_code: countryCodeStr,
                            reset_token: resetToken,
                        },
                    });
                },
                onError: (err: any) => {
                    const message =
                        err.response?.data?.errors?.message ??
                        err.response?.data?.message ??
                        err.message ??
                        "Invalid OTP. Please try again.";
                    setError(message);
                },
            },
        );
    };

    const handleResendOTP = async () => {
        if (!loginStr) {
            setError("Login identifier is missing.");
            return;
        }

        setError("");

        resendOtp(
            {
                login: loginStr,
                country_code: countryCodeStr || undefined,
                context: "forgot_password",
            },
            {
                onSuccess: () => {
                    setResendTimer(60);
                },
                onError: (err: any) => {
                    setError(
                        err?.response?.data?.message ??
                        err?.response?.data?.errors?.message ??
                        "Failed to resend OTP. Please try again."
                    );
                },
            },
        );
    };

    return (
        <FormLayout>
            {/* Logo and title */}
            <View className="mb-6">
                <Image
                    source={require("../../assets/images/cmc-telehealth-logo.png")}
                    className="w-24 h-24 mx-auto object-contain"
                />
                <Text className="text-base text-black text-center font-bold mt-1">
                    CMC Telehealth
                </Text>
            </View>

            {/* Heading */}
            <View className="mt-4">
                <Text className="text-black text-2xl font-semibold text-center">
                    Verify Reset Code
                </Text>
                <Text className="text-gray-500 text-sm mt-2 text-center px-4">
                    Enter the 6-digit code sent to{" "}
                    <Text className="font-semibold text-black">
                        {isWhatsApp
                            ? `${countryCodeStr} ${loginStr}`
                            : loginStr}
                    </Text>
                    {isWhatsApp ? " on WhatsApp" : ""}
                </Text>
            </View>

            {/* OTP Input Boxes */}
            <View className="mt-8">
                <View className="flex-row justify-center gap-3">
                    {otp.map((digit, index) => (
                        <TextInput
                            key={index}
                            ref={(ref) => {
                                if (ref) inputRefs.current[index] = ref;
                            }}
                            className={`w-12 h-12 border rounded-lg text-center text-lg leading-5 font-semibold ${
                                error ? "border-red-500" : "border-gray-300"
                            }`}
                            value={digit}
                            onChangeText={(value) => handleOtpChange(value, index)}
                            onKeyPress={({ nativeEvent }) =>
                                handleKeyPress(nativeEvent.key, index)
                            }
                            keyboardType="numeric"
                            maxLength={1}
                            autoFocus={index === 0}
                        />
                    ))}
                </View>
            </View>

            {/* Error message */}
            <ApiError message={error} />

            {/* Verify Button */}
            <Button onPress={handleVerify} className="mt-8" disabled={isPending}>
                <Text className="text-white text-center text-base font-semibold">
                    {isPending ? "Verifying..." : "Verify & Continue"}
                </Text>
            </Button>

            {/* Resend Timer + Back to Login */}
            <View className="mt-6 items-center">
                <Text className="text-gray-500 text-sm">
                    Resend OTP in{" "}
                    <Text className="text-primary font-medium">
                        00:{resendTimer.toString().padStart(2, "0")}
                    </Text>
                </Text>

                <Pressable
                    onPress={handleResendOTP}
                    className="mt-2"
                    disabled={resendTimer > 0 || resendIsPending}
                >
                    <Text
                        className={`font-medium ${
                            resendTimer > 0 ? "text-gray-400" : "text-primary"
                        }`}
                    >
                        {resendIsPending ? "Resending..." : "Resend OTP"}
                    </Text>
                </Pressable>

                <Pressable onPress={() => router.push("/auth/login")} className="mt-4">
                    <Text className="text-primary font-medium">Back to login</Text>
                </Pressable>
            </View>
        </FormLayout>
    );
};

export default ForgotPasswordVerifyOtp;
