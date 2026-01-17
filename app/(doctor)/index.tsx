import TodayAppointmentCard from "@/components/doctor/appointment/today-appointment-card";
import UpcomingAppointmentCard from "@/components/doctor/appointment/upcoming-appointment-card";
import AppointementStatusBox from "@/components/doctor/home/appointement-status-box";
import DoctorHomeHeader from "@/components/doctor/home/header";
import Testimonial from "@/components/patient/home/testimonial";
import Button from "@/components/ui/Button";
import Title from "@/components/ui/Title";
import TitleWithLink from "@/components/ui/title-with-link";
import { TodayAppointmentData, UpcomingAppointmentData } from "@/json-data/doctor/appointment";
import { AppointementStatusBoxData } from "@/json-data/doctor/home";
import { TestimonialData } from "@/json-data/patient/home";
import { useIsFocused } from "@react-navigation/native";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const Home = () => {

    const insets = useSafeAreaInsets();
    const isFocused = useIsFocused();

    return (
        <View className="flex-1 bg-white">

            {isFocused && <StatusBar style="light" />}
            
            <DoctorHomeHeader insets={insets} />

            <ScrollView 
                showsVerticalScrollIndicator={false}
                className='flex-1 p-5'
            >
                {/* appointement status */}
                <View className="flex-row items-center gap-x-3">
                    {
                        AppointementStatusBoxData.map((AppointementStatus) => {
                            return(
                                <AppointementStatusBox 
                                    key={AppointementStatus.id}
                                    status={AppointementStatus.status}
                                    status_count={AppointementStatus.status_count}
                                />
                            )
                        })
                    }
                </View>

                {/* today's appointement */}
                <View className="mt-7">
                    <TitleWithLink 
                        title_text="Today's Appointments"
                        link="/appointments"
                        link_text="See All"
                    />
                    {TodayAppointmentData.slice(0, 2).map((appointement) => {   
                        return(
                            <View className="mt-5" key={appointement.id}>
                                <TodayAppointmentCard
                                    image={appointement.image}
                                    name={appointement.name}
                                    time={appointement.time}
                                    mode={appointement.mode} 
                                />
                            </View>
                        )
                    })}
                </View>

                {/* today's appointement */}
                <View className="mt-7">
                    <TitleWithLink 
                        title_text="Upcoming Appointments"
                        link="/appointments"
                        link_text="See All" 
                    />
                    {UpcomingAppointmentData.slice(0, 2).map((appointement) => {   
                        return(
                            <View className="mt-5" key={appointement.id}>
                                <UpcomingAppointmentCard
                                    image={appointement.image}
                                    name={appointement.name}
                                    time={appointement.time}
                                    date={appointement.date}
                                    mode={appointement.mode} 
                                />
                            </View>
                        )
                    })}
                </View>

                <View className='px-2 pb-20'>

                    {/* Testimonial */}
                    <View className='mt-7'>
                        <Title text="Here's what our satisfied customers are saying..." />
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            className='mt-3'
                            contentContainerStyle={{ gap: 15, paddingRight: 0 }}
                        >
                            {TestimonialData.map((testimonial, id) => {
                                // Parse review_count to extract total_reviews and doctor_name
                                // Format: "137+ Reviews for Dr. Ananya Sharma"
                                const reviewMatch = testimonial.review_count.match(/^(\d+\+)\s+Reviews\s+for\s+(.+)$/);
                                const total_reviews = reviewMatch ? reviewMatch[1] : testimonial.review_count;
                                const doctor_name = reviewMatch ? reviewMatch[2] : "";
                                
                                return(
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
                            })}
                        </ScrollView>
                        <Button className='mt-5' onPress={() => router.push('/feedbacks')}>View All Feedbacks</Button>
                    </View>

                </View>


            </ScrollView>

        </View>
    );
}

export default Home;