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

interface Option {
  label: string;
  value: string;
}

interface Props {
  name: string;
  control: any;
  label?: string;
  options: Option[];
  placeholder?: string;
}

export default function MultiSelectField({
  name,
  control,
  label,
  options,
  placeholder = "Select reports",
}: Props) {
  const [visible, setVisible] = useState(false);

  return (
    <Controller
      control={control as Control<Record<string, string[]>>}
      name={name as keyof Record<string, string[]>}
      defaultValue={[] as string[]}
      render={({ field: { value = [], onChange } }) => {
        const selected = (value ?? []) as string[];
        const toggle = (val: string) => {
          if (selected.includes(val)) {
            onChange(selected.filter((v) => v !== val));
          } else {
            onChange([...selected, val]);
          }
        };

        const selectedLabels = options
          .filter(o => selected.includes(o.value))
          .map(o => o.label)
          .join(", ");

        return (
          <View>
            {label && <Text className="mb-1 text-sm">{label}</Text>}

            <Pressable
              onPress={() => setVisible(true)}
              className="border border-gray rounded-lg px-4 py-3"
            >

                <View className="flex-row items-center justify-between">
                    <Text className="text-base text-black">
                    {selectedLabels || placeholder}
                    </Text>
                    <ChevronDown size={18} color="#6b7280" />
                </View>
            </Pressable>

            <Modal transparent visible={visible} animationType="fade">
              <Pressable
                className="flex-1 bg-black/40 justify-center px-6"
                onPress={() => setVisible(false)}
              >
                <Pressable className="bg-white rounded-lg p-4 max-h-[60%]">
                  <ScrollView>
                    {options.map(option => {
                      const isSelected = selected.includes(option.value);

                      return (
                        <TouchableOpacity
                          key={option.value}
                          onPress={() => toggle(option.value)}
                          className="py-3 flex-row justify-between"
                        >
                          <Text>{option.label}</Text>
                          {isSelected && <Text>✓</Text>}
                        </TouchableOpacity>
                      );
                    })}
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