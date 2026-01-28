import BottomSheet, { BottomSheetTextInput } from "@gorhom/bottom-sheet";
import { forwardRef, useMemo } from "react";
import { ActivityIndicator, FlatList, Text, TouchableOpacity, View } from "react-native";

type Medicine = {
    id: string;
    name: string;
    type: string;
};

type Props = {
    medicinesQuery: {
        data?: Medicine[];
        isLoading: boolean;
        isError: boolean;
    };
    selectedType: "tablet" | "liquid";
    setSelectedType: (v: "tablet" | "liquid") => void;
    searchQuery: string;
    setSearchQuery: (v: string) => void;
    onSelectMedicine: (m: Medicine) => void;
};

const TYPE_MAP: Record<string, "tablet" | "liquid" | undefined> = {
    "cough medicine": "tablet",
    antibiotic: "tablet",
    syrup: "liquid",
    tonic: "liquid",
};

const MedicineBottomSheet = forwardRef<BottomSheet, Props>(
    ({ medicinesQuery, selectedType, setSelectedType, searchQuery, setSearchQuery, onSelectMedicine }, ref) => {

        const snapPoints = useMemo(() => ["35%", "85%"], []);

        const filtered = useMemo(() => {
            if (!medicinesQuery.data) return [];

            return medicinesQuery.data.filter((m) => {
                const mapped = TYPE_MAP[m.type.toLowerCase()];
                const matchType = mapped === selectedType;
                const matchSearch = searchQuery
                    ? m.name.toLowerCase().includes(searchQuery.toLowerCase())
                    : true;
                return matchType && matchSearch;
            });
        }, [medicinesQuery.data, selectedType, searchQuery]);

        return (
            <BottomSheet ref={ref} index={-1} snapPoints={snapPoints}>
                <View className="p-4 gap-y-3">

                    <Text className="font-semibold text-sm">Search Medication</Text>

                    <BottomSheetTextInput
                        placeholder="Search..."
                        placeholderTextColor="#999"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        style={{
                            borderWidth: 1,
                            borderColor: "#CFCFCF",
                            borderRadius: 8,
                            paddingVertical: 8,
                            paddingHorizontal: 10,
                            fontSize: 14,
                        }}
                    />

                    {/* TYPE FILTER */}
                    <View className="flex-row gap-2">
                        {(["tablet", "liquid"] as const).map((t) => (
                            <TouchableOpacity
                                key={t}
                                onPress={() => setSelectedType(t)}
                                className={`px-3 py-1 rounded-full border ${selectedType === t
                                        ? "bg-blue-600 border-blue-600"
                                        : "border-gray-400"
                                    }`}
                            >
                                <Text
                                    className={`text-xs ${selectedType === t ? "text-white" : "text-black"
                                        }`}
                                >
                                    {t === "tablet" ? "Tablet" : "Liquid"}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* LIST */}
                    {medicinesQuery.isLoading ? (
                        <ActivityIndicator size="small" className="mt-5" />
                    ) : (
                        <FlatList
                            data={filtered}
                            keyExtractor={(item) => item.id}
                            showsVerticalScrollIndicator={false}
                            className="mt-2"
                            ListEmptyComponent={() => (
                                <Text className="text-center text-gray-500 mt-10">
                                    No medicines found
                                </Text>
                            )}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    onPress={() => onSelectMedicine(item)}
                                    className="py-3 border-b border-gray-200"
                                >
                                    <Text className="text-sm font-medium">{item.name}</Text>
                                    <Text className="text-xs text-gray-500 capitalize mt-1">
                                        {item.type}
                                    </Text>
                                </TouchableOpacity>
                            )}
                        />
                    )}
                </View>
            </BottomSheet>
        );
    }
);

export default MedicineBottomSheet;
