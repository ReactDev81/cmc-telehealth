import Input from "@/components/form/Input";
import Button from "@/components/ui/Button";
import { X } from "lucide-react-native";
import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { Modal, Pressable, Text, View } from "react-native";

interface Props {
  visible: boolean;
  notes?: string;
  onClose: () => void;
  onSave: (notes: string) => void;
}

export default function EditNotesModal({
  visible,
  notes,
  onClose,
  onSave,
}: Props) {

  const methods = useForm({
    defaultValues: {
      notes: "",
    },
  });

  const { reset, handleSubmit, control } = methods;

  // prefill notes
  useEffect(() => {
    if (visible) {
      reset({
        notes: notes || "",
      });
    }
  }, [visible, notes]);

  const submitHandler = (values: any) => {
    onSave(values.notes);
  };

  if (!visible) return null;

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View className="flex-1 bg-black/40 justify-end">
        <View className="bg-white rounded-t-3xl p-5">

          {/* Header */}
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-lg font-semibold">Edit Notes</Text>
            <Pressable onPress={onClose}>
              <X size={22} />
            </Pressable>
          </View>

          <FormProvider {...methods}>

            <Input
              name="notes"
              control={control}
              label="Notes"
              placeholder="Write your health problem..."
              multiline
            />

            <View className="flex-row gap-3 mt-6 pb-10">
              <Button
                variant="outline"
                className="flex-1"
                onPress={onClose}
              >
                Cancel
              </Button>

              <Button
                className="flex-1"
                onPress={handleSubmit(submitHandler)}
              >
                Update
              </Button>
            </View>

          </FormProvider>
        </View>
      </View>
    </Modal>
  );
}
