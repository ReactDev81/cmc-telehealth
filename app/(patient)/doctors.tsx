import AvailableDoctors from "@/components/patient/home/available-doctors";
import Button from "@/components/ui/Button";
import useAxios from "@/hooks/useApi";
import { useEffect } from "react";
import { ActivityIndicator, FlatList, Text, View } from "react-native";
import SearchBar from "../../components/form/search";
import { AvailableDoctorsProps } from "../../types/patient/home";

const Doctors = () => {
  const { data, error, loading, fetchData } = useAxios<{
    data: AvailableDoctorsProps[];
  }>("get", `${process.env.EXPO_PUBLIC_API_BASE_URL}/patient/browse-doctors`, {
    headers: { Authorization: `Bearer ${process.env.EXPO_PUBLIC_token}` },
  });

  console.log("Doctors Data1:", data);

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

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <View className="flex-1 bg-white p-5">
      <SearchBar variant="secondary" placeholder="Search a doctors" />

      <View className="flex-row gap-x-2.5">
        <Button id="video-call" className="w-32 mt-4 mb-2">
          Video Call
        </Button>
        <Button id="in-person" variant="outline" className="w-32 mt-4 mb-2">
          In Person
        </Button>
      </View>

      {loading && (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" />
        </View>
      )}

      {!loading && error && (
        <View className="mt-6 p-4 rounded-lg bg-red-100">
          <Text className="text-red-600 text-sm">{error}</Text>
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
};

export default Doctors;
