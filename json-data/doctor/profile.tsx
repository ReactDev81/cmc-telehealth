import { MenuSection } from '@/types/common/profile'
import {
    Award,
    BriefcaseBusiness,
    ChartColumn,
    FileText,
    GraduationCap,
    Handshake,
    Headphones,
    HelpCircle,
    Info,
    MapPin,
    ShieldCheck,
    UserStar
} from 'lucide-react-native'

export const DoctorMenuSections: MenuSection[] = [
    {
        items: [
            {
                id: 'address-contact',
                icon: <MapPin size={20} color="#374151" />,
                title: 'Address Information',
                description: 'Update your contact details and address.',
                route: '/doctor/profile/address-contact'
            },
            {
                id: 'awards',
                icon: <Award size={20} color="#374151" />,
                title: 'Awards',
                description: 'List your achievements and awards.',
                route: '/doctor/profile/awards'
            },
            {
                id: 'working-experience',
                icon: <BriefcaseBusiness size={20} color="#374151" />,
                title: 'Working Experience',
                description: 'Add details about your past and current job roles, responsibilities, and achievements.',
                route: '/doctor/profile/working-experience'
            },
            {
                id: 'education-history',
                icon: <GraduationCap size={20} color="#374151" />,
                title: 'Education History',
                description: 'List your academic background, including degrees, institutions, and years of study.',
                route: '/doctor/profile/education-history'
            },
            {
                id: 'certifications',
                icon: <FileText size={20} color="#374151" />,
                title: 'Certificates',
                description: 'Upload relevant certifications',
                route: '/doctor/profile/certificates'
            },
            {
                id: 'usage-analytics',
                icon: <ChartColumn size={20} color="#374151" />,
                title: 'Usage Analytics',
                description: 'View analytics which based on your appointment',
                route: '/doctor/profile/usage-analytics'
            },
            {
                id: 'social-media',
                icon: <Handshake size={20} color="#374151" />,
                title: 'Social Media',
                description: 'Manage your social media presence.',
                route: '/doctor/profile/social-media'
            },
        ]
    },
    {
        title: 'Others',
        items: [
            {
                id: 'about',
                icon: <Info size={20} color="#374151" />,
                title: 'About CMC',
                description: 'Learn more about the company',
                route: '/common-screens/profile/about-us'
            },
            {
                id: 'faq',
                icon: <HelpCircle size={20} color="#374151" />,
                title: 'Frequently Asked Questions',
                description: "Check Faq's",
                route: '/common-screens/profile/faq'
            },
            {
                id: 'need_help',
                icon: <Headphones size={20} color="#374151" />,
                title: 'Need Help',
                description: 'Access Support',
                route: '/common-screens/profile/need-help'
            },
            {
                id: 'rate_us',
                icon: <UserStar size={20} color="#374151" />,
                title: 'Rate Us',
                description: 'Share your feedback to help us',
                route: '/common-screens/profile/rate-us'
            },
            {
                id: 'term_condition',
                icon: <Handshake size={20} color="#374151" />,
                title: 'Terms & Conditions',
                description: 'Understand the rules and guidelines',
                route: '/common-screens/profile/term-condition'
            },
            {
                id: 'privacy',
                icon: <ShieldCheck size={20} color="#374151" />,
                title: 'Privacy Policy',
                description: 'Review how your data is collected',
                route: '/common-screens/profile/privacy-policy'
            },
        ]
    }
]