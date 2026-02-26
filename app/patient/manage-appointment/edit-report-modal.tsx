import FileUploadField from "@/components/form/FileUploadField";
import Input from "@/components/form/Input";
import SelectField from "@/components/form/selectField";
import Button from "@/components/ui/Button";
import { X } from "lucide-react-native";
import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { Modal, Pressable, Text, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";

interface Props {
  visible: boolean;
  report: any;
  onClose: () => void;
  onSave: (data: any) => void;
}

interface EditReportFormValues {
  name: string;
  type: string;
  file: any | null;
}

export default function EditReportModal({
  visible,
  report,
  onClose,
  onSave,
}: Props) {

  const methods = useForm<EditReportFormValues>({
    defaultValues: {
      name: "",
      type: "",
      file: null,
    },
  });

  const { reset, handleSubmit, control } = methods;
  /**
   * Prefill form when modal opens
   */
  useEffect(() => {
    if (report && visible) {
      const fileName = report.file_url?.split("/").pop();
  
      const extension = fileName?.split(".").pop()?.toLowerCase();
  
      const mimeTypes: any = {
        jpg: "image/jpeg",
        jpeg: "image/jpeg",
        png: "image/png",
        pdf: "application/pdf",
      };
  
      reset({
        name: report.title || "",
        type: report.type || "",
        file: report.file_url
          ? {
              uri: report.file_url,
              name: fileName,
              type:
                mimeTypes[extension] ||
                "application/octet-stream",
              isExisting: true,
            }
          : null,
      });
    }
  }, [report, visible]);
  

  /**
   * Submit handler
   */
  const submitHandler = (values: any) => {
    const payload: any = {
      id: report.id,
      name: values.name,
      type: values.type,
    };
  
    if (values.file && !values.file.isExisting) {
      const fileObj = values.file;
  
      payload.file = {
        uri: fileObj.uri,
        name:
          fileObj.name ||
          `report.${fileObj.uri.split(".").pop()}`,
        type:
          fileObj.mimeType ||
          fileObj.type ||
          "application/octet-stream",
      };
    }
  
    onSave(payload);
  };
  

  if (!report) return null;

  return (
    <Modal visible={visible} animationType="slide" transparent>
      
      <View className="flex-1 bg-black/40 justify-end">
        
        <View className="bg-white rounded-t-3xl p-5">
        <KeyboardAwareScrollView
            bottomOffset={20}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
        >

          {/* Header */}
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-lg font-semibold">Edit Report</Text>
            <Pressable onPress={onClose}>
              <X size={22} />
            </Pressable>
          </View>

          <FormProvider {...methods}>

            {/* Report Title */}
            <Input
              name="name"
              control={control}
              label="Report Title"
              placeholder="Enter report title"
            />

            {/* Report Type */}
            <SelectField
              name="type"
              control={control}
              label="Report Type"
              options={[
                { label: "Blood Test", value: "blood_test" },
                { label: "X-Ray", value: "x_ray" },
                { label: "MRI", value: "mri" },
                { label: "Prescription", value: "prescription" },
              ]}
              className="mt-4"
            />

            {/* Replace File */}
            <FileUploadField
              name="file"
              control={control}
              label="Replace File (optional)"
              className="mt-4"
            />

            {report?.file_url && (
            <Text className="text-xs text-gray-500 mt-2">
                Current file: {report.file_url?.split("/").pop()}
            </Text>
            )}

            {/* Buttons */}
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
          </KeyboardAwareScrollView>
        </View>
        
      </View>
      
    </Modal>
  );
}
