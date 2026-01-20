import ReportsCard from '@/components/common/medical-reports/reports-card';
import Button from '@/components/ui/Button';
import { ReportCardData } from '@/json-data/common/medical-reports';
import BottomSheet, { BottomSheetBackdrop, BottomSheetView } from '@gorhom/bottom-sheet';
import { router } from 'expo-router';
import { X } from 'lucide-react-native';
import { useCallback, useMemo, useRef, useState } from 'react';
import { FlatList, Linking, Text, TouchableOpacity, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const MedicalRecords = () => {

    const bottomSheetRef = useRef<BottomSheet>(null);
    const snapPoints = useMemo(() => ['50%'], []);
    const [isOpen, setIsOpen] = useState(false);

    const reportTypes = [
        { label: "Abdominal Ultrasound Report", value: "abdominal_ultrasound_report" },
        { label: "Blood Test", value: "blood_test" },
        { label: "X-Ray", value: "x_ray" },
        { label: "Diabetes Screening Report", value: "diabetes_screening_report" },
        { label: "Endoscopy Report", value: "endoscopy_report" }
    ];      

    const handleOpenSheet = useCallback(() => {
        setIsOpen(true);
        setTimeout(() => {
          bottomSheetRef.current?.snapToIndex(0);
        }, 100);
    }, []);
    
    const handleCloseSheet = useCallback(() => {
        bottomSheetRef.current?.close();
        setIsOpen(false);
    }, []);

    const renderBackdrop = useCallback(
        (props: any) => (
            <BottomSheetBackdrop
                {...props}
                disappearsOnIndex={-1}
                appearsOnIndex={0}
                opacity={0.5}
                onPress={handleCloseSheet}
            />
        ),
        []
    );
    
    const handleSheetChanges = useCallback((index: number) => {
        if (index === -1) setIsOpen(false);
    }, []);

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>

            <View className="flex-1 bg-white p-5">
                <View>
                    <FlatList
                        data={ReportCardData}
                        keyExtractor={(item) => (item?.id ?? Math.random()).toString()}
                        renderItem={({ item }) => {

                            const handleViewReport = () => {
                                const pdfUrl = item.report_view;
                                if (pdfUrl) {
                                    Linking.openURL(pdfUrl);
                                }
                            };

                            return(
                                <ReportsCard
                                    report_name={item.report_name}
                                    report_date={item.report_date}
                                    doctor_name={item.doctor_name}
                                    report_type={item.report_type}
                                    handleReport={handleViewReport}
                                />
                            )
                        }}
                        ItemSeparatorComponent={() => <View style={{ height: 20 }} />}
                        showsVerticalScrollIndicator={false}
                    />
                </View>
            

                <View className='mt-8'>
                    <Button onPress={handleOpenSheet}>Upload New Report</Button>
                </View>
            </View>

            {/* Bottom Sheet Modal */}
            {isOpen && (
                <BottomSheet
                    ref={bottomSheetRef}
                    index={0}
                    snapPoints={snapPoints}
                    enablePanDownToClose={true}
                    backdropComponent={renderBackdrop}
                    onChange={handleSheetChanges}
                    backgroundStyle={{
                        backgroundColor: '#fff',
                        borderTopLeftRadius: 20,
                        borderTopRightRadius: 20,
                    }}
                    handleIndicatorStyle={{ width: 0 }}
                >
                    <BottomSheetView style={{ flex: 1 }}>

                        {/* Header */}
                        <View 
                            className="flex-row justify-between items-center p-5 pt-0"
                            style={{
                                boxShadow: '0px 0px 4px 0px rgba(0, 0, 0, 0.25)'
                            }}
                        >
                            <Text className="text-lg font-semibold">Select Report Type</Text>
                            <TouchableOpacity onPress={handleCloseSheet}>
                                <X color="#1F1E1E" size={18} strokeWidth={2.5} />
                            </TouchableOpacity>
                        </View>

                        {/* List of report types */}
                        <View className='pb-5'>
                        {reportTypes.map((item) => (
                            <TouchableOpacity
                                key={item.value}
                                className="p-5 border-b border-black-200"
                                onPress={() => {
                                    router.push({
                                        pathname: "/patient/profile/medical-reports/upload-your-report",
                                        params: {
                                            reportType: item.value,
                                        },
                                    });
                                    handleCloseSheet();
                                }}
                            >
                                <Text className="text-base text-gray-700">
                                    {item.label}
                                </Text>
                            </TouchableOpacity>
                        ))}
                        </View>

                    </BottomSheetView>
                </BottomSheet>
            )}
        </GestureHandlerRootView>
    );
};

export default MedicalRecords;