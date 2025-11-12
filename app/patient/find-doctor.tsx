import { useState } from "react"
import { View, FlatList } from "react-native"
import FindDoctorSearchBar from "@/components/patient/find-doctor/find-doctor-search-bar"
import { SpecialityByDoctorProps, SymptomsByDoctorProps } from "@/types/patient/find-doctor"
import SpecialityCard from "@/components/patient/home/speciality-card"
import { SpecialityByDcotorsData, SymptomsByDcotorsData } from "@/json-data/common/find-doctor"

const FindDoctor = () => {

    const [selectedFilter, setSelectedFilter] = useState<"Speciality" | "Symptoms">("Symptoms");
    const [searchQuery, setSearchQuery] = useState<string>("");

    // Filter data based on search query
    const getFilteredData = () => {
        const data = selectedFilter === "Speciality" ? SpecialityByDcotorsData : SymptomsByDcotorsData;
        
        if (!searchQuery.trim()) {
            return data;
        }

        return data.filter((item) => {
            const searchText = selectedFilter === "Speciality"
                ? (item as SpecialityByDoctorProps).speciality
                : (item as SymptomsByDoctorProps).symptoms;
            
            return searchText.toLowerCase().includes(searchQuery.toLowerCase());
        });
    };

    // Common render function
    const renderDoctor = ({ item }: { item: SpecialityByDoctorProps | SymptomsByDoctorProps }) => (
        <View className="flex-1">
            <SpecialityCard
                key={item.id}
                speciality={
                selectedFilter === "Speciality"
                    ? (item as SpecialityByDoctorProps).speciality
                    : (item as SymptomsByDoctorProps).symptoms
                }
                link={item.link}
                image={item.image}
                className="[&]:w-[72px] [&]:h-[72px]"
            />
        </View>
    );

    const filteredData = getFilteredData();

    return(
        <View className="flex-1 p-5 bg-white">

            <FindDoctorSearchBar 
                selectedFilter={selectedFilter} 
                setSelectedFilter={setSelectedFilter}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
            />

            <FlatList
                data={filteredData}
                renderItem={renderDoctor}
                keyExtractor={(item) => item.id?.toString() ?? Math.random().toString()}
                numColumns={3}
                columnWrapperStyle={{ justifyContent: "space-between", marginBottom: 42 }}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingTop: 20 }}
            />
            
        </View>
    )
}

export default FindDoctor