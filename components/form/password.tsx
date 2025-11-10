import { useState } from "react";
import { View, Text, TextInput, Pressable } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import { useController, Control } from "react-hook-form";

type PasswordInputProps = {
    name: string;
    control: Control<any>;
    label?: string;
    placeholder?: string;
    containerClassName?: string;
};

export default function PasswordInput({
    name,
    control,
    label = "Password",
    placeholder = "Enter your password",
    containerClassName = "",
}: PasswordInputProps) {

    const [show, setShow] = useState(false);
    const {field: { onChange, onBlur, value },fieldState: { error }} = useController({ name, control });

    return (
        <View className={containerClassName}>
            {label && <Text className="text-sm text-black mb-2.5">{label}</Text>}

            <View
                className={`border rounded-lg flex-row items-center ${
                    error ? "border-red-500" : "border-gray"
                }`}
            >
                <TextInput
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    placeholder={placeholder}
                    secureTextEntry={!show}
                    className="flex-1 px-4 py-4 text-sm text-black leading-4"
                />
                <Pressable onPress={() => setShow(!show)} className="px-3 py-3">
                    <Feather
                        name={show ? "eye" : "eye-off"}
                        size={20}
                        color="#667085"
                    />
                </Pressable>
            </View>

            {error && (
                <Text className="text-xs text-red-600 mt-1">{error.message}</Text>
            )}
        </View>
    );
}