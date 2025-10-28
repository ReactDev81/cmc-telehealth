import { useState } from "react"
import { View, Text, Image, TouchableOpacity } from "react-native"
import { Star } from "lucide-react-native";
import TextArea from "@/components/form/TextArea"
import RadioButton from "@/components/form/radio-button"
import Button from "@/components/ui/Button"

const WriteAReview = () => {

    const Options = [
        { value: 'yes', label: 'Yes' },
        { value: 'no', label: 'No' },
    ];

    const [recommend, setRecommend] = useState('yes');
    const [rating, setRating] = useState<number>(0);

    const handleRating = (value: number) => {
        setRating(value);
    };

    return(
        <View className="flex-1 bg-white p-5">

            <View className="max-w-52 w-full mx-auto">
                <Image 
                    source={require('../assets/images/doctor.png')}
                    className="w-24 h-24 mx-auto"
                />
                <Text className="text-base font-medium text-center mt-3">How was your experience with Dr. Marcus Horiz?</Text>

                {/* Star Rating */}
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
            </View>

            <View className="mt-14">
                <TextArea 
                    label="Write Your Review"
                />
                <RadioButton
                    name="recommend"
                    label="Would you recommend Dr. Marcus Horiz to your friends?" 
                    options={Options}
                    value={recommend}
                    onChange={setRecommend}
                    direction="horizontal"
                    className="mt-5"
                />

                <View className="flex-row items-center gap-x-4 mt-3">
                    <Button variant="outline" className="[&]:px-8">Cancel</Button>
                    <Button className="[&]:px-8">Submit</Button>
                </View>
            </View>

        </View>
    )
}

export default WriteAReview