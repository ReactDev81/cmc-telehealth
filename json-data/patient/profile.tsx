import {
    Bell,
    Calendar,
    ClipboardList,
    Handshake,
    Headphones,
    HelpCircle,
    IndianRupee,
    Info,
    KeyRound,
    MapPin,
    ShieldCheck,
    Star,
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
                description: 'View, manage, and track all your doctor appointments.',
                route: '/(patient)/appointments'
            },
            {
                id: 'medical-reports',
                icon: <ClipboardList size={20} color="#374151" />,
                title: 'Medical Reports',
                description: 'Access and download your medical reports anytime.',
                route: '/patient/profile/medical-reports'
            },
            {
                id: 'my-reviews',
                icon: <Star size={20} color="#374151" />,
                title: 'My Reviews',
                description: 'See and manage feedback you shared with doctors.',
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
                description: 'Add, edit, or update your saved addresses easily.',
                route: '/patient/profile/manage-address'
            },
            {
                id: 'transaction',
                icon: <IndianRupee size={20} color="#374151" />,
                title: 'Transactions',
                description: 'View payment history and transaction details.',
                route: '/patient/profile/transactions'
            },
            {
                id: 'notifications',
                icon: <Bell size={20} color="#374151" />,
                title: 'Notifications',
                description: 'Check alerts, reminders, and important updates.',
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
                description: 'Learn more about CMC Telehealth and our services.',
                route: '/common-screens/profile/about-us'
            },
            {
                id: 'faq',
                icon: <HelpCircle size={20} color="#374151" />,
                title: 'Frequently Asked Questions',
                description: "Find quick answers to common questions.",
                route: '/common-screens/profile/faq'
            },
            {
                id: 'need_help',
                icon: <Headphones size={20} color="#374151" />,
                title: 'Need Help',
                description: 'Get support and contact our help center anytime.',
                route: '/common-screens/profile/need-help'
            },
            {
                id: 'rate_us',
                icon: <UserStar size={20} color="#374151" />,
                title: 'Rate Us',
                description: 'Share your experience and rate our app.',
                route: '/common-screens/profile/rate-us'
            },
            {
                id: 'term_condition',
                icon: <Handshake size={20} color="#374151" />,
                title: 'Terms & Conditions',
                description: 'Read the rules and terms for using our services.',
                route: '/common-screens/profile/term-condition'
            },
            {
                id: 'privacy',
                icon: <ShieldCheck size={20} color="#374151" />,
                title: 'Privacy Policy',
                description: 'Learn how we collect, use, and protect your data.',
                route: '/common-screens/profile/privacy-policy'
            },
            {
                id: 'change-password',
                icon: <KeyRound size={20} color="#374151" />,
                title: 'Change Password',
                description: 'Update your account password to keep it secure.',
                route: '/auth/reset-password'
            },
        ]
    }
]