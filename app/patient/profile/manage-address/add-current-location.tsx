import Button from '@/components/ui/Button';
import { useAuth } from "@/context/UserContext";
import { useSavePatientAddress } from "@/queries/patient/useSavePatientAddress";
import * as Location from 'expo-location';
import { router, useLocalSearchParams } from 'expo-router';
import { MapPin } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Text, View } from "react-native";
import MapView, { Marker } from 'react-native-maps';


const AddCurrentLocation = () => {

    const { latitude, longitude } = useLocalSearchParams();
    const lat = parseFloat(latitude as string);
    const lon = parseFloat(longitude as string);

    const [address, setAddress] = useState<string | null>(null);
    const [district, setDistrict] = useState<string | null>(null);
    const [place, setPlace] = useState<Location.LocationGeocodedAddress | null>(null);
    const [loading, setLoading] = useState(true);

    const { user } = useAuth();
    const { mutate, isPending } = useSavePatientAddress(user?.id ?? "");  

    // console.log('place ', place)

    useEffect(() => {
        const getAddress = async () => {
            try {
                const [place] = await Location.reverseGeocodeAsync({
                    latitude: lat,
                    longitude: lon,
                });

                if (place) {
                    setAddress(place.formattedAddress);
                    setDistrict(place.district);
                    setPlace(place);
                    // console.log('place', place);
                } else {
                    setAddress('Address not found');
                }
            } catch (error) {
                // console.error('Reverse geocoding failed', error);
                setAddress('Unable to fetch address');
            } finally {
                setLoading(false);
            }
        };

        getAddress();
    }, [lat, lon]);

    const onSubmit = () => {
        if (!place) {
          Alert.alert("Error", "Location details are not available yet.");
          return;
        }

        const payload = {
          address: (place.name ?? "") + " " + (place.district ?? ""),
          area: place.district ?? "",
          pincode: place.postalCode ?? "",
          city: place.city ?? "",
          state: place.region ?? "",
          group: "address" as const,
        };
    
        mutate(payload, {
          onSuccess: (response) => {
            Alert.alert(
              "Success",
              response?.message || "Address updated successfully!"
            );
            router.replace("/patient/profile/manage-address");
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
        <View className='flex-1 relative'>

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

            <View className='w-full absolute bottom-0 left-0 right-0 rounded-t-3xl p-5 pb-14 bg-white'>

                <View className='bg-primary-100 rounded-xl p-5 mb-5'>
                    {loading ? (
                        <ActivityIndicator size="small" color="#013220" style={{ marginTop: 6 }} />
                    ) : (
                        <>
                            <View className='flex-row items-center gap-x-2'>
                                <MapPin size={20} color="#1F1E1E" />
                                <Text className='text-lg font-medium'>
                                    {district}
                                </Text>
                            </View>
                            <Text className='text-base text-black-400 rounded-xl mt-1'>
                                {address}
                            </Text>
                        </>
                    )}
                </View>

                <Button 
                    disabled={isPending} onPress={onSubmit}
                // onPress={() => router.replace('/patient/profile/manage-address')}
                >
                    Proceed
                </Button>

            </View>

        </View>
    )
}

export default AddCurrentLocation