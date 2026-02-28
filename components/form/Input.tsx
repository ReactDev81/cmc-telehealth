import { useController } from "react-hook-form";
import { Text, TextInput, View } from "react-native";

interface InputProps {
  name: string;
  control: any;
  label?: string;
  placeholder?: string;
  keyboardType?: any;
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  containerClassName?: string;
  secureTextEntry?: boolean;
  multiline?: boolean;
  editable?: boolean;
}

const Input = ({
  name,
  control,
  label,
  placeholder,
  keyboardType = "default",
  autoCapitalize = "none",
  containerClassName = "",
  secureTextEntry = false,
  multiline = false,
  editable = true,
}: InputProps) => {
  const {
    field: { onChange, onBlur, value },
    fieldState: { error },
  } = useController({
    name,
    control,
  });

  return (
    <View className={containerClassName}>
      {label && <Text className="text-sm text-black mb-1.5">{label}</Text>}

      <TextInput
        className={`border rounded-lg px-5 py-4 text-sm leading-4 ${
          error ? "border-red-500" : "border-gray"
        } ${!editable ? "bg-gray-100 text-gray-500" : ""}`}
        value={value}
        onChangeText={onChange}
        onBlur={onBlur}
        placeholder={placeholder || label}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        secureTextEntry={secureTextEntry}
        multiline={multiline}
        editable={editable}
        underlineColorAndroid="transparent"
      />

      {error && (
        <Text className="text-xs text-red-600 mt-1">{error.message}</Text>
      )}
    </View>
  );
};

export default Input;
