import { useState } from "react"
import { View, Text, Image, TouchableOpacity, Modal } from "react-native"
import { Star } from "lucide-react-native"
import { useForm, FormProvider, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import TextArea from "@/components/form/TextArea"
import RadioButton from "@/components/form/radio-button"
import Button from "@/components/ui/Button"

// Validation schema
const reviewSchema = z.object({
    rating: z.number()
        .min(1, 'Please select a rating')
        .max(5, 'Rating must be between 1 and 5'),
    review: z.string()
        .min(1, 'Review is required')
        .min(10, 'Review must be at least 10 characters')
        .max(500, 'Review must not exceed 500 characters'),
    recommend: z.enum(['yes', 'no'], {
        required_error: 'Please select whether you would recommend',
    }),
});

type ReviewFormData = z.infer<typeof reviewSchema>;

const WriteAReview = () => {

    const methods = useForm<ReviewFormData>({
        resolver: zodResolver(reviewSchema),
        defaultValues: {
            rating: 0,
            review: '',
            recommend: 'yes',
        },
        mode: 'onSubmit',
    });

    const { handleSubmit, control, setValue, watch, formState: { errors }, reset } = methods;

    const rating = watch('rating');
    const recommend = watch('recommend');
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const Options = [
        { value: 'yes', label: 'Yes' },
        { value: 'no', label: 'No' },
    ];

    const handleRating = (value: number) => {
        setValue('rating', value, { shouldValidate: true });
    };

    const onSubmit = (data: ReviewFormData) => {
        console.log('Review Data:', data);
        setShowSuccessModal(true);
    };

    const closeModal = () => {
        setShowSuccessModal(false);
        reset();
    };

    const handleCancel = () => {
        reset();
    };

    return(
        <FormProvider {...methods}>
            <View className="flex-1 bg-white p-5">
                <View className="max-w-52 w-full mx-auto">
                    <Image 
                        source={require('../../assets/images/doctor.png')}
                        className="w-24 h-24 mx-auto"
                    />
                    <Text className="text-base font-medium text-center mt-3">
                        How was your experience with Dr. Marcus Horiz?
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
                    <TextArea 
                        name="review"
                        label="Write Your Review"
                        placeholder="Share your experience with the doctor..."
                        control={control}
                    />

                    <RadioButton
                        name="recommend"
                        label="Would you recommend Dr. Marcus Horiz to your friends?" 
                        options={Options}
                        value={recommend}
                        onChange={(value) => setValue('recommend', value as 'yes' | 'no' , { shouldValidate: true })}
                        direction="horizontal"
                        className="mt-5"
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
                        >
                            Submit
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
                                Your review has been successfully submitted. Thank you very much!
                            </Text>
                            <Button className="mt-6 px-6" onPress={closeModal}>
                                Done
                            </Button>
                        </View>
                    </View>
                </Modal>
                
            </View>
        </FormProvider>
    )
}

export default WriteAReview