import { appointmentProps } from "types/appointment"

export const UpcomingAppointmentData: appointmentProps[] = [
    {
        id: 1,
        image: require('../assets/images/doctors/jubbin-j-jacob.png'),
        link: '',
        name: 'Dr. Jubbin J Jacob',
        speciality: 'Endocrinology',
        date: 'Sat, Jun 18',
        time: '2:30 PM' 
    },
    {
        id: 2,
        image: require('../assets/images/doctors/m-joseph-john.png'),
        link: '',
        name: 'Dr. M Joseph John',
        speciality: 'Clinical-haematology',
        date: 'Sat, Jun 18',
        time: '180 Patient' 
    },
    {
        id: 3,
        image: require('../assets/images/doctors/rajeshwar.png'),
        link: '',
        name: 'Dr Rajeshwar',
        speciality: 'Neurology',
        date: 'Sat, Jun 18',
        time: '240 Patient' 
    },
    {
        id: 4,
        image: require('../assets/images/doctors/nitin-batra.png'),
        link: '',
        name: 'Dr. Nitin Batra',
        speciality: 'Ophthalmology',
        date: 'Sat, Jun 18',
        time: '240 Patient' 
    },
]

export const PastAppointmentData: appointmentProps[] = [
    {
        id: 1,
        status: 'completed',
        image: require('../assets/images/doctors/jubbin-j-jacob.png'),
        link: '',
        name: 'Dr. Jubbin J Jacob',
        speciality: 'Endocrinology',
        date: 'Sat, Jun 18',
        time: '2:30 PM' 
    },
    {
        id: 2,
        status: 'cancelled',
        image: require('../assets/images/doctors/m-joseph-john.png'),
        link: '',
        name: 'Dr. M Joseph John',
        speciality: 'Clinical-haematology',
        date: 'Sat, Jun 18',
        time: '180 Patient' 
    },
    {
        id: 3,
        status: 'completed',
        image: require('../assets/images/doctors/rajeshwar.png'),
        link: '',
        name: 'Dr Rajeshwar',
        speciality: 'Neurology',
        date: 'Sat, Jun 18',
        time: '240 Patient' 
    },
    {
        id: 4,
        status: 'completed',
        image: require('../assets/images/doctors/nitin-batra.png'),
        link: '',
        name: 'Dr. Nitin Batra',
        speciality: 'Ophthalmology',
        date: 'Sat, Jun 18',
        time: '240 Patient' 
    },
]