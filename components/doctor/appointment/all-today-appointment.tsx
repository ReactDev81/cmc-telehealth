import { ScrollView, View} from "react-native"
import TodayAppointmentCard from "./today-appointment-card"
import { TodayAppointmentData } from "@/json-data/doctor/appointment"

const AllTodayAppointment = () => {
    return(
        <ScrollView>
            {TodayAppointmentData.map((appointement) => {   
                return(
                    <View className="mb-5" key={appointement.id}>
                        <TodayAppointmentCard
                            image={appointement.image}
                            name={appointement.name}
                            time={appointement.time}
                            mode={appointement.mode}  
                        />
                    </View>
                )
            })}
        </ScrollView>
    )
}

export default AllTodayAppointment