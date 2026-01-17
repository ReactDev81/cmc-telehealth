import FiltersModal from "@/components/patient/all-doctors/filters-modal";
import AvailableDoctors from "@/components/patient/home/available-doctors";
import Button from "@/components/ui/Button";
import { useAuth } from "@/context/UserContext";
import { useBrowseDoctors } from "@/queries/patient/useBrowseDoctors";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, FlatList, Text, View } from "react-native";
import SearchBar from "../../components/form/search";
import { AvailableDoctorsProps } from "../../types/patient/home";

type ConsultationType = "video" | "in-person" | "both";

const Doctors = () => {

    const { token, initializing } = useAuth();
    const { data, isLoading, isError, error } = useBrowseDoctors(!!token && !initializing);
    const [modalVisible, setModalVisible] = useState(false);
    const params = useLocalSearchParams();
    const [filters, setFilters] = useState<{
        departmentId?: string;
        symptomDepartmentId?: string;
      }>({});
      
    const [selectedType, setSelectedType] = useState<ConsultationType>("both");

    const handleSelect = (type: ConsultationType) => {
        setSelectedType(type);
    };  
    
    const matchConsultationType = (
        selected: ConsultationType,
        doctorType: string
      ) => {
        if (selected === "both") return true;
        if (doctorType === "both") return true;
        return doctorType === selected;
      };
      

    const filteredDoctors = useMemo(() => {
        if (!data?.data) return [];
      
        return data.data.filter((doctor) => {
      
          /** 1️⃣ STRICT consultation mode filter */
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
      
          return true;
        });
      }, [data, filters, selectedType]);           
      
      

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

    useEffect(() => {
        if (params.filter_type === "department" && params.id) {
          setFilters({ departmentId: String(params.id) });
        }
      
        if (params.filter_type === "symptom" && params.id) {
          setFilters({ symptomDepartmentId: String(params.id) });
        }
    }, [params]);      

    return (
        <View className="flex-1 bg-white p-5 relative">

            <SearchBar 
                variant="secondary" 
                placeholder="Search a doctors" 
                onPress={() => setModalVisible(true)}  
            />

            <View className="flex-row gap-x-2.5">
                <Button 
                    id="both" 
                    className="w-32 mt-4 mb-2"
                    variant={selectedType === "both" ? "filled" : "outline"}
                    onPress={() => handleSelect("both")}
                    
                >
                    Both
                </Button>
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
                    // data={data?.data ?? []}
                    data={filteredDoctors}
                    renderItem={renderDoctorItem}
                    keyExtractor={(item, index) => index.toString()}
                    // keyExtractor={(item) => item.id}
                    showsVerticalScrollIndicator={false}
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
