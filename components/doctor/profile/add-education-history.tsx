import DateField from "@/components/form/date";
import Input from "@/components/form/Input";
import Button from "@/components/ui/Button";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react-native";
import { useForm } from "react-hook-form";
import { Alert, Pressable, Text, View } from "react-native";
import { z } from "zod";

import { useAuth } from "@/context/UserContext";
import { useUpdateDoctorProfile } from "@/queries/doctor/useUpdateDoctorProfile";
import { EducationInfo } from "@/types/live/doctor/profile";
import { format } from "date-fns";

const EducationHistorySchema = z.object({
  degree: z.string().min(2, "Degree must be at least 2 characters long"),
  institution: z
    .string()
    .min(2, "Institution Name must be at least 2 characters long"),
  start_date: z.date({ required_error: "Start Date is required" }),
  end_date: z.date({ required_error: "End Date is required" }),
});

type EducationHistoryFormData = z.infer<typeof EducationHistorySchema>;

const AddNewEducationHistory = ({
  existingEducation = [],
  onClose,
}: {
  existingEducation?: EducationInfo[];
  onClose: () => void;
}) => {
  const { user } = useAuth();
  const doctorID = user?.id || "";

  const { mutate: updateProfile, isPending } = useUpdateDoctorProfile(
    doctorID,
    "education_info",
  );

  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<EducationHistoryFormData>({
    resolver: zodResolver(EducationHistorySchema),
    defaultValues: {
      degree: "",
      institution: "",
    },
  });

  const start_date = watch("start_date");
  const end_date = watch("end_date");

  const onSubmit = (data: EducationHistoryFormData) => {
    const newEducation = {
      degree: data.degree,
      institution: data.institution,
      start_date: format(data.start_date, "yyyy-MM-dd"),
      end_date: format(data.end_date, "yyyy-MM-dd"),
    };

    const payload = {
      education_info: [...existingEducation, newEducation],
    };

    updateProfile(payload, {
      onSuccess: () => {
        Alert.alert("Success", "Education history updated successfully!");
        reset();
        onClose();
      },
      onError: (error: any) => {
        console.log(error);
        Alert.alert(
          "Error",
          error?.response?.data?.message ||
            "Something went wrong while saving education",
        );
      },
    });
  };

  return (
    <View className="p-5 bg-white rounded-xl">
      {/* header */}
      <View className="flex-row items-center justify-between">
        <Text className="text-black text-lg font-semibold">
          Add Education History
        </Text>
        <Pressable onPress={onClose}>
          <X size={18} color="#1F1E1E" strokeWidth={2.5} />
        </Pressable>
      </View>

      {/* form */}
      <View className="mt-5">
        <Input
          name="degree"
          label="Degree"
          placeholder="e.g. MBBS"
          control={control}
        />

        <Input
          name="institution"
          label="Institution"
          placeholder="e.g. Govt Medical College"
          control={control}
          containerClassName="mt-5"
        />

        <DateField
          label="Start Date"
          value={start_date}
          onChange={(date) =>
            setValue("start_date", date as Date, { shouldValidate: true })
          }
          placeholder="DD/MM/YYYY"
          maximumDate={new Date()}
          error={errors.start_date?.message}
          className="mt-5"
        />

        <DateField
          label="End Date"
          value={end_date}
          onChange={(date) =>
            setValue("end_date", date as Date, { shouldValidate: true })
          }
          placeholder="DD/MM/YYYY"
          maximumDate={new Date()}
          error={errors.end_date?.message}
          className="mt-5"
        />

        <Button
          onPress={handleSubmit(onSubmit)}
          className="mt-5"
          disabled={isPending}
        >
          {isPending ? "Adding..." : "Add Education"}
        </Button>
      </View>
    </View>
  );
};

export default AddNewEducationHistory;
