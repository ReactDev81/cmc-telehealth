import { View, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Header from '@/components/home/header';
import ConsultationTypeCard from '../../components/home/consulation-type-card';
import TitleWithLink from '../../components/home/title-with-link';
import SpecialityCard from '../../components/home/speciality-card';
import AvailableDoctors from '../../components/home/available-doctors';
import Title from '../../components/ui/Title';
import Article from '../../components/home/article';
import Testimonial from '../../components/home/testimonial';
import Button from '../../components/ui/Button';

// json data
import { SpecialityData } from '@/json-data/home';
import { AvailableDoctorsData } from '@/json-data/home';
import { ArticleData } from '@/json-data/home';
import { TestimonialData } from '@/json-data/home';


const Home = () => {

    const insets = useSafeAreaInsets();

    return (
        <View className="flex-1 bg-white" style={{ paddingTop: insets.top }}>

            <Header />

            <ScrollView 
                showsVerticalScrollIndicator={false}
                className='flex-1'
            >

                <View className='px-4 py-5'>

                    {/* Consultation Type */}
                    <View className='flex flex-row gap-x-2.5'>
                        <View className='flex-1'>
                            <ConsultationTypeCard
                                link="/patient/find-doctor" 
                                image={require('../../assets/images/video-consultation.png')}
                                text="Instant Video Consultation"
                            />
                        </View>
                        <View className='flex-1'>
                            <ConsultationTypeCard
                                link="/patient/find-doctor" 
                                image={require('../../assets/images/clinic-appointment.png')}
                                text="Book In-Clinic Appointment"
                            />
                        </View>
                    </View>

                    {/* Speciality */}
                    <View className='mt-7'>
                        <TitleWithLink 
                            title_text="Find Doctor by Speciality / Symptoms"
                            link="/patient/find-doctor"
                            link_text="See All"
                        />
                        <ScrollView 
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            className='mt-4'
                            contentContainerStyle={{ gap: 20, paddingRight: 0 }}
                        >
                            {SpecialityData.map((speciality, id) => {
                                return(
                                    <SpecialityCard
                                        key={id} 
                                        speciality={speciality.speciality}
                                        link={speciality.link}
                                        image={speciality.image}
                                    />
                                )
                            })}
                        </ScrollView>
                    </View>

                    {/* Available Doctors */}
                    <View className='mt-7'>
                        <TitleWithLink 
                            title_text="Available Doctors"
                            link="/doctors"
                            link_text="See All"
                        />
                        <ScrollView 
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            className='mt-4'
                            contentContainerStyle={{ gap: 15, paddingRight: 0 }}
                        >
                            {AvailableDoctorsData.map((availableDoctors) => {
                                return(
                                    <TouchableOpacity
                                        key={availableDoctors.id}
                                        className="flex-1 px-1"
                                        onPress={() => router.push(`/patient/doctor/${availableDoctors.id}`)}
                                    >
                                        <AvailableDoctors
                                            image={availableDoctors.image}
                                            name={availableDoctors.name}
                                            speciality={availableDoctors.speciality}
                                            rating={availableDoctors.rating}
                                            reviews_count={availableDoctors.reviews_count}
                                        />
                                    </TouchableOpacity>
                                )
                            })}
                        </ScrollView>
                    </View>

                </View>

                {/* Article */}
                <View className='px-4 py-5 bg-primary'>
                    <Title text="Safe & Advanced Surgical Care" className="text-white" />
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        className='mt-3'
                        contentContainerStyle={{ gap: 15, paddingRight: 0 }}
                    >

                        {ArticleData.map((article, id) => {
                            return(
                                <Article
                                    key={id} 
                                    name={article.name}
                                    first_point={article.first_point}
                                    second_point={article.second_point}
                                />
                            )
                        })}
                    </ScrollView>
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
                        <Button className='mt-5' onPress={() => router.push('/patient/testimonial')}>View All Testimonial</Button>
                    </View>

                </View>

            </ScrollView>

        </View>
    );
}

export default Home