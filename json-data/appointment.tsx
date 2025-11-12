import { appointmentProps } from "@/types/appointment"

export const UpcomingAppointmentData: appointmentProps[] = [
    {
        id: 1,
        image: require('../assets/images/doctors/jubbin-j-jacob.png'),
        name: 'Dr. Jubbin J Jacob',
        speciality: 'Endocrinology',
        consultation_type: "video",
        consultation_fee: "1200",
        rating: 4.5,
        expercience: "(5 Years Exp)",
        date: 'Sat, Jun 18',
        time: '2:30 PM' 
    },
    {
        id: 2,
        image: require('../assets/images/doctors/m-joseph-john.png'),
        name: 'Dr. M Joseph John',
        speciality: 'Clinical-haematology',
        consultation_type: "clinic",
        consultation_fee: "1500",
        rating: 4.5,
        expercience: "(2 Years Exp)",
        date: 'Sat, Jun 18',
        time: '180 Patient' 
    },
    {
        id: 3,
        image: require('../assets/images/doctors/rajeshwar.png'),
        name: 'Dr Rajeshwar',
        speciality: 'Neurology',
        consultation_type: "video",
        consultation_fee: "800",
        rating: 4.5,
        expercience: "(1 Years Exp)",
        date: 'Sat, Jun 18',
        time: '240 Patient' 
    },
    {
        id: 4,
        image: require('../assets/images/doctors/nitin-batra.png'),
        name: 'Dr. Nitin Batra',
        speciality: 'Ophthalmology',
        consultation_type: "clinic",
        consultation_fee: "1000",
        rating: 4.5,
        expercience: "(3 Years Exp)",
        date: 'Sat, Jun 18',
        time: '240 Patient' 
    },
]

export const PastAppointmentData: appointmentProps[] = [
    {
        id: 1,
        status: 'completed',
        image: require('../assets/images/doctors/jubbin-j-jacob.png'),
        name: 'Dr. Jubbin J Jacob',
        speciality: 'Endocrinology',
        consultation_type: "video",
        consultation_fee: "800",
        rating: 4.5,
        expercience: "(1 Years Exp)",
        date: 'Sat, Jun 18',
        time: '2:30 PM' 
    },
    {
        id: 2,
        status: 'cancelled',
        image: require('../assets/images/doctors/m-joseph-john.png'),
        name: 'Dr. M Joseph John',
        speciality: 'Clinical-haematology',
        consultation_type: "video",
        consultation_fee: "1200",
        rating: 4.5,
        expercience: "(5 Years Exp)",
        date: 'Sat, Jun 18',
        time: '180 Patient' 
    },
    {
        id: 3,
        status: 'completed',
        image: require('../assets/images/doctors/rajeshwar.png'),
        name: 'Dr Rajeshwar',
        speciality: 'Neurology',
        consultation_type: "clinic",
        consultation_fee: "1000",
        rating: 4.5,
        expercience: "(3 Years Exp)",
        date: 'Sat, Jun 18',
        time: '240 Patient' 
    },
    {
        id: 4,
        status: 'completed',
        image: require('../assets/images/doctors/nitin-batra.png'),
        name: 'Dr. Nitin Batra',
        speciality: 'Ophthalmology',
        consultation_type: "video",
        consultation_fee: "1200",
        rating: 4.5,
        expercience: "(5 Years Exp)",
        date: 'Sat, Jun 18',
        time: '240 Patient' 
    },
]