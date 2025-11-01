import { View, ScrollView } from "react-native";
import TitleWithLink from "@/components/home/title-with-link";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import DoctorHomeHeader from "@/components/doctor/home/header";
import { AppointementStatusBoxData } from "@/json-data/doctor/home";
import AppointementStatusBox from "@/components/doctor/home/appointement-status-box";
import TodayAppointment from "@/components/doctor/appointment/today-appointment";
import { TodayAppointmentData } from "@/json-data/doctor/appointment";
import UpcomingAppointment from "@/components/doctor/appointment/upcoming-appointment";
import { UpcomingAppointmentData } from "@/json-data/doctor/appointment";
import Title from "@/components/ui/Title";
import Button from "@/components/ui/Button";
import { router } from "expo-router";
import { TestimonialData } from "@/json-data/home";
import Testimonial from "@/components/home/testimonial";

const Home = () => {

    const insets = useSafeAreaInsets();

    return (
        <View className="flex-1 bg-white" style={{ paddingTop: insets.top }}>
            
            <DoctorHomeHeader />

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
                            <TodayAppointment
                                key={appointement.id}
                                image={appointement.image}
                                name={appointement.name}
                                time={appointement.time}
                                mode={appointement.mode} 
                            />
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
                            <UpcomingAppointment
                                key={appointement.id}
                                image={appointement.image}
                                name={appointement.name}
                                time={appointement.time}
                                date={appointement.date}
                                mode={appointement.mode} 
                            />
                        )
                    })}
                </View>

                <View className='px-4 pb-10'>

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
                                return(
                                    <Testimonial
                                        key={id} 
                                        image={testimonial.image}
                                        name={testimonial.name}
                                        age={testimonial.name}
                                        city={testimonial.city}
                                        title={testimonial.title}
                                        description={testimonial.description}
                                        review_count={testimonial.review_count}
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