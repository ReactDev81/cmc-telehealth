import DateField from "@/components/form/date";
import Input from "@/components/form/Input";
import PasswordInput from "@/components/form/password";
import ApiError from "@/components/ui/ApiError";
import Button from "@/components/ui/Button";
import { useAuth } from "@/context/UserContext";
import { useCompleteProfile } from "@/mutations/useCompleteProfile";
import { User } from "@/types/common/user-context";
import { zodResolver } from "@hookform/resolvers/zod";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Pressable, Text, View } from "react-native";
import { z } from "zod";
import FormLayout from "../formLayout";

const schema = z.object({
  first_name: z.string().min(1),
  last_name: z.string().min(1),
  date_of_birth: z.date(),
  mobile_no: z.string().min(8),
  gender: z.string(),
  email: z.string().email(),
  password: z.string().min(8),
});

export default function RegisterCompleteProfile() {
  const { email } = useLocalSearchParams<{
    email?: string;
  }>();

  const { login } = useAuth();

  const { mutate: completeProfile, isPending } = useCompleteProfile();
  const [apiError, setApiError] = useState<string | null>(null);

  const { control, handleSubmit, reset } = useForm({
    resolver: zodResolver(schema),
  });

  // Prefill email once the route param is available
  useEffect(() => {
    if (email) {
      reset({ email: typeof email === "string" ? email : "" });
    }
  }, [email]);

  const onSubmit = (formData: any) => {
    setApiError(null);
    completeProfile(
      {
        payload: {
          date_of_birth: formData.date_of_birth.toISOString().split("T")[0],
          first_name: formData.first_name,
          last_name: formData.last_name,
          gender: formData.gender.toLowerCase(),
          mobile_no: formData.mobile_no,
          email: formData.email,
          password: formData.password,
        },
      },
      {
        onSuccess: async (data) => {

          console.log("data", data);

          const user = data.data;

          // API returns a single "name" field — split it
          const nameParts = (user.name ?? "").trim().split(" ");
          const first_name = nameParts[0] ?? "";
          const last_name = nameParts.slice(1).join(" ") || "";

          const userData: User = {
            id: user.id,
            first_name,
            last_name,
            avatar: user.avatar,
            email: user.email,
            gender: user.gender,
            date_of_birth: user.date_of_birth,
            role: "patient", // API doesn't return role; default to patient
            phone: user.phone,
            patient_id: user.patient_id ?? undefined,
            doctor_id: undefined, // API doesn't return doctor_id here
            status: user.status,
            address: {
              address: user.address?.address ?? null,
              area: user.address?.area ?? null,
              city: user.address?.city ?? null,
              landmark: user.address?.landmark ?? null,
              pincode: user.address?.pincode ?? null,
              state: user.address?.state ?? null,
            },
          };

          await login(userData, data.token);
          router.replace("/(patient)");
        },
        onError: (error) => {
          console.log(error.response?.data);
          const message =
            error.response?.data?.message ??
            error.message ??
            "Something went wrong. Please try again.";
          setApiError(message);
        },
      },
    );
  };

  return (
    <FormLayout>
      <View className="mt-10 mb-4">
        <Text className="text-black text-2xl font-semibold text-center">
          Basic Information
        </Text>
        <Text className="text-black-400 text-base mt-2 text-center max-w-80 mx-auto">
          Please tell us some basic information to complete your profile:
        </Text>
      </View>

      {/* First Name */}
      <Input
        name="first_name"
        control={control}
        label="First Name"
        placeholder="First Name"
        containerClassName="mt-5"
      />

      {/* Last Name */}
      <Input
        name="last_name"
        control={control}
        label="Last Name"
        placeholder="Last Name"
        containerClassName="mt-5"
      />

      {/* DOB */}
      <Controller
        control={control}
        name="date_of_birth"
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
        name="mobile_no"
        label="Phone Number"
        containerClassName="mt-5"
        control={control}
        placeholder="+234 (999) 000-0000"
        keyboardType="tel"
      />

      {/* Gender */}
      <View>
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
                  <Text
                    className={`text-center ${
                      value === g ? "text-white" : "text-primary"
                    }`}
                  >
                    {g}
                  </Text>
                </Pressable>
              ))}
            </View>
          )}
        />
      </View>

      <Input
        name="email"
        control={control}
        label="Email"
        placeholder="Email"
        containerClassName="mt-5"
        editable={false}
        keyboardType="email-address"
      />

      <PasswordInput
        name="password"
        control={control}
        label="Password"
        placeholder="Password"
        containerClassName="mt-5"
      />

      <ApiError message={apiError} />

      <Button
        onPress={handleSubmit(onSubmit)}
        disabled={isPending}
        className="mt-4"
      >
        {isPending ? "loading" : "Continue"}
      </Button>

      <Text className="text-base text-black-400 text-center mt-5 px-4">
        By providing your mobile number, you give us permission to contact you
        via text.
      </Text>
    </FormLayout>
  );
}
