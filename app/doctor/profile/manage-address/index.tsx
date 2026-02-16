import Button from '@/components/ui/Button';
import { useAuth } from '@/context/UserContext';
import BottomSheet, { BottomSheetBackdrop, BottomSheetView } from '@gorhom/bottom-sheet';
import * as Location from "expo-location";
import { router } from 'expo-router';
import { BriefcaseBusiness, CirclePlus, LocateFixed, MapPin, SquarePen, X } from 'lucide-react-native';
import { useCallback, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, Alert, Text, TouchableOpacity, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const ManageAddress = () => {

    const bottomSheetRef = useRef<BottomSheet>(null);
    const snapPoints = useMemo(() => ['40%'], []);
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();

    const address = user?.address;

    const handleAddAddress = () => {
        setIsOpen(true);
        setTimeout(() => {
            bottomSheetRef.current?.snapToIndex(0);
        }, 100);
    };

    const handleCloseModal = () => {
        bottomSheetRef.current?.close();
        setIsOpen(false);
    };

    const getCurrentLocation = async () => {
        try {
            const servicesEnabled = await Location.hasServicesEnabledAsync();

            if (!servicesEnabled) {
                Alert.alert(
                    'Location services disabled',
                    'Turn on location / GPS services in your device settings, then try again or choose a different location.'
                );
                return null;
            }

            let { status } = await Location.requestForegroundPermissionsAsync();

            if (status !== "granted") {
                Alert.alert(
                    'Location permission needed',
                    'Allow location access in your device settings to use your current location, or choose a different location instead.'
                );
                return null;
            }

            let loc = await Location.getCurrentPositionAsync({});
            return loc;
        } catch (error) {
            Alert.alert(
                'Unable to fetch location',
                'We could not get your current location. Please try again, or choose a different location.'
            );
            return null;
        }
    };

    const handleCurrentLocation = async () => {
        if (loading) return;
        setLoading(true);
        try {
            const loc = await getCurrentLocation();

            if (loc) {
                bottomSheetRef.current?.close();
                setIsOpen(false);
                router.replace({
                    pathname: '/doctor/profile/manage-address/add-current-location',
                    params: {
                        latitude: loc.coords.latitude,
                        longitude: loc.coords.longitude,
                    },
                });
            }
        } finally {
            setLoading(false);
        }
    };

    const handleChooseDifferentLocation = async () => {
        if (loading) return;
        setLoading(true);
        try {
            const loc = await getCurrentLocation();

            if (loc) {
                bottomSheetRef.current?.close();
                setIsOpen(false);
                router.replace({
                    pathname: '/doctor/profile/manage-address/choose-different-location',
                    params: {
                        latitude: loc.coords.latitude,
                        longitude: loc.coords.longitude,
                    },
                });
            }
        } finally {
            setLoading(false);
        }
    };

    const renderBackdrop = useCallback(
        (props: any) => (
            <BottomSheetBackdrop
                {...props}
                disappearsOnIndex={-1}
                appearsOnIndex={0}
                opacity={0.5}
                onPress={handleCloseModal}
            />
        ),
        []
    );

    const handleSheetChanges = useCallback((index: number) => {
        if (index === -1) {
            setIsOpen(false);
        }
    }, []);

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>

            <View className='flex-1 bg-white p-5'>

                <View className='border border-gray rounded-xl p-5 w-full h-32 items-center justify-center'>
                    <Button
                        icon={<CirclePlus color="#fff" size={18} />}
                        onPress={handleAddAddress}
                    >
                        Add New Address
                    </Button>
                </View>


                {address?.address == null ? '' :
                    <View className='border border-gray rounded-xl mt-5 px-5 py-4'>

                        <View className='flex-row items-center justify-between'>
                            <View className='flex-row items-center justify-center gap-x-2'>
                                <BriefcaseBusiness color="#013220" size={20} />
                                <Text>
                                    {address?.area ? address?.area : address?.address}
                                </Text>
                            </View>
                            <TouchableOpacity onPress={handleChooseDifferentLocation}>
                                <SquarePen size={16} color="#013220" />
                            </TouchableOpacity>
                        </View>

                        <View className='mt-2'>
                            <Text className='text-sm text-black-400'>
                                {`${address?.address}, ${address?.city}, ${address?.state}, ${address?.pincode}`}
                            </Text>
                        </View>

                    </View>
                }

            </View>

            {/* Bottom Sheet */}
            {isOpen && (
                <BottomSheet
                    ref={bottomSheetRef}
                    index={0}
                    snapPoints={snapPoints}
                    enablePanDownToClose={true}
                    backdropComponent={renderBackdrop}
                    onChange={handleSheetChanges}
                    backgroundStyle={{ backgroundColor: '#fff' }}
                    handleIndicatorStyle={{ backgroundColor: '#ccc', width: 40 }}
                >
                    <BottomSheetView style={{ flex: 1 }}>

                        {/* Header */}
                        <View
                            className='flex-row items-center justify-between p-5 pt-0'
                            style={{
                                boxShadow: '0px 0px 4px 0px rgba(0, 0, 0, 0.25)'
                            }}
                        >
                            <Text className='text-lg font-medium text-black'>Set Practice Location</Text>
                            <TouchableOpacity onPress={handleCloseModal}>
                                <X color="#1F1E1E" size={18} strokeWidth={2.5} />
                            </TouchableOpacity>
                        </View>

                        <View className='pt-5 pb-14 px-5'>

                            {/* Current Location Button */}
                            <Button
                                icon={<LocateFixed color="#fff" size={18} />}
                                onPress={handleCurrentLocation}
                                disabled={loading}
                            >
                                Current Location
                            </Button>

                            {/* Divider with "Or" */}
                            <View className='flex-row items-center my-4'>
                                <View className='flex-1 h-[1px] bg-gray' />
                                <Text className='text-sm text-gray font-medium mx-3'>Or</Text>
                                <View className='flex-1 h-[1px] bg-gray' />
                            </View>

                            {/* Choose Different Location Button */}
                            <Button
                                icon={<MapPin color="#1F1E1E" size={18} />}
                                onPress={handleChooseDifferentLocation}
                                variant='outline'
                                disabled={loading}
                            >
                                Choose a different location
                            </Button>

                        </View>

                        {loading && (
                            <View
                                style={{
                                    position: 'absolute',
                                    left: 0,
                                    right: 0,
                                    top: 0,
                                    bottom: 0,
                                    backgroundColor: 'rgba(255,255,255,0.85)',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                                pointerEvents="auto"
                            >
                                <ActivityIndicator size="large" />
                                <Text style={{ marginTop: 12 }}>Getting location…</Text>
                            </View>
                        )}

                    </BottomSheetView>
                </BottomSheet>
            )}
        </GestureHandlerRootView>
    )
}
export default ManageAddress
