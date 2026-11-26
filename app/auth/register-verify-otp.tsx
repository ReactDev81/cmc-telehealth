import ApiError from "@/components/ui/ApiError";
import Button from "@/components/ui/Button";
import { useAuth } from "@/context/UserContext";
import { useRegisterVerifyOtp } from "@/mutations/useRegisterVerifyOtp";
import { useResendOtp } from "@/mutations/useResendOtp";
import { User } from "@/types/common/user-context";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Image, Pressable, Text, TextInput, View } from "react-native";
import FormLayout from "../formLayout";

const RegisterVerifyOtp = () => {

    const { login: setAuthUser } = useAuth();
    const { mutate: verifyOtp, isPending } = useRegisterVerifyOtp();
    const { mutate: resendOtp, isPending: resendIsPending } = useResendOtp();
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [error, setError] = useState("");
    const [resendTimer, setResendTimer] = useState(60);
    const inputRefs = useRef<TextInput[]>([]);

    const { login, country_code = "+91", email } = useLocalSearchParams<{
        login?: string;
        country_code?: string;
        email?: string;
    }>();

    const targetLogin = typeof login === "string" && login ? login : (typeof email === "string" ? email : "");
    const targetCountryCode = typeof country_code === "string" ? country_code : "+91";

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

        setError("");

        if (!targetLogin) {
            setError("Missing WhatsApp number.");
            return;
        }

        verifyOtp(
            {
                otp: otpString,
                login: targetLogin,
                country_code: targetCountryCode,
                email: typeof email === "string" ? email : undefined,
                context: "register",
            },
            {
                onSuccess: async (data) => {
                    const user = data.data;

                    const userData: User = {
                        id: user?.id ?? "",
                        first_name: user?.first_name ?? "",
                        last_name: user?.last_name ?? "",
                        avatar: user?.avatar ?? "",
                        email: user?.email ?? "",
                        gender: "",
                        date_of_birth: "",
                        role: "patient",
                        phone: targetLogin,
                        patient_id: "",
                        doctor_id: "",
                        status: user?.status ?? "verified",
                        address: {
                            address: null,
                            area: null,
                            city: null,
                            landmark: null,
                            pincode: null,
                            state: null,
                        },
                    };

                    await setAuthUser(userData, data.token ?? "");

                    router.replace({
                        pathname: "/auth/register-complete-profile",
                        params: {
                            login: targetLogin,
                            country_code: targetCountryCode,
                            mobile_no: targetLogin,
                            email: user?.email && user.email.includes("@") ? user.email : "",
                        },
                    });
                },
                onError: (error) => {
                    const message =
                        error.response?.data?.errors?.message ??
                        error.response?.data?.message ??
                        error.message ??
                        "Invalid OTP. Please try again.";
                    setError(message);
                },
            },
        );
    };

    const handleResendOTP = async () => {
        setError("");

        if (!targetLogin) {
            setError("WhatsApp number is missing");
            return;
        }

        resendOtp(
            {
                login: targetLogin,
                country_code: targetCountryCode,
                email: typeof email === "string" ? email : undefined,
                context: "registration",
            },
            {
                onSuccess: (data) => {
                    console.log("OTP resent:", data);
                },
                onError: (error) => {
                    const message =
                        error.response?.data?.errors?.message ??
                        error.response?.data?.message ??
                        error.message ??
                        "Something went wrong. Please try again.";
                    setError(message);
                },
            },
        );

        setResendTimer(60);
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
                    Verify OTP
                </Text>
                <Text className="text-gray-500 text-base mt-2 text-center">
                    Fill the OTP that we sent on your WhatsApp number{" "}
                    {targetLogin ? `(${targetCountryCode} ${targetLogin})` : ""}.
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

            {/* api Error message */}
            <ApiError message={error} />

            {/* Verify Button */}
            <Button onPress={handleVerify} className="mt-4" disabled={isPending}>
                {isPending ? "loading..." : "Continue"}
            </Button>

            {/* Resend Timer + Back to Login */}
            <View className="mt-6 items-center">
                
                <Text className="text-gray-500 text-sm">
                    {resendTimer > 0 ? (
                        <>
                            Resend OTP in{" "}
                            <Text className="text-primary font-medium">
                                00:{resendTimer.toString().padStart(2, "0")}
                            </Text>
                        </>
                    ) : (
                        "Didn't receive the OTP?"
                    )}
                </Text>

                <Pressable
                    onPress={handleResendOTP}
                    className="mt-2"
                    disabled={resendTimer > 0}
                >
                    <Text
                        className={`font-medium ${
                            resendTimer > 0 ? "text-gray-400" : "text-primary"
                        }`}
                    >
                        {resendIsPending ? "loading..." : "Resend OTP"}
                    </Text>
                </Pressable>

                <Pressable onPress={() => router.push("/auth/login")} className="mt-3">
                    <Text className="text-primary font-medium">Back to login</Text>
                </Pressable>

            </View>

        </FormLayout>
    );
};

export default RegisterVerifyOtp;
