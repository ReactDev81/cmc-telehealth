import Input from "@/components/form/Input";
import TextArea from "@/components/form/TextArea";
import Button from "@/components/ui/Button";
import { useAuth } from "@/context/UserContext";
import { useContactUs } from "@/mutations/common/useContactUs";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Alert, View } from "react-native";
import * as z from "zod";


// Validation schema
const needHelpSchema = z.object({
  firstName: z
    .string()
    .min(1, "First name is required")
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name must not exceed 50 characters"),
  lastName: z
    .string()
    .min(1, "Last name is required")
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name must not exceed 50 characters"),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  message: z
    .string()
    .min(1, "Message is required")
    .min(10, "Message must be at least 10 characters")
    .max(500, "Message must not exceed 500 characters"),
});

type NeedHelpFormData = z.infer<typeof needHelpSchema>;

const NeedHelp = () => {
  // const { data, error, loading, fetchData } = useApi<{
  //   data: {};
  //   message?: string;
  // }>("post", `${process.env.EXPO_PUBLIC_API_BASE_URL}/contact-us`, {
  //   headers: {
  //     Authorization: `Bearer ${process.env.EXPO_PUBLIC_token}`,
  //     Accept: "application/json",
  //     "Content-Type": "multipart/form-data",
  //   },
  // });

  const { mutate: sendMessage, isPending } = useContactUs();
  const { user } = useAuth();
  const userId = user?.id || "";

  const methods = useForm<NeedHelpFormData>({
    resolver: zodResolver(needHelpSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: user?.email ?? "",
      message: "",
    },
    mode: "onBlur",
  });

  const { handleSubmit, reset } = methods;

  // const onSubmit = async (formData: NeedHelpFormData) => {
  //   try {
  //     const payload = new FormData();

  //     payload.append("first_name", formData.firstName);
  //     payload.append("last_name", formData.lastName);
  //     payload.append("email", formData.email);
  //     payload.append("message", formData.message);

  //     // Optional
  //     // payload.append("user_id", userId);

  //     await fetchData({
  //       data: payload,
  //     });

  //     Alert.alert("Success", data?.message, [
  //       { text: "OK", onPress: () => reset() },
  //     ]);
  //   } catch (error) {
  //     Alert.alert("Error", "Failed to send message.");
  //   }

  //   console.log("API Response:", data);
  // };

  const onSubmit = (formData: NeedHelpFormData) => {
    sendMessage(
      {
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: user?.email,
        message: formData.message,
        user_id: userId,
      },
      {
        onSuccess: (res) => {
          console.log("Response:", res);
          Alert.alert("Success", res.message);
          reset();
        },
        onError: (res) => {
          console.log("Response:", res);
          Alert.alert("Error", "Failed to send message");
        },
      }
    );
  };


  return (
    <View className="flex-1 bg-white p-5">
      <View className="mb-5">
        <Input
          name="firstName"
          control={methods.control}
          label="First Name"
          placeholder="Enter your first name"
          autoCapitalize="words"
        />
        <Input
          name="lastName"
          control={methods.control}
          label="Last Name"
          placeholder="Enter your last name"
          autoCapitalize="words"
          containerClassName="mt-5"
        />
        <View pointerEvents="none">
          <Input
            name="email"
            control={methods.control}
            label="Email"
            keyboardType="email-address"
            autoCapitalize="none"
            containerClassName="mt-5 opacity-40"
          />
        </View>
        <TextArea
          name="message"
          label="Message"
          placeholder="Please describe how we can help you..."
          containerClassName="mt-5"
          control={methods.control}
        />
      </View>

      <Button onPress={handleSubmit(onSubmit)}>Send Message</Button>
    </View>
  );
};

export default NeedHelp;
