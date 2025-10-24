import { Pressable, Text, View } from 'react-native';

type CheckboxProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  className?: string;
};

export default function Checkbox({ checked, onChange, label, className = '' }: CheckboxProps) {
  return (
    <Pressable onPress={() => onChange(!checked)} className={`flex-row items-center gap-2 ${className}`} hitSlop={8}>
      <View className={`h-4 w-4 rounded border ${checked ? 'bg-primary border-primary' : 'border-slate-300'}`} />
      {label ? <Text className="text-[#344054] text-sm">{label}</Text> : null}
    </Pressable>
  );
}