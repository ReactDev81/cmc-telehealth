import DateField from "@/components/form/date";
import SelectField from "@/components/form/selectField";
import TextArea from "@/components/form/TextArea";
import Button from "@/components/ui/Button";
import { useApplyLeave } from "@/mutations/doctor/useApplyLeave";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { ChevronRight, X } from "lucide-react-native";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { Alert, Modal, ScrollView, Text, TouchableOpacity, View } from "react-native";
import * as z from "zod";

const leaveSchema = z.object({
    leaveType: z.string().min(1, "Leave type is required"),
    startDate: z.date({ required_error: "Start date is required" }),
    endDate: z.date({ required_error: "End date is required" }),
    reason: z.string().min(1, "Reason is required"),
});

type LeaveFormValues = z.infer<typeof leaveSchema>;

interface ApplyLeaveModalProps {
    visible: boolean;
    onClose: () => void;
}

const ApplyLeaveModal = ({ visible, onClose }: ApplyLeaveModalProps) => {
    const { mutate: applyLeave, isPending } = useApplyLeave();

    const {
        control,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<LeaveFormValues>({
        resolver: zodResolver(leaveSchema),
        defaultValues: {
            leaveType: "",
            reason: "",
        },
    });

    // Log errors to console to help debugging
    useEffect(() => {
        if (Object.keys(errors).length > 0) {
            console.log('Form Validation Errors:', errors);
        }
    }, [errors]);

    const onSubmit = (data: LeaveFormValues) => {
        console.log('Submitting leave data:', data);
        const typeMap: Record<string, string> = {
            annual_vacation: "annual",
            sick_leave: "sick",
            casual_leave: "casual",
        };

        applyLeave(
            {
                type: typeMap[data.leaveType] || data.leaveType,
                start_date: format(data.startDate, "yyyy-MM-dd"),
                end_date: format(data.endDate, "yyyy-MM-dd"),
                reason: data.reason,
            },
            {
                onSuccess: (res) => {
                    Alert.alert("Success", res.message || "Leave applied successfully!");
                    reset();
                    onClose();
                },
                onError: (err: any) => {
                    // Log the full response data more explicitly
                    const errorData = err?.response?.data;
                    Alert.alert(
                        "Error",
                        errorData?.errors?.message || err.message || "Failed to apply leave. Please try again."
                    );
                },

            }

        );
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <View className="flex-1 bg-black/50 items-center justify-center p-5">
                <View className="bg-white w-full max-w-sm rounded-xl p-6 shadow-xl overflow-hidden">

                    {/* Header */}
                    <View className="flex-row justify-between items-center mb-6">
                        <Text className="text-xl font-bold text-black font-semibold">Apply Leave</Text>
                        <TouchableOpacity onPress={onClose} activeOpacity={0.7} className="p-1">
                            <X size={24} color="#000" />
                        </TouchableOpacity>
                    </View>

                    <ScrollView showsVerticalScrollIndicator={false} className="max-h-[80vh]">
                        <View className="gap-y-5">

                            {/* Leave Type */}
                            <SelectField
                                name="leaveType"
                                label="Leave Type"
                                control={control}
                                placeholder="Select Leave Type"
                                options={[
                                    { label: "Annual Leave", value: "annual" },
                                    { label: "Sick Leave", value: "sick" },
                                    { label: "Casual Leave", value: "casual" },
                                    { label: "Telehealth Leave", value: "telehealth" },
                                ]}
                            />

                            {/* Start Date */}
                            <Controller
                                control={control}
                                name="startDate"
                                render={({ field: { value, onChange } }) => (
                                    <DateField
                                        label="Start Date"
                                        value={value}
                                        onChange={onChange}
                                        error={errors.startDate?.message as string | undefined}
                                    />
                                )}
                            />

                            {/* End Date */}
                            <Controller
                                control={control}
                                name="endDate"
                                render={({ field: { value, onChange } }) => (
                                    <DateField
                                        label="End Date"
                                        value={value}
                                        onChange={onChange}
                                        error={errors.endDate?.message as string | undefined}
                                    />
                                )}
                            />

                            {/* Reason for Leave */}
                            <TextArea
                                name="reason"
                                label="Reason for Leave"
                                control={control}
                                placeholder="Write your reason here..."
                            />

                            {/* Submit Button */}
                            <Button
                                onPress={() => {
                                    console.log('Apply Leave button clicked');
                                    handleSubmit(onSubmit)();
                                }}
                                className="mt-4 flex-row-reverse"
                                icon={<ChevronRight size={20} color="#fff" />}
                                disabled={isPending}
                            >
                                {isPending ? "Applying..." : "Apply Leave"}
                            </Button>

                        </View>
                    </ScrollView>

                </View>
            </View>
        </Modal>
    );
};

export default ApplyLeaveModal;