import { SpecialityProps } from '@/types/home';
import { AvailableDoctorsProps } from '@/types/home';
import { ArticleProps } from '@/types/home';
import { TestimonialProps } from '@/types/home';

export const SpecialityData: SpecialityProps[] = [
    {
        id: 1,
        image: require('../assets/images/speciality/neurology.png'),
        link: '',
        speciality: 'Neurology'
    },
    {
        id: 2,
        image: require('../assets/images/speciality/cordiology.png'),
        link: '',
        speciality: 'Cordiology'
    },
    {
        id: 3,
        image: require('../assets/images/speciality/orthopedics.png'),
        link: '',
        speciality: 'Orthopedics'
    },
    {
        id: 4,
        image: require('../assets/images/speciality/pathology.png'),
        link: '',
        speciality: 'Pathology'
    },
    {
        id: 5,
        image: require('../assets/images/speciality/dermatology.png'),
        link: '',
        speciality: 'Dermatology'
    }
]

export const AvailableDoctorsData: AvailableDoctorsProps[] = [
    {
        id: 1,
        image: require('../assets/images/doctors/jubbin-j-jacob.png'),
        name: 'Dr. Jubbin J Jacob',
        speciality: 'Endocrinology',
        rating: 4.6,
        consultation_type: 'video',
        consultation_fee: '2500',
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
        name: 'Dr Rajeshwar ',
        speciality: 'Neurology',
        rating: 4.8,
        consultation_type: 'clinic',
        consultation_fee: '800',
        expercience: '(3 Years Exp)'
    }
]

export const ArticleData: ArticleProps[] = [
    {
        id: 1,
        name: 'Advanced Knee Replacement, Quick Recovery',
        first_point: 'Minimally Invasive Procedure',
        second_point: 'Early Discharge & Quick.',
    },
    {
        id: 2,
        name: 'Reclaim mobility with total knee replacement',
        first_point: 'Minimally Invasive Procedure',
        second_point: 'Early Discharge & Quick.',
    },
]

export const TestimonialData: TestimonialProps[] = [
    {
        id: 1,
        image: require('../assets/images/arshdeep-singh.png'),
        name: 'Arshdeep Singh',
        age: '34 Years',
        city: 'Ludhiana',
        title: 'Havin back pain spine ',
        description: "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable.",
        review_count: '137+ Reviews for Dr. Ananya Sharma'
    },
    {
        id: 2,
        image: require('../assets/images/preetpa.png'),
        name: 'Preetpa',
        age: '56 Years',
        city: 'Jalandhar',
        title: 'Havin back pain spine ',
        description: "It is a long established fact that reader will be distracted by the readable content of a page when looking at its layout. The point of using is that it has a more-or-less normal distributionletters.",
        review_count: '137+ Reviews for Dr. Preetpa'
    },
]