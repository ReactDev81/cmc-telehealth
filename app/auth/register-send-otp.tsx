import Input from "@/components/form/Input";
import ApiError from "@/components/ui/ApiError";
import Button from "@/components/ui/Button";
import { useRegister } from "@/mutations/useRegister";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, router } from "expo-router";
import { X } from "lucide-react-native";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Image, Modal, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { z } from "zod";
import PrivacyPolicy from "../common-screens/profile/privacy-policy";
import TermAndCondition from "../common-screens/profile/term-condition";
import FormLayout from "../formLayout";

const schema = z.object({
    email: z.string().email("Enter a valid email"),
});

export default function RegisterSendOtp() {

    const { mutate: register, isPending, isError, error } = useRegister();
    const [openPrivacy, setOpenPrivacy] = useState(false);
    const [openTerm, setOpenTerm] = useState(false);

    const { control, handleSubmit } = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            email: "",
        },
    });

    const onSubmit = async (formData: any) => {
        register(
            {
                email: formData.email,
            },
            {
                onSuccess: () => {
                    router.push({
                        pathname: "/auth/register-verify-otp",
                        params: {
                            email: formData.email,
                        },
                    });
                },
                onError: (error) => {
                    console.log("Register error:", error.response?.data);
                },
            },
        );
    };

    return (
        <FormLayout>
            <SafeAreaView className="flex-1 justify-center bg-white">

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
                    control={control}
                    label="Email"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    placeholder="example@email.com"
                    containerClassName="mt-8"
                />

                {/* api error message */}
                <ApiError
                    message={
                        isError
                        ? ((error as any)?.response?.data?.message ??
                            (error as any)?.message ??
                            "Registration failed. Please try again.")
                        : null
                    }
                />

                {/* Continue */}
                <Button
                    onPress={handleSubmit(onSubmit)}
                    className="mt-4"
                    disabled={isPending}
                >
                    {isPending ? "loading..." : "Continue"}
                </Button>

                <View className="mt-10 items-center">
                    <Text className="text-gray-500">
                        Already have an account?{" "}
                        <Link href="/auth/login">
                            <Text className="text-primary font-medium">Sign In</Text>
                        </Link>
                    </Text>
                </View>

                {/* Privacy Modal */}
                <Modal
                    visible={openPrivacy}
                    animationType="fade"
                    transparent
                    onRequestClose={() => setOpenPrivacy(false)}
                >
                    <View className="flex-1 bg-black/40 justify-center items-center">
                        <View className="w-11/12 min-h-80 bg-white relative p-2 rounded">
                            <Pressable
                                className="absolute top-2.5 right-2.5 z-10"
                                onPress={() => setOpenPrivacy(false)}
                            >
                                <X color="#4D4D4D" />
                            </Pressable>
                            <PrivacyPolicy />
                        </View>
                    </View>
                </Modal>

                {/* Term Modal */}
                <Modal
                    visible={openTerm}
                    animationType="fade"
                    transparent
                    onRequestClose={() => setOpenTerm(false)}
                >
                    <View className="flex-1 bg-black/40 justify-center items-center">
                        <View className="w-11/12 min-h-80 bg-white relative p-2 rounded">
                            <Pressable
                                className="absolute top-2.5 right-2.5 z-10"
                                onPress={() => setOpenTerm(false)}
                            >
                                <X color="#4D4D4D" />
                            </Pressable>
                            <TermAndCondition />
                        </View>
                    </View>
                </Modal>

            </SafeAreaView>
        </FormLayout>
    );
}
