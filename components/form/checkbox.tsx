import type { ReactNode } from "react";
import { Control, useController } from "react-hook-form";
import { Pressable, Text, View } from "react-native";

type CheckboxProps = {
  name: string;
  control: Control<any>;
  label?: ReactNode;
  className?: string;
};

export default function Checkbox({
  name,
  control,
  label,
  className = "",
}: CheckboxProps) {
  const {
    field: { value, onChange },
  } = useController({ name, control });

  const toggle = () => onChange(!value);

  return (
    <Pressable
      onPress={toggle}
      hitSlop={10}
      className={`flex-row items-center gap-2 ${className}`}
    >
      {/* Checkbox */}
      <View
        className={`h-4 w-4 rounded border ${
          value ? "bg-primary border-primary" : "border-gray"
        }`}
      />

      {/* Label */}
      {label && (
        <Text
          className="text-primary-400 text-sm"
          selectable={false}   // 🔑 important
        >
          {label}
        </Text>
      )}
    </Pressable>
  );
}
