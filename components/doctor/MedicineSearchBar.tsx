import Feather from "@expo/vector-icons/Feather";
import { useMemo, useState } from "react";
import { FlatList, Text, TextInput, TouchableOpacity, View } from "react-native";

type Props = {
    medicines?: { id: string; name: string; type: string }[];
    selectedType: string | null;
    setSelectedType: (v: string | null) => void;
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
    const [dropdownVisible, setDropdownVisible] = useState(false);

    const medicinesList = Array.isArray(medicines) ? medicines : [];

    // Extract unique medicine types from the medicines list
    const medicineTypes = useMemo(() => {
        const types = new Set<string>();
        medicinesList.forEach((m) => {
            if (m.type) {
                types.add(m.type);
            }
        });
        return Array.from(types).sort(); // Return sorted unique types
    }, [medicinesList]);

    // Filter medicines by selected type and search query
    const filteredMedicines = useMemo(() => {
        return medicinesList.filter((m) => {
            const matchesType = !selectedType || m.type === selectedType;
            const matchesSearch = searchQuery
                ? m.name.toLowerCase().includes(searchQuery.toLowerCase())
                : true;
            return matchesType && matchesSearch;
        });
    }, [medicinesList, selectedType, searchQuery]);

    const handleSelect = (option: string) => {
        setSelectedType(selectedType === option ? null : option); // Toggle selection
        setDropdownVisible(false);
    };

    const handleSelectMedicine = (medicine: { id: string; name: string; type: string }) => {
        onSelectMedicine(medicine);
        setSearchQuery(""); // Clear search after selection
    };

    return (
        <View>
            {/* Search Bar with Type Filter */}
            <View className="flex-row items-center p-1.5 rounded-xl bg-transparent border border-gray mb-3 relative">
                <TextInput
                    placeholder={`Search Medicine by Name`}
                    placeholderTextColor="#929292"
                    className="flex-1 text-base text-black py-2 px-2.5 leading-5"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    returnKeyType="search"
                />

                {/* Type Filter Dropdown Toggle */}
                <TouchableOpacity
                    onPress={() => setDropdownVisible(!dropdownVisible)}
                    activeOpacity={1}
                    className="flex-row items-center gap-x-1 pr-4"
                >
                    <Text className="text-sm font-medium text-black truncate max-w-24">
                        {selectedType ? selectedType.substring(0, 12) : "All Types"}
                    </Text>
                    <Feather
                        name={dropdownVisible ? "chevron-up" : "chevron-down"}
                        size={16}
                        color="black"
                    />
                </TouchableOpacity>

                {/* Dropdown Menu */}
                {dropdownVisible && (
                    <View className="absolute right-1 top-12 py-2 w-40 bg-white rounded-lg shadow-lg z-10 border border-gray-200 max-h-48">
                        <FlatList
                            data={medicineTypes}
                            keyExtractor={(item) => item}
                            scrollEnabled={medicineTypes.length > 5}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    onPress={() => handleSelect(item)}
                                    activeOpacity={0.7}
                                    className="px-4 py-2 flex-row items-center"
                                >
                                    <View
                                        className={`w-4 h-4 rounded border mr-2 ${selectedType === item
                                            ? "bg-blue-600 border-blue-600"
                                            : "border-gray-300"
                                            }`}
                                    />
                                    <Text
                                        className={`text-sm flex-1 ${selectedType === item
                                            ? "text-black font-semibold"
                                            : "text-gray-600"
                                            }`}
                                    >
                                        {item}
                                    </Text>
                                </TouchableOpacity>
                            )}
                        />
                        {/* Show "All Types" option */}
                        <TouchableOpacity
                            onPress={() => {
                                setSelectedType(null);
                                setDropdownVisible(false);
                            }}
                            activeOpacity={0.7}
                            className="px-4 py-2 border-t border-gray-200 flex-row items-center"
                        >
                            <Text className="text-sm text-blue-600 font-medium">Clear Filter</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>

            {/* Medicines List */}
            {searchQuery.length > 0 && (
                <View className="border border-gray-200 rounded-lg bg-white overflow-hidden">
                    <FlatList
                        data={filteredMedicines}
                        keyExtractor={(item) => item.id}
                        scrollEnabled={false}
                        ListEmptyComponent={
                            <View className="px-4 py-4">
                                <Text className="text-gray-500 text-center text-sm">
                                    No medicines found for "{searchQuery}"
                                    {selectedType && ` of type "${selectedType}"`}
                                </Text>
                            </View>
                        }
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                onPress={() => handleSelectMedicine(item)}
                                activeOpacity={0.7}
                                className="px-4 py-3 border-b border-gray-100"
                            >
                                <Text className="text-black font-medium text-sm">{item.name}</Text>
                                <Text className="text-gray-500 text-xs mt-1 capitalize">
                                    {item.type}
                                </Text>
                            </TouchableOpacity>
                        )}
                    />
                </View>
            )}
        </View>
    );
};

export default MedicineSearchBar;
