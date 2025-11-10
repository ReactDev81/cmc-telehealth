import { appointmentProps } from "@/types/doctor/appointment"

export const TodayAppointmentData: appointmentProps[] = [
    {
        id: 1,
        image: require('../../assets/images/patient/john-doe.png'),
        name: 'John Doe',
        mode : 'video',
        time: '10:00 AM'
    },  
    {
        id: 2,
        image: require('../../assets/images/patient/rahul-verma.png'),
        name: 'Rahul Verma',
        mode : 'clinic',
        time: '10:00 AM'
    },
    {
        id: 3,
        image: require('../../assets/images/patient/aniket-sharma.png'),
        name: 'Aniket Sharma',
        mode : 'clinic',
        time: '10:00 AM'
    },
    {
        id: 4,
        image: require('../../assets/images/patient/meera-nair.png'),
        name: 'Meera Nair',
        mode : 'clinic',
        time: '10:00 AM'
    },
]

export const UpcomingAppointmentData: appointmentProps[] = [
    {
        id: 1,
        image: require('../../assets/images/patient/david-wilson.png'),
        name: 'David Wilson',
        mode : 'video',
        date: 'Sat, Jul 30',
        time: '10:00 AM'
    },  
    {
        id: 2,
        image: require('../../assets/images/patient/meera-nair.png'),
        name: 'David Wilson',
        mode : 'clinic',
        date: 'Mon, Aug 12',
        time: '10:00 AM'
    },
    {
        id: 3,
        image: require('../../assets/images/patient/kavya-jain.png'),
        name: 'Kavya Jain',
        mode : 'video',
        date: 'Wed, Sep 25',
        time: '10:00 AM'
    },
    {
        id: 4,
        image: require('../../assets/images/patient/john-doe.png'),   
        name: 'John Doe',
        mode : 'video',
        date: 'Fri, Oct 05',
        time: '10:00 AM'
    },
]

export const PastAppointmentData: appointmentProps[] = [
    {
        id: 1,
        image: require('../../assets/images/patient/mark-stonis.png'),
        name: 'Mark Stonis',
        mode : 'video',
        status: 'completed',
        date: 'Sat, Jul 30',
        time: '10:00 AM'
    },  
    {
        id: 2,
        image: require('../../assets/images/patient/glen-clark.png'),
        name: 'Glen Clark',
        mode : 'clinic',
        status: 'cancelled',
        date: 'Mon, Aug 12',
        time: '10:00 AM'
    },
    {
        id: 3,
        image: require('../../assets/images/patient/rashmika-narang.png'),
        name: 'Rashmika Narang',
        mode : 'video',
        status: 'cancelled',
        date: 'Wed, Sep 25',
        time: '10:00 AM'
    },
    {
        id: 4,
        image: require('../../assets/images/patient/rohan-singh.png'),   
        name: 'Rohan Singh',
        mode : 'video',
        status: 'completed',
        date: 'Fri, Oct 05',
        time: '10:00 AM'
    },
]