import Feather from '@expo/vector-icons/Feather';
import { useState } from "react";
import { FlatList, Text, TextInput, TouchableOpacity, View } from "react-native";

type FindDoctorSearchBarProps = {
    selectedFilter: "Speciality" | "Symptoms";
    setSelectedFilter: React.Dispatch<React.SetStateAction<"Speciality" | "Symptoms">>;
    searchQuery: string;
    setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
};

const FindDoctorSearchBar = ({ 
    selectedFilter, 
    setSelectedFilter,
    searchQuery,
    setSearchQuery
} : FindDoctorSearchBarProps) => {

    const [dropdownVisible, setDropdownVisible] = useState(false);
  
    const options = ["Speciality", "Symptoms"];
  
    const handleSelect = (option: "Speciality" | "Symptoms") => {
        setSelectedFilter(option);
        setDropdownVisible(false);
        setSearchQuery("");
    };

    return(
        <View className='flex-row items-center p-1.5 rounded-xl bg-transparent border border-gray'>

            <TextInput
                placeholder={`Search A Doc by ${selectedFilter}`}
                placeholderTextColor='#929292'
                className='flex-1 text-base text-black py-2 px-2.5 leading-5'
                value={searchQuery}
                onChangeText={setSearchQuery}
                returnKeyType="search"
            />

            {/* Dropdown Toggle */}
            <TouchableOpacity
                onPress={() => setDropdownVisible(!dropdownVisible)}
                activeOpacity={1}
                className="flex-row items-center gap-x-1 pr-4"
            >
                <Text className="text-sm font-medium text-black">{selectedFilter}</Text>
                <Feather name={dropdownVisible ? "chevron-up" : "chevron-down"} size={16} className="text-black" />
            </TouchableOpacity>

            {/* Dropdown Menu */}
            {dropdownVisible && (
                <View className="absolute right-10 top-16 max-w-32 py-2 w-full bg-white rounded-lg shadow-custom z-10">
                    <FlatList
                        data={options}
                        keyExtractor={(item) => item}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                onPress={() => handleSelect(item as "Speciality" | "Symptoms")}
                                activeOpacity={1}
                                className="px-5 py-2"
                            >
                                <Text
                                    className={`text-sm ${
                                        item === selectedFilter ? "text-black font-medium" : "text-black-400"
                                    }`}
                                >
                                    {item}
                                </Text>
                            </TouchableOpacity>
                        )}
                    />
                </View>
            )}

        </View>
    )
}

export default FindDoctorSearchBar