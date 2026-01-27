import Feather from "@expo/vector-icons/Feather";
import { FlatList, Text, TextInput, TouchableOpacity, View } from "react-native";

type Props = {
    medicines?: { id: string; name: string; type: string }[];
    selectedType: string;
    setSelectedType: (v: string) => void;
    searchQuery: string;
    setSearchQuery: (v: string) => void;
    onSelectMedicine: (medicine: { id: string; name: string; type: string }) => void;
};

const MedicineSearchBar = ({
    medicines,
    selectedType,
    setSelectedType,
    searchQuery,
    setSearchQuery,
    onSelectMedicine,
}: Props) => {
    // Add safety check for medicines - ensure it's always an array
    const medicinesList = Array.isArray(medicines) ? medicines : [];

    console.log("🏥 MedicineSearchBar - Search query:", searchQuery);
    console.log("🏥 MedicineSearchBar - Medicines received:", medicinesList.length);
    console.log("🏥 MedicineSearchBar - Selected type:", selectedType);

    const typeOptions = ["Tablet", "Liquid"];
    // Only filter by type - the API already handles the search filtering
    const filteredMedicines = medicinesList.filter((m) => {
        const medicineType = m.type.toLowerCase();
        const selectedTypeLower = selectedType.toLowerCase();
        // Check if medicine type matches or contains the selected type
        return medicineType === selectedTypeLower || medicineType.includes(selectedTypeLower);
    });

    console.log("🏥 MedicineSearchBar - Filtered medicines:", filteredMedicines.length);

    return (
        <View>
            <View className="flex-row items-center p-1.5 rounded-xl border border-gray mb-3">
                <TextInput
                    placeholder="Search Medicine"
                    placeholderTextColor="#929292"
                    className="flex-1 text-base text-black py-2 px-2.5"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />

                <TouchableOpacity
                    onPress={() => {
                        // Toggle between Tablet and Liquid
                        setSelectedType(selectedType === "Tablet" ? "Liquid" : "Tablet");
                    }}
                    className="flex-row items-center gap-x-1 pr-4"
                >
                    <Text className="text-sm font-medium text-black">{selectedType}</Text>
                    <Feather name="refresh-cw" size={16} />
                </TouchableOpacity>
            </View>

            {searchQuery.length > 0 && (
                <FlatList
                    data={filteredMedicines}
                    keyExtractor={(item) => item.id}
                    style={{ maxHeight: 200 }}
                    ListEmptyComponent={
                        medicinesList.length === 0 ? (
                            <View className="px-3 py-4">
                                <Text className="text-black-400 text-center">Loading medicines...</Text>
                            </View>
                        ) : (
                            <View className="px-3 py-4">
                                <Text className="text-black-400 text-center">No medicines found for "{searchQuery}"</Text>
                            </View>
                        )
                    }
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            onPress={() => onSelectMedicine(item)}
                            className="px-3 py-2 border-b border-gray-200 bg-white"
                        >
                            <Text className="text-black font-medium">{item.name}</Text>
                            <Text className="text-black-400 text-xs mt-1">{item.type}</Text>
                        </TouchableOpacity>
                    )}
                />
            )}
        </View>
    );
};

export default MedicineSearchBar;
