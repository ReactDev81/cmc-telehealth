import CurrentMedicines from "@/components/patient/my-medicines/current-medicines";
import PastMedicines from "@/components/patient/my-medicines/past-mediciines";
import Tab, { TabItem } from "@/components/ui/Tab";
import { View } from "react-native";

const MyMedicines = () => {
    const medicinesTabs: TabItem[] = [
        {
            key: "current",
            label: "Current Medicine",
            content: <CurrentMedicines />,
        },
        {
            key: "past",
            label: "Past Medicine",
            content: <PastMedicines />,
        },
    ];

    return (
        <View className="flex-1 bg-white p-5 pb-0">
            <Tab tabs={medicinesTabs} defaultTab="current" />
        </View>
    );
};

export default MyMedicines;
