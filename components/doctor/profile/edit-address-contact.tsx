import Input from "@/components/form/Input";
import Button from "@/components/ui/Button";
import { useAuth } from "@/context/UserContext";
import { useUpdateDoctorProfile } from "@/queries/doctor/useUpdateDoctorProfile";
import { AddressContact } from "@/types/live/doctor/profile";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from 'lucide-react-native';
import { useForm } from 'react-hook-form';
import { Alert, Pressable, ScrollView, Text, View } from "react-native";
import { z } from "zod";

const AddressContactSchema = z.object({
    address_line1: z.string().min(2, "Address Line 1 must be at least 2 characters long"),
    address_line2: z.string().optional().or(z.literal('')),
    city: z.string().min(2, "City is required"),
    state: z.string().min(2, "State is required"),
    country: z.string().min(2, "Country is required"),
    postal_code: z.string().min(4, "Postal code must be at least 4 characters long"),
});

type AddressContactFormData = z.infer<typeof AddressContactSchema>;

const EditAddressContact = ({
    initialData,
    onClose
}: {
    initialData?: AddressContact,
    onClose: () => void
}) => {
    const { user } = useAuth();
    const doctorID = user?.id || "";

    const { mutate: updateProfile, isPending } = useUpdateDoctorProfile(doctorID, "address_contact");

    const { control, handleSubmit, reset } = useForm<AddressContactFormData>({
        resolver: zodResolver(AddressContactSchema),
        defaultValues: {
            address_line1: initialData?.address_line1 || '',
            address_line2: initialData?.address_line2 || '',
            city: initialData?.city || '',
            state: initialData?.state || '',
            country: initialData?.country || '',
            postal_code: initialData?.postal_code || '',
        }
    });

    const onSubmit = (data: AddressContactFormData) => {
        // Postman shows a flat structure for address_contact
        const payload = {
            ...data,
            group: "address_contact"
        };

        updateProfile(payload, {
            onSuccess: () => {
                Alert.alert("Success", "Address & contact information updated successfully!");
                reset();
                onClose();
            },
            onError: (error: any) => {
                console.log(error);
                Alert.alert("Error", error?.response?.data?.message || "Something went wrong while saving address");
            }
        });
    }

    return (
        <View className="max-h-[85%] p-5 bg-white rounded-xl">

            {/* header */}
            <View className="flex-row items-center justify-between mb-5">
                <Text className="text-black text-lg font-semibold">Edit Address & Contact</Text>
                <Pressable onPress={onClose}>
                    <X size={18} color="#1F1E1E" strokeWidth={2.5} />
                </Pressable>
            </View>

            {/* form */}
            <ScrollView showsVerticalScrollIndicator={false}>
                <View className="gap-y-4">
                    <Input
                        name="address_line1"
                        label="Address Line 1"
                        placeholder="House no, Street"
                        control={control}
                    />

                    <Input
                        name="address_line2"
                        label="Address Line 2 (Optional)"
                        placeholder="Locality, Landmark"
                        control={control}
                    />

                    <Input
                        name="city"
                        label="City"
                        placeholder="e.g. Ludhiana"
                        control={control}
                    />

                    <Input
                        name="state"
                        label="State"
                        placeholder="e.g. Punjab"
                        control={control}
                    />

                    <Input
                        name="country"
                        label="Country"
                        placeholder="e.g. India"
                        control={control}
                    />

                    <Input
                        name="postal_code"
                        label="Postal Code"
                        placeholder="e.g. 141001"
                        control={control}
                        keyboardType="numeric"
                    />

                    <Button onPress={handleSubmit(onSubmit)} className="mt-2 mb-4" disabled={isPending}>
                        {isPending ? "Saving..." : "Save Changes"}
                    </Button>
                </View>
            </ScrollView>

        </View>
    )
}

export default EditAddressContact
