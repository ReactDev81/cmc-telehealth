import TodayAppointmentCard from "@/components/doctor/appointment/today-appointment-card";
import UpcomingAppointmentCard from "@/components/doctor/appointment/upcoming-appointment-card";
import AppointmentStatusBox from "@/components/doctor/home/appointment-status-box";
import DoctorHomeHeader from "@/components/doctor/home/header";
import Testimonial from "@/components/patient/home/testimonial";
import Button from "@/components/ui/Button";
import EmptyState from "@/components/ui/EmptyState";
import Title from "@/components/ui/Title";
import TitleWithLink from "@/components/ui/title-with-link";
import { useAuth } from "@/context/UserContext";
import { useDoctorDashboard } from "@/queries/doctor/useDashboard";
import { useIsFocused } from "@react-navigation/native";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { CalendarClock, CalendarOff, Star } from "lucide-react-native";
import { useEffect } from "react";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

const Home = () => {

  const insets = useSafeAreaInsets();
  const isFocused = useIsFocused();
  const { token } = useAuth();
  // console.log("token: ", token)
  // console.log("🏥 Doctor Home Token:", token);

  const { data, isLoading, isError, refetch } = useDoctorDashboard(token!);

  // Refetch dashboard data when screen comes into focus
  useEffect(() => {
    if (isFocused && token) {
      refetch();
    }
  }, [isFocused, token]);

  if (isLoading)
    return (
      <SafeAreaView className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="primary" />
      </SafeAreaView>
    );
  if (isError)
    return (
      <SafeAreaView className="flex-1 items-center justify-center">
        <Text className="text-black">Error loading dashboard</Text>
      </SafeAreaView>
    );
  if (!data)
    return (
      <SafeAreaView className="flex-1 items-center justify-center">
        <Text className="text-black">No data available</Text>
      </SafeAreaView>
    );

  const summary = data.summary;
  const todays = data.todays_appointments;
  const upcoming = data.upcoming_appointments;
  const reviews = data.doctor_reviews;

  const appointmentStatusData = [
    {
      id: 1,
      status: "today" as const,
      status_count: summary.todays_appointments,
    },
    {
      id: 2,
      status: "upcoming" as const,
      status_count: summary.upcoming_appointments,
    },
    {
      id: 3,
      status: "cancelled" as const,
      status_count: summary.cancelled_appointments,
    },
  ];

  return (
    <View className="flex-1 bg-white">
      {isFocused && <StatusBar style="light" />}

      <DoctorHomeHeader insets={insets} />

      <ScrollView showsVerticalScrollIndicator={false} className="flex-1 p-5">
        {/* appointment status */}
        <View className="flex-row items-center gap-x-3">
          {appointmentStatusData.map((AppointmentStatus) => {
            // Map status to the appropriate tab key
            const getTabKey = () => {
              if (AppointmentStatus.status === "today") return "today";
              if (AppointmentStatus.status === "upcoming") return "upcoming";
              if (AppointmentStatus.status === "cancelled") return "upcoming";
              return "today";
            };

            return (
              <AppointmentStatusBox
                key={AppointmentStatus.id}
                status={AppointmentStatus.status}
                status_count={AppointmentStatus.status_count}
                onPress={() => router.push(`/appointments?tab=${getTabKey()}`)}
              />
            );
          })}
        </View>

        {/* today's appointment */}
        <View className="mt-7">
          <TitleWithLink
            title_text="Today's Appointments"
            link="/appointments?tab=today"
            link_text="See All"
          />
          {todays && todays.length === 0 ? (
            <EmptyState
              title="No Appointments Today"
              message="You don't have any appointments scheduled for today."
              icon={<CalendarOff size={44} color="#94A3B8" />}
            />
          ) : (
            todays.slice(0, 2).map((item) => (
              <View key={item.id} className="mt-5">
                <TodayAppointmentCard
                  appointmentId={item.id}
                  image={item.patient_image}
                  name={item.patient_name}
                  time={item.time}
                  mode={item.consultation_type}
                  date={item.date}
                  call_now={item.call_now}
                />
              </View>
            ))
          )}
        </View>

        {/* upcoming appointment */}
        <View className="mt-7">
          <TitleWithLink
            title_text="Upcoming Appointments"
            link="/appointments?tab=upcoming"
            link_text="See All"
          />
          {upcoming && upcoming.length === 0 ? (
            <EmptyState
              title="No Upcoming Appointments"
              message="Your schedule is clear. No future appointments found."
              icon={<CalendarClock size={44} color="#94A3B8" />}
            />
          ) : (
            upcoming.slice(0, 2).map((item) => (
              <View key={item.id} className="mt-5">
                <UpcomingAppointmentCard
                  image={item.patient_image}
                  date={item.date!}
                  time={item.time}
                  name={item.patient_name}
                  mode={item.consultation_type}
                  appointmentId={item.id}
                  status={item.status}
                />
              </View>
            ))
          )}
        </View>

        <View className="px-2 pb-20">
          {/* Testimonial */}
          <View className="mt-7">
            <Title text="Here's what our satisfied customers are saying..." />
            {reviews && reviews.length === 0 ? (
                <EmptyState
                  title="No Feedbacks"
                  message="You don't have any feedbacks yet."
                  icon={<Star size={44} color="#94A3B8" />}
                  className="mt-5 rounded-2xl border border-gray-100"
                />
              ) : (
                  <>
                      <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        className="mt-3"
                        contentContainerStyle={{
                          gap: 15,
                          paddingRight: 20,
                          flexGrow: 1,
                          justifyContent:
                            reviews && reviews.length === 0 ? "center" : "flex-start",
                        }}
                      >
                    
                      {reviews.map((review) => (
                        <Testimonial
                          key={review.id}
                          patient_id={review.id}
                          patient_name={review.patient_name}
                          patient_image={review.patient_image}
                          patient_age={String(review.patient_age ?? "")}
                          patient_location={review.patient_location ?? ""}
                          days_ago={review.created_at}
                          title={review.title}
                          content={review.content}
                          rating={review.rating}
                          total_reviews={String(review.total_reviews)}
                          doctor_name={review.doctor_name}
                        />
                      ))}
                    
                  </ScrollView>
                  <Button className="mt-5" onPress={() => router.push("/feedbacks")}>
                    View All Feedbacks
                  </Button>
                </>
              )
            }
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default Home;
