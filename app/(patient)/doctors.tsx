import { View, FlatList } from 'react-native';
import SearchBar from '../../components/form/search';
import { AvailableDoctorsProps } from '../../types/home';
import AllDoctorsData from '../../json-data/doctors';
import AvailableDoctors from '../../components/home/available-doctors';

const Doctors = () => {

    const renderDoctorItem = ({ item } : { item: AvailableDoctorsProps }) => {
        return (
            <AvailableDoctors
                id={item.id}
                image={item.image}
                name={item.name}
                speciality={item.speciality}
                rating={item.rating}
                consultation_type={item.consultation_type}
                consultation_fee={item.consultation_fee}
                expercience={item.expercience}
            />
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
                showsVerticalScrollIndicator={false}
            />

        </View>
    );
}

export default Doctors