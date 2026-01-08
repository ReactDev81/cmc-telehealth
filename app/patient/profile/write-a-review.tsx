import Input from "@/components/form/Input";
import TextArea from "@/components/form/TextArea";
import Button from "@/components/ui/Button";
import useApi from "@/hooks/useApi";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocalSearchParams } from "expo-router";
import { Star } from "lucide-react-native";
import { useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { Image, Modal, Text, TouchableOpacity, View } from "react-native";
import * as z from "zod";

// Validation schema
const reviewSchema = z.object({
  rating: z
    .number()
    .min(1, "Please select a rating")
    .max(5, "Rating must be between 1 and 5"),
  title: z
    .string()
    .min(1, "Title is required")
    .max(100, "Title must not exceed 100 characters"),
  review: z
    .string()
    .min(1, "Review is required")
    .min(10, "Review must be at least 10 characters")
    .max(500, "Review must not exceed 500 characters"),
});

type ReviewFormData = z.infer<typeof reviewSchema>;

const WriteAReview = () => {
  // Get doctor ID and name from route params
  const { doctorName } = useLocalSearchParams<{
    doctorId: string;
    doctorName: string;
  }>();

  // Static doctor ID
  const doctorId = process.env.EXPO_PUBLIC_DOCTOR_ID;

  const methods = useForm<ReviewFormData>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      rating: 0,
      title: "",
      review: "",
    },
    mode: "onSubmit",
  });

  const { data, error, loading, fetchData } = useApi<{
    data: {};
    message?: string;
  }>("post", `${process.env.EXPO_PUBLIC_API_BASE_URL}/reviews`, {
    headers: {
      Authorization: `Bearer ${process.env.EXPO_PUBLIC_token}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });

  const { handleSubmit, control, setValue, watch, reset } = methods;

  const rating = watch("rating");
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleRating = (value: number) => {
    setValue("rating", value, { shouldValidate: true });
  };

  const onSubmit = async (formData: ReviewFormData) => {
    // try {
    const review = {
      doctor_user_id: doctorId, // Send as string for UUID
      title: formData.title,
      content: formData.review,
      rating: formData.rating,
    };

    await fetchData({ data: review });
    console.log("Submitted formData Data:", formData);
    reset();
  };

  const closeModal = () => {
    setShowSuccessModal(false);
    reset();
  };

  const handleCancel = () => {
    reset();
  };

  return (
    <FormProvider {...methods}>
      <View className="flex-1 bg-white p-5">
        <View className="max-w-52 w-full mx-auto">
          <Image
            source={require("../../../assets/images/female-doctor.png")}
            className="w-24 h-24 mx-auto"
          />
          <Text className="text-base font-medium text-center mt-3">
            How was your experience with {doctorName || "the doctor"}?
          </Text>

          {/* Star Rating */}
          <Controller
            control={methods.control}
            name="rating"
            render={({ fieldState: { error } }) => (
              <View>
                <View className="flex-row justify-center gap-x-2 mt-5">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <TouchableOpacity
                      key={value}
                      onPress={() => handleRating(value)}
                      activeOpacity={1}
                    >
                      <Star
                        size={24}
                        color={value <= rating ? "#013220" : "#013220"}
                        fill={value <= rating ? "#013220" : "transparent"}
                        strokeWidth={1}
                        className="mx-1"
                      />
                    </TouchableOpacity>
                  ))}
                </View>
                {error && (
                  <Text className="text-red-500 text-xs text-center mt-2">
                    {error.message}
                  </Text>
                )}
              </View>
            )}
          />
        </View>

        <View className="mt-14">
          <Input
            name="title"
            control={control}
            label="Title"
            placeholder="Enter review title..."
            autoCapitalize="words"
            containerClassName="mt-5"
          />

          <TextArea
            name="review"
            label="Write Your Review"
            placeholder="Share your experience with the doctor..."
            control={control}
            containerClassName="mt-5"
          />

          <View className="flex-row items-center gap-x-4 mt-3">
            <Button
              variant="outline"
              className="[&]:px-8"
              onPress={handleCancel}
            >
              Cancel
            </Button>
            <Button
              className="[&]:px-8"
              onPress={handleSubmit(onSubmit)}
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit"}
            </Button>
          </View>
        </View>

        {/* Success Modal */}
        <Modal
          visible={showSuccessModal}
          transparent
          animationType="fade"
          onRequestClose={closeModal}
        >
          <View className="flex-1 bg-black/60 justify-center items-center px-5">
            <View className="bg-white rounded-xl p-8 w-full max-w-sm items-center">
              <View className="w-14 h-14 items-center justify-center rounded-full bg-primary-100">
                <Star size={24} color="#013220" fill="#013220" />
              </View>
              <Text className="text-lg font-semibold text-black mt-5">
                Review Successful!
              </Text>
              <Text className="text-base text-black-400 text-center mt-2">
                Your review has been successfully submitted. Thank you very
                much!
              </Text>
              <Button className="mt-6 px-6" onPress={closeModal}>
                Done
              </Button>
            </View>
          </View>
        </Modal>
      </View>
    </FormProvider>
  );
};

export default WriteAReview;
