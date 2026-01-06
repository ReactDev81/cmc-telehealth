import AvailableDoctors from '@/components/patient/home/available-doctors';
import useAxios from '@/hooks/useApi';
import { useEffect } from 'react';
import { ActivityIndicator, FlatList, Text, View } from 'react-native';
import SearchBar from '../../components/form/search';
import { AvailableDoctorsProps } from '../../types/patient/home';


const Doctors = () => {

    const {data, error, loading, fetchData} = useAxios<{ data: AvailableDoctorsProps[] }>('get', `${process.env.EXPO_PUBLIC_API_BASE_URL}/patient/all-doctors`, {headers: {Authorization: `Bearer ${process.env.EXPO_PUBLIC_token}`}});

    console.log('Doctors Data:', data?.data);
    console.log('Doctors Error:', error);

    const renderDoctorItem = ({ item } : { item: AvailableDoctorsProps }) => {
        return (
            <AvailableDoctors
                avatar_url={item.avatar_url}
                name={item.name}  
                department={item.department}
                rating={item.rating}
                consultation_type={item.consultation_type}
                consultation_fee={item.consultation_fee}
                years_experience={item.years_experience}
            />
        );
    };

    useEffect(() => {
        fetchData();
    }, [])

    return (
        <View className='flex-1 bg-white p-5'>
            <SearchBar 
                variant="secondary"
                placeholder="Search a doctors"
            />
            {/* {
                loading ? (
                    <View className='flex-1 items-center justify-center'>
                        <ActivityIndicator size="large" />
                    </View>
                ) : (
                    <FlatList
                        data={data?.data ?? []}
                        renderItem={renderDoctorItem}
                        keyExtractor={(item, index) => index.toString()}
                        showsVerticalScrollIndicator={false}
                    />
                )
            } */}

            {loading && (
                <View className='flex-1 items-center justify-center'>
                    <ActivityIndicator size="large" />
                </View>
            )}

            {!loading && error && (
                <View className='mt-6 p-4 rounded-lg bg-red-100'>
                    <Text className='text-red-600 text-sm'>
                        {error}
                    </Text>
                </View>
            )}

            {!loading && !error && (
                <FlatList
                    data={data?.data ?? []}
                    renderItem={renderDoctorItem}
                    keyExtractor={(item, index) => index.toString()}
                    showsVerticalScrollIndicator={false}
                />
            )}
        </View>
    );
}

export default Doctors