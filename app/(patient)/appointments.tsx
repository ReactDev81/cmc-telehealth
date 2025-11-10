import { View } from 'react-native';
import Tab, { TabItem } from '../../components/ui/Tab';
import UpcomingAppointments from '../../components/appointment/upcoming-appointments';
import PastAppointment from '../../components/appointment/past-appointments';


const Appointments = () => {

    const appointmentTabs: TabItem[] = [
        {
            key: 'upcoming',
            label: 'Upcoming',
            content: <UpcomingAppointments />
        },
        {
            key: 'past',
            label: 'Past',
            content:  <PastAppointment />
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