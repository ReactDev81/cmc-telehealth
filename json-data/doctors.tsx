import { AvailableDoctorsProps } from "@/types/home"

const AllDoctorsData: AvailableDoctorsProps[] = [
    {
        id: 1,
        image: require('../assets/images/doctors/jubbin-j-jacob.png'),
        name: 'Dr. Jubbin J Jacob',
        speciality: 'Endocrinology',
        rating: 4.6,
        consultation_type: 'video',
        consultation_fee: '1500',
        expercience: '(5 Years Exp)'
    },
    {
        id: 2,
        image: require('../assets/images/doctors/m-joseph-john.png'),
        name: 'Dr. M Joseph John',
        speciality: 'Clinical-haematology',
        rating: 4.5,
        consultation_type: 'video',
        consultation_fee: '500', 
        expercience: '(2 Years Exp)'
    },
    {
        id: 3,
        image: require('../assets/images/doctors/rajeshwar.png'),
        name: 'Dr Rajeshwar',
        speciality: 'Neurology',
        rating: 4.8,
        consultation_type: 'clinic',
        consultation_fee: '800',
        expercience: '(3 Years Exp)'
    },
    {
        id: 4,
        image: require('../assets/images/doctors/nitin-batra.png'),
        name: 'Dr. Nitin Batra',
        speciality: 'Ophthalmology',
        rating: 4.8,
        consultation_type: 'video',
        consultation_fee: '1200',
        expercience: '(5 Years Exp)'
    },
    {
        id: 5,
        image: require('../assets/images/doctors/rupali-chopra.png'),
        name: 'Dr. Rupali Chopra',
        speciality: 'Ophthalmology',
        rating: 4.8,
        consultation_type: 'clinic',
        consultation_fee: '900',
        expercience: '(4 Years Exp)'
    },
    {
        id: 6,
        image: require('../assets/images/doctors/vineeth-jaison.png'),
        name: 'Dr Vineeth Jaison',
        speciality: 'Neurology',
        rating: 4.8,
        consultation_type: 'video',
        consultation_fee: '2500',
        expercience: '(8 Years Exp)'
    }
]

export default AllDoctorsData