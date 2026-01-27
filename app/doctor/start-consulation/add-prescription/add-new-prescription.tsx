// import Checkbox from "@/components/form/checkbox";
// import DateField from "@/components/form/date";
// import Input from "@/components/form/Input";
// import SelectField from "@/components/form/selectField";
// import TextArea from "@/components/form/TextArea";
// import Button from "@/components/ui/Button";
// import { useAuth } from "@/context/UserContext";
// import { useAddPrescription } from "@/queries/doctor/useAddPrescription";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useLocalSearchParams } from "expo-router";
// import { X } from 'lucide-react-native';
// import { useState } from 'react';
// import { useForm } from 'react-hook-form';
// import { Alert, Pressable, Text, View } from "react-native";
// import { z } from "zod";

// const PrescriptionSchema = z.object({
//     medicine_name: z.string().min(2, "Medication must be at least 2 characters long"),
//     medication_type: z.string().min(1, "Medication type is required"),
//     dosage: z.string().min(1, "Dosage is required"),
//     frequency: z.string().min(1, "Frequency is required"),
//     timing_morning: z.boolean().optional(),
//     timing_afternoon: z.boolean().optional(),
//     timing_night: z.boolean().optional(),
//     before_food: z.boolean().optional(),
//     after_food: z.boolean().optional(),
//     is_ongoing: z.boolean().optional(),
//     instructions: z.string().optional(),
// });

// type PrescriptionFormData = z.infer<typeof PrescriptionSchema>;

// const AddNewPrescription = ({ onClose }: { onClose: () => void }) => {

//     const { token } = useAuth();
//     const { appointmentId } = useLocalSearchParams();
//     const addPrescriptionMutation = useAddPrescription(
//         appointmentId as string,
//         token!
//     );


//     const [startDate, setStartDate] = useState<Date | null>(new Date());
//     const [endDate, setEndDate] = useState<Date | null>(null);

//     const { control, handleSubmit, reset, watch } = useForm<PrescriptionFormData>({
//         resolver: zodResolver(PrescriptionSchema),
//         defaultValues: {
//             medicine_name: '',
//             medication_type: '',
//             dosage: '',
//             frequency: '',
//             timing_morning: false,
//             timing_afternoon: false,
//             timing_night: false,
//             before_food: false,
//             after_food: false,
//             is_ongoing: false,
//             instructions: ''
//         }
//     });

//     const medicationType = watch('medication_type');

//     const medicationTypeOptions = [
//         { label: "Tablet", value: "tablet" },
//         { label: "Liquid", value: "liquid" },
//     ];

//     const tabletDosageOptions = [
//         { label: "Half Tablet", value: "0.5 tablet" },
//         { label: "1 Tablet", value: "1 tablet" },
//         { label: "1.5 Tablets", value: "1.5 tablets" },
//         { label: "2 Tablets", value: "2 tablets" },
//     ];

//     const liquidDosageOptions = [
//         { label: "Half Spoon", value: "0.5 spoon" },
//         { label: "1 Spoon", value: "1 spoon" },
//         { label: "1.5 Spoons", value: "1.5 spoons" },
//         { label: "2 Spoons", value: "2 spoons" },
//     ];

//     const getDosageOptions = () => {
//         if (medicationType === 'tablet') return tabletDosageOptions;
//         if (medicationType === 'liquid') return liquidDosageOptions;
//         return [];
//     };

//     const frequencyOptions = [
//         { label: "Once a day", value: "OD" },
//         { label: "Twice a day", value: "BD" },
//         { label: "Three times a day", value: "TDS" },
//         { label: "Four times a day / As needed", value: "SOS" },
//     ];



//     const onSubmit = (data: any) => {
//         const timings: string[] = [];
//         if (data.timing_morning) timings.push("morning");
//         if (data.timing_afternoon) timings.push("afternoon");
//         if (data.timing_night) timings.push("night");

//         const payload = {
//             medicines: [
//                 {
//                     medicine_name: data.medicine_name,
//                     dosage: data.dosage,
//                     frequency: data.frequency,
//                     timings,
//                     before_food: data.before_food,
//                     after_food: data.after_food,
//                     start_date: startDate?.toISOString().split("T")[0] || null,
//                     end_date: endDate?.toISOString().split("T")[0] || null,
//                     is_ongoing: data.is_ongoing,
//                     instructions: data.instructions
//                 }
//             ]
//         };

//         addPrescriptionMutation.mutate(payload, {
//             onSuccess: () => {
//                 Alert.alert("Success", "Prescription added successfully!");
//                 reset();
//                 setStartDate(new Date());
//                 setEndDate(null);
//                 onClose();
//             },
//             onError: () => {
//                 Alert.alert("Error", "Failed to add prescription");
//             }
//         });
//     };

//     return (
//         <View className="p-5 bg-white rounded-xl">

