import { ScrollView, View } from "react-native"
import UpcomingAppointmentCard from "./upcoming-appointment-card"
import { UpcomingAppointmentData } from "@/json-data/doctor/appointment"

const AllUpcomingAppointment = () => {
    return(
        <ScrollView>
            {UpcomingAppointmentData.map((appointement) => {   
                return(
                    <View className="mb-5" key={appointement.id}>
                        <UpcomingAppointmentCard
                            image={appointement.image}
                            name={appointement.name}
                            time={appointement.time}
                            date={appointement.date}
                            mode={appointement.mode}  
                        />
                    </View>
                )
            })}
        </ScrollView>
    )
}

export default AllUpcomingAppointment