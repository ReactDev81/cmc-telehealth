import Input from "@/components/form/Input";
import TextArea from "@/components/form/TextArea";
import SelectField from "@/components/form/selectField";
import Button from "@/components/ui/Button";
import { useAuth } from "@/context/UserContext";
import { useContactUs } from "@/mutations/common/useContactUs";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle, XCircle } from "lucide-react-native";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Modal, Pressable, Text, View } from "react-native";
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
  subject: z.string().min(1, "Subject is required"),
  message: z
    .string()
    .min(1, "Message is required")
    .min(10, "Message must be at least 10 characters")
    .max(500, "Message must not exceed 500 characters"),
});

type NeedHelpFormData = z.infer<typeof needHelpSchema>;

type FeedbackModal = {
  visible: boolean;
  type: "success" | "error";
  message: string;
};

const NeedHelp = () => {
  const { mutate: sendMessage, isPending } = useContactUs();
  const { user } = useAuth();
  const userId = user?.id || "";

  const [feedback, setFeedback] = useState<FeedbackModal>({
    visible: false,
    type: "success",
    message: "",
  });

  const methods = useForm<NeedHelpFormData>({
    resolver: zodResolver(needHelpSchema),
    defaultValues: {
      firstName: user?.first_name,
      lastName: user?.last_name,
      email: user?.email ?? "",
      subject: "",
      message: "",
    },
    mode: "onBlur",
  });

  const { handleSubmit, reset } = methods;

  const onSubmit = (formData: NeedHelpFormData) => {
    sendMessage(
      {
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: user?.email,
        subject: formData.subject,
        message: formData.message,
        user_id: userId,
      },
      {
        onSuccess: (res) => {
          setFeedback({
            visible: true,
            type: "success",
            message: res.message || "Your message has been sent successfully!",
          });
          reset();
        },
        onError: (res) => {
          setFeedback({
            visible: true,
            type: "error",
            message: res?.message || "Something went wrong. Please try again.",
          });
        },
      },
    );
  };

  const isSuccess = feedback.type === "success";

  return (
    <View className="flex-1 bg-white p-5">
      {/* Feedback Modal */}
      <Modal
        visible={feedback.visible}
        transparent
        animationType="fade"
        onRequestClose={() => setFeedback((f) => ({ ...f, visible: false }))}
      >
        <View className="flex-1 items-center justify-center bg-black/50 px-6">
          <View className="bg-white w-full max-w-sm rounded-2xl p-6 items-center shadow-xl">
            {isSuccess ? (
              <CheckCircle size={56} color="#16a34a" strokeWidth={1.5} />
            ) : (
              <XCircle size={56} color="#dc2626" strokeWidth={1.5} />
            )}
            <Text className="text-xl font-semibold text-black mt-4 text-center">
              {isSuccess ? "Message Sent!" : "Something Went Wrong"}
            </Text>
            <Text className="text-black-400 text-sm mt-2 text-center leading-5">
              {feedback.message}
            </Text>
            <Pressable
              onPress={() => setFeedback((f) => ({ ...f, visible: false }))}
              className="mt-6 w-full bg-primary rounded-xl py-3 items-center"
            >
              <Text className="text-white font-semibold text-base">OK</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      <View className="mb-5">
        <View pointerEvents="none">
          <Input
            name="firstName"
            control={methods.control}
            label="First Name"
            placeholder="Enter your first name"
            autoCapitalize="words"
            containerClassName="opacity-40"
          />
        </View>
        <View pointerEvents="none">
          <Input
            name="lastName"
            control={methods.control}
            label="Last Name"
            placeholder="Enter your last name"
            autoCapitalize="words"
            containerClassName="mt-5 opacity-40"
          />
        </View>
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
        <SelectField
          name="subject"
          label="Subject"
          control={methods.control}
          placeholder="Select a subject"
          className="mt-5 !text-sm"
          options={[
            { label: "General Inquiry", value: "General Inquiry" },
            { label: "Technical Support", value: "Technical Support" },
            { label: "Feedback", value: "Feedback" },
          ]}
        />
        <TextArea
          name="message"
          label="Message"
          placeholder="Please describe how we can help you..."
          containerClassName="mt-5"
          control={methods.control}
        />
      </View>

      <Button onPress={handleSubmit(onSubmit)} disabled={isPending}>
        {isPending ? "Sending..." : "Send Message"}
      </Button>
    </View>
  );
};

export default NeedHelp;
