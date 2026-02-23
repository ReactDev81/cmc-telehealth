import { useAuth } from "@/context/UserContext";
import { useChangePassword } from "@/queries/useChangePassword";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { Image, Text, View } from "react-native";
import { z } from "zod";
import PasswordInput from "../../components/form/password";
import Button from "../../components/ui/Button";
import FormLayout from "../formLayout";

const passwordSchema = z
  .object({
    old_password: z.string().min(1, "Old password is required"),
    new_password: z.string().min(8, "Password must be at least 8 characters"),
    new_password_confirmation: z
      .string()
      .min(1, "Please confirm your new password"),
  })
  .refine((data) => data.new_password === data.new_password_confirmation, {
    message: "Passwords do not match",
    path: ["new_password_confirmation"],
  });

type PasswordForm = z.infer<typeof passwordSchema>;

const ResetPassword = () => {
  const { logout, token } = useAuth();
  const { mutate, isPending } = useChangePassword();

  console.log("Token in Reset Password:", token);

  const { control, handleSubmit } = useForm<PasswordForm>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      old_password: "",
      new_password: "",
      new_password_confirmation: "",
    },
  });

  const onSubmit = (data: PasswordForm) => {
    mutate(data, {
      onSuccess: (response) => {
        logout();
        // console.log("Logout:", logout());
        console.log("SUCCESS:", response);
        router.replace("/auth/login");
      },
      onError: (error: any) => {
        console.log("ERROR:", error?.response?.data);
      },
    });
  };

  return (
    <FormLayout>
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
        {/* Old Password */}
        <Controller
          control={control}
          name="old_password"
          render={() => (
            <View>
              <PasswordInput
                name="old_password"
                control={control}
                label="Old Password"
                placeholder="Enter Old Password"
              />
            </View>
          )}
        />

        {/* New Password */}
        <Controller
          control={control}
          name="new_password"
          render={() => (
            <View className="mt-5">
              <PasswordInput
                name="new_password"
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
          name="new_password_confirmation"
          render={() => (
            <View className="mt-5">
              <PasswordInput
                name="new_password_confirmation"
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
        <Button onPress={handleSubmit(onSubmit)} disabled={isPending}>
          {isPending ? "Updating..." : "Change Password"}
        </Button>
      </View>
    </FormLayout>
  );
};

export default ResetPassword;
