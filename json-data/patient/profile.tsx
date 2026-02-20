import {
    Bell,
    Calendar,
    ClipboardList,
    Handshake,
    Headphones,
    HelpCircle,
    Info,
    MapPin,
    Receipt,
    ShieldCheck,
    Stethoscope,
    UserStar
} from 'lucide-react-native'
import { MenuSection } from "../../types/common/profile"

export const menuSections: MenuSection[] = [
    {
        items: [
            {
                id: 'appointments',
                icon: <Calendar size={20} color="#374151" />,
                title: 'My Appointments',
                description: 'Nutritional products',
                route: '/(patient)/appointments'
            },
            {
                id: 'medical-reports',
                icon: <ClipboardList size={20} color="#374151" />,
                title: 'Medical Reports',
                description: 'Reports more',
                route: '/patient/profile/medical-reports'
            },
            {
                id: 'my-reviews',
                icon: <Stethoscope size={20} color="#374151" />,
                title: 'My Reviews',
                description: 'Reviews to the Doctor',
                route: '/common-screens/my-reviews'
            },
        ]
    },
    {
        title: 'More',
        items: [
            {
                id: 'manage-address',
                icon: <MapPin size={20} color="#374151" />,
                title: 'Manage Address',
                description: 'Check and manage addresses',
                route: '/patient/profile/manage-address'
            },
            {
                id: 'transaction',
                icon: <Receipt size={20} color="#374151" />,
                title: 'Transactions',
                description: 'Check transaction detail',
                route: '/patient/profile/transactions'
            },
            {
                id: 'notifications',
                icon: <Bell size={20} color="#374151" />,
                title: 'Notifications',
                description: 'Check all notifications',
                route: '/common-screens/notifications'
            }
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