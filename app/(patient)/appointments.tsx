import AllPastAppointment from '@/components/patient/appointment/all-past-appointment';
import AllUpcomingAppointment from '@/components/patient/appointment/all-upcoming-appointment';
import { useAuth } from "@/context/UserContext";
import useAxios from '@/hooks/useApi';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import Tab, { TabItem } from '../../components/ui/Tab';


export type Appointment = {
    id: string;
    slug: string;
    appointment_date: string;
    appointment_date_formatted: string;
    appointment_time: string;
    appointment_time_formatted: string;
    consultation_type: 'video' | 'in-person';
    consultation_type_label: string;
    status: string;
    status_label: string;
    fee_amount: string;
    notes?: {
        reason?: string;
        symptoms?: string[];
        allergies?: string | null;
        problem?: string;
    };
    doctor: {
        id: string;
        name: string;
        first_name: string;
        last_name: string;
        avatar: string | null;
        department: string;
        slug: string;
    };
};


type AppointmentResponse = {
    success: boolean;
    filter: 'past' | 'upcoming';
    data: Appointment[];
};

const Appointments = () => {
    const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
    const { token } = useAuth();
    const { data, error, loading, fetchData } = useAxios<AppointmentResponse>(
        'get',
        `/appointments/my?filter=${activeTab}`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: 'application/json',
            },
        }
    );

    // console.log('Appointments Data:', data?.data ?? []);

    useEffect(() => {
        fetchData();
    }, [activeTab]);

    const appointmentTabs: TabItem[] = [
        {
            key: 'upcoming',
            label: 'Upcoming',
            content: loading ? (
                <ActivityIndicator />
            ) : (
                <AllUpcomingAppointment appointments={data?.data ?? []} />
            ),
        },
        {
            key: 'past',
            label: 'Past',
            content: loading ? (
                <ActivityIndicator />
            ) : (
                <AllPastAppointment appointments={data?.data ?? []} />
            ),
        },
    ];

    // console.log("appointment data :", data?.data)

    if (error) {
        return (
            <View className="flex-1 items-center justify-center">
                <Text className="text-red-500">Failed to load appointments</Text>
            </View>
        );
    }

    return (
        <View className="flex-1 bg-white p-5 pb-0">
            <Tab
                tabs={appointmentTabs}
                defaultTab="upcoming"
                onTabChange={(key) =>
                    setActiveTab(key as 'upcoming' | 'past')
                }
            />
        </View>
    );
};

export default Appointments;
