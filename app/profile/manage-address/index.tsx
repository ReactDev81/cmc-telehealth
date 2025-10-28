import { View, Text, TouchableOpacity } from 'react-native'
import { useRef, useMemo, useCallback, useState } from 'react'
import * as Location from "expo-location";
import { router } from 'expo-router';
import { CirclePlus, BriefcaseBusiness, SquarePen, MapPin, X, LocateFixed } from 'lucide-react-native';
import BottomSheet, { BottomSheetBackdrop, BottomSheetView } from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Button from '@/components/ui/Button'

const ManageAddress = () => {

    const bottomSheetRef = useRef<BottomSheet>(null);
    const snapPoints = useMemo(() => ['40%'], []);
    const [isOpen, setIsOpen] = useState(false);
    const [location, setLocation] = useState<Location.LocationObject | null>(null);

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
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") return null;
      
        let loc = await Location.getCurrentPositionAsync({});
        setLocation(loc);
        return loc;
    };      

    const handleCurrentLocation = async () => {
        const loc = await getCurrentLocation();
      
        if (loc) {
            bottomSheetRef.current?.close();
            setIsOpen(false);
            router.push({
                pathname: '/profile/manage-address/add-current-location',
                params: {
                    latitude: loc.coords.latitude,
                    longitude: loc.coords.longitude,
                },
            });
        }
    };

    const handleChooseDifferentLocation = async () => {
        const loc = await getCurrentLocation();
      
        if (loc) {
            bottomSheetRef.current?.close();
            setIsOpen(false);
            router.push({
                pathname: '/profile/manage-address/choose-different-location',
                params: {
                    latitude: loc.coords.latitude,
                    longitude: loc.coords.longitude,
                },
            });
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

    return(
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

                <View className='border border-gray rounded-xl mt-5 px-5 py-4'>

                    <View className='flex-row items-center justify-between'>
                        <View className='flex-row items-center justify-center gap-x-2'>
                            <BriefcaseBusiness color="#013220" size={20} />
                            <Text>32 Sector</Text>
                        </View>
                        <TouchableOpacity>
                            <SquarePen size={16} color="#013220" />
                        </TouchableOpacity>
                    </View>
                    
                    <View className='mt-2'>
                        <Text className='text-sm text-black-400'>364, Sector32A, Ludhiana, PUNJAB, 141010</Text>
                    </View>

                </View>

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
                            <Text className='text-lg font-medium text-black'>Deliver to</Text>
                            <TouchableOpacity onPress={handleCloseModal}>
                                <X color="#1F1E1E" size={18} strokeWidth={2.5} />
                            </TouchableOpacity>
                        </View>

                        <View className='pt-5 pb-14 px-5'>

                            {/* Current Location Button */}
                            <Button 
                                icon={<LocateFixed color="#fff" size={18} />}
                                onPress={handleCurrentLocation}
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
                            >
                                Choose a different location
                            </Button>

                        </View>

                    </BottomSheetView>
                </BottomSheet>
            )}
        </GestureHandlerRootView>
    )
}
export default ManageAddress