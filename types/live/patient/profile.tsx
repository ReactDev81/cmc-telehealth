import { ImageSourcePropType } from "react-native";

// About Us Props Interface
export interface aboutProps {
  about_us: string;
}

// Term And Condition Props Interface
export interface TermAndConditionProps {
  terms_and_conditions: string;
}

// Privacy Policy Props Interface
export interface PrivacyPolicyProps {
  privacy_policy: string;
}

// FAQ Props Interface
export interface FAQProps {
  title: string;
  description: string | null;
  icon: ImageSourcePropType;
}
