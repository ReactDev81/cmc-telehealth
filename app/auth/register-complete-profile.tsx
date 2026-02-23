import DateField from "@/components/form/date";
import Input from "@/components/form/Input";
import Button from "@/components/ui/Button";
import { useAuth } from "@/context/UserContext";
import { useCompleteProfile } from "@/mutations/useCompleteProfile";
import { User, UserRole } from "@/types/common/user-context";
import { zodResolver } from "@hookform/resolvers/zod";
import { router, useLocalSearchParams } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { Pressable, ScrollView, Text, View } from "react-native";
import { z } from "zod";
import FormLayout from "../formLayout";

const schema = z.object({
  first_name: z.string().min(1),
  last_name: z.string().min(1),
  date_of_birth: z.date(),
  mobile_no: z.string().min(8),
  gender: z.string(),
});

export default function RegisterCompleteProfile() {
  const { token } = useLocalSearchParams<{
    token?: string;
  }>();

  const { login } = useAuth();

  console.log("token", token);

  const { mutate: completeProfile, isPending } = useCompleteProfile();

  const { control, handleSubmit } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = (formData: any) => {
    const tokenStr = typeof token === "string" ? token : "";

    completeProfile(
      {
        payload: {
          date_of_birth: formData.date_of_birth.toISOString().split("T")[0],
          first_name: formData.first_name,
          last_name: formData.last_name,
          gender: formData.gender.toLowerCase(),
          mobile_no: formData.mobile_no,
        },
        token: tokenStr,
      },
      {
        onSuccess: async (data) => {
          console.log("Profile completed:", data);

          const role: UserRole = (data.user.role as UserRole) ?? "patient";

          const userData: User = {
            id: data.user.id,
            first_name: data.user.first_name,
            last_name: data.user.last_name,
            avatar: data.user.avatar,
            email: data.user.email,
            gender: data.user.gender,
            date_of_birth: data.user.date_of_birth,
            role,
            phone: data.user.phone,
            patient_id: data.user.patient_id ?? undefined,
            doctor_id: data.user.doctor_id ?? undefined,
            address: {
              address: data.user.address.address,
              area: data.user.address.area,
              city: data.user.address.city,
              landmark: data.user.address.landmark,
              pincode: data.user.address.pincode,
              state: data.user.address.state,
            },
          };

          await login(userData, tokenStr);
          router.replace("/(patient)");
        },
        onError: (error) => {
          console.log(error.response?.data);
        },
      },
    );
  };

  return (
    <FormLayout>
      <ScrollView showsVerticalScrollIndicator={false}>
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

        <Button
          onPress={handleSubmit(onSubmit)}
          disabled={isPending}
          className="mt-8"
        >
          {isPending ? "loading" : "Continue"}
        </Button>

        <Text className="text-base text-black-400 text-center mt-5 px-4">
          By providing your mobile number, you give us permission to contact you
          via text.
        </Text>
      </ScrollView>
    </FormLayout>
  );
}
