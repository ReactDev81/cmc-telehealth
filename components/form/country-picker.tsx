import { COUNTRIES, Country } from "@/json-data/common/countries";
import { ChevronDown, Search, X } from "lucide-react-native";
import { useMemo, useState } from "react";
import {
    FlatList,
    Modal,
    Pressable,
    SafeAreaView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

interface CountryPickerProps {
    value: string; // e.g. "+91"
    onChange: (country: Country) => void;
    label?: string;
    className?: string;
}

export default function CountryPicker({
    value = "+91",
    onChange,
    label,
    className = "",
}: CountryPickerProps) {
    const [modalVisible, setModalVisible] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const selectedCountry = useMemo(() => {
        return (
            COUNTRIES.find((c) => c.dial_code === value) ||
            COUNTRIES[0] // Default to India (+91)
        );
    }, [value]);

    const filteredCountries = useMemo(() => {
        const query = searchQuery.trim().toLowerCase();
        if (!query) return COUNTRIES;

        return COUNTRIES.filter(
            (c) =>
                c.name.toLowerCase().includes(query) ||
                c.dial_code.includes(query) ||
                c.code.toLowerCase().includes(query)
        );
    }, [searchQuery]);

    const handleSelect = (country: Country) => {
        onChange(country);
        setModalVisible(false);
        setSearchQuery("");
    };

    return (
        <View className={className}>
            {label && (
                <Text className="text-sm text-black mb-1.5 font-medium">{label}</Text>
            )}

            {/* Dropdown Button */}
            <TouchableOpacity
                onPress={() => setModalVisible(true)}
                activeOpacity={0.7}
                className="border border-gray rounded-xl px-3 py-3.5 bg-white flex-row items-center justify-between"
            >
                <View className="flex-row items-center gap-x-1.5">
                    <Text className="text-base">{selectedCountry.flag}</Text>
                    <Text className="text-sm font-semibold text-black">
                        {selectedCountry.dial_code}
                    </Text>
                </View>
                <ChevronDown size={16} color="#4D4D4D" />
            </TouchableOpacity>

            {/* Selection Modal */}
            <Modal
                visible={modalVisible}
                animationType="slide"
                transparent={false}
                onRequestClose={() => {
                    setModalVisible(false);
                    setSearchQuery("");
                }}
            >
                <SafeAreaView className="flex-1 bg-white">
                    {/* Header */}
                    <View className="px-5 py-4 border-b border-gray-200 flex-row items-center justify-between">
                        <Text className="text-lg font-bold text-black">Select Country</Text>
                        <TouchableOpacity
                            onPress={() => {
                                setModalVisible(false);
                                setSearchQuery("");
                            }}
                            className="p-1 rounded-full bg-gray-100"
                        >
                            <X size={20} color="#1F1E1E" />
                        </TouchableOpacity>
                    </View>

                    {/* Search Bar */}
                    <View className="px-5 py-3">
                        <View className="flex-row items-center bg-gray-100 rounded-xl px-3.5 py-2.5">
                            <Search size={18} color="#9CA3AF" />
                            <TextInput
                                className="flex-1 ml-2 text-sm text-black"
                                placeholder="Search country or dial code..."
                                placeholderTextColor="#9CA3AF"
                                value={searchQuery}
                                onChangeText={setSearchQuery}
                                autoCorrect={false}
                                clearButtonMode="while-editing"
                            />
                            {searchQuery.length > 0 && (
                                <TouchableOpacity onPress={() => setSearchQuery("")}>
                                    <X size={16} color="#6B7280" />
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>

                    {/* Country List */}
                    <FlatList
                        data={filteredCountries}
                        keyExtractor={(item) => item.code + item.dial_code}
                        keyboardShouldPersistTaps="handled"
                        renderItem={({ item }) => {
                            const isSelected = item.dial_code === selectedCountry.dial_code && item.code === selectedCountry.code;

                            return (
                                <TouchableOpacity
                                    onPress={() => handleSelect(item)}
                                    activeOpacity={0.6}
                                    className={`flex-row items-center justify-between px-5 py-3.5 border-b border-gray-100 ${
                                        isSelected ? "bg-primary-100" : "bg-white"
                                    }`}
                                >
                                    <View className="flex-row items-center gap-x-3 flex-1">
                                        <Text className="text-2xl">{item.flag}</Text>
                                        <Text className="text-sm font-medium text-black flex-1" numberOfLines={1}>
                                            {item.name}
                                        </Text>
                                    </View>
                                    <Text className="text-sm font-semibold text-primary ml-3">
                                        {item.dial_code}
                                    </Text>
                                </TouchableOpacity>
                            );
                        }}
                        ListEmptyComponent={
                            <View className="items-center justify-center py-12">
                                <Text className="text-sm text-gray-500">No countries found</Text>
                            </View>
                        }
                    />
                </SafeAreaView>
            </Modal>
        </View>
    );
}
