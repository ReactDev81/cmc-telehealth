import { MenuSection } from "../types/profile"
import { 
    Calendar, 
    ClipboardList, 
    MapPin, 
    CreditCard, 
    Receipt, 
    Bell, 
    Info, 
    HelpCircle, 
    Headphones, 
    ShieldCheck,
    Handshake,
    UserStar,
    Stethoscope
} from 'lucide-react-native'

export const menuSections: MenuSection[] = [
    {
        items: [
            {
                id: 'appointments',
                icon: <Calendar size={20} color="#374151" />,
                title: 'My Appointments',
                description: 'Nutritional products',
                route: '/(tabs)/appointments'
            },
            {
                id: 'medical-reports',
                icon: <ClipboardList size={20} color="#374151" />,
                title: 'Medical Reports',
                description: 'Reports more',
                route: '/profile/medical-reports'
            },
            {
                id: 'write-a-review',
                icon: <Stethoscope size={20} color="#374151" />,
                title: 'Write A Review',
                description: 'Review to the Doctor',
                route: '/write-a-review'
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
                route: '/profile/manage-address'
            },
            {
                id: 'payment-method',
                icon: <CreditCard size={20} color="#374151" />,
                title: 'Payment Method',
                description: 'Check payment method',
                route: '/profile/payment-method'
            },
            {
                id: 'transaction',
                icon: <Receipt size={20} color="#374151" />,
                title: 'Transactions',
                description: 'Check transaction detail',
                route: '/profile/transactions'
            },
            {
                id: 'notifications',
                icon: <Bell size={20} color="#374151" />,
                title: 'Notifications',
                description: 'Check all notifications',
                route: '/notifications'
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
                route: '/profile/about-us'
            },
            {
                id: 'faq',
                icon: <HelpCircle size={20} color="#374151" />,
                title: 'Frequently Asked Questions',
                description: "Check Faq's",
                route: '/profile/faq'
            },
            {
                id: 'need_help',
                icon: <Headphones size={20} color="#374151" />,
                title: 'Need Help',
                description: 'Access Support',
                route: '/profile/need-help'
            },
            {
                id: 'rate_us',
                icon: <UserStar size={20} color="#374151" />,
                title: 'Rate Us',
                description: 'Share your feedback to help us',
                route: '/profile/rate-us'
            },
            {
                id: 'term_condition',
                icon: <Handshake size={20} color="#374151" />,
                title: 'Terms & Conditions',
                description: 'Understand the rules and guidelines',
                route: '/profile/term-condition'
            },
            {
                id: 'privacy',
                icon: <ShieldCheck size={20} color="#374151" />,
                title: 'Privacy Policy',
                description: 'Review how your data is collected',
                route: '/profile/privacy-policy'
            },
        ]
    }
]