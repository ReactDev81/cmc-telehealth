import useApi from "@/hooks/useApi";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { Image, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { z } from "zod";
import PasswordInput from "../../components/form/password";
import Button from "../../components/ui/Button";

const passwordSchema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters"),
    password_confirmation: z
      .string()
      .min(1, "Please confirm your new password"),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Passwords do not match",
    path: ["password_confirmation"],
  });

const ForgotPasswordChangePassword = () => {
  const router = useRouter();
  const { data, error, fetchData } = useApi<{
    token: string;
  }>("post", "/forgot-password/reset-password", {
    headers: {
      Accept: "application/json",
    },
  });

  const { control, handleSubmit } = useForm({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      password: "",
      password_confirmation: "",
    },
  });

  const { email } = useLocalSearchParams<{
    email?: string;
  }>();

  const onSubmit = async (formData: z.infer<typeof passwordSchema>) => {
    const confirmPassword = {
      email: email,
      password: formData.password,
      password_confirmation: formData.password_confirmation,
    };

    await fetchData({ data: confirmPassword });
    router.replace("/auth/login");
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
      <View className="mt-4">
        <Text className="text-black text-2xl font-bold text-center">
          Set New Password
        </Text>
        <Text className="text-black-400 text-base text-center mt-2">
          Enter your old and new password below to update it
        </Text>
      </View>

      {/* Form */}
      <View className="mt-8">
        {/* New Password */}
        <Controller
          control={control}
          name="password"
          render={() => (
            <View className="mt-5">
              <PasswordInput
                name="password"
                control={control}
                label="New Password"
                placeholder="Enter New Password"
              />
            </View>
          )}
        />

        {/* Confirm Password */}
        <Controller
          control={control}
          name="password_confirmation"
          render={() => (
            <View className="mt-5">
              <PasswordInput
                name="password_confirmation"
                control={control}
                label="Confirm Password"
                placeholder="Confirm New Password"
              />
            </View>
          )}
        />
      </View>

      {/* Submit Button */}
      <View className="mt-6">
        <Button onPress={handleSubmit(onSubmit)}>Change Password</Button>
      </View>
    </SafeAreaView>
  );
};

export default ForgotPasswordChangePassword;
