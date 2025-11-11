import { ScrollView } from "react-native"
import { Link } from "expo-router"
import PastAppointmentCard from "./past-appointment-card"
import { PastAppointmentData } from "@/json-data/doctor/appointment"

const AllPastAppointment = () => {
    return(
        <ScrollView>
            {PastAppointmentData.map((appointement) => {   
                return(
                    <Link href='/doctor/appointment-detail' className="mb-5" key={appointement.id}>
                        <PastAppointmentCard
                            image={appointement.image}
                            name={appointement.name}
                            time={appointement.time}
                            date={appointement.date}
                            mode={appointement.mode}
                            status={appointement.status} 
                        />
                    </Link>
                )
            })}
        </ScrollView>
    )
}

export default AllPastAppointment