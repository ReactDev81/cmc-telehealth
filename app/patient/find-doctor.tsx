import FindDoctorSearchBar from "@/components/patient/find-doctor/find-doctor-search-bar";
import SpecialityCard from "@/components/patient/home/speciality-card";
import useAxios from "@/hooks/useApi";
import { useEffect, useMemo, useState } from "react";
import { FlatList, Text, View } from "react-native";
import { SpecialityByDoctorProps, SymptomsByDoctorProps } from "../../types/patient/find-doctor";


const FindDoctor = () => {

    const [selectedFilter, setSelectedFilter] = useState<"Speciality" | "Symptoms">("Speciality");
    const [searchQuery, setSearchQuery] = useState("");

    const { data, loading, error, fetchData } = useAxios<{
        success: boolean;
        data: {
            id: string;
            department: { name: string; icon: string };
            symptoms: { name: string; icon: string }[];
        }[];
    }>(
        "get",
        `${process.env.EXPO_PUBLIC_API_BASE_URL}/patient/departments-and-symptoms-list`,
        {
            headers: {
                Authorization: `Bearer ${process.env.EXPO_PUBLIC_token}`,
            },
        }
    );

    useEffect(() => {
        fetchData();
    }, []);

    console.log("Fetched Data:", data);


    const specialities: SpecialityByDoctorProps[] = useMemo(
        () =>
            data?.data.map(item => ({
            id: item.id,
            name: item.department.name,
            icon: item.department.icon, // string URL
            link: `/doctors?filter_type=department&id=${item.id}` as const,
            })) ?? [],
        [data]
    );

    const symptoms: SymptomsByDoctorProps[] = useMemo(
        () =>
            data?.data.flatMap(item =>
            item.symptoms.map(symptom => ({
            id: `${item.id}-${symptom.name}`,
            name: symptom.name,
            icon: symptom.icon, // string URL
            link: `/doctors?filter_type=symptom&id=${item.id}` as const,
            }))
            ) ?? [],
        [data]
    );

    const filteredData = useMemo(() => {
        const source = selectedFilter === "Speciality" ? specialities : symptoms;

        if (!searchQuery.trim()) return source;

        return source.filter(item =>
            item.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [selectedFilter, searchQuery, specialities, symptoms]);

    // Common render function
    const renderItem = ({
        item,
    }: {
        item: SpecialityByDoctorProps | SymptomsByDoctorProps;
    }) => (
        <View className="flex-1 items-center">
            <SpecialityCard
                speciality={item.name}
                image={item.icon}
                link={item.link}
                className="[&]:w-[72px] [&]:h-[72px]"
            />
        </View>
    );

    return(
        <View className="flex-1 p-5 bg-white">

            <FindDoctorSearchBar
                selectedFilter={selectedFilter}
                setSelectedFilter={setSelectedFilter}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
            />

            {/* Loading */}
            {loading && (
                <View className="mt-20 items-center">
                <Text className="text-gray-400">Loading...</Text>
                </View>
            )}

            {/* Error */}
            {error && (
                <View className="mt-20 items-center">
                <Text className="text-red-500">Something went wrong</Text>
                </View>
            )}

            {/* List */}
            {!loading && !error && (
                <FlatList
                    data={filteredData}
                    renderItem={renderItem}
                    keyExtractor={item => item.id}
                    numColumns={3}
                    columnWrapperStyle={{
                        justifyContent: "space-between",
                        marginBottom: 42,
                    }}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingTop: 20 }}
                    ListEmptyComponent={() => (
                        <View className="mt-20 items-center">
                            <Text className="text-gray-400">
                                No {selectedFilter.toLowerCase()} found
                            </Text>
                        </View>
                    )}
                />
            )}
            
        </View>
    )
}

export default FindDoctor