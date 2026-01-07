import DateField from "@/components/form/date";
import Input from "@/components/form/Input";
import Button from "@/components/ui/Button";
import { useAuth } from "@/context/UserContext";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { z } from "zod";

const schema = z.object({
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    dateOfBirth: z.date(),
    phoneNumber: z.string().min(8),
    gender: z.string(),
});

export default function RegisterCompleteProfile() {

    const { user } = useAuth();

    const { control, handleSubmit } = useForm({
        resolver: zodResolver(schema),
    });

    const onSubmit = async (data: any) => {
        // TODO: API → save profile
        console.log("Data :",  data);
        router.replace('/auth/login');
    };

    return (
        <SafeAreaView className="flex-1 bg-white px-6">
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
                    control={control}
                    label="First Name"
                    placeholder="First Name"
                    containerClassName="mt-5"
                />

                {/* Last Name */}
                <Input
                    name="lastName"
                    control={control}
                    label="Last Name"
                    placeholder="Last Name"
                    containerClassName="mt-5"
                />

                {/* DOB */}
                <Controller
                    control={control}
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
                    control={control}
                    placeholder="+234 (999) 000-0000"
                    keyboardType="tel"
                />

                {/* Gender */}
                <Text className="text-sm text-black mb-2 mt-5">Gender</Text>
                <Controller
                    control={control}
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

                <Button
                    onPress={handleSubmit(onSubmit)}
                    className="mt-8"
                >
                    Continue
                </Button>

                <Text className="text-base text-black-400 text-center mt-5 px-4">
                    By providing your mobile number, you give us permission to contact you via text.
                </Text>
                
            </ScrollView>
        </SafeAreaView>
    );
}