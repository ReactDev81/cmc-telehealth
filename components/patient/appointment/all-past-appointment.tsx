import { appointmentProps } from "@/types/patient/appointment";
import { FlatList, View } from "react-native";
import PastAppointment from "./past-appointments";

const AllPastAppointment = ({ appointments }: { appointments: appointmentProps[] }) => {

    const renderDoctorItem = ({ item }: { item: appointmentProps }) => {
        return (
            <PastAppointment
                id={item.id}
                status={item.status_label}
                image={item.doctor?.avatar}
                name={item.doctor?.name}
                speciality={item.doctor.department}
                rating={item.doctor?.average_rating}
                consultation_type={item.consultation_type_label}
                consultation_fee={item.fee_amount}
                experience={item.doctor?.years_experience}
                date={item.appointment_date_formatted}
                time={item.appointment_time_formatted}
            />
        );
    };

    return (
        <FlatList
            data={appointments}
            renderItem={renderDoctorItem}
            keyExtractor={(item, index) => index.toString()}
            showsVerticalScrollIndicator={false}
            ItemSeparatorComponent={() => <View className="h-5" />}
        />
    )
}

export default AllPastAppointment