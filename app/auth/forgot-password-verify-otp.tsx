import Button from "@/components/ui/Button";
import { useVerifyForgotPasswordOtp } from "@/queries/useVerifyForgotPasswordOtp";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Image, Pressable, Text, TextInput, View } from "react-native";
import FormLayout from "../formLayout";

const ForgotPasswordVerifyOtp = () => {
  // const { data, fetchData } = useApi<{
  //   token: string;
  // }>("post", "/verify-otp", {
  //   headers: {
  //     Accept: "application/json",
  //   },
  // });

  const {
    mutate,
    isPending,
    isError,
    error: apiError,
  } = useVerifyForgotPasswordOtp();

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [resendTimer, setResendTimer] = useState(54);
  const inputRefs = useRef<TextInput[]>([]);

  const { email } = useLocalSearchParams<{
    email?: string;
  }>();

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
    console.log("OTP entered:", otpString);

    // const verifyOTP = {
    //   email: email,
    //   otp: otpString,
    //   context: "forgot_password",
    // };

    // await fetchData({ data: verifyOTP });

    // router.push({
    //   pathname: "/auth/forgot-password-change-password",
    //   params: { email: email },
    // });

    mutate(
      {
        email,
        otp: otpString,
        context: "forgot_password",
      },
      {
        onSuccess: () => {
          router.push({
            pathname: "/auth/forgot-password-change-password",
            params: { email },
          });
        },
        onError: () => {
          setError(
            (apiError as any)?.response?.data?.message ||
              "Invalid OTP. Please try again.",
          );
        },
      },
    );
  };

  const handleResendOTP = () => {
    console.log("Resending OTP...");
    setResendTimer(60);
  };

  return (
    // <SafeAreaView className="flex-1 justify-center bg-white px-6">
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
          Fill the OTP that we sent on your email.
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

        {/* Error message */}
        {error ? (
          <Text className="text-red-500 text-sm text-center mt-3">{error}</Text>
        ) : null}
      </View>

      {/* Verify Button */}
      <Button onPress={handleVerify} className="mt-8">
        <Text className="text-white text-center text-base font-semibold">
          Continue
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
          disabled={resendTimer > 0}
        >
          <Text
            className={`font-medium ${
              resendTimer > 0 ? "text-gray-400" : "text-primary"
            }`}
          >
            Resend OTP
          </Text>
        </Pressable>

        <Pressable onPress={() => router.push("/auth/login")} className="mt-3">
          <Text className="text-primary font-medium">Back to login</Text>
        </Pressable>
      </View>
    </FormLayout>
  );
};

export default ForgotPasswordVerifyOtp;
