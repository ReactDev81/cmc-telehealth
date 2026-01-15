import DateField from "@/components/form/date";
import Button from "@/components/ui/Button";
import { useAuth } from "@/context/UserContext";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, router } from "expo-router";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import { z } from "zod";
import Checkbox from "../../components/form/checkbox";
import Input from "../../components/form/Input";
import PasswordInput from "../../components/form/password";

const step1Schema = z.object({
    email: z.string().email("Enter a valid email"),
    password: z.string().min(8, "Password must be at least 8 characters long"),
    agreedToTerms: z
        .boolean()
        .refine((v) => v === true, { message: "You must agree to the terms" }),
});

const step2Schema = z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    dateOfBirth: z.date({
      required_error: "Date of birth is required",
      invalid_type_error: "Invalid date format",
    }),
    phoneNumber: z.string().min(8, "Enter a valid phone number"),
    gender: z.string().min(1, "Please select gender"),
});

export default function RegisterScreen() {

    const [step, setStep] = useState(1);
    const { user } = useAuth();

    // Step 1 form
    const {
        control: controlStep1,
        handleSubmit: handleSubmitStep1,
        formState: { errors: errorsStep1 },
        watch: watchStep1,
    } = useForm({
        resolver: zodResolver(step1Schema),
        defaultValues: { email: "", password: "", agreedToTerms: false },
    });

    // Step 2 form
    const {
        control: controlStep2,
        handleSubmit: handleSubmitStep2,
        formState: { errors: errorsStep2 },
    } = useForm({
        resolver: zodResolver(step2Schema),
        defaultValues: {
            firstName: "",
            lastName: "",
            dateOfBirth: undefined,
            phoneNumber: "",
            gender: "",
        },
    });

    const onSubmitStep1 = (data: z.infer<typeof step1Schema>) => {
        setStep(2);
    };

    const onSubmitStep2 = (data: z.infer<typeof step2Schema>) => {

        // If for some reason we don't have a user yet, send them to login
        if (!user) {
            return router.replace("/auth/login");
        }

        if (user.role === "patient") {
            return router.replace("/(patient)");
        }

        if (user.role === "doctor") {
            return router.replace("/(doctor)");
        }

        return router.replace("/auth/login");
    };

    // --- Password Strength ---
    const renderPasswordStrength = (password: string) => {
        const strength = password.length;
        const bars = Array.from({ length: 4 }, (_, i) => (
            <View
                key={i}
                className={`h-1 flex-1 mx-0.5 rounded ${
                    i < strength / 2 ? "bg-primary" : "bg-gray-200"
                }`}
            />
        ));

        return (
            <View className="mt-2">
                <Text className="text-xs text-gray-600 mb-1">Password strength:</Text>
                <View className="flex-row">{bars}</View>
            </View>
        );
    };

    //   STEP 1 VIEW
    if (step === 1) {
        return (
            <View className="flex-1 justify-center bg-white px-6">

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
                        Create an account
                    </Text>
                    <Text className="text-gray-500 mt-2 text-center">
                        Let's get you started. Please enter your details
                    </Text>
                </View>

                {/* Email */}
                <Input
                    name="email"
                    control={controlStep1}
                    label="Email"
                    keyboardType="email"
                    autoCapitalize="none"
                    placeholder="example@email.com"
                    containerClassName="mt-8"
                />

                {/* Password */}
                <Controller
                    control={controlStep1}
                    name="password"
                    render={() => (
                        <View className="mt-5">
                            <PasswordInput
                                name="password"
                                control={controlStep1}
                                placeholder="8 characters minimum"
                            />
                                {watchStep1("password") && renderPasswordStrength(watchStep1("password"))}
                        </View>
                    )}
                />

                {/* Terms */}
                <View className="mt-2 flex-row">
                    <Checkbox name="agreedToTerms" control={controlStep1} />
                    <Text className="text-gray-600 text-sm ml-3 mt-4">
                        By clicking "Continue", you agree to accept our{" "}
                        <Text className="text-primary font-medium">Privacy Policy</Text> and{" "}
                        <Text className="text-primary font-medium">Terms of Service</Text>
                    </Text>
                    {errorsStep1.agreedToTerms && (
                        <Text className="text-red-500 text-xs mt-1 ml-6">
                            {errorsStep1.agreedToTerms.message}
                        </Text>
                    )}
                </View>

                {/* Continue */}
                <Button
                    onPress={handleSubmitStep1(onSubmitStep1)}
                    className="mt-8"
                >
                    Continue
                </Button>

                <View className="mt-10 items-center">
                    <Text className="text-gray-500">
                        Already have an account?{" "}
                        <Link href="/auth/login">
                            <Text className="text-primary font-medium">Sign In</Text>
                        </Link>
                    </Text>
                </View>
            </View>
        );
    }

    // STEP 2 VIEW
    return (
        <View className="flex-1 bg-white px-6">
            <ScrollView showsVerticalScrollIndicator={false}>

                <View className="mt-10 mb-4">
                    <Text className="text-black text-2xl font-semibold text-center">Basic Information</Text>
                    <Text className="text-black-400 text-base mt-2 text-center max-w-80 mx-auto">
                        Please tell us some basic information to complete your profile:
                    </Text>
                </View>

                {/* First Name */}
                <Input
                    name="firstName"
                    control={controlStep2}
                    label="First Name"
                    placeholder="First Name"
                    containerClassName="mt-5"
                />

                {/* Last Name */}
                <Input
                    name="lastName"
                    control={controlStep2}
                    label="Last Name"
                    placeholder="Last Name"
                    containerClassName="mt-5"
                />

                {/* DOB */}
                <Controller
                    control={controlStep2}
                    name="dateOfBirth"
                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                        <DateField
                            label="Date of Birth"
                            value={value}
                            onChange={onChange}
                            error={error?.message}
                            className="mt-5"
                            maximumDate={new Date()} // prevent future DOB
                        />
                    )}
                />

                {/* Phone Number */}
                <Input
                    name="phoneNumber"
                    label="Phone Number"
                    containerClassName="mt-5"
                    control={controlStep2}
                    placeholder="+234 (999) 000-0000"
                    keyboardType="tel"
                />

                {/* Gender */}
                <Text className="text-sm text-black mb-2 mt-5">Gender</Text>
                <Controller
                    control={controlStep2}
                    name="gender"
                    render={({ field: { onChange, value } }) => (
                        <View className="flex-row gap-2">
                            {["Male", "Female"].map((g) => (
                                <Pressable
                                    key={g}
                                    onPress={() => onChange(g)}
                                    className={`flex-1 py-4 px-4 rounded-xl border ${
                                        value === g ? "bg-primary border-primary" : "border-primary"
                                    }`}
                                >
                                    <Text className={`text-center ${value === g ? "text-white" : "text-primary"}`}>
                                        {g}
                                    </Text>
                                </Pressable>
                            ))}
                        </View>
                    )}
                />

                {errorsStep2.gender && (
                    <Text className="text-red-500 text-xs mt-1">
                        {errorsStep2.gender.message}
                    </Text>
                )}

                <Button
                    onPress={handleSubmitStep2(onSubmitStep2)}
                    className="mt-8"
                >
                        Continue
                </Button>

                <Text className="text-base text-black-400 text-center mt-5 px-4">
                    By providing your mobile number, you give us permission to contact you via text.
                </Text>
                
            </ScrollView>
        </View>
    );
}