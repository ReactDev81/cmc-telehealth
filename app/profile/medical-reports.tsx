import { FlatList, View, Linking } from 'react-native';
import ReportsCard from '@/components/medical-reports/reports-card';
import { ReportCardData } from '@/json-data/medical-reports';

const MedicalRecords = () => {
    return (
        <View className="flex-1 bg-white p-5">
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
    );
};

export default MedicalRecords;
