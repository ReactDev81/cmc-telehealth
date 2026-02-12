import { Check } from 'lucide-react-native';
import type { ReactNode } from "react";
import { Control, useController } from "react-hook-form";
import { Pressable, Text, View } from "react-native";

type CheckboxProps = {
  name: string;
  control: Control<any>;
  label?: ReactNode;
  labelComponent?: ReactNode;
  className?: string;
};

export default function Checkbox({
  name,
  control,
  label,
  labelComponent,
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
      className={`flex-row gap-2 ${className}`}
    >
      {/* Checkbox */}
      <View
        className={`h-5 w-5 mt-1 rounded border items-center justify-center ${
          value ? "bg-primary border-primary" : "border-gray"
        }`}
      >
        {value && <Check size={10} color="white" strokeWidth={5} />}
      </View> 

      {/* Label */}
      {label && (
        <Text
          className="text-primary-400 text-sm mt-1"
          selectable={false} 
        >
          {label}
        </Text>
      )}

      {labelComponent && labelComponent}
      
    </Pressable>
  );
}
