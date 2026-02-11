import Checkbox from "@/components/form/checkbox";
import Input from "@/components/form/Input";
import PasswordInput from "@/components/form/password";
import Button from "@/components/ui/Button";
import useApi from "@/hooks/useApi";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, router } from "expo-router";
import { X } from 'lucide-react-native';
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Image, Modal, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { z } from "zod";
import PrivacyPolicy from "../common-screens/profile/privacy-policy";
import TermAndCondition from "../common-screens/profile/term-condition";

const schema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "Minimum 8 characters"),
  agreedToTerms: z.boolean().refine((val) => val === true, {
    message: "You must accept terms",
  }),
});

export default function RegisterSendOtp() {

  const { data, error, fetchData } = useApi<{ 
    data: {
      email: string;
      password: string;
      agreedToTerms: boolean;
    };
    message?: string;
  }>("post", '/register', {
    headers: {
      Accept: "application/json",
    },
  });

  const [submittedForm, setSubmittedForm] = useState<any>(null);
  const [openPrivacy, setOpenPrivacy] = useState(false);
  const [openTerm, setOpenTerm] = useState(false);

  const { control, handleSubmit, watch } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
      password: "",
      agreedToTerms: false,
    },
  });

  // --- Password Strength ---
  const renderPasswordStrength = (password: string) => {
    const strength = password.length;
    const bars = Array.from({ length: 4 }, (_, i) => (
      <View
        key={i}
        className={`h-1 flex-1 mx-0.5 rounded ${
          i < strength / 2 ? "bg-primary" : "bg-gray-200"
        }`}
      />
    ));

    return (
      <View className="mt-2">
        <Text className="text-xs text-gray-600 mb-1">Password strength:</Text>
        <View className="flex-row">{bars}</View>
      </View>
    );
  };

  const onSubmit = async (formData: any) => {
    // console.log("Form Submitted:", formData);

    const register = {
      email: formData.email,
      password: formData.password,
      agreedToTerms: formData.agreedToTerms,
    };

    setSubmittedForm(formData);
    await fetchData({ data: register });
  };

  useEffect(() => {
    if (data && submittedForm) {
      console.log("API Response:", data);

      router.push({
        pathname: "/auth/register-verify-otp",
        params: {
          email: submittedForm.email,
          password: submittedForm.password,
        },
      });
    }
  }, [data, submittedForm]);

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

      {/* Password */}
      <Controller
        control={control}
        name="password"
        render={() => (
          <View className="mt-5">
            <PasswordInput
              name="password"
              control={control}
              placeholder="8 characters minimum"
            />
            {watch("password") && renderPasswordStrength(watch("password"))}
          </View>
        )}
      />

      {/* Terms */}
      <View className="mt-3">
        <Checkbox
          name="agreedToTerms"
          control={control}
          labelComponent={
            <View className="flex-1">
              <Text className="text-gray-600 text-sm">
                By clicking "Continue", you agree to accept our{" "}
                <Text
                  className="text-primary font-medium"
                  onPress={() => setOpenPrivacy(true)}
                >
                  Privacy Policy
                </Text>{" "}
                and{" "}
                <Text
                  className="text-primary font-medium"
                  onPress={() => setOpenTerm(true)}
                >
                  Terms of Service
                </Text>
              </Text>
            </View>
          }
        />
      </View>


      {/* Continue */}
      <Button onPress={handleSubmit(onSubmit)} className="mt-8">
        Continue
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
                <Pressable className="absolute top-2.5 right-2.5 z-10" onPress={() => setOpenPrivacy(false)}>
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
                <Pressable className="absolute top-2.5 right-2.5 z-10" onPress={() => setOpenTerm(false)}>
                  <X color="#4D4D4D" />
                </Pressable>
                <TermAndCondition />
            </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}
