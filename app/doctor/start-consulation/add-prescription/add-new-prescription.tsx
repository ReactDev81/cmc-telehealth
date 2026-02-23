import MedicineSearchBar from "@/components/doctor/MedicineSearchBar";
import SuccessModal from "@/components/doctor/prescription/SuccessModal";
import Checkbox from "@/components/form/checkbox";
import DateField from "@/components/form/date";
import SelectField from "@/components/form/selectField";
import TextArea from "@/components/form/TextArea";
import Button from "@/components/ui/Button";
import { useAuth } from "@/context/UserContext";
import { useAddPrescription } from "@/queries/doctor/useAddPrescription";
import { useMedicines } from "@/queries/doctor/useMedicines";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocalSearchParams } from "expo-router";
import { X } from "lucide-react-native";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Alert, Pressable, ScrollView, Text, View } from "react-native";
import { z } from "zod";

const PrescriptionSchema = z.object({
  medicine_id: z.string().min(1, "Medicine selection required"),
  medicine_name: z.string().min(2, "Medication required"),
  medication_type: z.string().min(1, "Medication type required"),
  dosage: z.string().min(1, "Dosage required"),
  frequency: z.string().min(1, "Frequency required"),
  timing_morning: z.boolean().optional(),
  timing_afternoon: z.boolean().optional(),
  timing_evening: z.boolean().optional(),
  timing_night: z.boolean().optional(),
  before_food: z.boolean().optional(),
  after_food: z.boolean().optional(),
  // is_ongoing: z.boolean().optional(),
  instructions: z.string().optional(),
  stamp_preference: z.string().min(1, "Stamp preference required"),
});

export type PrescriptionForm = z.infer<typeof PrescriptionSchema>;

