import Checkbox from "@/components/form/checkbox";
import Input from "@/components/form/Input";
import PasswordInput from "@/components/form/password";
import Button from "@/components/ui/Button";

import { zodResolver } from "@hookform/resolvers/zod";
import { Link, router } from "expo-router";
import { useForm } from "react-hook-form";
import { Image, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { z } from "zod";

import { useAuth } from "@/context/UserContext";
import { useLogin } from "@/mutations/useLogin";

const loginSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  remember: z.boolean().optional(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginScreen() {
  const { login } = useAuth();
  const { mutate: signIn, isPending } = useLogin();

  const {
    control,
    handleSubmit,
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      remember: false,
    },
  });

  const handleSignIn = (formData: LoginFormValues) => {
    signIn(formData, {
      onSuccess: async (data) => {
        const userData = {
          id: data.user.id,
          name: data.user.name,
          email: data.user.email,
          role: data.user.role,
        };
  
        // ✅ THIS LINE IS ALL YOU NEED
        await login(userData, data.token);
  
        // ✅ Safe navigation AFTER token is in memory
        if (data.user.role === "patient") {
          router.replace("/(patient)");
        } else {
          router.replace("/(doctor)");
        }
      },
    });
  };
  

  return (
    <SafeAreaView className="flex-1 justify-center bg-white px-6">
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
        <Link
          href="/auth/forgot-password-send-otp"
          className="text-[#D70015] text-sm font-semibold"
        >
          Forgot Password?
        </Link>
      </View>

      {/* Submit */}
      <View className="mt-8">
        <Button
          variant="filled"
          onPress={handleSubmit(handleSignIn)}
          disabled={isPending}
        >
          {isPending ? "Signing In..." : "Sign In"}
        </Button>

        <View className="flex-row items-center mt-7">
          <View className="flex-1 h-px bg-primary-200" />
          <Text className="mx-3 text-black-400 text-base">
            or Sign In with
          </Text>
          <View className="flex-1 h-px bg-primary-200" />
        </View>

        <Pressable className="mt-7 border border-[#D0D5DD] py-3.5 rounded-xl flex-row justify-center items-center gap-x-4">
          <Image source={require("../../assets/images/google.png")} />
          <Text className="text-black-400">Sign in with Google</Text>
        </Pressable>
      </View>

      {/* Signup */}
      <View className="mt-10 items-center">
        <Text className="text-black-400">
          Don't have an account?
          <Link href="/auth/register-send-otp">
            <Text className="text-primary font-medium"> Sign Up</Text>
          </Link>
        </Text>
      </View>
    </SafeAreaView>
  );
}
