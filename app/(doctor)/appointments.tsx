import { View } from "react-native";
import Tab, { TabItem } from "@/components/ui/Tab";
import AllTodayAppointment from "@/components/doctor/appointment/all-today-appointment";
import AllUpcomingAppointment from "@/components/doctor/appointment/all-upcoming-appointment";
import AllPastAppointment from "@/components/doctor/appointment/all-past-appointment";

const Appointments = () => {

    const appointmentTabs: TabItem[] = [
        {
            key: 'today',
            label: 'Today',
            content: <AllTodayAppointment />
        },
        {
            key: 'upcoming',
            label: 'Upcoming',
            content: <AllUpcomingAppointment />
        },
        {
            key: 'past',
            label: 'Past',
            content:  <AllPastAppointment />
        }
    ]

    return (
         <View className='flex-1 bg-white p-5 pb-0'>
            <Tab 
                tabs={appointmentTabs}
                defaultTab='today'
            />
        </View>
    );
}

export default Appointments;