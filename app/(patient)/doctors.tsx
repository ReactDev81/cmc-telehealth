import { View, FlatList, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import SearchBar from '../../components/form/search';
import { AvailableDoctorsProps } from '../../types/home';
import AllDoctorsData from '../../json-data/doctors';
import AvailableDoctors from '../../components/home/available-doctors';

const Doctors = () => {

    const renderDoctorItem = ({ item } : { item: AvailableDoctorsProps }) => {
        return (
            <TouchableOpacity
                className="flex-1 px-1"
                onPress={() => router.push(`/patient/doctor/${item.id}`)}
            >
            {/* <View className='flex-1 px-1'> */}
                <AvailableDoctors
                    imageClass="h-32"
                    image={item.image}
                    name={item.name}
                    speciality={item.speciality}
                    rating={item.rating}
                    reviews_count={item.reviews_count}
                />
            {/* </View> */}
            </TouchableOpacity>
        );
    };

    return (
        <View className='flex-1 bg-white p-5'>
            <SearchBar 
                variant="secondary"
                placeholder="Search a doctors"
            />
            <FlatList
                data={AllDoctorsData}
                renderItem={renderDoctorItem}
                keyExtractor={(item, index) => index.toString()}
                numColumns={2}
                columnWrapperStyle={{ gap: 20, marginBottom: 20 }}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingTop: 20 }}
            />
        </View>
    );
}

export default Doctors