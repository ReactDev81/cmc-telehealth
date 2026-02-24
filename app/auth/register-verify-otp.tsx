// import Button from "@/components/ui/Button";
// import { useRegisterVerifyOtp } from "@/mutations/useRegisterVerifyOtp";
// import { useResendOtp } from "@/mutations/useResendOtp";
// import { router, useLocalSearchParams } from "expo-router";
// import { useEffect, useRef, useState } from "react";
// import { Image, Pressable, Text, TextInput, View } from "react-native";
// import FormLayout from "../formLayout";
// import { useAuth } from "@/context/UserContext";
// import { User } from "@/types/common/user-context";

// const RegisterVerifyOtp = () => {
//   const { mutate: verifyOtp, isPending } = useRegisterVerifyOtp();
//   const { mutate: resendOtp, isPending: resendIsPending } = useResendOtp();
//   const [otp, setOtp] = useState(["", "", "", "", "", ""]);
//   const [error, setError] = useState("");
//   const [resendTimer, setResendTimer] = useState(54);
//   const inputRefs = useRef<TextInput[]>([]);
//   const { login } = useAuth();

//   const { email } = useLocalSearchParams<{
//     email?: string;
//   }>();

//   // Countdown timer
//   useEffect(() => {
//     if (resendTimer > 0) {
//       const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
//       return () => clearTimeout(timer);
//     }
//   }, [resendTimer]);

//   const handleOtpChange = (value: string, index: number) => {
//     const newOtp = [...otp];
//     newOtp[index] = value;
//     setOtp(newOtp);
//     setError("");

//     // Auto-focus next input
//     if (value && index < 5) {
//       inputRefs.current[index + 1]?.focus();
//     }
//   };

//   const handleKeyPress = (key: string, index: number) => {
//     if (key === "Backspace" && !otp[index] && index > 0) {
//       inputRefs.current[index - 1]?.focus();
//     }
//   };

//   const handleVerify = async () => {
//     const otpString = otp.join("");

//     if (otpString.length < 6) {
//       setError("Please enter the complete 6-digit OTP.");
//       return;
//     }

//     setError("");
//     console.log("OTP entered:", otpString);

//     const emailStr = typeof email === "string" ? email : "";
//     if (!emailStr) {
//       setError("Missing email.");
//       return;
//     }

//     verifyOtp(
//       {
//         email: emailStr,
//         otp: otpString,
//         context: "register",
//       },
//       {
//         onSuccess: (data) => {

//             const user = data.data;

//         const userData: User = {
//             id: user?.id,
//             first_name: user?.first_name ?? "",
//             last_name: user?.last_name ?? "",
//             avatar: user.avatar ?? "",
//             email: user.email ?? "",
//             gender: user.gender ?? "",
//             date_of_birth: user.date_of_birth ?? "",
//             role: "patient", // API doesn't return role; default to patient
//             phone: user.phone ?? "",
//             patient_id: user.patient_id ?? undefined,
//             doctor_id: undefined, // API doesn't return doctor_id here
//             status: user.status ?? "",
//             address: {
//                 address: user.address?.address ?? null,
//                 area: user.address?.area ?? null,
//                 city: user.address?.city ?? null,
//                 landmark: user.address?.landmark ?? null,
//                 pincode: user.address?.pincode ?? null,
//                 state: user.address?.state ?? null,
//             },
//         };

//                     await login(userData, data.token);
//                     console.log("data", data);
//                     //   router.replace("/(patient)");
//                   },

//           console.log("OTP verified:", data);

//           router.push({
//             pathname: "/auth/register-complete-profile",
//             params: {
//               email: emailStr,
//             },
//           });
//         },
//         onError: (error) => {
//           console.log("OTP error:", error.response?.data);
//         },
//       },
//     );
//   };

//   const handleResendOTP = async () => {
//     const emailStr = typeof email === "string" ? email : "";

//     if (!emailStr) {
//       setError("Email is missing");
//       return;
//     }

//     resendOtp(
//       {
//         email: emailStr,
//         process: "registration",
//       },
//       {
//         onSuccess: (data) => {
//           console.log(data); // OTP resent
//         },
//         onError: (error) => {
//           console.log(error.response?.data);
//         },
//       },
//     );

//     setResendTimer(60);
//   };

//   return (
//     <FormLayout>
//       {/* Logo and title */}
//       <View className="mb-6">
//         <Image
//           source={require("../../assets/images/cmc-telehealth-logo.png")}
//           className="w-24 h-24 mx-auto object-contain"
//         />
//         <Text className="text-base text-black text-center font-bold mt-1">
//           CMC Telehealth
//         </Text>
//       </View>

