import React from "react";
import { View, Text, TextInput } from "react-native";
import { useFormContext, Controller } from "react-hook-form";

interface TextAreaProps {
    name: string;
    label?: string;
    placeholder?: string;
    containerClassName?: string;
    className?: string;
}

const TextArea: React.FC<TextAreaProps> = ({
    name,
    label,
    placeholder,
    containerClassName = "",
    className = "",
}) => {

    const { control,formState: { errors } } = useFormContext();

    const fieldError = errors[name]?.message as string | undefined;

    return (
        <View className={containerClassName}>

            {label && <Text className="text-sm text-black mb-2.5">{label}</Text>}

            <Controller
                control={control}
                name={name}
                render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                        multiline
                        numberOfLines={5}
                        placeholder={placeholder}
                        textAlignVertical="top"
                        className={`border ${
                            fieldError ? "border-red-500" : "border-gray"
                        } rounded-lg px-4 py-3 h-32 ${className}`}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        value={value}
                    />
                )}
            />

            {fieldError && (
                <Text className="text-red-500 text-xs mt-1">{fieldError}</Text>
            )}
        </View>
    );
};

export default TextArea;