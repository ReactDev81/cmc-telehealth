import { MenuSection } from "@/types/common/profile";
import {
  Award,
  BriefcaseBusiness,
  FileText,
  GraduationCap,
  Handshake,
  Headphones,
  HelpCircle,
  Info,
  KeyRound,
  MapPin,
  ShieldCheck,
  Star,
  UserStar
} from "lucide-react-native";

export const DoctorMenuSections: MenuSection[] = [
  {
    items: [
      {
        id: "address-contact",
        icon: <MapPin size={20} color="#374151" />,
        title: "Address Information",
        description: "Update your practice location and address.",
        route: "/doctor/profile/manage-address",
      },
      {
        id: "awards",
        icon: <Award size={20} color="#374151" />,
        title: "Awards",
        description: "List your achievements and awards.",
        route: "/doctor/profile/awards",
      },
      {
        id: "working-experience",
        icon: <BriefcaseBusiness size={20} color="#374151" />,
        title: "Working Experience",
        description:
          "Add details about your past and current job roles, responsibilities, and achievements.",
        route: "/doctor/profile/working-experience",
      },
      {
        id: "education-history",
        icon: <GraduationCap size={20} color="#374151" />,
        title: "Education History",
        description:
          "List your academic background, including degrees, institutions, and years of study.",
        route: "/doctor/profile/education-history",
      },
      {
        id: "certifications",
        icon: <FileText size={20} color="#374151" />,
        title: "Certificates",
        description: "Upload relevant certifications",
        route: "/doctor/profile/certificates",
      },
      // Temporarily hidden - Usage Analytics
      // {
      //     id: 'usage-analytics',
      //     icon: <ChartColumn size={20} color="#374151" />,
      //     title: 'Usage Analytics',
      //     description: 'View analytics which based on your appointment',
      //     route: '/doctor/profile/usage-analytics'
      // },
      {
        id: "social-media",
        icon: <Handshake size={20} color="#374151" />,
        title: "Social Media",
        description: "Manage your social media presence.",
        route: "/doctor/profile/social-media",
      },
      {
        id: 'my-reviews',
        icon: <Star size={20} color="#374151" />,
        title: 'My Reviews',
        description: 'Reviews to the Doctor',
        route: '/common-screens/my-reviews'
      },
    ],
  },
  {
    title: "Others",
    items: [
      {
        id: "about",
        icon: <Info size={20} color="#374151" />,
        title: "About CMC",
        description: "Learn more about CMC Telehealth and our services.",
        route: "/common-screens/profile/about-us",
      },
      {
        id: "faq",
        icon: <HelpCircle size={20} color="#374151" />,
        title: "Frequently Asked Questions",
        description: "Find quick answers to common questions.",
        route: "/common-screens/profile/faq",
      },
      {
        id: "need_help",
        icon: <Headphones size={20} color="#374151" />,
        title: "Need Help",
        description: "Get support and contact our help center anytime.",
        route: "/common-screens/profile/need-help",
      },
      {
        id: "rate_us",
        icon: <UserStar size={20} color="#374151" />,
        title: "Rate Us",
        description: "Share your experience and rate our app.",
        route: "/common-screens/profile/rate-us",
      },
      {
        id: "term_condition",
        icon: <Handshake size={20} color="#374151" />,
        title: "Terms & Conditions",
        description: "Read the rules and terms for using our services.",
        route: "/common-screens/profile/term-condition",
      },
      {
        id: "privacy",
        icon: <ShieldCheck size={20} color="#374151" />,
        title: "Privacy Policy",
        description: "Learn how we collect, use, and protect your data.",
        route: "/common-screens/profile/privacy-policy",
      },
      {
        id: 'change-password',
        icon: <KeyRound size={20} color="#374151" />,
        title: 'Change Password',
        description: 'Update your account password to keep it secure.',
        route: '/auth/reset-password'
      },
    ],
  },
];
