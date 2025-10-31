import { Pressable, Text, View } from "react-native";
import { useController, Control } from "react-hook-form";

type CheckboxProps = {
    name: string;
    control: Control<any>;
    label?: string;
    className?: string;
};

export default function Checkbox({
    name,
    control,
    label,
    className = "",
}: CheckboxProps) {

  const {field: { value, onChange }} = useController({ name, control })

    return (
        <Pressable
            onPress={() => onChange(!value)}
            className={`flex-row items-center gap-2 ${className}`}
            hitSlop={8}
        >
            <View
                className={`h-4 w-4 rounded border ${
                    value ? "bg-primary border-primary" : "border-gray"
                }`}
            />
            {label && <Text className="text-[#344054] text-sm">{label}</Text>}
        </Pressable>
    );
}