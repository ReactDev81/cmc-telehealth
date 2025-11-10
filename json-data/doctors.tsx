import { AvailableDoctorsProps } from "@/types/home"

const AllDoctorsData: AvailableDoctorsProps[] = [
    {
        id: 1,
        image: require('../assets/images/doctors/jubbin-j-jacob.png'),
        name: 'Dr. Jubbin J Jacob',
        speciality: 'Endocrinology',
        rating: 4.6,
        reviews_count: '160 Patient' 
    },
    {
        id: 2,
        image: require('../assets/images/doctors/m-joseph-john.png'),
        name: 'Dr. M Joseph John',
        speciality: 'Clinical-haematology',
        rating: 4.5,
        reviews_count: '180 Patient' 
    },
    {
        id: 3,
        image: require('../assets/images/doctors/rajeshwar.png'),
        name: 'Dr Rajeshwar',
        speciality: 'Neurology',
        rating: 4.8,
        reviews_count: '240 Patient' 
    },
    {
        id: 4,
        image: require('../assets/images/doctors/nitin-batra.png'),
        name: 'Dr. Nitin Batra',
        speciality: 'Ophthalmology',
        rating: 4.8,
        reviews_count: '240 Patient' 
    },
    {
        id: 5,
        image: require('../assets/images/doctors/rupali-chopra.png'),
        name: 'Dr. Rupali Chopra',
        speciality: 'Ophthalmology',
        rating: 4.8,
        reviews_count: '240 Patient' 
    },
    {
        id: 6,
        image: require('../assets/images/doctors/vineeth-jaison.png'),
        name: 'Dr Vineeth Jaison',
        speciality: 'Neurology',
        rating: 4.8,
        reviews_count: '240 Patient' 
    }
]

export default AllDoctorsData