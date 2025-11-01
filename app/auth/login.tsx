import { Link, router } from "expo-router";
import { View, Text, Pressable, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Button from "../../components/ui/Button";
import Input from "../../components/form/Input";
import PasswordInput from "@/components/form/password";
import Checkbox from "@/components/form/checkbox";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/context/UserContext";

const loginSchema = z.object({
    email: z.string().email("Enter a valid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    remember: z.boolean().optional(),
    role: z.string().min(1, "Please select role"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginScreen() {

    const { login } = useAuth();

    const { control, handleSubmit, formState: { isSubmitting, errors } } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: { email: "", password: "", role: "", remember: false,  },
    });

    const handleSignIn = (data: LoginFormValues) => {
        console.log("Form submitted:", data);

        // Example user data — replace this with API response later
        const userData = {
            id: "1",
            name: "John Doe",
            email: data.email,
            role: data.role.toLowerCase() as "patient" | "doctor",
        };

        // Save to context
        login(userData);

        // Redirect based on role
        if (userData.role === "patient") {
            router.replace("/(patient)");
        } else {
            router.replace("/(doctor)");
        }
    };

    return (
        <SafeAreaView className="flex-1 justify-center bg-white px-6">

            <View className="mb-6">
                <Image
                    source={require("../../assets/images/cmc-telehealth-logo.png")}
                    className="w-24 h-24 mx-auto object-contain"
                />
                <Text className="text-base text-black text-center font-bold mt-1">
                    CMC Telehealth
                </Text>
            </View>

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
            <PasswordInput name="password" control={control} containerClassName="mt-5" />

            {/* role */}
            <Text className="text-sm text-black mb-2 mt-5">Role</Text>
                <Controller
                    control={control}
                    name="role"
                    render={({ field: { onChange, value } }) => (
                        <View className="flex-row gap-2">
                            {["Patient", "Doctor"].map((g) => (
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

            {errors.role && (
                <Text className="text-red-500 text-xs mt-1">
                    {errors.role.message}
                </Text>
            )}

            {/* Remember & Forgot */}
            <View className="mt-5 flex-row items-center justify-between">
                <Checkbox name="remember" control={control} label="Remember for 30 days" />
                <Link
                    href="/auth/reset-password"
                    className="text-[#D70015] text-sm font-semibold"
                >
                    Forgot Password?
                </Link>
            </View>

            {/* Submit Button */}
            <View className="mt-8">
                <Button
                    variant="filled"
                    onPress={handleSubmit(handleSignIn)}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? "Signing In..." : "Sign In"}
                </Button>

                <View className="flex-row items-center mt-7">
                    <View className="flex-1 h-px bg-primary-200" />
                    <Text className="mx-3 text-black-400 text-base">or Sign In with</Text>
                    <View className="flex-1 h-px bg-primary-200" />
                </View>

                <Pressable className="mt-7 border border-[#D0D5DD] py-3.5 rounded-xl flex-row justify-center items-center gap-x-4">
                    <Image source={require("../../assets/images/google.png")} />
                    <Text className="text-black-400">Sign in with Google</Text>
                </Pressable>
            </View>

            <View className="mt-10 items-center">
                <Text className="text-black-400">
                    Don’t have an account?
                    <Link href="/auth/signup">
                        <Text className="text-primary font-medium"> Sign Up</Text>
                    </Link>
                </Text>
            </View>

        </SafeAreaView>
    );
}