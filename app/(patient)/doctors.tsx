import AvailableDoctors from "@/components/patient/home/available-doctors";
import Button from "@/components/ui/Button";
import { useAuth } from "@/context/UserContext";
import { useBrowseDoctors } from "@/queries/patient/useBrowseDoctors";
import { useState } from "react";
import { ActivityIndicator, FlatList, Text, View } from "react-native";
import SearchBar from "../../components/form/search";
import { AvailableDoctorsProps } from "../../types/patient/home";


const Doctors = () => {

    const { token, initializing } = useAuth();

    const { data, isLoading, isError, error } = useBrowseDoctors(!!token && !initializing);
    const [modalVisible, setModalVisible] = useState(false);

    const renderDoctorItem = ({ item }: { item: AvailableDoctorsProps }) => {
        return (
            <AvailableDoctors
                id={item.id}
                avatar={item.avatar}
                name={item.name}
                speciality={item.speciality}
                rating={item.rating}
                consultation_type={item.consultation_type}
                consultation_fee={item.consultation_fee}
                years_experience={item.years_experience}
            />
        );
    };
    
    // if (isError) {
    //     return <Text>Error loading home</Text>;
    // }

    return (
        <View className="flex-1 bg-white p-5">

            <SearchBar variant="secondary" placeholder="Search a doctors" onPress={() => setModalVisible(true)}  />

            <View className="flex-row gap-x-2.5">
                <Button id="video-call" className="w-32 mt-4 mb-2">
                    Video Call
                </Button>
                <Button id="in-person" variant="outline" className="w-32 mt-4 mb-2">
                    In Person
                </Button>
            </View>

            {isLoading && (
                <View className="flex-1 items-center justify-center">
                    <ActivityIndicator size="large" />
                </View>
            )}

            {!isLoading && error && (
                <View className="mt-6 p-4 rounded-lg bg-red-100">
                    <Text className="text-red-600 text-sm">{error?.message ?? 'An error occurred'}</Text>
                </View>
            )}

            {!isLoading && !error && (
                <FlatList
                    data={data?.data ?? []}
                    renderItem={renderDoctorItem}
                    keyExtractor={(item, index) => index.toString()}
                    showsVerticalScrollIndicator={false}
                />
            )}
            
        </View>
    );
};

export default Doctors;
