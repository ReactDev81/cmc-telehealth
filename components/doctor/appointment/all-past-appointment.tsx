import { Appointment } from "@/types/doctor/appointment"
import { Link } from "expo-router"
import { ScrollView } from "react-native"
import PastAppointmentCard from "./past-appointment-card"

const AllPastAppointment = ({data}: {data?: Appointment[]}) => {
    const defaultAvatar = "https://cdn-icons-png.flaticon.com/512/387/387561.png";
    const appointments = data || [];

    return(
        <ScrollView>
            {appointments.map((appointement) => {   
                const imageSource = appointement.patient.avatar 
                    ? { uri: appointement.patient.avatar }
                    : { uri: defaultAvatar };

                return(
                    <Link href='/doctor/appointment-detail' className="mb-5" key={appointement.appointment_id}>
                        <PastAppointmentCard
                            image={imageSource}
                            name={appointement.patient.name}
                            time={appointement.appointment_time_formatted}
                            date={appointement.appointment_date_formatted}
                            mode={appointement.consultation_type === "video" ? "Video" : "In Person"}
                            status={appointement.status_label} 
                        />
                    </Link>
                )
            })}
        </ScrollView>
    )
}

export default AllPastAppointment