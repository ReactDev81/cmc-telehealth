import { Appointment } from "@/app/(patient)/appointments";
import { FlatList, View } from "react-native";
import UpcomingAppointments from "./upcoming-appointments";

const AllUpcomingAppointment = ({ appointments }: { appointments: Appointment[] }) => {

    const renderDoctorItem = ({ item }: { item: Appointment }) => {

        return (
            <UpcomingAppointments
                appointment_id={item.appointment_id}
                image={item.doctor.avatar ? { uri: item.doctor.avatar } : require("../../../assets/images/demo.jpg")}
                name={item.doctor.name}
                speciality={item.doctor.department}
                rating={0}
                consultation_type={item.consultation_type_label}
                consultation_fee={item.fee_amount}
                experience={""}
                date={item.appointment_date_formatted}
                time={item.appointment_time_formatted}
                call_now={item.call_now}
                join_url={item.video_consultation?.join_url || item.join_url}
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

export default AllUpcomingAppointment;