import Testimonial from "@/components/patient/home/testimonial";
import { useAuth } from "@/context/UserContext";
import { useReviews } from "@/queries/doctor/useReviews";
import { Review } from "@/types/live/doctor/feedback";
import { ActivityIndicator, FlatList, Text, View } from "react-native";

const Feedback = () => {

    const { token } = useAuth();
    const { data, isLoading, isError } = useReviews(token);

    if (isLoading) return <View className="items-center justify-center">
        <ActivityIndicator color="#013220" />
    </View>;
    if (isError) return <Text className="text-red-500">Error loading reviews</Text>;

    const reviews = data?.reviews ?? [];

    const renderItem = ({ item }: { item: Review }) => {
        return (
            <Testimonial
                className="max-w-full mb-5"
                patient_image={item.patient_image}
                patient_name={item.patient_name}
                patient_age={item.patient_age}
                patient_location={item.patient_location}
                title={item.title}
                content={item.content}
                total_reviews={item.total_reviews}
                doctor_name={item.doctor_name}
                doctor_avatar={item.doctor_avatar}
                days_ago={item.created_at}
            />
        );
    };

    return (
        <View className="flex-1 bg-white p-5">
            <FlatList
                data={reviews}
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()}
            />
        </View>
    );
}

export default Feedback;