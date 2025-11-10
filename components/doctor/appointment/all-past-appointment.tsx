import { ScrollView, View } from "react-native"
import PastAppointmentCard from "./past-appointment-card"
import { PastAppointmentData } from "@/json-data/doctor/appointment"

const AllPastAppointment = () => {
    return(
        <ScrollView>
            {PastAppointmentData.map((appointement) => {   
                return(
                    <View className="mb-5" key={appointement.id}>
                        <PastAppointmentCard
                            image={appointement.image}
                            name={appointement.name}
                            time={appointement.time}
                            date={appointement.date}
                            mode={appointement.mode}
                            status={appointement.status} 
                        />
                    </View>
                )
            })}
        </ScrollView>
    )
}

export default AllPastAppointment