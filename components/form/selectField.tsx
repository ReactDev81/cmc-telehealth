import { ChevronDown } from "lucide-react-native";
import { useState } from "react";
import { Control, Controller } from "react-hook-form";
import {
    Modal,
    Pressable,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

interface SelectOption {
    label: string;
    value: string;
}

interface SelectFieldProps {
    name: string;
    label?: string;
    control: Control<any>;
    options: SelectOption[];
    placeholder?: string;
    className?: string;
}

export default function SelectField({
    name,
    label,
    control,
    options,
    placeholder = "Select an option",
    className = "",
}: SelectFieldProps) {
    return (
        <Controller
            control={control}
            name={name}
            defaultValue=""
            render={({ field: { value, onChange }, fieldState: { error } }) => {
                const [modalVisible, setModalVisible] = useState(false);

                const selectedOption =
                    options.find((option) => option.value === value) ?? null;

                const handleSelect = (optionValue: string) => {
                    onChange(optionValue);
                    setModalVisible(false);
                };

                return (
                    <View className={className}>
                        {label && (
                            <Text className="mb-1 text-sm">
                                {label}
                            </Text>
                        )}

                        <Pressable
                            onPress={() => setModalVisible(true)}
                            className={`border rounded-lg py-3 px-4 bg-white ${error ? "border-red-500" : "border-gray"
                                }`}
                        >
                            <View className="flex-row items-center justify-between">
                                <Text className="text-base text-black">
                                    {selectedOption?.label || placeholder}
                                </Text>
                                <ChevronDown size={18} color={error ? "#ef4444" : "#6b7280"} />
                            </View>
                        </Pressable>

                        {error && (
                            <Text className="mt-1 text-xs text-red-500">
                                {error.message}
                            </Text>
                        )}

                        <Modal
                            transparent
                            visible={modalVisible}
                            animationType="fade"
                            onRequestClose={() => setModalVisible(false)}
                        >
                            <Pressable
                                className="flex-1 bg-black/40 justify-center px-6"
                                onPress={() => setModalVisible(false)}
                            >
                                <Pressable className="bg-white rounded-lg p-4 max-h-[60%]">
                                    <Text className="text-base font-semibold mb-3">
                                        {label || placeholder}
                                    </Text>

                                    <ScrollView>
                                        <TouchableOpacity
                                            onPress={() => handleSelect("")}
                                            className="py-2"
                                        >
                                            <Text className="text-base text-gray-500">
                                                {placeholder}
                                            </Text>
                                        </TouchableOpacity>

                                        {options.map((option) => (
                                            <TouchableOpacity
                                                key={option.value}
                                                onPress={() =>
                                                    handleSelect(option.value)
                                                }
                                                className="py-2"
                                            >
                                                <Text className="text-base text-black">
                                                    {option.label}
                                                </Text>
                                            </TouchableOpacity>
                                        ))}
                                    </ScrollView>
                                </Pressable>
                            </Pressable>
                        </Modal>
                    </View>
                );
            }}
        />
    );
}
