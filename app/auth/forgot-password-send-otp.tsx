import Input from "@/components/form/Input";
import Button from "@/components/ui/Button";
import useApi from "@/hooks/useApi";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, router } from "expo-router";
import { useForm } from "react-hook-form";
import { Image, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { z } from "zod";

const schema = z.object({
  email: z.string().email("Enter a valid email"),
});

const ForgotPasswordSendOtp = () => {
  const { data, error, fetchData } = useApi<{
    message?: string;
    email: string;
  }>("post", "/forgot-password/send-otp", {
    headers: {
      Accept: "application/json",
    },
  });

  const { control, handleSubmit } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (formData: any) => {
    const forgotPasswordData = {
      email: formData.email,
    };

    await fetchData({ data: forgotPasswordData });

    router.push({
      pathname: "/auth/forgot-password-verify-otp",
      params: { email: formData.email },
    });
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

      <View className="mt-4">
        <Text className="text-black text-2xl font-bold text-center">
          Reset Pasword
        </Text>
        <Text className="text-gray-500 mt-2 text-center">
          Enter your email to receive reset instructions
        </Text>
      </View>

      {/* Email */}
      <Input
        name="email"
        control={control}
        label="Email"
        keyboardType="email"
        autoCapitalize="none"
        placeholder="example@email.com"
        containerClassName="mt-8"
      />

      {/* Continue */}
      <Button onPress={handleSubmit(onSubmit)} className="mt-8">
        Continue
      </Button>

      <View className="mt-6 items-center">
        <Link href="/auth/login">
          <Text className="text-primary font-medium">Back to login</Text>
        </Link>
      </View>
    </SafeAreaView>
  );
};

export default ForgotPasswordSendOtp;
