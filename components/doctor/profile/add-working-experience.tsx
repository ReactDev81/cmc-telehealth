import { View, Text, Pressable, Alert } from "react-native";
import { X } from 'lucide-react-native';
import Input from "@/components/form/Input";
import DateField from "@/components/form/date";
import TextArea from "@/components/form/TextArea";
import { useForm } from 'react-hook-form';
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "@/components/ui/Button";

const WorkingExperienceSchema = z.object({
    job_title: z.string().min(2, "Job Title must be at least 2 characters long"),
    hospital_organization: z.string().min(2, "Hospital/Organization Name must be at least 2 characters long"),
    hospital_address: z.string().min(2, "Hospital Address is required"),
    start_date: z.date({ required_error: 'Start Date is required' }),
    end_date: z.date({ required_error: 'End Date is required' }),
    notes: z.string().min(2, "Notes is required"),
});
  
type WorkingExperienceFormData = z.infer<typeof WorkingExperienceSchema>;

const AddNewWorkingExperience = ({ onClose }: { onClose: () => void }) => {

    const { control, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm<WorkingExperienceFormData>({
        resolver: zodResolver(WorkingExperienceSchema),
        defaultValues: {
            job_title: '',
            hospital_organization: '',
            hospital_address: '',
            notes: '',
        }
    });

    const start_date = watch('start_date');
    const end_date = watch('end_date');

    const onSubmit = (data: any) => {
        console.log(data);
        Alert.alert("Success", "New experience saved successfully!");
        reset();
        onClose();
    }

    return(
        <View className="p-5 bg-white rounded-xl">

            {/* headet */}
            <View className="flex-row items-center justify-between">
                <Text className="text-black text-lg font-semibold">Add New Experience</Text>
                <Pressable onPress={onClose}>
                    <X size={18} color="#1F1E1E" strokeWidth={2.5} />
                </Pressable>
            </View>

            {/* form */}
            <View className="mt-5">

                <Input
                    name="job_title"
                    label="Job Title"
                    control={control}
                />

                <Input
                    name="hospital_organization"
                    label="Hospital/Organization"
                    control={control}
                    containerClassName="mt-5" 
                />

                <Input
                    name="hospital_address"
                    label="Address of Hospital"
                    control={control}
                    containerClassName="mt-5" 
                />

                <DateField
                    label="Start Date"
                    value={start_date}
                    onChange={(date) => setValue('start_date', date as Date, { shouldValidate: true })}
                    placeholder="DD/MM/YYYY"
                    maximumDate={new Date()}
                    error={errors.start_date?.message}
                    className="mt-5"
                />

                <DateField
                    label="End Date"
                    value={end_date}
                    onChange={(date) => setValue('end_date', date as Date, { shouldValidate: true })}
                    placeholder="DD/MM/YYYY"
                    maximumDate={new Date()}
                    error={errors.end_date?.message}
                    className="mt-5"
                />
                
                <TextArea
                    name="notes"
                    label="Notes"
                    control={control}
                    containerClassName="mt-5"
                />

                <Button onPress={handleSubmit(onSubmit)} className="mt-5">
                    Add Experience 
                </Button>
            </View>

        </View>
    )
}

export default AddNewWorkingExperience