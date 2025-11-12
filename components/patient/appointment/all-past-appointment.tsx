import { View, FlatList } from "react-native"
import { appointmentProps } from "@/types/patient/appointment"
import { PastAppointmentData } from "@/json-data/patient/appointment"
import PastAppointment from "./past-appointments"

const AllPastAppointment = () => {

    const renderDoctorItem = ({ item } : { item: appointmentProps }) => {
        return (
            <PastAppointment
                id={item.id}
                status={item.status}
                image={item.image}
                name={item.name}
                speciality={item.speciality}
                rating={item.rating}
                consultation_type={item.consultation_type}
                consultation_fee={item.consultation_fee}
                expercience={item.expercience}
                date={item.date}
                time={item.time}
            />
        );
    };

    return(
        <FlatList
            data={PastAppointmentData}
            renderItem={renderDoctorItem}
            keyExtractor={(item, index) => index.toString()}
            showsVerticalScrollIndicator={false}
            ItemSeparatorComponent={() => <View className="h-5" />}
        />
    )
}

export default AllPastAppointment