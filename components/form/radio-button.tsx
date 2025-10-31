import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

type RadioOption = {
    value: string;
    label: string;
};

type RadioButtonProps = {
    name: string;
    label?: string;
    options: RadioOption[];
    value: string;
    onChange: (value: string) => void;
    direction?: "horizontal" | "vertical";
    className?: string;
};

const RadioButton: React.FC<RadioButtonProps> = ({
    name,
    label,
    options,
    value,
    onChange,
    direction = "vertical",
    className = "",
}) => {
    return (
        <View className={`${className}`}>
            {label && <Text className="text-sm text-black mb-2.5">{label}</Text>}
            <View
                className={`flex ${
                    direction === "horizontal" ? "flex-row" : "flex-col"
                } gap-3`}
            >
                {options.map((option) => (
                    <TouchableOpacity
                        key={option.value}
                        onPress={() => onChange(option.value)}
                        activeOpacity={1}
                        className="flex-row items-center"
                    >
                        <View
                            className={`w-4 h-4 rounded-full border ${
                                value === option.value ? "border-primary" : "border-gray"
                            } items-center justify-center`}
                        >
                            {value === option.value && (
                                <View className="w-2 h-2 bg-primary rounded-full" />
                            )}
                        </View>
                        <Text className={`ml-1.5 text-sm ${ value === option.value ? 'text-primary' : 'text-gray'}`}>{option.label}</Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
};

export default RadioButton;