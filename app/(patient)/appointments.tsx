import { View } from 'react-native';
import Tab, { TabItem } from '../../components/ui/Tab';
import AllUpcomingAppointment from '@/components/patient/appointment/all-upcoming-appointment';
import AllPastAppointment from '@/components/patient/appointment/all-past-appointment';


const Appointments = () => {

    const appointmentTabs: TabItem[] = [
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
                defaultTab='upcoming'
            />
        </View>
    );
}

export default Appointments