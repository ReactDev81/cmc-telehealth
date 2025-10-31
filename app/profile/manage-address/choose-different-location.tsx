import * as Location from "expo-location";
import { useEffect, useState } from "react";
import { MapPin } from "lucide-react-native";
import { View, Text, ActivityIndicator, ScrollView, Alert } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Input from "@/components/form/Input";
import MapView, { Marker } from "react-native-maps";
import Button from "@/components/ui/Button";


const locationSchema = 
z.object({
    houseNumber: z.string().min(1, "House / Floor / Flat Number is required"),
    areaDetails: z.string().optional(),
    landmark: z.string().optional(),
pincode: z
    .string()
    .min(5, "Pincode must be at least 5 digits")
    .regex(/^\d+$/, "Pincode must contain only numbers"),
    city: z.string().min(1, "City is required"),
    state: z.string().min(1, "State is required"),
});

type LocationFormData = z.infer<typeof locationSchema>;

const ChooseDifferentLocation = () => {

    const { latitude, longitude } = useLocalSearchParams();
    const lat = parseFloat(latitude as string);
    const lon = parseFloat(longitude as string);

    const [address, setAddress] = useState<string | null>(null);
    const [streetName, setStreetName] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    const { control, handleSubmit, setValue, formState: { errors } } = useForm<LocationFormData>({
        resolver: zodResolver(locationSchema),
        defaultValues: {
            houseNumber: "",
            areaDetails: "",
            landmark: "",
            pincode: "",
            city: "",
            state: "",
        },
    });

    useEffect(() => {
        const getAddress = async () => {
            try {
                const [place] = await Location.reverseGeocodeAsync({
                    latitude: lat,
                    longitude: lon,
                });

                if (place) {
                    const formatted = `${place.name || ""}, ${place.street || ""}, ${
                        place.city || ""
                    }, ${place.region || ""}, ${place.postalCode || ""}`;
                    setAddress(formatted);
                    setStreetName(place.street);
                    setValue("pincode", place.postalCode || "");
                    setValue("city", place.city || "");
                    setValue("state", place.region || "");
                } else {
                    setAddress("Address not found");
                }
            } catch (error) {
                console.error("Reverse geocoding failed", error);
                setAddress("Unable to fetch address");
            } finally {
                setLoading(false);
            }
        };

        getAddress();
    }, [lat, lon]);

  
    const onSubmit = (data: LocationFormData) => {
        console.log("Form Data:", data);
        Alert.alert("Success", "Address saved successfully!");
        router.push("/profile/manage-address");
    };

    return (
        <ScrollView
            className="bg-white p-5"
            contentContainerStyle={{ paddingBottom: 40 }}
        >
            {loading ? (
                <ActivityIndicator size="small" color="#013220" style={{ marginTop: 6 }} />
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
                            <Text className="text-lg font-medium">{streetName}</Text>
                        </View>
                        <Text className="text-base text-black-400 rounded-xl mt-1">
                            {address}
                        </Text>
                    </View>
                </View>
            )}

            {/* 🧾 Form Inputs */}
            <View className="mt-5">

                <Input
                    name="houseNumber"
                    control={control}
                    label="House / Floor / Flat Number *"
                    autoCapitalize="none"
                />

                <Input
                    name="areaDetails"
                    control={control}
                    label="Area Details"
                    autoCapitalize="none"
                    containerClassName="mt-5"
                />

                <View>
                    <Input
                        name="landmark"
                        control={control}
                        label="Landmark"
                        autoCapitalize="none"
                        containerClassName="mt-5"
                    />
                    <Text className="text-base text-primary mt-2.5">
                        196m away from your selected location
                    </Text>
                </View>

                <View className="flex-row gap-x-2.5">
                    <View className="flex-1">
                        <Input
                            name="pincode"
                            control={control}
                            label="Pincode"
                            autoCapitalize="none"
                            keyboardType="numeric"
                            containerClassName="mt-5 flex-1"
                        />
                    </View>
                    <View className="flex-1">
                        <Input
                            name="city"
                            control={control}
                            label="City"
                            autoCapitalize="none"
                            containerClassName="mt-5"
                        />
                    </View>
                </View>

                <Input
                    name="state"
                    control={control}
                    label="State"
                    autoCapitalize="none"
                    containerClassName="mt-5"
                />

                <Button className="mt-7" onPress={handleSubmit(onSubmit)}>
                    Save & Next
                </Button>
            </View>
        </ScrollView>
    );
};

export default ChooseDifferentLocation;