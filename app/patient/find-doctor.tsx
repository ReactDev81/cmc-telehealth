import FindDoctorSearchBar from "@/components/patient/find-doctor/find-doctor-search-bar";
import SpecialityCard from "@/components/patient/home/speciality-card";
import EmptyState from "@/components/ui/EmptyState";
import { useFindDoctorData } from "@/queries/patient/useFindDoctorData";
import { useIsFocused } from "@react-navigation/native";
import { Search } from "lucide-react-native";
import { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, FlatList, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { SpecialityByDoctorProps, SymptomsByDoctorProps } from "../../types/patient/find-doctor";

const FindDoctor = () => {
    const [selectedFilter, setSelectedFilter] = useState<"Speciality" | "Symptoms">("Speciality");
    const [searchQuery, setSearchQuery] = useState("");
    const isFocused = useIsFocused();
    const { data, isLoading, isError, error, refetch } = useFindDoctorData();

    useEffect(() => {
        if (isFocused) {
            refetch();
        }
    }, [isFocused, refetch]);

    const specialities: SpecialityByDoctorProps[] = useMemo(
        () =>
            (data?.data ?? []).map((item) => ({
                id: String(item.id),
                name: item.department.name,
                icon: item.department.icon,
                link: `/doctors?filter_type=department&id=${item.id}` as const,
            })),
        [data]
    );

    const symptoms: SymptomsByDoctorProps[] = useMemo(
        () =>
            (data?.data ?? []).flatMap((item) =>
                item.symptoms.map((symptom) => ({
                    id: `${item.id}-${symptom.name}`,
                    name: symptom.name,
                    icon: symptom.icon,
                    link: `/doctors?filter_type=symptom&id=${item.id}` as const,
                }))
            ),
        [data]
    );

    const filteredData = useMemo(() => {
        const source = selectedFilter === "Speciality" ? specialities : symptoms;

        if (!searchQuery.trim()) {
            return source;
        }

        return source.filter((item) =>
            item.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [selectedFilter, searchQuery, specialities, symptoms]);

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

    if (isLoading) {
        return (
            <SafeAreaView className="flex-1 items-center justify-center bg-white">
                <ActivityIndicator size="large" color="#000000" />
            </SafeAreaView>
        );
    }

    if (isError) {
        return (
            <SafeAreaView className="flex-1 items-center justify-center bg-white">
                <Text className="text-danger">
                    {((error as any)?.response?.data?.errors?.message ??
                        (error as any)?.message ??
                        "Something went wrong. Please try again.")}
                </Text>
            </SafeAreaView>
        );
    }

    return (
        <View className="flex-1 bg-white p-5">
            <FindDoctorSearchBar
                selectedFilter={selectedFilter}
                setSelectedFilter={setSelectedFilter}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
            />

            <FlatList
                data={filteredData}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
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
        </View>
    );
};

export default FindDoctor;
