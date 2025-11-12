import * as Location from 'expo-location';
import { useEffect, useState } from 'react';
import { MapPin } from 'lucide-react-native';
import { View, Text, ActivityIndicator } from "react-native"
import { router } from 'expo-router';
import MapView, { Marker } from 'react-native-maps';
import { useLocalSearchParams } from 'expo-router';
import Button from '@/components/ui/Button';


const AddCurrentLocation = () => {

    const { latitude, longitude } = useLocalSearchParams();
    const lat = parseFloat(latitude as string);
    const lon = parseFloat(longitude as string);

    const [address, setAddress] = useState<string | null>(null);
    const [streetName, setStreetName] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getAddress = async () => {
            try {
                const [place] = await Location.reverseGeocodeAsync({
                    latitude: lat,
                    longitude: lon,
                });

                if (place) {
                    const formatted = `${place.name || ''}, ${place.street || ''}, ${place.city || ''}, ${place.region || ''}, ${place.postalCode || ''}`;
                    setAddress(formatted);
                    setStreetName(place.street);
                } else {
                    setAddress('Address not found');
                }
            } catch (error) {
                console.error('Reverse geocoding failed', error);
                setAddress('Unable to fetch address');
            } finally {
                setLoading(false);
            }
        };
    
        getAddress();
    }, [lat, lon]);

    return(
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
                                    {streetName}
                                </Text>
                            </View>
                            <Text className='text-base text-black-400 rounded-xl mt-1'>
                                {address}
                            </Text>
                        </>
                    )}
                </View>

                <Button onPress={() => router.push('/patient/profile/manage-address')}>Proceed</Button>

            </View>
            
      </View>
    )
}

export default AddCurrentLocation