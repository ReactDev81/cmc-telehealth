import Input from "@/components/form/Input";
import Button from "@/components/ui/Button";
import { useAuth } from "@/context/UserContext";
import { useUpdateDoctorProfile } from "@/queries/doctor/useUpdateDoctorProfile";
import { zodResolver } from "@hookform/resolvers/zod";
import * as Location from "expo-location";
import { router, useLocalSearchParams } from "expo-router";
import { MapPin } from "lucide-react-native";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { ActivityIndicator, Alert, ScrollView, Text, View } from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as z from "zod";

const locationSchema = z.object({
    address_line1: z.string().min(1, "Address Line 1 is required"),
    address_line2: z.string().optional(),
    city: z.string().min(1, "City is required"),
    state: z.string().min(1, "State is required"),
    country: z.string().min(1, "Country is required"),
    postal_code: z
        .string()
        .min(4, "Postal code must be at least 4 characters")
        .regex(/^\d+$/, "Postal code must contain only numbers"),
});

type LocationFormData = z.infer<typeof locationSchema>;

const ChooseDifferentLocation = () => {

    const { latitude, longitude } = useLocalSearchParams();
    const lat = parseFloat(latitude as string);
    const lon = parseFloat(longitude as string);

    const [address, setAddress] = useState<string | null>(null);
    const [district, setDistrict] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const { user, updateUser } = useAuth();

    useEffect(() => {
        if (isNaN(lat) || isNaN(lon)) {
            Alert.alert("Error", "Invalid coordinates provided.");
            router.back();
            return;
        }
    }, [lat, lon]);

    const doctorID = user?.id || "";
    const { mutate, isPending } = useUpdateDoctorProfile(doctorID, "address_contact");

    const {
        control,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<LocationFormData>({
        resolver: zodResolver(locationSchema),
        defaultValues: {
            address_line1: "",
            address_line2: "",
            city: "",
            state: "",
            country: "",
            postal_code: "",
        },
    });

    useEffect(() => {
        const getAddress = async () => {
            if (isNaN(lat) || isNaN(lon)) return;
            try {
                const [place] = await Location.reverseGeocodeAsync({
                    latitude: lat,
                    longitude: lon,
                });

                if (place) {
                    const formatted = place.formattedAddress;
                    setAddress(formatted);
                    setDistrict(place.district)
                    setValue("address_line1", `${place.name} ${place.district}` || "");
                    setValue("address_line2", place.street || "");
                    setValue("postal_code", place.postalCode || "");
                    setValue("city", place.city || "");
                    setValue("state", place.region || "");
                    setValue("country", place.country || "");
                } else {
                    setAddress("Address not found");
                }
            } catch (error) {
                setAddress("Unable to fetch address");
            } finally {
                setLoading(false);
            }
        };

        getAddress();
    }, [lat, lon]);

    const onSubmit = (formData: LocationFormData) => {

        const payload = {
            address_line1: formData.address_line1,
            address_line2: formData.address_line2 ?? "",
            city: formData.city,
            state: formData.state,
            country: formData.country,
            postal_code: formData.postal_code,
            group: "address_contact" as const,
        };

        mutate(payload, {
            onSuccess: (response: any) => {
                const updatedAddress = response?.data;
                if (updatedAddress) {
                    updateUser({
                        address: {
                            address: updatedAddress.address_line1,
                            area: updatedAddress.address_line1,
                            city: updatedAddress.city,
                            state: updatedAddress.state,
                            pincode: updatedAddress.postal_code,
                            landmark: updatedAddress.address_line2 || null,
                        }
                    });
                }

                Alert.alert(
                    "Success",
                    response?.message || "Practice location updated successfully!"
                );

                router.replace("/doctor/profile/manage-address");
            },
            onError: (error: any) => {
                Alert.alert(
                    "Error",
                    error?.response?.data?.message || "Failed to update address"
                );
            },
        });
    };

    return (
        <ScrollView
            className="bg-white p-5 mb-14"
            contentContainerStyle={{ paddingBottom: 40 }}
        >
            {loading ? (
                <ActivityIndicator
                    size="small"
                    color="#013220"
                    style={{ marginTop: 6 }}
                />
            ) : (
                <View className="rounded-xl">
                    <View className="overflow-hidden rounded-t-xl h-32">
                        <MapView
                            style={{ flex: 1 }}
                            initialRegion={{
                                latitude: lat,
                                longitude: lon,
                                latitudeDelta: 0.01,
                                longitudeDelta: 0.01,
                            }}
                        >
                            <Marker coordinate={{ latitude: lat, longitude: lon }} />
                        </MapView>
                    </View>

                    <View className="bg-primary-100 rounded-b-xl p-5">
                        <View className="flex-row items-center gap-x-2">
                            <MapPin size={20} color="#1F1E1E" />
                            <Text className="text-lg font-medium">{district}</Text>
                        </View>
                        <Text className="text-base text-black-400 rounded-xl mt-1">
                            {address}
                        </Text>
                    </View>
                </View>
            )}

            {/* Form Inputs */}
            <View className="mt-5">
                <Input
                    name="address_line1"
                    control={control}
                    label="Address Line 1 *"
                    placeholder="House no, Street"
                    autoCapitalize="none"
                />

                <Input
                    name="address_line2"
                    control={control}
                    label="Address Line 2 (Optional)"
                    placeholder="Locality, Landmark"
                    autoCapitalize="none"
                    containerClassName="mt-5"
                />

                <View className="flex-row gap-x-2.5">
                    <View className="flex-1">
                        <Input
                            name="postal_code"
                            control={control}
                            label="Postal Code *"
                            autoCapitalize="none"
                            keyboardType="numeric"
                            containerClassName="mt-5 flex-1"
                        />
                    </View>
                    <View className="flex-1">
                        <Input
                            name="city"
                            control={control}
                            label="City *"
                            autoCapitalize="none"
                            containerClassName="mt-5"
                        />
                    </View>
                </View>

                <Input
                    name="state"
                    control={control}
                    label="State *"
                    autoCapitalize="none"
                    containerClassName="mt-5"
                />

                <Input
                    name="country"
                    control={control}
                    label="Country *"
                    autoCapitalize="none"
                    containerClassName="mt-5"
                />

                <Button className="mt-7" disabled={isPending} onPress={handleSubmit(onSubmit)}>
                    {isPending ? "Saving..." : "Save & Proceed"}
                </Button>
            </View>
        </ScrollView>
    );
};

export default ChooseDifferentLocation;
