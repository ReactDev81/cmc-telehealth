import TodayAppointmentCard from "@/components/doctor/appointment/today-appointment-card";
import UpcomingAppointmentCard from "@/components/doctor/appointment/upcoming-appointment-card";
import AppointementStatusBox from "@/components/doctor/home/appointement-status-box";
import DoctorHomeHeader from "@/components/doctor/home/header";
import Testimonial from "@/components/patient/home/testimonial";
import Button from "@/components/ui/Button";
import Title from "@/components/ui/Title";
import TitleWithLink from "@/components/ui/title-with-link";
import { useAuth } from "@/context/UserContext";
import { useDoctorDashboard } from "@/queries/doctor/useDashboard";
import { useIsFocused } from "@react-navigation/native";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

const Home = () => {
    const insets = useSafeAreaInsets();
    const isFocused = useIsFocused();

    const { token } = useAuth();
    // console.log("token: ", token)
    // console.log("🏥 Doctor Home Token:", token);

    const { data, isLoading, isError } = useDoctorDashboard(token!);

    if (isLoading) return <SafeAreaView className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="primary" />
    </SafeAreaView>;
    if (isError) return <SafeAreaView className="flex-1 items-center justify-center">
        <Text className="text-black">Error loading dashboard</Text>
    </SafeAreaView>;
    if (!data) return <SafeAreaView className="flex-1 items-center justify-center">
        <Text className="text-black">No data available</Text>
    </SafeAreaView>;

    const summary = data.summary;
    const todays = data.todays_appointments;
    const upcoming = data.upcoming_appointments;
    // console.log("upcomming: ", upcoming)
    const reviews = data.doctor_reviews;

    // if (todays.length === 0) {
    //     return <Text>No appointments today</Text>;
    // }

    const appointmentStatusData = [
        {
            id: 1,
            status: 'completed' as const,
            status_count: summary.todays_appointments,
        },
        {
            id: 2,
            status: 'upcoming' as const,
            status_count: summary.upcoming_appointments,
        },
        {
            id: 3,
            status: 'cancelled' as const,
            status_count: summary.cancelled_appointments,
        },
    ];

    return (
        <View className="flex-1 bg-white">
            {isFocused && <StatusBar style="light" />}

            <DoctorHomeHeader insets={insets} />

            <ScrollView showsVerticalScrollIndicator={false} className="flex-1 p-5">
                {/* appointement status */}
                <View className="flex-row items-center gap-x-3">
                    {appointmentStatusData.map((AppointementStatus) => {
                        return (
                            <AppointementStatusBox
                                key={AppointementStatus.id}
                                status={AppointementStatus.status}
                                status_count={AppointementStatus.status_count}
                            />
                        );
                    })}
                </View>

                {/* today's appointement */}
                <View className="mt-7">
                    <TitleWithLink
                        title_text="Today's Appointments"
                        link="/appointments"
                        link_text="See All"
                    />
                    {todays.length === 0 ? (
                        <Text className="text-center text-gray-500 mt-5">No appointments today</Text>
                    ) : (
                        todays.slice(0, 2).map((item) => (
                            <View key={item.id} className="mt-5">
                                <TodayAppointmentCard
                                    appointmentId={item.id}
                                    image={item.patient_image}
                                    name={item.patient_name}
                                    time={item.time}
                                    mode={item.consultation_type}
                                />
                            </View>
                        ))
                    )}
                </View>

                {/* today's appointement */}
                <View className="mt-7">
                    <TitleWithLink
                        title_text="Upcoming Appointments"
                        link="/appointments"
                        link_text="See All"
                    />
                    {upcoming.slice(0, 2).map((item) => (
                        <View key={item.id} className="mt-5">
                            <UpcomingAppointmentCard
                                image={item.patient_image}
                                date={item.date!}
                                time={item.time}
                                name={item.patient_name}
                                mode={item.consultation_type}
                                status="Scheduled"
                            />
                        </View>
                    ))}
                </View>

                <View className="px-2 pb-20">
                    {/* Testimonial */}
                    <View className="mt-7">
                        <Title text="Here's what our satisfied customers are saying..." />
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            className="mt-3"
                            contentContainerStyle={{ gap: 15, paddingRight: 0 }}
                        >
                            {/* {TestimonialData.map((testimonial, id) => {
                                // Parse review_count to extract total_reviews and doctor_name
                                // Format: "137+ Reviews for Dr. Ananya Sharma"
                                const reviewMatch = testimonial.review_count.match(/^(\d+\+)\s+Reviews\s+for\s+(.+)$/);
                                const total_reviews = reviewMatch ? reviewMatch[1] : testimonial.review_count;
                                const doctor_name = reviewMatch ? reviewMatch[2] : "";

                                return (
                                    <Testimonial
                                        key={id}
                                        patient_id={String(testimonial.id || id)}
                                        doctor_id=""
                                        patient_image={testimonial.image}
                                        patient_name={testimonial.name}
                                        patient_age={testimonial.age}
                                        title={testimonial.title}
                                        content={testimonial.description}
                                        rating={5}
                                        is_active={true}
                                        is_featured={true}
                                        slug={`testimonial-${testimonial.id || id}`}
                                        total_reviews={total_reviews}
                                        doctor_name={doctor_name}
                                    />
                                )
                            })} */}
                            {reviews.map((review) => (
                                <Testimonial
                                    key={review.id}
                                    patient_id={review.id}
                                    patient_name={review.patient_name}
                                    patient_image={review.patient_image}
                                    patient_age={review.patient_age ?? ""}
                                    title={review.title}
                                    content={review.content}
                                    rating={review.rating}
                                    total_reviews={review.total_reviews}
                                    doctor_name={review.doctor_name}
                                />
                            ))}
                        </ScrollView>
                        <Button className="mt-5" onPress={() => router.push("/feedbacks")}>
                            View All Feedbacks
                        </Button>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
};

export default Home;
