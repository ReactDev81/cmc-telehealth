import FiltersModal from "@/components/patient/all-doctors/filters-modal";
import AvailableDoctors from "@/components/patient/home/available-doctors";
import Button from "@/components/ui/Button";
import { useAuth } from "@/context/UserContext";
import { useBrowseDoctors } from "@/queries/patient/useBrowseDoctors";
import { useIsFocused } from "@react-navigation/native";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, FlatList, ScrollView, Text, View } from "react-native";
import SearchBar from "../../components/form/search";
import { AvailableDoctorsProps } from "../../types/patient/home";

type ConsultationType = "video" | "in-person" | "both";

const Doctors = () => {

  const { token, initializing } = useAuth();
  const { data, isLoading, isError, error, refetch } = useBrowseDoctors(!!token && !initializing);
  const [modalVisible, setModalVisible] = useState(false);
  const params = useLocalSearchParams();
  const [filters, setFilters] = useState<{
    departmentId?: string;
    symptomDepartmentId?: string;
  }>({});
  const [searchText, setSearchText] = useState("");
  const [selectedType, setSelectedType] = useState<ConsultationType>("both");

  const isFocused = useIsFocused();

  const handleSelect = (type: ConsultationType) => {
    setSelectedType(type);
    router.setParams({ consultation_type: type });
  };

  const matchConsultationType = (
    selected: ConsultationType,
    doctorType: string
  ) => {
    if (selected === "both") return true;
    if (doctorType === "both") return true;
    return doctorType === selected;
  };

  const normalize = (text: string) =>
    text.toLowerCase().trim();


  const filteredDoctors = useMemo(() => {
    if (!data?.data) return [];

    const search = normalize(searchText);

    return data.data.filter((doctor) => {

      /** 1️⃣ Consultation type filter */
      if (
        !matchConsultationType(
          selectedType,
          doctor.consultation_type
        )
      ) {
        return false;
      }

      /** 2️⃣ Department filter (speciality / symptom) */
      const filterDepartmentId =
        filters.departmentId || filters.symptomDepartmentId;

      if (filterDepartmentId) {
        const doctorDepartmentIds = doctor.speciality?.map(
          (spec: any) => String(spec.id)
        );

        if (!doctorDepartmentIds?.includes(filterDepartmentId)) {
          return false;
        }
      }

      /** 3️⃣ SEARCH FILTER */
      if (search.length > 0) {

        const doctorNameMatch =
          normalize(doctor.name).includes(search);

        const departmentMatch =
          doctor.speciality?.some((spec: any) =>
            normalize(spec.name).includes(search)
          );

        const symptomMatch =
          doctor.speciality?.some((spec: any) =>
            Array.isArray(spec.symptoms) &&
            spec.symptoms.some((symptom: string) =>
              normalize(symptom).includes(search)
            )
          );

        if (!doctorNameMatch && !departmentMatch && !symptomMatch) {
          return false;
        }
      }


      return true;
    });
  }, [data, filters, selectedType, searchText]);



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
    const filterType = params?.filter_type as "department" | "symptom" | undefined;
    const id = params?.id;
  
    if (!filterType || !id) return;
  
    if (filterType === "department") {
      setFilters({
        departmentId: String(id),
        symptomDepartmentId: undefined,
      });
    }
  
    if (filterType === "symptom") {
      setFilters({
        symptomDepartmentId: String(id),
        departmentId: undefined,
      });
    }
  }, [params?.filter_type, params?.id]);  


  useEffect(() => {
    const consultationType = params?.consultation_type as ConsultationType;
  
    if (
      consultationType &&
      ["video", "in-person", "both"].includes(consultationType)
    ) {
      setSelectedType(consultationType);
    }
  }, [params?.consultation_type]);


  useEffect(() => {
    if (isFocused) {
      refetch();
    }
  }, [isFocused, refetch]);

  return (
    <View className="flex-1 bg-white p-5 relative">

      <SearchBar
        variant="secondary"
        placeholder="Find doctors, symptoms, departments"
        value={searchText}
        onChangeText={setSearchText}
        onPress={() => setModalVisible(true)}
      />

      <View className="flex-row gap-x-2.5">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 12 }}
        >
          <Button
            id="video"
            className="w-32 mt-4 mb-2"
            variant={selectedType === "video" ? "filled" : "outline"}
            onPress={() => handleSelect("video")}
          >
            Video Call
          </Button>
          <Button
            id="in-person"
            className="w-32 mt-4 mb-2"
            variant={selectedType === "in-person" ? "filled" : "outline"}
            onPress={() => handleSelect("in-person")}
          >
            In Person
          </Button>
          <Button
            id="both"
            className="w-32 mt-4 mb-2"
            variant={selectedType === "both" ? "filled" : "outline"}
            onPress={() => handleSelect("both")}
          >
            Both
          </Button>
        </ScrollView>
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
          data={filteredDoctors}
          renderItem={renderDoctorItem}
          keyExtractor={(item, index) => index.toString()}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View className="flex-1 items-center justify-center py-20">
                <Text className="text-black-400 text-base">No Doctors Available</Text>
            </View>
          }
        />
      )}

      <FiltersModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        filters={filters}
        setFilters={setFilters}
      />

    </View>
  );
};

export default Doctors;
