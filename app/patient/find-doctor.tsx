import FindDoctorSearchBar from "@/components/patient/find-doctor/find-doctor-search-bar";
import SpecialityCard from "@/components/patient/home/speciality-card";
import EmptyState from "@/components/ui/EmptyState";
import ErrorState from "@/components/ui/ErrorState";
import Skeleton from "@/components/ui/Skeleton";
import { useFindDoctorData } from "@/queries/patient/useFindDoctorData";
import { Search } from "lucide-react-native";
import { useMemo, useState } from "react";
import { FlatList, View } from "react-native";
import { SpecialityByDoctorProps, SymptomsByDoctorProps } from "../../types/patient/find-doctor";

const FindDoctor = () => {

    const [selectedFilter, setSelectedFilter] = useState<"Speciality" | "Symptoms">("Speciality");
    const [searchQuery, setSearchQuery] = useState("");
    const { data, isLoading, isError, error, refetch } = useFindDoctorData();

    const specialities: SpecialityByDoctorProps[] = useMemo(
        () =>
            data?.data.map(item => ({
                id: String(item.id),
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

    return (
        <View className="flex-1 p-5 bg-white">
            <FindDoctorSearchBar
                selectedFilter={selectedFilter}
                setSelectedFilter={setSelectedFilter}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
            />

            {isLoading && (
                <View className="mt-10 gap-y-8">
                    <View className="flex-row justify-between">
                        <Skeleton width="30%" height={80} />
                        <Skeleton width="30%" height={80} />
                        <Skeleton width="30%" height={80} />
                    </View>
                    <View className="flex-row justify-between">
                        <Skeleton width="30%" height={80} />
                        <Skeleton width="30%" height={80} />
                        <Skeleton width="30%" height={80} />
                    </View>
                </View>
            )}

            {isError && (
                <ErrorState
                    title="Failed to load categories"
                    onRetry={() => refetch()}
                />
            )}

            {!isLoading && !isError && (
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
                        <EmptyState
                            title={`No ${selectedFilter.toLowerCase()} found`}
                            message={`We couldn't find any ${selectedFilter.toLowerCase()} matching "${searchQuery}"`}
                            icon={<Search size={40} color="#94A3B8" />}
                            className="mt-10"
                        />
                    )}
                />
            )}
        </View>
    )
}

export default FindDoctor