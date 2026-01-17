import { Picker } from "@react-native-picker/picker";
import { Control, Controller } from "react-hook-form";
import { Text, View } from "react-native";

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
            defaultValue="" // ✅ IMPORTANT
            render={({ field: { value, onChange }, fieldState: { error } }) => (
                <View className={className}>
                    {label && (
                        <Text className="mb-1 text-sm font-medium text-black-500">
                            {label}
                        </Text>
                    )}

                    <View
                        className={`border rounded-lg ${error ? "border-red-500" : "border-gray-300"
                            }`}
                    >
                        <Picker
                            selectedValue={value || ""} // ✅ always string
                            onValueChange={(itemValue) => onChange(itemValue)}
                        >
                            <Picker.Item label={placeholder} value="" />
                            {options.map((option) => (
                                <Picker.Item
                                    key={option.value}
                                    label={option.label}
                                    value={option.value}
                                />
                            ))}
                        </Picker>
                    </View>

                    {error && (
                        <Text className="mt-1 text-xs text-red-500">
                            {error.message}
                        </Text>
                    )}
                </View>
            )}
        />
    );
}
