import AvailableDoctors from "@/components/patient/home/available-doctors";
import ConsultationTypeCard from "@/components/patient/home/consulation-type-card";
import Header from "@/components/patient/home/header";
import SpecialityCard from "@/components/patient/home/speciality-card";
import Testimonial from "@/components/patient/home/testimonial";
import { useAuth } from "@/context/UserContext";
import { usePatientHome } from "@/queries/patient/usePatientHome";
import { htmlToReadableText } from "@/utils/html";
import { useIsFocused } from "@react-navigation/native";
import { Link, router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ActivityIndicator, Image, ScrollView, Text, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import Button from "../../components/ui/Button";
import Title from "../../components/ui/Title";
import TitleWithLink from "../../components/ui/title-with-link";


const Home = () => {

  const insets = useSafeAreaInsets();
  const isFocused = useIsFocused();
  const { token } = useAuth();

  const { data, isLoading, isError, error } = usePatientHome(!!token);

  const homeData = data?.data;
  const specialities = homeData?.speciality_symptoms || [];

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#000000" />
      </SafeAreaView>
    );
  }

  if (isError) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-white">
        <Text className="text-black">Error loading home</Text>
      </SafeAreaView>
    );
  }

  // console.log("Home Data:", homeData?.available_doctors);

  return (
    <View className="flex-1 bg-white">

      {isFocused && <StatusBar style="light" translucent />}

      <Header insets={insets} />

      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        <View className="px-4 py-5">

          {/* Consultation Type */}
          <View className="flex flex-row gap-x-2.5">
            <View className="flex-1">
              <ConsultationTypeCard
                link="/(patient)/doctors"
                image={require("../../assets/images/video-consultation.png")}
                text="Instant Video Consultation"
              />
            </View>
            <View className="flex-1">
              <ConsultationTypeCard
                link="/(patient)/doctors"
                image={require("../../assets/images/clinic-appointment.png")}
                text="Book In-Clinic Appointment"
              />
            </View>
          </View>

          {/* Speciality */}
          <View className="mt-7">
            <TitleWithLink
              title_text="Find Doctor by Speciality"
              link="/patient/find-doctor"
              link_text="See All"
            />
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              className="mt-5"
              contentContainerStyle={{ gap: 20, paddingRight: 0 }}
            >
              {specialities ? (
                specialities.map((speciality, id) => {
                  return (
                    <SpecialityCard
                      key={id}
                      speciality={speciality.department.name}
                      link="/doctors"
                      image={speciality?.department?.icon}
                    />
                  );
                })
              ) : (
                <Text>No specialities available</Text>
              )}
            </ScrollView>
          </View>

          {/* Available Doctors */}
          <View className="mt-7">
            <TitleWithLink
              title_text="Available Doctors"
              link="/doctors"
              link_text="See All"
            />
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: 15, paddingRight: 0 }}
            >
              {homeData?.available_doctors ? (
                homeData?.available_doctors.map((availableDoctors) => {
                  return (
                    <AvailableDoctors
                      key={availableDoctors.id}
                      id={availableDoctors.id}
                      avatar={availableDoctors.avatar}
                      name={availableDoctors.name}
                      speciality={availableDoctors.speciality}
                      rating={availableDoctors.rating}
                      consultation_type={availableDoctors.consultation_type}
                      consultation_fee={availableDoctors.consultation_fee}
                      years_experience={availableDoctors.years_experience}
                    />
                  );
                })
              ) : (
                <Text>No doctors available</Text>
              )}
            </ScrollView>
          </View>
        </View>

        {/* Article */}
        <View className="px-4 py-5 bg-primary">
          <Title text="Safe & Advanced Surgical Care" className="text-white" />
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="mt-3"
            contentContainerStyle={{ gap: 15, paddingRight: 0 }}
          >
            {homeData?.advertisements ? (
              homeData.advertisements.map((article, id) => {
                return (
                  <View
                    key={id}
                    className="p-4 bg-white rounded-xl w-[300px] flex-row items-center justify-between"
                  >
                    {/* Left Content */}
                    <View className="flex-1 pr-3">
                      <Link href={article.link}>
                        <Image
                          className="h-[160px] w-[300px] rounded-xl object-cover"
                          // resizeMode="cover"
                          source={{ uri: article.image }}
                        />
                      </Link>
                    </View>
                  </View>
                );
              })
            ) : (
              <Text>No articles available</Text>
            )}
          </ScrollView>
        </View>

        <View className="px-4 pb-10">
          {/* Testimonial */}
          <View className="mt-7">
            <Title text="Here's what our satisfied customers are saying..." />
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              className="mt-3"
              contentContainerStyle={{ gap: 15, paddingRight: 0 }}
            >
              {homeData?.patient_reviews ? (
                homeData.patient_reviews.map((testimonial, index) => (
                  <Testimonial
                    key={index}
                    patient_id={testimonial.patient_id}
                    doctor_id={testimonial.doctor_id}
                    patient_image={testimonial.patient_image}
                    patient_name={testimonial.patient_name}
                    patient_age={testimonial.patient_age}
                    patient_location={testimonial.patient_location}
                    days_ago={testimonial.created_at}
                    title={testimonial.title}
                    content={htmlToReadableText(testimonial.content)}
                    total_reviews={testimonial.total_reviews}
                    doctor_name={testimonial.doctor_name}
                    rating={testimonial.rating}
                    is_active={testimonial.is_active}
                    is_featured={testimonial.is_featured}
                    slug={testimonial.slug}
                  />
                ))
              ) : (
                <Text>No testimonials available</Text>
              )}
            </ScrollView>
            <Button
              className="mt-5"
              onPress={() => router.push("/patient/all-testimonials" as any)}
            >
              View All Testimonial
            </Button>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default Home;