//             {/* headet */}
//             <View className="flex-row items-center justify-between">
//                 <Text className="text-black text-lg font-semibold">Add New Prescriptions</Text>
//                 <Pressable onPress={onClose}>
//                     <X size={18} color="#1F1E1E" strokeWidth={2.5} />
//                 </Pressable>
//             </View>

//             {/* form */}
//             <View className="mt-5">

//                 {/* <Input
//                     name="medicine_name"
//                     label="Medication*"
//                     control={control}
//                     placeholder="Search Here for Medicine"
//                 /> */}

//                 <SelectField
//                     name="medication_type"
//                     label="Medication Type*"
//                     control={control}
//                     options={medicationTypeOptions}
//                     placeholder="Select medication type"
//                     className="mt-5"
//                 />

//                 {medicationType && (
//                     <SelectField
//                         name="dosage"
//                         label="Dosage*"
//                         control={control}
//                         options={getDosageOptions()}
//                         placeholder={`Select ${medicationType} dosage`}
//                         className="mt-5"
//                     />
//                 )}

//                 <SelectField
//                     name="frequency"
//                     label="Frequency*"
//                     control={control}
//                     options={frequencyOptions}
//                     placeholder="Drop Down to select frequency"
//                     className="mt-5"
//                 />

//                 {/* Timings */}
//                 <View className="mt-5">
//                     <Text className="text-sm font-medium text-black mb-2">Timings*</Text>
//                     <View className="flex-row items-center gap-x-6">
//                         <Checkbox
//                             name="timing_morning"
//                             control={control}
//                             label="Morning"
//                         />
//                         <Checkbox
//                             name="timing_afternoon"
//                             control={control}
//                             label="Afternoon"
//                         />
//                         <Checkbox
//                             name="timing_night"
//                             control={control}
//                             label="Night"
//                         />
//                     </View>
//                 </View>

//                 {/* Meal Instructions */}
//                 <View className="mt-5">
//                     <Text className="text-sm font-medium text-black mb-2">Meal Instructions*</Text>
//                     <View className="flex-row items-center gap-x-6">
//                         <Checkbox
//                             name="before_food"
//                             control={control}
//                             label="Before Meal"
//                         />
//                         <Checkbox
//                             name="after_food"
//                             control={control}
//                             label="After Meal"
//                         />
//                     </View>
//                 </View>

//                 {/* Duration */}
//                 <View className="mt-5">
//                     <Text className="text-sm font-medium text-black mb-2">Duration*</Text>
//                     <View className="flex-row items-center gap-x-3">
//                         <View className="flex-1">
//                             <DateField
//                                 value={startDate}
//                                 onChange={(date) => setStartDate(date || null)}
//                                 placeholder="Current Date"
//                             />
//                         </View>
//                         <View className="flex-1">
//                             <DateField
//                                 value={endDate}
//                                 onChange={(date) => setEndDate(date || null)}
//                                 placeholder="Select Date"
//                                 minimumDate={startDate || undefined}
//                             />
//                         </View>
//                     </View>
//                 </View>

//                 {/* Ongoing */}
//                 <View className="mt-5">
//                     <Checkbox
//                         name="is_ongoing"
//                         control={control}
//                         label="This is an ongoing medication"
//                     />
//                 </View>

//                 <TextArea
//                     name="instructions"
//                     label="Notes*"
//                     control={control}
//                     placeholder="Notes"
//                     containerClassName="mt-5"
//                 />

//                 {/* <Button
//                     onPress={handleSubmit(onSubmit)}
//                     className="mt-5 flex-row-reverse"
//                     icon={<ChevronRight size={16} color="#fff" strokeWidth={3} />}
//                 >
//                     Add Prescriptions
//                 </Button> */}
//                 <Button
//                     disabled={addPrescriptionMutation.isPending}
//                     className="mt-5 flex-row-reverse"
//                 >
//                     {addPrescriptionMutation.isPending ? "Saving..." : "Add Prescription"}
//                 </Button>
//             </View>

//         </View >
//     )
// }

// export default AddNewPrescription


import MedicineSearchBar from "@/components/doctor/MedicineSearchBar";
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
import { ActivityIndicator, Alert, Pressable, Text, View } from "react-native";
import { z } from "zod";

const PrescriptionSchema = z.object({
    medicine_name: z.string().min(2, "Medication required"),
    medication_type: z.string().min(1, "Medication type required"),
    dosage: z.string().min(1, "Dosage required"),
    frequency: z.string().min(1, "Frequency required"),
    timing_morning: z.boolean().optional(),
    timing_afternoon: z.boolean().optional(),
    timing_night: z.boolean().optional(),
    before_food: z.boolean().optional(),
    after_food: z.boolean().optional(),
    is_ongoing: z.boolean().optional(),
    instructions: z.string().optional(),
});

type PrescriptionFormData = z.infer<typeof PrescriptionSchema>;

