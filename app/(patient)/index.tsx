import AvailableDoctors from "@/components/patient/home/available-doctors";
import ConsultationTypeCard from "@/components/patient/home/consulation-type-card";
import Header from "@/components/patient/home/header";
import SpecialityCard from "@/components/patient/home/speciality-card";
import Testimonial from "@/components/patient/home/testimonial";
import { useIsFocused } from "@react-navigation/native";
import { Link, router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Image, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Button from "../../components/ui/Button";
import Title from "../../components/ui/Title";
import TitleWithLink from "../../components/ui/title-with-link";

// json data
import useAxios from "@/hooks/useApi";
import {
  AdvertisementProps,
  SpecialityProps,
  TestimonialProps,
} from "@/types/live/patient/home";
import { AvailableDoctorsProps } from "@/types/patient/home";
import { useEffect } from "react";

const Home = () => {
  const insets = useSafeAreaInsets();
  const isFocused = useIsFocused();

  const { data, error, loading, fetchData } = useAxios<{
    data: {
      available_doctors: AvailableDoctorsProps[];
      advertisements?: AdvertisementProps[];
      patient_reviews?: TestimonialProps[];
      speciality_symptoms?: SpecialityProps[];
    };
  }>("get", `${process.env.EXPO_PUBLIC_API_BASE_URL}/patient/home`, {
    headers: {
      Authorization: `Bearer ${process.env.EXPO_PUBLIC_token}`,
    },
  });

  const htmlToReadabletext = (html: string) => {
    return html
      .replace(/<br\s*\/?>/gi, "\n") // Replace <br> tags with newlines
      .replace(/<\/?[^>]+(>|$)/g, "") // Remove all other HTML tags
      .trim();
  };

  const homeData = data?.data;
  const specialities = homeData?.speciality_symptoms || [];

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <View className="flex-1 bg-white">
      {isFocused && <StatusBar style="light" />}
      <Header insets={insets} />

      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        <View className="px-4 py-5">
          {/* Consultation Type */}
          <View className="flex flex-row gap-x-2.5">
            <View className="flex-1">
              <ConsultationTypeCard
                link="/patient/find-doctor"
                image={require("../../assets/images/video-consultation.png")}
                text="Instant Video Consultation"
              />
            </View>
            <View className="flex-1">
              <ConsultationTypeCard
                link="/patient/find-doctor"
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
              {loading ? (
                <Text>Loading...</Text>
              ) : specialities ? (
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
              {loading ? (
                <Text>Loading...</Text>
              ) : homeData?.available_doctors ? (
                homeData?.available_doctors.map((availableDoctors) => {
                  return (
                    <AvailableDoctors
                      key={availableDoctors.id}
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
            {loading ? (
              <Text>Loading...</Text>
            ) : homeData?.advertisements ? (
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
              {loading ? (
                <Text>Loading...</Text>
              ) : homeData?.patient_reviews ? (
                homeData.patient_reviews.map((testimonial, index) => (
                  <Testimonial
                    key={index}
                    image={testimonial.patient_image}
                    name={testimonial.patient_name}
                    age={testimonial.patient_age} // backend does not provide
                    city={testimonial.patient_location} // backend does not provide
                    title={testimonial.title}
                    description={htmlToReadabletext(testimonial.content)}
                    review_count={testimonial.rating}
                  />
                ))
              ) : (
                <Text>No testimonials available</Text>
              )}
            </ScrollView>
            <Button
              className="mt-5"
              onPress={() => router.push("/reviews/all-reviews" as any)}
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
