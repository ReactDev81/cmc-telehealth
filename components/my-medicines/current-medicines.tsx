import { FlatList, View } from "react-native"
import MedicineCard from "./medicine-card"
import { MedicineCardProps } from "@/types/my-medicines"
import { CurrentMedicinesData } from "@/json-data/my-medicines"

const CurrentMedicines = () => {

    const renderMedicines = ({ item }: { item: MedicineCardProps }) => {

        const { patient_symptoms, doctor_name, consulated_date } = item;

        return(
            <MedicineCard 
                patient_symptoms={patient_symptoms}
                doctor_name={doctor_name}
                consulated_date={consulated_date}
            />
        )
    }

    return(
        <FlatList
            data={CurrentMedicinesData}
            renderItem={renderMedicines}
            ItemSeparatorComponent={() => <View className="h-5" />}
        />
    )
}

export default CurrentMedicines