const AddNewPrescription = ({ onClose }: { onClose: () => void }) => {
    const { token } = useAuth();
    const { appointmentId } = useLocalSearchParams();
    const addPrescriptionMutation = useAddPrescription(appointmentId as string, token!);

    const [selectedType, setSelectedType] = useState("Tablet");
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

    const { control, handleSubmit, reset, setValue, watch } = useForm<PrescriptionFormData>({
        resolver: zodResolver(PrescriptionSchema),
        defaultValues: {
            medicine_name: "",
            medication_type: "tablet",
            dosage: "",
            frequency: "",
            timing_morning: false,
            timing_afternoon: false,
            timing_night: false,
            before_food: false,
            after_food: false,
            is_ongoing: false,
            instructions: "",
        },
    });

    if (medicinesQuery.isLoading)
        return (
            <View className="p-5"><ActivityIndicator /></View>
        );

    const medicines = medicinesQuery.data || [];

    const medicationType = watch("medication_type");

    const medicationTypeOptions = [
        { label: "Tablet", value: "tablet" },
        { label: "Liquid", value: "liquid" },
    ];

    const tabletDosageOptions = [
        { label: "Half Tablet", value: "0.5 tablet" },
        { label: "1 Tablet", value: "1 tablet" },
        { label: "1.5 Tablets", value: "1.5 tablets" },
        { label: "2 Tablets", value: "2 tablets" },
    ];

    const liquidDosageOptions = [
        { label: "Half Spoon", value: "0.5 spoon" },
        { label: "1 Spoon", value: "1 spoon" },
        { label: "1.5 Spoons", value: "1.5 spoons" },
        { label: "2 Spoons", value: "2 spoons" },
    ];

    const frequencyOptions = [
        { label: "Once a day", value: "OD" },
        { label: "Twice a day", value: "BD" },
        { label: "Three times a day", value: "TDS" },
        { label: "SOS", value: "SOS" },
    ];

    const onSubmit = (data: any) => {
        const timings: string[] = [];
        if (data.timing_morning) timings.push("morning");
        if (data.timing_afternoon) timings.push("afternoon");
        if (data.timing_night) timings.push("night");

        const payload = {
            medicines: [
                {
                    medicine_name: data.medicine_name,
                    dosage: data.dosage,
                    frequency: data.frequency,
                    timings,
                    before_food: data.before_food,
                    after_food: data.after_food,
                    start_date: startDate?.toISOString().split("T")[0],
                    end_date: endDate?.toISOString().split("T")[0] || null,
                    is_ongoing: data.is_ongoing,
                    instructions: data.instructions,
                },
            ],
        };

        addPrescriptionMutation.mutate(payload, {
            onSuccess: () => {
                Alert.alert("Success", "Prescription added!");
                reset();
                setStartDate(new Date());
                setEndDate(null);
                onClose();
            },
        });
    };

    return (
        <View className="p-5 bg-white rounded-xl">

            <View className="flex-row items-center justify-between">
                <Text className="text-black text-lg font-semibold">Add Prescription</Text>
                <Pressable onPress={onClose}>
                    <X size={18} />
                </Pressable>
            </View>

            <MedicineSearchBar
                medicines={medicines}
                selectedType={selectedType}
                setSelectedType={(type) => {
                    setSelectedType(type);
                    setValue("medication_type", type.toLowerCase());
                }}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                onSelectMedicine={(m) => {
                    setValue("medicine_name", m.name);
                    setValue("medication_type", m.type.toLowerCase());
                    setSelectedType(m.type);
                    setSearchQuery("");
                }}
            />

            {medicationType && (
                <SelectField
                    name="dosage"
                    label="Dosage*"
                    control={control}
                    options={medicationType === "tablet" ? tabletDosageOptions : liquidDosageOptions}
                    className="mt-4"
                />
            )}

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
                <View className="flex-row gap-x-3">
                    <Checkbox name="timing_morning" label="Morning" control={control} />
                    <Checkbox name="timing_afternoon" label="Afternoon" control={control} />
                    <Checkbox name="timing_night" label="Night" control={control} />
                </View>
            </View>

            {/* Meal Instructions */}
            <View className="mt-4">
                <Text className="text-sm font-medium text-black mb-2">Meal</Text>
                <View className="flex-row gap-x-3">
                    <Checkbox name="before_food" label="Before Meal" control={control} />
                    <Checkbox name="after_food" label="After Meal" control={control} />
                </View>
            </View>

            {/* Duration */}
            <View className="mt-4">
                <Text className="text-sm font-medium text-black mb-2">Duration</Text>
                <View className="flex-row gap-x-3">
                    <DateField value={startDate} onChange={setStartDate} />
                    <DateField value={endDate} onChange={setEndDate} />
                </View>
            </View>

            {/* Notes */}
            <TextArea name="instructions" label="Notes" control={control} className="mt-4" />

            <Button onPress={handleSubmit(onSubmit)} className="mt-5 flex-row-reverse">
                {addPrescriptionMutation.isPending ? "Saving..." : "Add Prescription"}
            </Button>
        </View>
    );
};

export default AddNewPrescription;