//       {/* Heading */}
//       <View className="mt-4">
//         <Text className="text-black text-2xl font-semibold text-center">
//           Verify OTP
//         </Text>
//         <Text className="text-gray-500 text-base mt-2 text-center">
//           Fill the OTP that we sent on your email.
//         </Text>
//       </View>

//       {/* OTP Input Boxes */}
//       <View className="mt-8">
//         <View className="flex-row justify-center gap-3">
//           {otp.map((digit, index) => (
//             <TextInput
//               key={index}
//               ref={(ref) => {
//                 if (ref) inputRefs.current[index] = ref;
//               }}
//               className={`w-12 h-12 border rounded-lg text-center text-lg leading-5 font-semibold ${
//                 error ? "border-red-500" : "border-gray-300"
//               }`}
//               value={digit}
//               onChangeText={(value) => handleOtpChange(value, index)}
//               onKeyPress={({ nativeEvent }) =>
//                 handleKeyPress(nativeEvent.key, index)
//               }
//               keyboardType="numeric"
//               maxLength={1}
//               autoFocus={index === 0}
//             />
//           ))}
//         </View>

//         {/* Error message */}
//         {error ? (
//           <Text className="text-red-500 text-sm text-center mt-3">{error}</Text>
//         ) : null}
//       </View>

//       {/* Verify Button */}
//       <Button onPress={handleVerify} className="mt-8" disabled={isPending}>
//         {isPending ? "loading..." : "Continue"}
//       </Button>

//       {/* Resend Timer + Back to Login */}
//       <View className="mt-6 items-center">
//         <Text className="text-gray-500 text-sm">
//           Resend OTP in{" "}
//           <Text className="text-primary font-medium">
//             00:{resendTimer.toString().padStart(2, "0")}
//           </Text>
//         </Text>

//         <Pressable
//           onPress={handleResendOTP}
//           className="mt-2"
//           disabled={resendTimer > 0}
//         >
//           <Text
//             className={`font-medium ${
//               resendTimer > 0 ? "text-gray-400" : "text-primary"
//             }`}
//           >
//             {resendIsPending ? "loading" : "Resend OTP"}
//           </Text>
//         </Pressable>

//         <Pressable onPress={() => router.push("/auth/login")} className="mt-3">
//           <Text className="text-primary font-medium">Back to login</Text>
//         </Pressable>
//       </View>
//     </FormLayout>
//   );
// };

// export default RegisterVerifyOtp;

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
  const { login } = useAuth();
  const { mutate: verifyOtp, isPending } = useRegisterVerifyOtp();
  const { mutate: resendOtp, isPending: resendIsPending } = useResendOtp();
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

    const emailStr = typeof email === "string" ? email : "";
    if (!emailStr) {
      setError("Missing email.");
      return;
    }

    verifyOtp(
      {
        email: emailStr,
        otp: otpString,
        context: "register",
      },
      {
        onSuccess: async (data) => {
          console.log(
            "✅ OTP verify raw response:",
            JSON.stringify(data, null, 2),
          );
          const user = data.data;

          // API returns a single "name" field — split it

          const userData: User = {
            id: user.id ?? "",
            first_name: user.first_name ?? "",
            last_name: user.last_name ?? "",
            avatar: user.avatar ?? "",
            email: user.email ?? "",
            gender: user.gender ?? "",
            date_of_birth: user.date_of_birth ?? "",
            role: "patient", // API doesn't return role; default to patient
            phone: user.phone ?? "",
            patient_id: user.patient_id ?? undefined,
            doctor_id: undefined, // API doesn't return doctor_id here
            status: user.status ?? "",
            address: {
              address: user.address?.address ?? null,
              area: user.address?.area ?? null,
              city: user.address?.city ?? null,
              landmark: user.address?.landmark ?? null,
              pincode: user.address?.pincode ?? null,
              state: user.address?.state ?? null,
            },
          };

          await login(userData, data.token ?? "");
          console.log("data", data);
          //   router.replace("/(patient)");
          //   },

          router.push({
            pathname: "/auth/register-complete-profile",
            params: {
              email: emailStr,
            },
          });
        },
        onError: (error) => {
          console.log("OTP error:", error.response?.data);
        },
      },
    );
  };

  const handleResendOTP = async () => {
    const emailStr = typeof email === "string" ? email : "";

    if (!emailStr) {
      setError("Email is missing");
      return;
    }

    resendOtp(
      {
        email: emailStr,
        process: "registration",
      },
      {
        onSuccess: (data) => {
          console.log(data); // OTP resent
        },
        onError: (error) => {
          console.log(error.response?.data);
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
      <Button onPress={handleVerify} className="mt-8" disabled={isPending}>
        {isPending ? "loading..." : "Continue"}
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
            {resendIsPending ? "loading" : "Resend OTP"}
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
