import SearchBar from "@/components/form/search";
import Button from "@/components/ui/Button";
import { useFindDoctorData } from "@/queries/patient/useFindDoctorData";
import { router } from "expo-router";
import { Activity, Check, Stethoscope } from "lucide-react-native";
import { useMemo, useState } from "react";
import { FlatList, Modal, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface FiltersModalProps {
    visible: boolean;
    onClose: () => void;
    filters: {
        departmentId?: string;
        symptomDepartmentId?: string;
    };
    setFilters: React.Dispatch<
        React.SetStateAction<{
            departmentId?: string;
            symptomDepartmentId?: string;
        }>
    >;
}

const FiltersModal = ({ visible, onClose, filters, setFilters }: FiltersModalProps) => {

    const { data } = useFindDoctorData();
    const [activeTab, setActiveTab] = useState<"speciality" | "symptoms">(
        "speciality"
    );
    const [search, setSearch] = useState("");
    const items = Array.isArray(data?.data) ? data.data : [];

    const symptoms = items.flatMap((item) =>
        Array.isArray(item.symptoms)
        ? item.symptoms.map((symptom: { name: string; icon: string }) => ({
            ...symptom,
            departmentId: item.id,
        }))
        : []
    );

    const filteredSpecialities = useMemo(() => {
        return items.filter((item) =>
            item.department.name.toLowerCase().includes(search.toLowerCase())
        );
    }, [search, items]);

    const filteredSymptoms = useMemo(() => {
        return symptoms.filter((symptom) =>
            symptom.name.toLowerCase().includes(search.toLowerCase())
        );
    }, [search, symptoms]);

    const selectedCount = [
        filters.departmentId,
        filters.symptomDepartmentId,
    ].filter(Boolean).length;

    return (
        <Modal visible={visible} animationType="slide">
            <SafeAreaView className="flex-1 bg-white">

                {/* HEADER */}
                <View className="flex-row items-center justify-between px-5 py-4 border-b border-gray-200">
                    <Pressable onPress={onClose}>
                        <Text className="text-lg">✕</Text>
                    </Pressable>

                    <View className="items-center">
                        <Text className="font-semibold text-lg">Filter Doctors</Text>
                    </View>

                    <Pressable
                        onPress={() => {
                            setFilters({});
                            router.setParams({
                                filter_type: undefined,
                                id: undefined,
                            });
                        }}
                    >
                        <Text className="text-primary font-medium">Clear</Text>
                    </Pressable>
                </View>

                {/* TABS */}
                <View className="flex-row px-5 mt-4 gap-3">

                    <Pressable
                        onPress={() => setActiveTab("speciality")}
                        className={`flex-1 flex-row items-center justify-center p-4 rounded-xl ${
                        activeTab === "speciality"
                            ? "bg-primary"
                            : "bg-gray-100"
                        }`}
                    >
                        <Stethoscope
                            size={18}
                            color={activeTab === "speciality" ? "white" : "#555"}
                        />
                        <Text
                            className={`ml-2 font-medium ${
                                activeTab === "speciality"
                                ? "text-white"
                                : "text-gray-600"
                            }`}
                        >
                            Speciality
                        </Text>
                    </Pressable>

                    <Pressable
                        onPress={() => setActiveTab("symptoms")}
                        className={`flex-1 flex-row items-center justify-center p-4 rounded-xl ${
                        activeTab === "symptoms"
                            ? "bg-primary"
                            : "bg-gray-100"
                        }`}
                    >
                        <Activity
                            size={18}
                            color={activeTab === "symptoms" ? "white" : "#555"}
                        />
                            <Text
                                className={`ml-2 font-medium ${
                                    activeTab === "symptoms"
                                    ? "text-white"
                                    : "text-gray-600"
                                }`}
                            >
                                Symptoms
                            </Text>
                    </Pressable>
                </View>

                {/* SEARCH */}
                <View className="px-5 mt-4">
                    <SearchBar
                        variant="secondary"
                        placeholder={
                            activeTab === "speciality"
                            ? "Search specialities..."
                            : "Search symptoms..."
                        }
                        value={search}
                        onChangeText={setSearch}
                        filterIcon={false}
                    />
                </View>

                {/* LIST */}
                <FlatList
                    data={
                        activeTab === "speciality"
                        ? filteredSpecialities
                        : filteredSymptoms
                    }
                    keyExtractor={(item, index) =>
                        activeTab === "speciality"
                        ? String(item.id)
                        : `${item.name}-${index}`
                    }
                    contentContainerStyle={{ padding: 20, paddingBottom: 120 }}
                    renderItem={({ item }) => {
                        const isSpeciality = activeTab === "speciality";

                        const label = isSpeciality
                        ? item.department.name
                        : item.name;

                        const id = isSpeciality
                        ? String(item.id)
                        : String(item.departmentId);

                        const selected = isSpeciality
                        ? filters.departmentId === id
                        : filters.symptomDepartmentId === id;

                        return (
                            <Pressable
                                className={`flex-row items-center justify-between p-4 mb-3 rounded-xl ${
                                    selected ? "bg-primary" : "bg-gray-50"
                                }`}
                                onPress={() => {
                                    if (isSpeciality) {
                                        setFilters((prev) => ({
                                            ...prev,
                                            departmentId:
                                                prev.departmentId === id ? undefined : id,
                                            symptomDepartmentId: undefined,
                                        }));
                                    } else {
                                        setFilters((prev) => ({
                                            ...prev,
                                            symptomDepartmentId:
                                                prev.symptomDepartmentId === id
                                                ? undefined
                                                : id,
                                            departmentId: undefined,
                                        }));
                                    }
                                }}
                            >
                                <Text
                                    className={`font-medium ${
                                        selected ? "text-white" : "text-gray-800"
                                    }`}
                                >
                                    {label}
                                </Text>

                                <View
                                    className={`w-6 h-6 rounded-full border items-center justify-center ${
                                        selected
                                        ? "bg-white border-white"
                                        : "border-gray-300"
                                    }`}
                                >
                                    {selected && <Check size={14} color="#0f5132" />}
                                </View>
                            </Pressable>
                        );
                    }}
                />

                {/* APPLY BUTTON */}
                <Button onPress={onClose} className="mx-5 mb-3 py-4">
                    Apply Filters
                </Button>

            </SafeAreaView>
        </Modal>
    );
};

export default FiltersModal;