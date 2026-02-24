import Input from "@/components/form/Input";
import ApiError from "@/components/ui/ApiError";
import Button from "@/components/ui/Button";
import { useSendForgotPasswordOtp } from "@/queries/useSendForgotPasswordOtp";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, router } from "expo-router";
import { useForm } from "react-hook-form";
import { Image, Text, View } from "react-native";
import { z } from "zod";
import FormLayout from "../formLayout";

const schema = z.object({
  email: z.string().email("Enter a valid email"),
});

const ForgotPasswordSendOtp = () => {
  const { mutate, isPending, isError, error } = useSendForgotPasswordOtp();
  // const { data, error, fetchData } = useApi<{
  //   message?: string;
  //   email: string;
  // }>("post", "/forgot-password/send-otp", {
  //   headers: {
  //     Accept: "application/json",
  //   },
  // });

  const { control, handleSubmit } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (formData: any) => {
    // const forgotPasswordData = {
    //   email: formData.email,
    // };

    mutate(
      { email: formData.email },
      {
        onSuccess: () => {
          router.push({
            pathname: "/auth/forgot-password-verify-otp",
            params: { email: formData.email },
          });
        },
      },
    );

    // await fetchData({ data: forgotPasswordData });

    // router.push({
    //   pathname: "/auth/forgot-password-verify-otp",
    //   params: { email: formData.email },
    // });
  };

  return (
    <FormLayout>
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
      <ApiError
        message={
          isError
            ? ((error as any)?.response?.data?.message ??
              (error as any)?.message ??
              "Something went wrong. Please try again.")
            : null
        }
      />
      <Button onPress={handleSubmit(onSubmit)} className="mt-4">
        Continue
      </Button>

      <View className="mt-6 items-center">
        <Link href="/auth/login">
          <Text className="text-primary font-medium">Back to login</Text>
        </Link>
      </View>
    </FormLayout>
  );
};

export default ForgotPasswordSendOtp;
