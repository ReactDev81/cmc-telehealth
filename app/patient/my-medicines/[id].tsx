import { View, Text, ScrollView } from "react-native"
import { Link } from "expo-router"
import { MedicinesData } from "@/json-data/patient/my-medicines"
import MedicineAccordian from "@/components/patient/my-medicines/medicine-accordian"

const MedicinesDetail = () => {
    return(
        <ScrollView className="flex-1 bg-white p-5 pb-14">

            {MedicinesData.map((med) => (
                <MedicineAccordian
                    key={med.id}
                    medicine={med}
                    defaultExpanded={true}
                />
            ))}

            <View>
                <Text className="text-base font-medium text-black">Conclusion Report:</Text>
                <Text className="text-base text-black-400 mt-1.5">
                    This prescription for Lisinopril 10 mg is actively managing your hypertension to maintain healthy blood pressure levels
                </Text>   
            </View>

            <View className="flex-row item-center mt-2.5">
                <Text className="text-base font-medium text-black">Next Visit: </Text>
                <Text className="text-base text-black-400">2025-02-10 Tusday</Text>   
            </View>

            <View className="mt-3 pb-14">
                <Text className="text-base font-medium text-black mb-3">Uploaded Report's:</Text>
                <View className="flex-row items-center gap-x-2">
                    <Text className="text-base text-black-400 font-medium">Blood Test:</Text>
                    <Link href="/" className="text-base text-primary">View/Download Document</Link>
                </View>
                <View className="flex-row items-center gap-x-2 mt-1.5">
                    <Text className="text-base text-black-400 font-medium">X-Ray Test:</Text>
                    <Link href="/" className="text-base text-primary">View/Download Document</Link>
                </View> 
                <View className="flex-row items-center gap-x-2 mt-1.5">
                    <Text className="text-base text-black-400 font-medium">Depression and Anxiety:</Text>
                    <Link href="/" className="text-base text-primary">View/Download Document</Link>
                </View>     
            </View>
            

        </ScrollView>
    )
}

export default MedicinesDetail