const AddNewPrescription = ({ onClose }: { onClose: () => void }) => {
  const { token } = useAuth();
  const { appointment_id } = useLocalSearchParams<{ appointment_id: string }>();
  const addPrescription = useAddPrescription(appointment_id || "", token!);
  console.log("Prescription", addPrescription);

  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500); // Wait 500ms after user stops typing

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const medicinesQuery = useMedicines(token!, debouncedSearch);
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(null);

  const { control, handleSubmit, reset, setValue, watch } =
    useForm<PrescriptionForm>({
      resolver: zodResolver(PrescriptionSchema),
      defaultValues: {
        medicine_id: "",
        medicine_name: "",
        medication_type: "tablet",
        dosage: "",
        frequency: "",
        timing_morning: false,
        timing_afternoon: false,
        timing_evening: false,
        timing_night: false,
        before_food: false,
        after_food: false,
        // is_ongoing: false,
        instructions: "",
        stamp_preference: "both",
      },
    });

  const [showSuccess, setShowSuccess] = useState(false);

  const medicationType = watch("medication_type");

  // Reset dosage whenever the medicine type changes so stale values aren't submitted
  useEffect(() => {
    setValue("dosage", "");
  }, [medicationType, setValue]);

  // Returns dosage options appropriate for the selected medicine type
  const getDosageOptions = (type: string) => {
    const t = (type || "").toLowerCase();

    if (t.includes("tablet") || t.includes("capsule")) {
      return [
        { label: "½ Tablet", value: "0.5 tablet" },
        { label: "1 Tablet", value: "1 tablet" },
        { label: "1½ Tablets", value: "1.5 tablets" },
        { label: "2 Tablets", value: "2 tablets" },
        { label: "3 Tablets", value: "3 tablets" },
      ];
    }

    if (
      t.includes("liquid") ||
      t.includes("syrup") ||
      t.includes("suspension") ||
      t.includes("solution")
    ) {
      return [
        { label: "2.5 ml (½ spoon)", value: "2.5 ml" },
        { label: "5 ml (1 spoon)", value: "5 ml" },
        { label: "10 ml (2 spoons)", value: "10 ml" },
        { label: "15 ml (3 spoons)", value: "15 ml" },
        { label: "20 ml (4 spoons)", value: "20 ml" },
      ];
    }

    if (t.includes("drop")) {
      return [
        { label: "1 Drop", value: "1 drop" },
        { label: "2 Drops", value: "2 drops" },
        { label: "3 Drops", value: "3 drops" },
        { label: "4 Drops", value: "4 drops" },
      ];
    }

    if (t.includes("cream") || t.includes("ointment") || t.includes("gel")) {
      return [
        { label: "Thin layer", value: "thin layer" },
        { label: "Pea-sized amount", value: "pea-sized amount" },
        { label: "As prescribed", value: "as prescribed" },
      ];
    }

    // Injection / Inhaler / Patch / Other — generic
    return [
      { label: "1 Unit", value: "1 unit" },
      { label: "2 Units", value: "2 units" },
      { label: "As prescribed", value: "as prescribed" },
    ];
  };

  const dosageOptions = getDosageOptions(medicationType);

  const frequencyOptions = [
    { label: "Once a day", value: "OD" },
    { label: "Twice a day", value: "BD" },
    { label: "Three times a day", value: "TDS" },
    { label: "SOS", value: "SOS" },
  ];

  const stampOptions = [
    { label: "Both (Stamp & Signature)", value: "both" },
    { label: "Global Stamp", value: "only_global" },
    { label: "Department Stamp", value: "only_department" },
  ];

  const submit = (data: PrescriptionForm) => {
    const timings: string[] = [];
    if (data.timing_morning) timings.push("morning");
    if (data.timing_afternoon) timings.push("afternoon");
    if (data.timing_evening) timings.push("evening");
    if (data.timing_night) timings.push("night");

    const payload = {
      stamp_preference: data.stamp_preference,
      medicines: [
        {
          medicine_id: data.medicine_id,
          medicine_name: data.medicine_name,
          dosage: data.dosage,
          frequency: data.frequency,
          timings,
          before_food: data.before_food,
          after_food: data.after_food,
          start_date: startDate?.toISOString().split("T")[0],
          end_date: endDate?.toISOString().split("T")[0],
          // is_ongoing: data.is_ongoing,
          instructions: data.instructions,
        },
      ],
    };

    console.log(
      "📤 Prescription Data Payload:",
      JSON.stringify(payload, null, 2),
    );

    addPrescription.mutate(payload, {
      onSuccess: (response) => {
        console.log(
          "✅ Prescription Request SUCCESS:",
          JSON.stringify(response, null, 2),
        );
        setShowSuccess(true);
      },
      onError: (error: any) => {
        console.log("❌ Prescription Request FAILED:", error);
        console.log(
          "❌ Prescription Error Data:",
          JSON.stringify(error?.response?.data, null, 2),
        );

        const errorData = error?.response?.data;
        let errorMsg = "Failed to add prescription. Please try again.";

        if (errorData?.errors) {
          const firstKey = Object.keys(errorData.errors)[0];
          const firstError = errorData.errors[firstKey];
          errorMsg = Array.isArray(firstError)
            ? firstError[0]
            : typeof firstError === "string"
              ? firstError
              : errorMsg;
        } else if (errorData?.message) {
          errorMsg = errorData.message;
        }

        Alert.alert("Error", errorMsg);
      },
    });
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
    reset();
    setStartDate(new Date());
    setEndDate(null);
    onClose();
  };

  return (
    <View className="w-full">
      <View className="p-5 bg-white rounded-xl">
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-black text-lg font-semibold">
            Add Prescription
          </Text>
          <Pressable onPress={onClose}>
            <X size={18} />
          </Pressable>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          className="max-h-[550px]"
        >
          {watch("medicine_name") ? (
            <View className="flex-row items-center p-1.5 rounded-xl bg-transparent border border-gray mb-3">
              <View className="flex-row items-center bg-black-200 px-3 py-1.5 rounded-lg border border-primary-100">
                <Text className="text-black font-medium mr-2">
                  {watch("medicine_name")}
                </Text>
                <Pressable
                  onPress={() => {
                    setValue("medicine_name", "");
                    setValue("medicine_id", "");
                    setSelectedType(null);
                  }}
                >
                  <X size={16} color="#013220" />
                </Pressable>
              </View>
            </View>
          ) : (
            <MedicineSearchBar
              medicines={medicinesQuery.data || []}
              selectedType={selectedType}
              setSelectedType={(type) => {
                setSelectedType(type);
                if (type) {
                  setValue("medication_type", type);
                }
              }}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              onSelectMedicine={(m) => {
                setValue("medicine_id", m.id);
                setValue("medicine_name", m.name);
                setValue("medication_type", m.type || "tablet");
                setSelectedType(m.type || "tablet");
                setSearchQuery("");
              }}
            />
          )}

          <SelectField
            name="dosage"
            label={`Dosage* ${medicationType ? `(${medicationType})` : ""}`}
            control={control}
            options={dosageOptions}
            className="mt-4"
          />

          <SelectField
            name="frequency"
            label="Frequency*"
            control={control}
            options={frequencyOptions}
            className="mt-4"
          />

          {/* Timings */}
          <View className="mt-4">
            <Text className="text-sm font-medium text-black mb-2">Timings</Text>
            <View className="flex-row flex-wrap gap-x-3 gap-y-2">
              <Checkbox
                name="timing_morning"
                label="Morning"
                control={control}
              />
              <Checkbox
                name="timing_afternoon"
                label="Afternoon"
                control={control}
              />
              <Checkbox
                name="timing_evening"
                label="Evening"
                control={control}
              />
              <Checkbox name="timing_night" label="Night" control={control} />
            </View>
          </View>

          {/* Meal Instructions */}
          <View className="mt-4">
            <Text className="text-sm font-medium text-black mb-2">Meal</Text>
            <View className="flex-row gap-x-3">
              <Checkbox
                name="before_food"
                label="Before Meal"
                control={control}
              />
              <Checkbox
                name="after_food"
                label="After Meal"
                control={control}
              />
            </View>
          </View>

          {/* Duration */}
          <View className="mt-4">
            {/* <View className="flex-row items-center justify-between mb-2">
                            <Text className="text-sm font-medium text-black">Duration</Text>
                            <Checkbox name="is_ongoing" label="Ongoing" control={control} />
                        </View> */}
            <View className="flex-row gap-x-3">
              <View className="flex-1">
                <DateField
                  value={startDate}
                  onChange={setStartDate}
                  label="Start Date"
                />
              </View>

              <View className="flex-1">
                <DateField
                  value={endDate}
                  onChange={setEndDate}
                  label="End Date"
                />
              </View>
            </View>
          </View>

          <SelectField
            name="stamp_preference"
            label="Stamp Preference*"
            control={control}
            options={stampOptions}
            className="mt-4"
          />

          {/* Notes */}
          <TextArea
            name="instructions"
            label="Notes"
            control={control}
            containerClassName="mt-4"
          />

          <Button
            onPress={handleSubmit(submit)}
            className="mt-6 flex-row-reverse mb-4"
          >
            {addPrescription.isPending ? "Saving..." : "Add Prescription"}
          </Button>
        </ScrollView>
      </View>

      <SuccessModal visible={showSuccess} onClose={handleSuccessClose} />
    </View>
  );
};

export default AddNewPrescription;
